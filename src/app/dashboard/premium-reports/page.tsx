import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Crown, ArrowLeft, ArrowRight, Calendar, FileText } from "lucide-react"
import Navbar from "@/components/Navbar"
import styles from "./premium-reports.module.css"

export const dynamic = 'force-dynamic'

export default async function PremiumReportsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const userId = (session.user as any).id

    // 获取用户所有已购买的高级报告
    const premiumReports = await prisma.premiumReport.findMany({
        where: {
            userId,
            paymentStatus: 'PAID'
        },
        include: {
            testResult: {
                include: { test: true }
            }
        },
        orderBy: { paidAt: 'desc' }
    })

    return (
        <div className={styles.container}>
            <Navbar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={20} />
                        返回仪表盘
                    </Link>
                    <h1>
                        <Crown size={28} />
                        我的高级报告
                    </h1>
                    <p>您已解锁 {premiumReports.length} 份 AI 深度分析报告</p>
                </header>

                {premiumReports.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Crown size={64} className={styles.emptyIcon} />
                        <h2>还没有高级报告</h2>
                        <p>完成测试后，您可以购买 AI 深度分析报告，获取恋爱、事业、成长等全方位解读</p>
                        <Link href="/tests" className={styles.exploreBtn}>
                            探索测试
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className={styles.reportGrid}>
                        {premiumReports.map((report) => (
                            <Link
                                key={report.id}
                                href={`/results/${report.testResultId}`}
                                className={styles.reportCard}
                            >
                                <div className={styles.reportHeader}>
                                    <span className={styles.reportType}>
                                        {report.testResult.test.title}
                                    </span>
                                    <span className={styles.reportScore}>
                                        {report.testResult.score}
                                    </span>
                                </div>
                                
                                <div className={styles.reportMeta}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} />
                                        {report.paidAt ? new Date(report.paidAt).toLocaleDateString('zh-CN') : '未知日期'}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <FileText size={14} />
                                        {report.reportData ? '已生成' : '待生成'}
                                    </span>
                                </div>

                                <div className={styles.reportPreview}>
                                    {report.reportData ? (
                                        <p>包含恋爱分析、个人成长、事业规划等完整内容</p>
                                    ) : (
                                        <p>报告正在生成中，点击查看详情</p>
                                    )}
                                </div>

                                <div className={styles.reportAction}>
                                    查看完整报告
                                    <ArrowRight size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
