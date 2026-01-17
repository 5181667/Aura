import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const { testId } = await req.json()

    if (!testId) {
      return NextResponse.json({ message: "缺少 testId 参数" }, { status: 400 })
    }

    // 获取原测试
    const originalTest = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!originalTest) {
      return NextResponse.json({ message: "测试不存在" }, { status: 404 })
    }

    // 创建副本
    const newTest = await prisma.test.create({
      data: {
        title: `${originalTest.title} (副本)`,
        description: originalTest.description,
        type: originalTest.type,
        category: originalTest.category,
        questions: originalTest.questions as any,
        scoring: originalTest.scoring as any,
        isPublished: false, // 副本默认不发布
        isSystem: false // 副本不是系统测试
      }
    })

    return NextResponse.json({ 
      message: "测试已复制",
      test: newTest
    })

  } catch (error) {
    console.error("DUPLICATE_TEST_ERROR", error)
    return NextResponse.json(
      { message: "复制失败" }, 
      { status: 500 }
    )
  }
}
