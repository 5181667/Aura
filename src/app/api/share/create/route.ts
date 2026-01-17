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

        const { resultId } = await req.json()

        // Verify the result belongs to the user
        const result = await prisma.testResult.findUnique({
            where: { id: resultId }
        })

        if (!result || result.userId !== (session.user as any).id) {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        // Create share token (expires in 30 days)
        const shareToken = await prisma.shareToken.create({
            data: {
                resultId,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
        })

        return NextResponse.json({ token: shareToken.token }, { status: 201 })
    } catch (error) {
        console.error("SHARE_CREATE_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
