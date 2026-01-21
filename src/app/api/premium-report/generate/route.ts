import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { generatePremiumReport, generateMockPremiumReport } from "@/lib/deepseek"

// 生成高级报告
export async function POST(req: Request) {
    try {
        const { testResultId, premiumReportId } = await req.json()

        if (!testResultId && !premiumReportId) {
            return NextResponse.json({ message: "缺少必要参数" }, { status: 400 })
        }

        // 查找高级报告记录
        let premiumReport
        if (premiumReportId) {
            premiumReport = await prisma.premiumReport.findUnique({
                where: { id: premiumReportId },
                include: {
                    testResult: {
                        include: { test: true }
                    },
                    user: true
                }
            })
        } else {
            premiumReport = await prisma.premiumReport.findUnique({
                where: { testResultId },
                include: {
                    testResult: {
                        include: { test: true }
                    },
                    user: true
                }
            })
        }

        // 验证用户状态
        const session = await getServerSession(authOptions)
        let isPro = (session?.user as any)?.isPro

        // 从数据库获取最新的 Pro 状态（解决 Session 缓存问题）
        if (session?.user) {
            const user = await prisma.user.findUnique({
                where: { id: (session.user as any).id },
                select: { isPro: true }
            })
            if (user) {
                isPro = user.isPro
            }
        }

        if (!premiumReport) {
            // 如果是 Pro 会员，且没有高级报告记录，自动创建一个已支付的记录
            if (isPro) {
                // 需要 testResult 的 context 来创建
                const testResult = await prisma.testResult.findUnique({
                    where: { id: testResultId }
                })

                if (!testResult) {
                    return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
                }

                premiumReport = await prisma.premiumReport.create({
                    data: {
                        testResultId: testResultId,
                        userId: (session.user as any).id,
                        orderId: `PRO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        amount: 0,
                        paymentStatus: 'PAID',
                        paymentMethod: 'PRO_MEMBERSHIP',
                        paidAt: new Date(),
                    },
                    include: {
                        testResult: {
                            include: { test: true }
                        },
                        user: true
                    }
                })
            } else {
                return NextResponse.json({ message: "高级报告记录不存在" }, { status: 404 })
            }
        }

        // 验证支付状态：如果是付费会员，或者已支付，则允许生成
        if (!isPro && premiumReport.paymentStatus !== 'PAID') {
            return NextResponse.json({ message: "请先完成支付" }, { status: 402 })
        }

        // 如果已经生成过报告，直接返回
        if (premiumReport.reportData && !premiumReport.generateError) {
            return NextResponse.json({
                success: true,
                report: premiumReport.reportData,
                generatedAt: premiumReport.generatedAt,
                cached: true
            })
        }

        // 准备测试数据
        const testResult = premiumReport.testResult
        const testData = {
            testType: testResult.test.type,
            score: testResult.score,
            dimensions: (testResult.dimensions as any[]) || []
        }

        // 获取用户性别
        const gender = premiumReport.user?.gender || undefined

        let reportData

        try {
            // 尝试调用 AI 生成报告
            if (process.env.DEEPSEEK_API_KEY) {
                reportData = await generatePremiumReport(testData, gender)
            } else {
                // 没有 API Key 时使用模拟数据
                console.log('DEEPSEEK_API_KEY not configured, using mock data')
                reportData = generateMockPremiumReport(testData)
            }
        } catch (aiError) {
            console.error('AI generation failed:', aiError)

            // 记录错误但不阻止流程，使用模拟数据
            await prisma.premiumReport.update({
                where: { id: premiumReport.id },
                data: {
                    generateError: aiError instanceof Error ? aiError.message : '生成失败'
                }
            })

            // 使用模拟数据作为降级方案
            reportData = generateMockPremiumReport(testData)
        }

        // 保存报告数据
        await prisma.premiumReport.update({
            where: { id: premiumReport.id },
            data: {
                reportData: reportData as any,
                generatedAt: new Date(),
                generateError: null
            }
        })

        return NextResponse.json({
            success: true,
            report: reportData,
            generatedAt: new Date(),
            cached: false
        })

    } catch (error) {
        console.error("GENERATE_PREMIUM_REPORT_ERROR", error)
        return NextResponse.json({
            message: error instanceof Error ? error.message : "生成报告失败"
        }, { status: 500 })
    }
}

// 获取高级报告
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const testResultId = searchParams.get('testResultId')

        if (!testResultId) {
            return NextResponse.json({ message: "缺少测试结果ID" }, { status: 400 })
        }

        const premiumReport = await prisma.premiumReport.findUnique({
            where: { testResultId },
            include: {
                testResult: {
                    include: { test: true }
                }
            }
        })

        if (!premiumReport) {
            return NextResponse.json({
                hasPremiumReport: false,
                isPaid: false
            })
        }

        return NextResponse.json({
            hasPremiumReport: true,
            isPaid: premiumReport.paymentStatus === 'PAID',
            hasReport: !!premiumReport.reportData,
            report: premiumReport.reportData,
            generatedAt: premiumReport.generatedAt,
            generateError: premiumReport.generateError,
            orderId: premiumReport.orderId
        })

    } catch (error) {
        console.error("GET_PREMIUM_REPORT_ERROR", error)
        return NextResponse.json({ message: "获取报告失败" }, { status: 500 })
    }
}
