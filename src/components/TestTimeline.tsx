"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, RotateCcw } from 'lucide-react'
import { getMBTIProfile } from '@/data/mbti-profiles'
import styles from './TestTimeline.module.css'

interface TestResult {
    id: string
    score: string
    createdAt: Date
    test: {
        id: string
        title: string
        type: string
    }
}

// 类型颜色映射
const typeColors: Record<string, string> = {
    'MBTI': '#8b5cf6',
    'BIG_FIVE': '#06b6d4',
    'DISC': '#f59e0b',
    'EQ': '#ec4899',
    'HOLLAND': '#10b981',
    'ENNEAGRAM': '#6366f1'
}

// 类型图标
const typeIcons: Record<string, string> = {
    'MBTI': '🧠',
    'BIG_FIVE': '🧬',
    'DISC': '📊',
    'EQ': '💖',
    'HOLLAND': '🎯',
    'ENNEAGRAM': '🔮'
}

export default function TestTimeline({ results }: { results: TestResult[] }) {
    const groupByDate = (results: TestResult[]) => {
        const groups: { [key: string]: TestResult[] } = {}

        results.forEach(result => {
            const date = new Date(result.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })

            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(result)
        })

        return groups
    }

    const groupedResults = groupByDate(results)
    const totalGroups = Object.keys(groupedResults).length

    return (
        <div className={styles.timeline}>
            {/* 渐变时间轴线 */}
            <div className={styles.timelineLine} />

            {Object.entries(groupedResults).map(([date, dateResults], groupIndex) => (
                <motion.div
                    key={date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                    className={styles.dateGroup}
                >
                    {/* 时间节点 */}
                    <div className={styles.dateNode}>
                        <div className={styles.nodeDot} />
                        <span className={styles.dateLabel}>{date}</span>
                    </div>

                    {/* 该日期的测试卡片 */}
                    <div className={styles.results}>
                        {dateResults.map((result, idx) => {
                            let color = typeColors[result.test.type] || '#8b5cf6'
                            const icon = typeIcons[result.test.type] || '📋'

                            // 如果是 MBTI，尝试获取具体类型的颜色
                            if (result.test.type === 'MBTI') {
                                const profile = getMBTIProfile(result.score)
                                if (profile) {
                                    color = profile.color
                                }
                            }

                            return (
                                <motion.div
                                    key={result.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: groupIndex * 0.1 + idx * 0.05 }}
                                    className={styles.resultCard}
                                    style={{ '--card-color': color } as React.CSSProperties}
                                >
                                    {/* 大水印结果 */}
                                    <div className={styles.scoreWatermark}>
                                        {result.score}
                                    </div>

                                    {/* 卡片内容 */}
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardTop}>
                                            <span className={styles.typeIcon}>{icon}</span>
                                            <span className={styles.typeBadge} style={{ background: `${color}25`, color }}>
                                                {result.test.type}
                                            </span>
                                            <span className={styles.resultTime}>
                                                {new Date(result.createdAt).toLocaleTimeString('zh-CN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <h4 className={styles.testTitle}>{result.test.title}</h4>

                                        <div className={styles.resultDisplay}>
                                            <span className={styles.resultLabel}>测试结果</span>
                                            <span className={styles.resultValue} style={{ color }}>
                                                {result.score}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover 操作按钮 */}
                                    <div className={styles.cardActions}>
                                        <Link
                                            href={`/results/${result.id}`}
                                            className={styles.actionBtn}
                                        >
                                            <Eye size={16} />
                                            查看详情
                                        </Link>
                                        <Link
                                            href={`/tests/${result.test.id}`}
                                            className={styles.actionBtn}
                                        >
                                            <RotateCcw size={16} />
                                            重新测试
                                        </Link>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
