import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const { resultId } = await req.json()

        if (!resultId) {
            return NextResponse.json({ message: "缺少结果ID" }, { status: 400 })
        }

        // 查找测试结果
        const result = await prisma.testResult.findUnique({
            where: { id: resultId }
        })

        if (!result) {
            return NextResponse.json({ message: "测试结果不存在" }, { status: 404 })
        }

        // 权限验证：
        // 1. 如果结果有 userId，必须是当前登录用户的
        // 2. 如果结果没有 userId（游客结果），允许分享
        if (result.userId) {
            if (!session?.user) {
                return NextResponse.json({ message: "请先登录" }, { status: 401 })
            }
            if (result.userId !== (session.user as any).id) {
                return NextResponse.json({ message: "无权限分享此结果" }, { status: 403 })
            }
        }

        // 检查是否已存在有效的分享链接
        const existingToken = await prisma.shareToken.findFirst({
            where: {
                resultId,
                expiresAt: { gt: new Date() }
            }
        })

        if (existingToken) {
            return NextResponse.json({ token: existingToken.token }, { status: 200 })
        }

        // 创建新的分享令牌（30天有效期）
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
