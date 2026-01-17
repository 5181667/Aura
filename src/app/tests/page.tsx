import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Navbar from "@/components/Navbar"
import TestsClient from "./TestsClient"
import styles from "./tests.module.css"

export default async function TestsPage() {
    const session = await getServerSession(authOptions)
    const tests = await prisma.test.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'asc' }
    })

    // 获取用户已完成的测试
    let completedTestIds: string[] = []
    if (session) {
        const userResults = await prisma.testResult.findMany({
            where: { userId: (session.user as any).id },
            select: { testId: true }
        })
        completedTestIds = userResults.map(r => r.testId)
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <TestsClient tests={tests} completedTestIds={completedTestIds} />
        </div>
    )
}
