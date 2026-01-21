import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 批量操作类型
type BatchAction = 'activate' | 'deactivate' | 'delete' | 'setRole'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const { userIds, action, data } = await req.json() as {
      userIds: string[]
      action: BatchAction
      data?: { role?: string }
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ message: "请选择要操作的用户" }, { status: 400 })
    }

    if (!action) {
      return NextResponse.json({ message: "请指定操作类型" }, { status: 400 })
    }

    const currentUserId = (session.user as any).id

    // 过滤掉当前用户（不能对自己操作）
    const filteredUserIds = userIds.filter(id => id !== currentUserId)

    if (filteredUserIds.length === 0) {
      return NextResponse.json({ message: "不能对自己执行此操作" }, { status: 400 })
    }

    let result: { count: number } | null = null
    let message = ''

    switch (action) {
      case 'activate':
        result = await prisma.user.updateMany({
          where: { id: { in: filteredUserIds } },
          data: { isActive: true }
        })
        message = `已启用 ${result.count} 个用户`
        break

      case 'deactivate':
        result = await prisma.user.updateMany({
          where: { id: { in: filteredUserIds } },
          data: { isActive: false }
        })
        message = `已禁用 ${result.count} 个用户`
        break

      case 'setRole':
        if (!data?.role) {
          return NextResponse.json({ message: "请指定角色" }, { status: 400 })
        }
        result = await prisma.user.updateMany({
          where: { id: { in: filteredUserIds } },
          data: { role: data.role }
        })
        message = `已将 ${result.count} 个用户角色设为 ${data.role}`
        break

      case 'delete':
        // 批量删除需要先删除关联数据
        await prisma.$transaction([
          // 删除测试结果相关的分享令牌
          prisma.shareToken.deleteMany({
            where: {
              result: {
                userId: { in: filteredUserIds }
              }
            }
          }),
          // 删除测试结果
          prisma.testResult.deleteMany({
            where: { userId: { in: filteredUserIds } }
          }),
          // 删除全面分析
          prisma.fullAnalysis.deleteMany({
            where: { userId: { in: filteredUserIds } }
          }),
          // 删除好友请求
          prisma.friendRequest.deleteMany({
            where: {
              OR: [
                { senderId: { in: filteredUserIds } },
                { receiverId: { in: filteredUserIds } }
              ]
            }
          }),
          // 删除消息
          prisma.message.deleteMany({
            where: {
              OR: [
                { senderId: { in: filteredUserIds } },
                { receiverId: { in: filteredUserIds } }
              ]
            }
          }),
          // 删除用户
          prisma.user.deleteMany({
            where: { id: { in: filteredUserIds } }
          })
        ])
        message = `已删除 ${filteredUserIds.length} 个用户`
        break

      default:
        return NextResponse.json({ message: "未知操作类型" }, { status: 400 })
    }

    return NextResponse.json({ 
      message,
      affected: result?.count || filteredUserIds.length
    })

  } catch (error) {
    console.error("BATCH_USER_ACTION_ERROR", error)
    return NextResponse.json(
      { message: "批量操作失败" }, 
      { status: 500 }
    )
  }
}
