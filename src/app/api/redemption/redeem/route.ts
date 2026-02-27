import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// POST - 使用兑换码解锁高级报告（支持未登录用户）
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user ? (session.user as any).id : null

        const { code, testResultId } = await req.json()

        if (!code || !testResultId) {
            return NextResponse.json({ message: "缺少必要参数" }, { status: 400 })
        }

        // 标准化兑换码：去空格、转大写
        const normalizedCode = code.trim().toUpperCase()

        // 查找兑换码
        const redemptionCode = await prisma.redemptionCode.findUnique({
            where: { code: normalizedCode }
        })

        if (!redemptionCode) {
            return NextResponse.json({ message: "兑换码不存在" }, { status: 404 })
        }

        if (redemptionCode.isUsed) {
            return NextResponse.json({ message: "该兑换码已被使用" }, { status: 400 })
        }

        if (redemptionCode.expiresAt && redemptionCode.expiresAt < new Date()) {
            return NextResponse.json({ message: "该兑换码已过期" }, { status: 400 })
        }

        // 检查测试结果是否存在
        const testResult = await prisma.testResult.findUnique({
            where: { id: testResultId },
            include: { premiumReport: true, test: true }
        })

        if (!testResult) {
            return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
        }

        // 校验兑换码的测试类型是否匹配
        if (redemptionCode.testType !== 'ALL' && redemptionCode.testType !== testResult.test.type) {
            const typeLabels: Record<string, string> = {
                'MBTI': 'MBTI', 'BIG_FIVE': '大五人格', 'DISC': 'DISC',
                'EQ': '情商', 'HOLLAND': '霍兰德', 'ENNEAGRAM': '九型人格',
                'TALENT': '天赋发掘', 'MENTAL_AGE': '心理年龄', 'ALL': '通用'
            }
            const codeLabel = typeLabels[redemptionCode.testType] || redemptionCode.testType
            const testLabel = typeLabels[testResult.test.type] || testResult.test.type
            return NextResponse.json({
                message: `该兑换码仅适用于「${codeLabel}」类型测试，当前测试为「${testLabel}」`
            }, { status: 400 })
        }

        // 如果已经有支付成功的报告，不允许重复兑换
        if (testResult.premiumReport?.paymentStatus === 'PAID') {
            return NextResponse.json({ message: "该测试已解锁高级报告" }, { status: 400 })
        }

        // 使用事务：标记兑换码已使用 + 创建/更新 PremiumReport
        const orderId = `REDEEM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        await prisma.$transaction(async (tx) => {
            // 1. 标记兑换码已使用
            await tx.redemptionCode.update({
                where: { id: redemptionCode.id },
                data: {
                    isUsed: true,
                    usedBy: userId,
                    usedAt: new Date(),
                    usedForTestResultId: testResultId,
                }
            })

            // 2. 创建或更新 PremiumReport 记录
            if (testResult.premiumReport) {
                await tx.premiumReport.update({
                    where: { id: testResult.premiumReport.id },
                    data: {
                        orderId,
                        amount: 0,
                        paymentStatus: 'PAID',
                        paymentMethod: 'REDEMPTION_CODE',
                        paidAt: new Date(),
                        userId,
                    }
                })
            } else {
                await tx.premiumReport.create({
                    data: {
                        testResultId,
                        userId,
                        orderId,
                        amount: 0,
                        paymentStatus: 'PAID',
                        paymentMethod: 'REDEMPTION_CODE',
                        paidAt: new Date(),
                    }
                })
            }
        })

        return NextResponse.json({
            success: true,
            message: "兑换成功！正在为您生成高级报告...",
        })

    } catch (error) {
        console.error("REDEEM_CODE_ERROR", error)
        return NextResponse.json({
            message: error instanceof Error ? error.message : "兑换失败"
        }, { status: 500 })
    }
}
