"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import RadarChart from '@/components/RadarChart'
import PersonalityReport from '@/components/PersonalityReport'
import ShareDialog from '@/components/ShareDialog'
import styles from './result.module.css'

export default function ResultClient({ result }: { result: any }) {
    const [showShare, setShowShare] = useState(false)

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
                <Link href="/dashboard" className={styles.logo}>AuraTest</Link>
                <Link href="/dashboard" className="btn-premium">返回个人中心</Link>
            </nav>

            <main className={styles.main} id="result-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={styles.header}
                >
                    <h1>{result.test.title} - 测试结果</h1>
                    <div className={styles.scoreDisplay}>
                        <span className={styles.scoreLabel}>你的类型</span>
                        <span className={styles.scoreValue}>{result.score}</span>
                    </div>
                </motion.div>

                <div className={styles.content}>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`${styles.chartSection} glass`}
                    >
                        <h2>性格维度雷达图</h2>
                        <RadarChart dimensions={dimensions} />
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={`${styles.reportSection} glass`}
                    >
                        <PersonalityReport dimensions={dimensions} />
                    </motion.section>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className={styles.actions}
                    >
                        <button 
                            className="btn-premium" 
                            onClick={() => setShowShare(true)}
                        >
                            📤 分享结果
                        </button>
                        <Link href="/tests" className="btn-premium">
                            继续探索更多测试
                        </Link>
                    </motion.div>
                </div>
            </main>

            {showShare && (
                <ShareDialog 
                    resultId={result.id} 
                    onClose={() => setShowShare(false)} 
                />
            )}
        </div>
    )
}
