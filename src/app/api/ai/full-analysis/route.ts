import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { 
  analyzeFullProfile, 
  FullAnalysisResult 
} from "@/lib/deepseek"

// 请求全面分析
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 })
    }

    const userId = (session.user as any).id

    // 获取用户所有测试结果
    const testResults = await prisma.testResult.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { createdAt: 'desc' }
    })

    if (testResults.length === 0) {
      return NextResponse.json({ 
        message: "您还没有完成任何测试，请先完成至少一项测试" 
      }, { status: 400 })
    }

    // 检查是否已有全面分析，且测试结果未变化
    const existingAnalysis = await prisma.fullAnalysis.findUnique({
      where: { userId }
    })

    const currentTestIds = testResults.map(r => r.id).sort().join(',')
    const existingTestIds = existingAnalysis?.includedTests?.sort().join(',')

    if (existingAnalysis && existingTestIds === currentTestIds) {
      return NextResponse.json({
        analysis: existingAnalysis.analysisData,
        includedTests: existingAnalysis.includedTests,
        analyzedAt: existingAnalysis.analyzedAt,
        cached: true
      })
    }

    // 准备测试数据
    const testData = testResults.map(result => ({
      testType: result.test.type,
      score: result.score,
      dimensions: (result.dimensions as any[]) || []
    }))

    let analysis: FullAnalysisResult

    // 强制调用 DeepSeek API（不允许模拟数据）
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { message: "DEEPSEEK_API_KEY 未配置，无法进行全面分析" },
        { status: 500 }
      )
    }

    try {
      analysis = await analyzeFullProfile(testData)
    } catch (error) {
      console.error('全面分析失败:', error)
      return NextResponse.json(
        { message: "DeepSeek 调用失败，请稍后重试" },
        { status: 500 }
      )
    }

    // 保存或更新全面分析
    await prisma.fullAnalysis.upsert({
      where: { userId },
      create: {
        userId,
        analysisData: analysis as any,
        includedTests: testResults.map(r => r.id),
        analyzedAt: new Date()
      },
      update: {
        analysisData: analysis as any,
        includedTests: testResults.map(r => r.id),
        analyzedAt: new Date()
      }
    })

    return NextResponse.json({
      analysis,
      includedTests: testResults.map(r => r.id),
      analyzedAt: new Date(),
      cached: false
    })

  } catch (error) {
    console.error("FULL_ANALYSIS_ERROR", error)
    return NextResponse.json(
      { message: "分析失败，请稍后重试" }, 
      { status: 500 }
    )
  }
}

// 获取已有的全面分析
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 })
    }

    const userId = (session.user as any).id

    // 获取全面分析
    const fullAnalysis = await prisma.fullAnalysis.findUnique({
      where: { userId }
    })

    if (!fullAnalysis) {
      return NextResponse.json({ 
        hasAnalysis: false,
        message: "暂无全面分析，点击生成按钮开始分析" 
      })
    }

    // 获取用户当前测试数量
    const currentTestCount = await prisma.testResult.count({
      where: { userId }
    })

    // 检查是否有新的测试需要纳入分析
    const hasNewTests = currentTestCount > (fullAnalysis.includedTests?.length || 0)

    return NextResponse.json({
      hasAnalysis: true,
      analysis: fullAnalysis.analysisData,
      includedTests: fullAnalysis.includedTests,
      analyzedAt: fullAnalysis.analyzedAt,
      hasNewTests,
      message: hasNewTests ? '您有新的测试结果，建议重新生成全面分析' : null
    })

  } catch (error) {
    console.error("GET_FULL_ANALYSIS_ERROR", error)
    return NextResponse.json(
      { message: "获取分析失败" }, 
      { status: 500 }
    )
  }
}
