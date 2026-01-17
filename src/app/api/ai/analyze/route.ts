import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { 
  analyzeSingleTest, 
  generateMockSingleAnalysis,
  SingleTestAnalysis 
} from "@/lib/deepseek"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 })
    }

    const { resultId } = await req.json()

    if (!resultId) {
      return NextResponse.json({ message: "缺少 resultId 参数" }, { status: 400 })
    }

    // 获取测试结果
    const testResult = await prisma.testResult.findUnique({
      where: { id: resultId },
      include: { test: true }
    })

    if (!testResult) {
      return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
    }

    // 检查是否已有 AI 分析
    if (testResult.aiAnalysis) {
      return NextResponse.json({ 
        analysis: testResult.aiAnalysis,
        cached: true 
      })
    }

    // 准备测试数据
    const testData = {
      testType: testResult.test.type,
      score: testResult.score,
      dimensions: (testResult.dimensions as any[]) || []
    }

    let analysis: SingleTestAnalysis

    // 尝试调用 DeepSeek API，如果失败则使用模拟数据
    try {
      if (process.env.DEEPSEEK_API_KEY) {
        analysis = await analyzeSingleTest(testData)
      } else {
        console.log('DEEPSEEK_API_KEY 未配置，使用模拟分析')
        analysis = generateMockSingleAnalysis(testData)
      }
    } catch (error) {
      console.error('AI 分析失败，使用模拟数据:', error)
      analysis = generateMockSingleAnalysis(testData)
    }

    // 保存分析结果
    await prisma.testResult.update({
      where: { id: resultId },
      data: {
        aiAnalysis: analysis as any,
        aiAnalyzedAt: new Date()
      }
    })

    return NextResponse.json({ 
      analysis,
      cached: false 
    })

  } catch (error) {
    console.error("AI_ANALYZE_ERROR", error)
    return NextResponse.json(
      { message: "分析失败，请稍后重试" }, 
      { status: 500 }
    )
  }
}

// 获取已有的 AI 分析结果
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "未登录" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const resultId = searchParams.get('resultId')

    if (!resultId) {
      return NextResponse.json({ message: "缺少 resultId 参数" }, { status: 400 })
    }

    const testResult = await prisma.testResult.findUnique({
      where: { id: resultId },
      select: {
        aiAnalysis: true,
        aiAnalyzedAt: true
      }
    })

    if (!testResult) {
      return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
    }

    return NextResponse.json({
      analysis: testResult.aiAnalysis,
      analyzedAt: testResult.aiAnalyzedAt
    })

  } catch (error) {
    console.error("GET_AI_ANALYSIS_ERROR", error)
    return NextResponse.json(
      { message: "获取分析失败" }, 
      { status: 500 }
    )
  }
}
