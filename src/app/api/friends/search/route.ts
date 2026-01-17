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

        const { query } = await req.json()

        if (!query || query.trim().length < 1) {
            return NextResponse.json({ message: "请输入搜索内容" }, { status: 400 })
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: (session.user as any).id
                        }
                    },
                    {
                        OR: [
                            { email: { contains: query, mode: 'insensitive' } },
                            { name: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                lastActiveAt: true,
            },
            take: 20
        })

        return NextResponse.json({ users }, { status: 200 })
    } catch (error) {
        console.error("FRIEND_SEARCH_ERROR", error)
        return NextResponse.json({ message: "搜索失败" }, { status: 500 })
    }
}
