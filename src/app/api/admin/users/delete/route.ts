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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ message: "缺少 userId 参数" }, { status: 400 })
    }

    // 不能删除自己
    if (userId === (session.user as any).id) {
      return NextResponse.json({ message: "不能删除自己的账户" }, { status: 400 })
    }

    // 删除用户相关数据
    await prisma.$transaction([
      // 删除测试结果相关的分享令牌
      prisma.shareToken.deleteMany({
        where: {
          result: {
            userId
          }
        }
      }),
      // 删除测试结果
      prisma.testResult.deleteMany({
        where: { userId }
      }),
      // 删除全面分析
      prisma.fullAnalysis.deleteMany({
        where: { userId }
      }),
      // 删除好友请求
      prisma.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      }),
      // 删除消息
      prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      }),
      // 删除用户
      prisma.user.delete({
        where: { id: userId }
      })
    ])

    return NextResponse.json({ message: "用户已删除" })

  } catch (error) {
    console.error("DELETE_USER_ERROR", error)
    return NextResponse.json(
      { message: "删除失败" }, 
      { status: 500 }
    )
  }
}
