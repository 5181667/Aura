
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const { id } = await params
        const { isPro } = await req.json()

        const user = await prisma.user.update({
            where: { id },
            data: { isPro },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user pro status:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
