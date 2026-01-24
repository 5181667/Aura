import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import RadarChart from "@/components/RadarChart"
import PersonalityReport from "@/components/PersonalityReport"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import styles from "../../results/[id]/result.module.css"

export const dynamic = 'force-dynamic'

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params

    const shareToken = await prisma.shareToken.findUnique({
        where: { token },
        include: {
            result: {
                include: {
                    test: true,
                    user: true,
                }
            }
        }
    })

    if (!shareToken || new Date() > shareToken.expiresAt) {
        notFound()
    }

    const result = shareToken.result
    // 处理游客情况：user 可能为 null
    const userName = result.user?.name || '匿名用户'
    
    const fallbackDimensions = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
    }
    const dimensionArray = Array.isArray(result.dimensions) ? result.dimensions : null
    const dimensions = dimensionArray ? fallbackDimensions : (result.dimensions as typeof fallbackDimensions || fallbackDimensions)
    const radarData = dimensionArray
        ? Object.fromEntries(
            dimensionArray.map((dim: any) => [
                dim.label || dim.dimension,
                Number(dim.percentage ?? dim.rawScore ?? 0)
            ])
        )
        : dimensions

    return (
        <div className={styles.container}>
            <Navbar />

            <main className={styles.main}>
                <div className={styles.header}>
                    <p style={{ opacity: 0.7, marginBottom: '1rem' }}>
                        {userName} 分享了 TA 的测试结果
                    </p>
                    <h1>{result.test.title}</h1>
                    <div className={styles.scoreDisplay}>
                        <span className={styles.scoreLabel}>测试结果</span>
                        <span className={styles.scoreValue}>{result.score}</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <section className={`${styles.chartSection} glass`}>
                        <h2>性格维度雷达图</h2>
                        <RadarChart data={radarData} />
                    </section>

                    <section className={`${styles.reportSection} glass`}>
                        {dimensionArray ? (
                            <div className={styles.dimensionList}>
                                {dimensionArray.map((dim: any) => (
                                    <div key={dim.dimension} className={styles.dimensionItem}>
                                        <span className={styles.dimensionName}>{dim.label || dim.dimension}</span>
                                        <span className={styles.dimensionValue}>
                                            {Number(dim.percentage ?? dim.rawScore ?? 0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <PersonalityReport dimensions={dimensions} />
                        )}
                    </section>

                    <div className={styles.actions}>
                        <Link href="/register" className="btn-premium">
                            立即注册开始测试
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
