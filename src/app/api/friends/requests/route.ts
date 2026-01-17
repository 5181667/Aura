import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ message: "未登录" }, { status: 401 })
        }

        const userId = (session.user as any).id

        const requests = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId,
                status: "PENDING"
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ requests }, { status: 200 })
    } catch (error) {
        console.error("GET_REQUESTS_ERROR", error)
        return NextResponse.json({ message: "获取失败" }, { status: 500 })
    }
}
