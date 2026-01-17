import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import RadarChart from "@/components/RadarChart"
import PersonalityReport from "@/components/PersonalityReport"
import Link from "next/link"
import styles from "../../results/[id]/result.module.css"

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
    const dimensions = result.dimensions || {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
    }

    return (
        <div className={styles.container}>
            <nav className={`${styles.navbar} glass`}>
                <Link href="/" className={styles.logo}>AuraTest</Link>
                <Link href="/tests" className="btn-premium">我也要测试</Link>
            </nav>

            <main className={styles.main}>
                <div className={styles.header}>
                    <p style={{ opacity: 0.7, marginBottom: '1rem' }}>
                        {result.user.name} 分享了 TA 的测试结果
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
                        <RadarChart dimensions={dimensions} />
                    </section>

                    <section className={`${styles.reportSection} glass`}>
                        <PersonalityReport dimensions={dimensions} />
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
