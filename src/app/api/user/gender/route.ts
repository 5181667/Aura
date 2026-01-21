import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 更新用户性别
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ message: "未登录" }, { status: 401 })
        }

        const { gender } = await req.json()

        // gender 可以是 'male', 'female', 或 null
        if (gender !== null && gender !== 'male' && gender !== 'female') {
            return NextResponse.json({ message: "无效的性别值" }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { gender }
        })

        return NextResponse.json({ 
            message: "更新成功",
            gender 
        })
    } catch (error) {
        console.error("UPDATE_GENDER_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}

// 获取用户性别（用于判断是否首次测试）
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ message: "未登录" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: { gender: true }
        })

        return NextResponse.json({ 
            gender: user?.gender || null,
            hasGender: !!user?.gender
        })
    } catch (error) {
        console.error("GET_GENDER_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
