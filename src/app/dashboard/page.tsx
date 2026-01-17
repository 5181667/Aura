import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Brain, Sparkles, ArrowRight, Zap, Trophy, FileText, Compass } from "lucide-react"
import Navbar from "@/components/Navbar"
import TestTimeline from "@/components/TestTimeline"
import styles from "./dashboard.module.css"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            testResults: {
                include: { test: true },
                orderBy: { createdAt: "desc" }
            },
            fullAnalysis: true
        }
    })

    // 计算用户注册天数
    const daysSinceJoined = user?.createdAt 
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 1

    // 统计数据
    const testTypes = new Set(user?.testResults.map(r => r.test.type))
    const stats = {
        totalTests: user?.testResults.length || 0,
        testTypes: testTypes.size,
        hasFullAnalysis: !!user?.fullAnalysis,
        // 获取最近的 MBTI 结果作为主要特质
        mainTrait: user?.testResults.find(r => r.test.type === 'MBTI')?.score || 
                   user?.testResults[0]?.score || null
    }

    // 获取未完成的测试类型
    const allTestTypes = ['MBTI', 'BIG_FIVE', 'DISC', 'EQ', 'HOLLAND', 'ENNEAGRAM']
    const completedTypes = Array.from(testTypes)
    const uncompletedTests = allTestTypes.filter(t => !completedTypes.includes(t))
    
    // 测试类型配置
    const testTypeInfo: Record<string, { name: string; desc: string; icon: string }> = {
        'BIG_FIVE': { name: '大五人格', desc: '解锁 98% 的深度自我认知', icon: '🧬' },
        'DISC': { name: 'DISC 行为风格', desc: '了解你的工作行为模式', icon: '📊' },
        'EQ': { name: '情商测试', desc: '探索你的情感智慧维度', icon: '💖' },
        'HOLLAND': { name: '霍兰德职业兴趣', desc: '发现最适合你的职业方向', icon: '🎯' },
        'ENNEAGRAM': { name: '九型人格', desc: '深入理解你的核心动机', icon: '🔮' },
        'MBTI': { name: 'MBTI 性格类型', desc: '探索你的16种性格类型', icon: '🧠' }
    }

    return (
        <div className={styles.container}>
            <Navbar />

            <main className={styles.main}>
                {/* 顶部：问候区 + 属性栏 */}
                <header className={styles.header}>
                    <div className={styles.greetingArea}>
                        <h1 className={styles.greeting}>
                            你好，{user?.name} <span className={styles.wave}>👋</span>
                        </h1>
                        <p className={styles.subtitle}>
                            这是你探索自我的第 <strong>{daysSinceJoined}</strong> 天
                            {stats.testTypes > 0 && (
                                <>，已解锁 <strong>{stats.testTypes}</strong> 个维度的性格画像</>
                            )}
                        </p>
                    </div>
                    
                    <div className={styles.statusBar}>
                        <div className={styles.statusItem}>
                            <FileText size={18} />
                            <span className={styles.statusValue}>{stats.totalTests}</span>
                            <span className={styles.statusLabel}>次测试</span>
                        </div>
                        <div className={styles.statusDivider} />
                        <div className={styles.statusItem}>
                            <Compass size={18} />
                            <span className={styles.statusValue}>{stats.testTypes}</span>
                            <span className={styles.statusLabel}>种类型</span>
                        </div>
                        {stats.mainTrait && (
                            <>
                                <div className={styles.statusDivider} />
                                <div className={`${styles.statusItem} ${styles.traitItem}`}>
                                    <Trophy size={18} />
                                    <span className={styles.statusTrait}>{stats.mainTrait}</span>
                                </div>
                            </>
                        )}
                        <Link href="/tests" className={styles.newTestBtn}>
                            开始新测试
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </header>

                {/* 主内容区 */}
                <div className={styles.mainGrid}>
                    {/* 左侧：时间轴 */}
                    <section className={styles.timelineSection}>
                        <div className={styles.sectionHeader}>
                            <h2>成长轨迹</h2>
                            <Link href="/tests" className={styles.sectionLink}>
                                探索更多 <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        {user?.testResults.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <Sparkles size={48} />
                                </div>
                                <h3>开启你的探索之旅</h3>
                                <p>完成第一个测试，开始绘制你的性格画像</p>
                                <Link href="/tests" className="btn-premium">
                                    开始第一个测试
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <TestTimeline results={user?.testResults as any} />
                        )}
                    </section>

                    {/* 右侧：AI 分析 + 推荐 */}
                    <aside className={styles.sidebar}>
                        {/* AI 深度画像卡片 */}
                        <div className={styles.aiCard}>
                            <div className={styles.aiCardBg}>
                                <div className={styles.aiOrb} />
                                <div className={styles.aiOrbSecondary} />
                            </div>
                            
                            <div className={styles.aiContent}>
                                <div className={styles.aiIconWrapper}>
                                    <Brain size={32} />
                                    <div className={styles.aiPulse} />
                                </div>
                                
                                <h3>AI 深度人格画像</h3>
                                <p>
                                    基于你完成的 {stats.totalTests} 次测试数据，
                                    AI 将为你生成独一无二的综合性格分析报告
                                </p>
                                
                                <Link href="/analysis" className={styles.aiBtn}>
                                    <Zap size={18} />
                                    {stats.hasFullAnalysis ? '查看我的画像' : '生成深度人格画像'}
                                    <Sparkles size={16} className={styles.btnSparkle} />
                                </Link>
                            </div>
                        </div>

                        {/* 待探索推荐 */}
                        {uncompletedTests.length > 0 && (
                            <div className={styles.recommendSection}>
                                <h3 className={styles.recommendTitle}>
                                    <Compass size={18} />
                                    探索更多维度
                                </h3>
                                <div className={styles.recommendList}>
                                    {uncompletedTests.slice(0, 2).map(type => {
                                        const info = testTypeInfo[type]
                                        return (
                                            <Link 
                                                key={type} 
                                                href="/tests" 
                                                className={styles.recommendCard}
                                            >
                                                <span className={styles.recommendIcon}>{info.icon}</span>
                                                <div className={styles.recommendInfo}>
                                                    <span className={styles.recommendName}>{info.name}</span>
                                                    <span className={styles.recommendDesc}>{info.desc}</span>
                                                </div>
                                                <ArrowRight size={16} className={styles.recommendArrow} />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    )
}
