import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        const { title, description, type, category, questions } = await req.json()

        if (!title || !type) {
            return NextResponse.json({ message: "参数错误" }, { status: 400 })
        }

        const test = await prisma.test.create({
            data: {
                title,
                description,
                type,
                category: category || 'personality',
                questions: questions || [],
                isPublished: false
            }
        })

        return NextResponse.json({ 
            message: "创建成功", 
            testId: test.id 
        }, { status: 201 })
    } catch (error) {
        console.error("CREATE_TEST_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
