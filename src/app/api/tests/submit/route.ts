import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ message: "未登录" }, { status: 401 })
        }

        const { testId, score, details, dimensions } = await req.json()

        if (!testId || !score) {
            return NextResponse.json({ message: "缺少必要参数" }, { status: 400 })
        }

        const result = await prisma.testResult.create({
            data: {
                userId: (session.user as any).id,
                testId,
                score,
                details,
                dimensions,
            }
        })

        return NextResponse.json({ 
            message: "提交成功", 
            resultId: result.id 
        }, { status: 201 })
    } catch (error) {
        console.error("TEST_SUBMIT_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
