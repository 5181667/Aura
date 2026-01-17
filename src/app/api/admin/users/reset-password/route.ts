import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const { userId, newPassword } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "缺少 userId 参数" }, { status: 400 })
    }

    // 生成随机密码或使用提供的密码
    const password = newPassword || generateRandomPassword()
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      message: "密码已重置",
      temporaryPassword: newPassword ? undefined : password
    })

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error)
    return NextResponse.json(
      { message: "操作失败" }, 
      { status: 500 }
    )
  }
}

function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
