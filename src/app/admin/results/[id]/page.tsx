import Link from "next/link"
import { prisma } from "@/lib/prisma"
import styles from "../results.module.css"

export const dynamic = 'force-dynamic'

function formatJson(value: unknown) {
    if (!value) return null
    try {
        return JSON.stringify(value, null, 2)
    } catch {
        return String(value)
    }
}

export default async function AdminResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const result = await prisma.testResult.findUnique({
        where: { id },
        include: {
            user: true,
            test: true,
            premiumReport: true
        }
    })

    if (!result) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.detailHeader}>
                    <div>
                        <h1>测试结果不存在</h1>
                        <p>未找到对应的历史记录</p>
                    </div>
                    <Link href="/admin/results" className={styles.backLink}>
                        返回列表
                    </Link>
                </div>
            </div>
        )
    }

    const detailsJson = formatJson(result.details)
    const dimensionsJson = formatJson(result.dimensions)
    const aiJson = formatJson(result.aiAnalysis)

    return (
        <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
                <div>
                    <h1>测试详情</h1>
                    <p>查看该用户的完整测试数据与分析结果</p>
                </div>
                <Link href="/admin/results" className={styles.backLink}>
                    返回列表
                </Link>
            </div>

            <div className={styles.detailGrid}>
                <section className={styles.infoCard}>
                    <h2>基础信息</h2>
                    <div className={styles.infoList}>
                        <div>
                            <span className={styles.label}>测试名称</span>
                            <span className={styles.value}>{result.test.title}</span>
                        </div>
                        <div>
                            <span className={styles.label}>测试类型</span>
                            <span className={styles.value}>{result.test.type}</span>
                        </div>
                        <div>
                            <span className={styles.label}>结果分数</span>
                            <span className={styles.value}>{result.score}</span>
                        </div>
                        <div>
                            <span className={styles.label}>完成时间</span>
                            <span className={styles.value}>
                                {new Date(result.createdAt).toLocaleString("zh-CN")}
                            </span>
                        </div>
                        <div>
                            <span className={styles.label}>AI分析时间</span>
                            <span className={styles.value}>
                                {result.aiAnalyzedAt ? new Date(result.aiAnalyzedAt).toLocaleString("zh-CN") : "未分析"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className={styles.infoCard}>
                    <h2>用户信息</h2>
                    <div className={styles.infoList}>
                        <div>
                            <span className={styles.label}>用户身份</span>
                            <span className={styles.value}>{result.user ? "注册用户" : "游客"}</span>
                        </div>
                        <div>
                            <span className={styles.label}>用户昵称</span>
                            <span className={styles.value}>{result.user?.name || "匿名"}</span>
                        </div>
                        <div>
                            <span className={styles.label}>用户邮箱</span>
                            <span className={styles.value}>{result.user?.email || "未绑定邮箱"}</span>
                        </div>
                        <div>
                            <span className={styles.label}>高级报告</span>
                            <span className={styles.value}>
                                {result.premiumReport?.paymentStatus === "PAID" ? "已购买" : "未购买"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className={styles.infoCard}>
                    <h2>维度得分</h2>
                    {dimensionsJson ? (
                        <pre className={styles.jsonBlock}>{dimensionsJson}</pre>
                    ) : (
                        <p className={styles.emptyText}>暂无维度数据</p>
                    )}
                </section>

                <section className={styles.infoCard}>
                    <h2>AI 分析结果</h2>
                    {aiJson ? (
                        <pre className={styles.jsonBlock}>{aiJson}</pre>
                    ) : (
                        <p className={styles.emptyText}>暂无 AI 分析</p>
                    )}
                </section>

                <section className={`${styles.infoCard} ${styles.fullWidth}`}>
                    <h2>详细结果</h2>
                    {detailsJson ? (
                        <pre className={styles.jsonBlock}>{detailsJson}</pre>
                    ) : (
                        <p className={styles.emptyText}>暂无详细结果</p>
                    )}
                </section>
            </div>
        </div>
    )
}
