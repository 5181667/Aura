import { prisma } from "@/lib/prisma"
import ResultsTable from "./ResultsTable"
import styles from "../admin.module.css"

export const dynamic = 'force-dynamic'

export default async function AdminResultsPage() {
    const results = await prisma.testResult.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            score: true,
            createdAt: true,
            aiAnalyzedAt: true,
            ipAddress: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            test: {
                select: {
                    title: true,
                    type: true
                }
            },
            premiumReport: {
                select: {
                    paymentStatus: true
                }
            }
        }
    })

    const formattedResults = results.map(result => ({
        ...result,
        createdAt: result.createdAt.toISOString(),
        aiAnalyzedAt: result.aiAnalyzedAt ? result.aiAnalyzedAt.toISOString() : null
    }))

    return (
        <div>
            <header className={styles.header}>
                <h1>历史测试详情</h1>
                <p>管理员可查看所有历史测试结果与关键信息</p>
            </header>

            <section className={`${styles.section} glass`}>
                <div className={styles.sectionHeader}>
                    <h2>全部记录 ({results.length})</h2>
                </div>
                <ResultsTable results={formattedResults} />
            </section>
        </div>
    )
}
