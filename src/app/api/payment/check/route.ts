import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { queryOrderStatus } from "@/lib/payment"

// 检查支付状态（前端轮询）
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const orderId = searchParams.get('orderId')

        if (!orderId) {
            return NextResponse.json({ message: "缺少订单号" }, { status: 400 })
        }

        // 从数据库查询订单状态
        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId },
            include: {
                testResult: {
                    include: { test: true }
                }
            }
        })

        if (!premiumReport) {
            return NextResponse.json({ message: "订单不存在" }, { status: 404 })
        }

        // 如果数据库显示已支付，直接返回
        if (premiumReport.paymentStatus === 'PAID') {
            return NextResponse.json({
                status: 'paid',
                paidAt: premiumReport.paidAt,
                hasReport: !!premiumReport.reportData,
                testResultId: premiumReport.testResultId,
            })
        }

        // 否则主动查询支付平台
        const queryResult = await queryOrderStatus(orderId)
        
        if (queryResult.success && queryResult.status === 'paid') {
            // 更新数据库状态
            await prisma.premiumReport.update({
                where: { id: premiumReport.id },
                data: {
                    paymentStatus: 'PAID',
                    paidAt: new Date(),
                }
            })

            return NextResponse.json({
                status: 'paid',
                paidAt: new Date(),
                hasReport: false,
                testResultId: premiumReport.testResultId,
            })
        }

        // 返回当前状态
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
