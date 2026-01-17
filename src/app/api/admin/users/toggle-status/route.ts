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

    const { userId, isActive } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "缺少 userId 参数" }, { status: 400 })
    }

    // 不能禁用自己
    if (userId === (session.user as any).id) {
      return NextResponse.json({ message: "不能禁用自己的账户" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    })

    return NextResponse.json({
      message: isActive ? "用户已启用" : "用户已禁用",
      user
    })

  } catch (error) {
    console.error("TOGGLE_USER_STATUS_ERROR", error)
    return NextResponse.json(
      { message: "操作失败" }, 
      { status: 500 }
    )
  }
}
