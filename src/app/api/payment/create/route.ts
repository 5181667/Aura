import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import {
    generateOrderNo,
    createPrecreateTrade,
    createPagePay,
    createWapPay,
    qrToDataURL,
} from "@/lib/payment"
import { createNativeOrder, isWechatPayConfigured } from "@/lib/wechatpay"

type PaymentMethod = 'alipay' | 'wechat'

// 创建支付订单
export async function POST(req: Request) {
    try {
        const { testResultId, clientType = 'pc', paymentMethod = 'alipay' } = await req.json()

        if (!testResultId) {
            return NextResponse.json({ message: "缺少测试结果ID" }, { status: 400 })
        }

        const method = (paymentMethod === 'wechat' ? 'wechat' : 'alipay') as PaymentMethod

        // 检查测试结果是否存在
        const testResult = await prisma.testResult.findUnique({
            where: { id: testResultId },
            include: {
                test: true,
                premiumReport: true,
            },
        })

        if (!testResult) {
            return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
        }

        // 如果已经有支付成功的报告，不允许重复购买
        if (testResult.premiumReport?.paymentStatus === 'PAID') {
            return NextResponse.json({ message: "已购买过高级报告" }, { status: 400 })
        }

        // 获取当前用户（可选）
        const session = await getServerSession(authOptions)
        const userId = session?.user ? (session.user as any).id : null

        // 生成订单号
        const orderId = generateOrderNo()
        const amount = 9.9

        // 创建或更新 PremiumReport 记录
        let premiumReport
        if (testResult.premiumReport) {
            premiumReport = await prisma.premiumReport.update({
                where: { id: testResult.premiumReport.id },
                data: {
                    orderId,
                    amount,
                    paymentMethod: method,
                    paymentStatus: 'PENDING',
                    userId,
                },
            })
        } else {
            premiumReport = await prisma.premiumReport.create({
                data: {
                    testResultId,
                    userId,
                    orderId,
                    amount,
                    paymentMethod: method,
                    paymentStatus: 'PENDING',
                },
            })
        }

        const subject = `${testResult.test.title} - 高级分析报告`
        const totalAmount = amount.toFixed(2)
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const returnUrl = `${baseUrl}/results/${testResultId}?payment=success`

        let qrcode: string | null = null
        let payUrl: string | null = null

        if (method === 'wechat') {
            if (!isWechatPayConfigured()) {
                return NextResponse.json(
                    { message: '微信支付暂未配置，请先配置 WECHAT_PAY_APP_ID 等环境变量或使用支付宝' },
                    { status: 400 }
                )
            }
            // 正式环境需 HTTPS；本地测试可用 WECHAT_PAY_NOTIFY_URL 覆盖（如 ngrok 地址）
            const notifyUrl =
                process.env.WECHAT_PAY_NOTIFY_URL ||
                `${baseUrl}/api/payment/wechat-notify`
            const wxResult = await createNativeOrder({
                outTradeNo: orderId,
                description: subject,
                totalFen: Math.round(amount * 100),
                notifyUrl,
            })
            if (!wxResult.success || !wxResult.codeUrl) {
                return NextResponse.json(
                    { message: wxResult.error || '微信下单失败，请稍后重试或改用支付宝' },
                    { status: 400 }
                )
            }
            qrcode = await qrToDataURL(wxResult.codeUrl)
        } else {
            // 支付宝
            const precreateResult = await createPrecreateTrade({
                outTradeNo: orderId,
                totalAmount,
                subject,
            })
            if (precreateResult.success && precreateResult.qrCodeDataUrl) {
                qrcode = precreateResult.qrCodeDataUrl
            }

            if (clientType === 'mobile') {
                const wapResult = createWapPay({
                    outTradeNo: orderId,
                    totalAmount,
                    subject,
                    returnUrl,
                })
                if (wapResult.success) payUrl = wapResult.payUrl || null
            } else {
                const pageResult = createPagePay({
                    outTradeNo: orderId,
                    totalAmount,
                    subject,
                    returnUrl,
                })
                if (pageResult.success) payUrl = pageResult.payUrl || null
            }

            if (!qrcode && !payUrl) {
                return NextResponse.json(
                    { message: precreateResult.error || '支付宝暂不可用，请稍后重试或改用微信支付' },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json({
            success: true,
            orderId,
            amount,
            paymentMethod: method,
            qrcode,
            payUrl,
            premiumReportId: premiumReport.id,
        })

    } catch (error) {
        console.error("CREATE_PAYMENT_ERROR", error)
        return NextResponse.json({ message: "创建订单失败" }, { status: 500 })
    }
}
