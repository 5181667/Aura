import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { queryTradeStatus } from "@/lib/payment"
import { queryWechatOrder } from "@/lib/wechatpay"

// 检查支付状态（前端轮询）
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const orderId = searchParams.get('orderId')

        if (!orderId) {
            return NextResponse.json({ message: "缺少订单号" }, { status: 400 })
        }

        // 1. 先查数据库（优先，最快）
        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId },
            include: {
                testResult: {
                    include: { test: true },
                },
            },
        })

        if (!premiumReport) {
            return NextResponse.json({ message: "订单不存在" }, { status: 404 })
        }

        // 2. 如果数据库已显示已支付，直接返回
        if (premiumReport.paymentStatus === 'PAID') {
            return NextResponse.json({
                status: 'paid',
                paidAt: premiumReport.paidAt,
                hasReport: !!premiumReport.reportData,
                testResultId: premiumReport.testResultId,
            })
        }

        // 3. 数据库未显示已支付 → 主动查询支付渠道
        try {
            const isWechat = premiumReport.paymentMethod === 'wechat'
            const queryResult = isWechat
                ? await queryWechatOrder(orderId)
                : await queryTradeStatus(orderId)

            const paid = isWechat
                ? queryResult.success && queryResult.status === 'SUCCESS'
                : queryResult.success && queryResult.status === 'paid'
            const closed = isWechat
                ? queryResult.success && (queryResult.status === 'CLOSED' || queryResult.status === 'REVOKED')
                : queryResult.success && queryResult.status === 'closed'

            if (paid) {
                await prisma.premiumReport.update({
                    where: { id: premiumReport.id },
                    data: {
                        paymentStatus: 'PAID',
                        paidAt: new Date(),
                    },
                })

                return NextResponse.json({
                    status: 'paid',
                    paidAt: new Date(),
                    hasReport: false,
                    testResultId: premiumReport.testResultId,
                })
            }

            if (closed) {
                await prisma.premiumReport.update({
                    where: { id: premiumReport.id },
                    data: { paymentStatus: 'FAILED' },
                })

                return NextResponse.json({
                    status: 'closed',
                    testResultId: premiumReport.testResultId,
                })
            }
        } catch (queryError) {
            console.error('[Payment Check] 查询支付状态失败:', queryError)
        }

        // 4. 返回当前数据库状态
        return NextResponse.json({
            status: premiumReport.paymentStatus.toLowerCase(),
            hasReport: !!premiumReport.reportData,
            testResultId: premiumReport.testResultId,
        })

    } catch (error) {
        console.error("CHECK_PAYMENT_ERROR", error)
        return NextResponse.json({ message: "查询失败" }, { status: 500 })
    }
}
