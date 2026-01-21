import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { 
    generateOrderNo, 
    createPaymentUrl, 
    createPaymentQRCode,
    type PaymentMethod 
} from "@/lib/payment"

// 创建支付订单
export async function POST(req: Request) {
    try {
        const { testResultId, paymentMethod = 'alipay' } = await req.json()

        if (!testResultId) {
            return NextResponse.json({ message: "缺少测试结果ID" }, { status: 400 })
        }

        // 验证支付方式
        if (!['alipay', 'wechat'].includes(paymentMethod)) {
            return NextResponse.json({ message: "无效的支付方式" }, { status: 400 })
        }

        // 检查测试结果是否存在
        const testResult = await prisma.testResult.findUnique({
            where: { id: testResultId },
            include: { 
                test: true,
                premiumReport: true 
            }
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
            // 更新现有的待支付订单
            premiumReport = await prisma.premiumReport.update({
                where: { id: testResult.premiumReport.id },
                data: {
                    orderId,
                    amount,
                    paymentMethod: paymentMethod as PaymentMethod,
                    paymentStatus: 'PENDING',
                    userId,
                }
            })
        } else {
            // 创建新订单
            premiumReport = await prisma.premiumReport.create({
                data: {
                    testResultId,
                    userId,
                    orderId,
                    amount,
                    paymentMethod: paymentMethod as PaymentMethod,
                    paymentStatus: 'PENDING',
                }
            })
        }

        // 构建支付订单信息
        const orderInfo = {
            outTradeNo: orderId,
            type: paymentMethod as PaymentMethod,
            name: `${testResult.test.title} - 高级分析报告`,
            money: amount.toFixed(2),
            returnUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/results/${testResultId}?payment=success`,
        }

        // 尝试获取二维码
        const qrResult = await createPaymentQRCode(orderInfo)
        
        // 同时生成跳转支付链接作为备选
        const paymentUrl = createPaymentUrl(orderInfo)

        return NextResponse.json({
            success: true,
            orderId,
            amount,
            qrcode: qrResult.success ? qrResult.qrcode : null,
            payUrl: qrResult.success ? qrResult.payUrl : paymentUrl,
            paymentUrl,  // 备选跳转链接
            premiumReportId: premiumReport.id,
        })

    } catch (error) {
        console.error("CREATE_PAYMENT_ERROR", error)
        return NextResponse.json({ message: "创建订单失败" }, { status: 500 })
    }
}
