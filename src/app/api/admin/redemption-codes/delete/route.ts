import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// POST - 批量删除兑换码
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        const { ids } = await req.json()

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "请选择要删除的兑换码" }, { status: 400 })
        }

        const result = await prisma.redemptionCode.deleteMany({
            where: {
                id: { in: ids }
            }
        })

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
        })

    } catch (error) {
        console.error("DELETE_REDEMPTION_CODES_ERROR", error)
        return NextResponse.json({ message: "删除兑换码失败" }, { status: 500 })
    }
}
