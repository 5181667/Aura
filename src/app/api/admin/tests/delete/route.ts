import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const testId = searchParams.get('testId')

    if (!testId) {
      return NextResponse.json({ message: "缺少 testId 参数" }, { status: 400 })
    }

    // 检查是否为系统内置测试
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { isSystem: true, title: true }
    })

    if (!test) {
      return NextResponse.json({ message: "测试不存在" }, { status: 404 })
    }

    if (test.isSystem) {
      return NextResponse.json({ message: "系统内置测试不能删除" }, { status: 400 })
    }

    // 删除测试及相关数据
    await prisma.$transaction([
      // 删除测试结果的分享令牌
      prisma.shareToken.deleteMany({
        where: {
          result: {
            testId
          }
        }
      }),
      // 删除测试结果
      prisma.testResult.deleteMany({
        where: { testId }
      }),
      // 删除测试
      prisma.test.delete({
        where: { id: testId }
      })
    ])

    return NextResponse.json({ 
      message: `测试 "${test.title}" 已删除` 
    })

  } catch (error) {
    console.error("DELETE_TEST_ERROR", error)
    return NextResponse.json(
      { message: "删除失败" }, 
      { status: 500 }
    )
  }
}
