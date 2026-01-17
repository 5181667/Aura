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

        const { userId, role } = await req.json()

        if (!userId || !role || !['USER', 'ADMIN'].includes(role)) {
            return NextResponse.json({ message: "参数错误" }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        return NextResponse.json({ message: "角色已更新" }, { status: 200 })
    } catch (error) {
        console.error("UPDATE_ROLE_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
