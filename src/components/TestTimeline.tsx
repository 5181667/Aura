"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
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

    return (
        <div className={styles.timeline}>
            {Object.entries(groupedResults).map(([date, dateResults], index) => (
                <motion.div
                    key={date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={styles.dateGroup}
                >
                    <div className={styles.dateLabel}>{date}</div>
                    <div className={styles.results}>
                        {dateResults.map((result) => (
                            <Link 
                                key={result.id} 
                                href={`/results/${result.id}`}
                                className={styles.resultCard}
                            >
                                <div className={styles.resultBadge}>{result.test.type}</div>
                                <h4>{result.test.title}</h4>
                                <div className={styles.resultScore}>
                                    结果：<span>{result.score}</span>
                                </div>
                                <div className={styles.resultTime}>
                                    {new Date(result.createdAt).toLocaleTimeString('zh-CN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
