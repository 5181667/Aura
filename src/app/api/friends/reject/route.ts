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

        const { requestId } = await req.json()
        const userId = (session.user as any).id

        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId }
        })

        if (!request || request.receiverId !== userId) {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        await prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" }
        })

        return NextResponse.json({ message: "已拒绝好友请求" }, { status: 200 })
    } catch (error) {
        console.error("REJECT_FRIEND_ERROR", error)
        return NextResponse.json({ message: "操作失败" }, { status: 500 })
    }
}
