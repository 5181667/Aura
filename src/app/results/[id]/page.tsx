import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ResultClient from "./ResultClient"

export const dynamic = 'force-dynamic'

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const result = await prisma.testResult.findUnique({
        where: { id },
        include: {
            test: true,
            user: true,
        }
    })

    if (!result || result.userId !== (session.user as any).id) {
        return <div>结果不存在或无权访问</div>
    }

    return <ResultClient result={result} />
}
