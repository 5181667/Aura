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

        const { receiverId } = await req.json()

        if (!receiverId) {
            return NextResponse.json({ message: "缺少参数" }, { status: 400 })
        }

        const senderId = (session.user as any).id

        // Check if already friends or request exists
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        })

        if (existingRequest) {
            return NextResponse.json({ message: "好友请求已存在" }, { status: 400 })
        }

        const request = await prisma.friendRequest.create({
            data: {
                senderId,
                receiverId,
            }
        })

        return NextResponse.json({ message: "好友请求已发送", request }, { status: 201 })
    } catch (error) {
        console.error("FRIEND_REQUEST_ERROR", error)
        return NextResponse.json({ message: "发送失败" }, { status: 500 })
    }
}
