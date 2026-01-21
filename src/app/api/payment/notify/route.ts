import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyNotify, type PaymentNotifyParams } from "@/lib/payment"

// 支付回调通知
export async function POST(req: Request) {
    try {
        // 解析回调参数
        const formData = await req.formData()
        const params: PaymentNotifyParams = {
            pid: formData.get('pid') as string || '',
            trade_no: formData.get('trade_no') as string || '',
            out_trade_no: formData.get('out_trade_no') as string || '',
            type: formData.get('type') as string || '',
            name: formData.get('name') as string || '',
            money: formData.get('money') as string || '',
            trade_status: formData.get('trade_status') as string || '',
            sign: formData.get('sign') as string || '',
            sign_type: formData.get('sign_type') as string || 'MD5',
        }

        console.log('Payment notify received:', params)

        // 验证签名
        if (!verifyNotify(params)) {
            console.error('Payment notify sign verify failed')
            return new Response('sign verify fail', { status: 400 })
        }

        // 检查交易状态
        if (params.trade_status !== 'TRADE_SUCCESS') {
            console.log('Payment not success:', params.trade_status)
            return new Response('success')  // 返回success避免重复通知
        }

        // 查找订单
        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId: params.out_trade_no }
        })

        if (!premiumReport) {
            console.error('Order not found:', params.out_trade_no)
            return new Response('order not found', { status: 404 })
        }

        // 检查是否已处理
        if (premiumReport.paymentStatus === 'PAID') {
            console.log('Order already paid:', params.out_trade_no)
            return new Response('success')
        }

        // 验证金额
        const expectedAmount = premiumReport.amount.toFixed(2)
        if (params.money !== expectedAmount) {
            console.error('Amount mismatch:', params.money, 'expected:', expectedAmount)
            return new Response('amount mismatch', { status: 400 })
        }

        // 更新订单状态
        await prisma.premiumReport.update({
            where: { id: premiumReport.id },
            data: {
                paymentStatus: 'PAID',
                paidAt: new Date(),
            }
        })

        console.log('Payment success:', params.out_trade_no)

        // 返回 success 告知平台已收到通知
        return new Response('success')

    } catch (error) {
        console.error("PAYMENT_NOTIFY_ERROR", error)
        return new Response('fail', { status: 500 })
    }
}

// 也支持 GET 请求（某些支付平台用GET）
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const params: PaymentNotifyParams = {
            pid: searchParams.get('pid') || '',
            trade_no: searchParams.get('trade_no') || '',
            out_trade_no: searchParams.get('out_trade_no') || '',
            type: searchParams.get('type') || '',
            name: searchParams.get('name') || '',
            money: searchParams.get('money') || '',
            trade_status: searchParams.get('trade_status') || '',
            sign: searchParams.get('sign') || '',
            sign_type: searchParams.get('sign_type') || 'MD5',
        }

        console.log('Payment notify (GET) received:', params)

        // 验证签名
        if (!verifyNotify(params)) {
            console.error('Payment notify sign verify failed')
            return new Response('sign verify fail', { status: 400 })
        }

        // 检查交易状态
        if (params.trade_status !== 'TRADE_SUCCESS') {
            return new Response('success')
        }

        // 查找并更新订单
        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId: params.out_trade_no }
        })

        if (!premiumReport) {
            return new Response('order not found', { status: 404 })
        }

        if (premiumReport.paymentStatus !== 'PAID') {
            await prisma.premiumReport.update({
                where: { id: premiumReport.id },
                data: {
                    paymentStatus: 'PAID',
                    paidAt: new Date(),
                }
            })
        }

        return new Response('success')

    } catch (error) {
        console.error("PAYMENT_NOTIFY_GET_ERROR", error)
        return new Response('fail', { status: 500 })
    }
}
