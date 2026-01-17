import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        lastActiveAt: true,
        createdAt: true,
        updatedAt: true,
        testResults: {
          include: {
            test: {
              select: {
                id: true,
                title: true,
                type: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        fullAnalysis: {
          select: {
            id: true,
            analyzedAt: true,
            includedTests: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 })
    }

    // 计算统计数据
    const stats = {
      totalTests: user.testResults.length,
      hasFullAnalysis: !!user.fullAnalysis,
      lastTestAt: user.testResults[0]?.createdAt || null
    }

    return NextResponse.json({ user, stats })

  } catch (error) {
    console.error("GET_USER_DETAIL_ERROR", error)
    return NextResponse.json(
      { message: "获取用户详情失败" }, 
      { status: 500 }
    )
  }
}

// 更新用户信息
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const data = await req.json()
    const { name, email, role } = data

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({ 
      message: "用户信息已更新",
      user 
    })

  } catch (error) {
    console.error("UPDATE_USER_ERROR", error)
    return NextResponse.json(
      { message: "更新失败" }, 
      { status: 500 }
    )
  }
}
