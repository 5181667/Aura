import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { generatePremiumReport, generateMockPremiumReport, APITimeoutError } from "@/lib/deepseek"

// 后台重试 AI 生成（不阻塞用户请求）
async function backgroundRetryAIGeneration(premiumReportId: string, testData: any, gender?: string) {
    try {
        console.log(`[BG] 开始后台重试 AI 报告生成: ${premiumReportId}`)
        const reportData = await generatePremiumReport(testData, gender)

        await prisma.premiumReport.update({
            where: { id: premiumReportId },
            data: {
                reportData: reportData as any,
                generatedAt: new Date(),
                generateError: null
            }
        })
        console.log(`[BG] AI 报告生成成功: ${premiumReportId}`)
    } catch (err) {
        console.error(`[BG] AI 报告后台重试失败: ${premiumReportId}`, err)
    }
}

// 生成高级报告
export async function POST(req: Request) {
    try {
        const { testResultId, premiumReportId, retryAI } = await req.json()

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
            if (isPro) {
                const testResult = await prisma.testResult.findUnique({
                    where: { id: testResultId }
                })

                if (!testResult) {
                    return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
                }

                premiumReport = await prisma.premiumReport.create({
                    data: {
                        testResultId: testResultId,
                        userId: (session!.user as any).id,
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

        if (!isPro && premiumReport.paymentStatus !== 'PAID') {
            return NextResponse.json({ message: "请先完成支付" }, { status: 402 })
        }

        // 如果已经生成过报告且不是重试请求，直接返回
        if (premiumReport.reportData && !premiumReport.generateError && !retryAI) {
            return NextResponse.json({
                success: true,
                report: premiumReport.reportData,
                generatedAt: premiumReport.generatedAt,
                cached: true
            })
        }

        const testResult = premiumReport.testResult
        const testData = {
            testType: testResult.test.type,
            score: testResult.score,
            dimensions: (testResult.dimensions as any[]) || []
        }
        const gender = premiumReport.user?.gender || undefined

        let reportData
        let usedFallback = false

        try {
            if (process.env.DEEPSEEK_API_KEY) {
                reportData = await generatePremiumReport(testData, gender)
            } else {
                console.log('DEEPSEEK_API_KEY not configured, using mock data')
                reportData = generateMockPremiumReport(testData)
                usedFallback = true
            }
        } catch (aiError) {
            const isTimeout = aiError instanceof APITimeoutError
            console.error(`AI generation ${isTimeout ? 'timed out' : 'failed'}:`, aiError)

            reportData = generateMockPremiumReport(testData)
            usedFallback = true

            await prisma.premiumReport.update({
                where: { id: premiumReport.id },
                data: {
                    generateError: isTimeout ? 'TIMEOUT' : (aiError instanceof Error ? aiError.message : '生成失败')
                }
            })

            // 超时时触发后台重试
            if (isTimeout && process.env.DEEPSEEK_API_KEY) {
                backgroundRetryAIGeneration(premiumReport.id, testData, gender).catch(() => {})
            }
        }

        await prisma.premiumReport.update({
            where: { id: premiumReport.id },
            data: {
                reportData: reportData as any,
                generatedAt: new Date(),
                ...(usedFallback ? {} : { generateError: null })
            }
        })

        return NextResponse.json({
            success: true,
            report: reportData,
            generatedAt: new Date(),
            cached: false,
            usedFallback,
            canRetry: usedFallback && !!process.env.DEEPSEEK_API_KEY
        })

    } catch (error) {
        console.error("GENERATE_PREMIUM_REPORT_ERROR", error)
        return NextResponse.json({
            message: error instanceof Error ? error.message : "生成报告失败",
            canRetry: true
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
