"use client"

import { useState } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, Heart, Briefcase, Clock, CheckCircle, ArrowRight, Sparkles, RotateCcw } from "lucide-react"
import LoadingButton from "@/components/LoadingButton"
import styles from "./tests.module.css"

function TestCard({ test, isCompleted, config }: { test: any; isCompleted: boolean; config: any }) {
    const router = useRouter()
    const scoring = test.scoring as any
    const questions = test.questions as any[]

    const handleClick = () => {
        router.push(`/tests/${test.id}`)
    }

    return (
        <div
            className={`${styles.testCard} glass cursor-pointer`}
            onClick={handleClick}
        >
            {isCompleted && (
                <div className={styles.completedBadge}>
                    <CheckCircle size={14} />
                    已完成
                </div>
            )}

            <div className={styles.cardHeader}>
                <span
                    className={styles.tag}
                    style={{
                        background: `${config.color}20`,
                        color: config.color,
                        borderColor: `${config.color}40`
                    }}
                >
                    {config.label}
                </span>
                <h3>{test.title}</h3>
            </div>

            <p className={styles.description}>{test.description}</p>

            <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                    <Clock size={14} />
                    {scoring?.estimatedTime || '10-15分钟'}
                </span>
                <span className={styles.metaItem}>
                    {questions?.length || 0} 题
                </span>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <LoadingButton
                    href={`/tests/${test.id}`}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={isCompleted ? styles.restartBtn : styles.startBtn}
                    loadingText="跳转中..."
                >
                    <span>{isCompleted ? '重新测试' : '开始测试'}</span>
                    {isCompleted ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
                </LoadingButton>
            </div>
        </div>
    )
}

// 测试类型标签配置
const typeConfig: Record<string, { label: string; color: string; category: string }> = {
    'MBTI': { label: 'MBTI 16型人格', color: '#8b5cf6', category: 'personality' },
    'BIG_FIVE': { label: '大五人格', color: '#06b6d4', category: 'personality' },
    'DISC': { label: 'DISC 行为风格', color: '#10b981', category: 'personality' },
    'EQ': { label: '情商测试', color: '#f59e0b', category: 'emotion' },
    'HOLLAND': { label: '霍兰德职业兴趣', color: '#ec4899', category: 'career' },
    'ENNEAGRAM': { label: '九型人格', color: '#6366f1', category: 'personality' }
}

// 分类配置
const categoryConfig = [
    { id: 'all', name: '全部测试', icon: <Sparkles size={20} />, color: '#8b5cf6' },
    { id: 'personality', name: '性格测试', icon: <Brain size={20} />, color: '#8b5cf6' },
    { id: 'emotion', name: '情商测试', icon: <Heart size={20} />, color: '#f59e0b' },
    { id: 'career', name: '职业兴趣', icon: <Briefcase size={20} />, color: '#ec4899' }
]

interface TestsClientProps {
    tests: any[]
    completedTestIds: string[]
}

export default function TestsClient({ tests, completedTestIds }: TestsClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')

    // 按类别分组
    const categories = {
        all: tests,
        personality: tests.filter(t => ['MBTI', 'BIG_FIVE', 'DISC', 'ENNEAGRAM'].includes(t.type)),
        emotion: tests.filter(t => t.type === 'EQ'),
        career: tests.filter(t => t.type === 'HOLLAND')
    }

    const displayTests = categories[activeCategory as keyof typeof categories] || tests

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>探索测试</h1>
                <p>从性格到职业，多维度了解真实的自己</p>
            </header>

            {/* 分类标签栏 */}
            <div className={styles.categoryTabs}>
                {categoryConfig.map((category) => {
                    const count = categories[category.id as keyof typeof categories]?.length || 0
                    return (
                        <button
                            key={category.id}
                            className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                            style={{
                                '--category-color': category.color
                            } as React.CSSProperties}
                        >
                            <span className={styles.tabIcon}>{category.icon}</span>
                            <span className={styles.tabName}>{category.name}</span>
                            <span className={styles.tabCount}>{count}</span>
                        </button>
                    )
                })}
            </div>

            {/* 测试卡片网格 */}
            <div className={styles.testGrid}>
                {displayTests.map((test: any) => {
                    const config = typeConfig[test.type] || { label: test.type, color: '#8b5cf6' }
                    const isCompleted = completedTestIds.includes(test.id)

                    return (
                        <TestCard
                            key={test.id}
                            test={test}
                            isCompleted={isCompleted}
                            config={config}
                        />
                    )
                })}
            </div>

            {displayTests.length === 0 && (
                <div className={styles.emptyState}>
                    <Sparkles size={48} />
                    <p>该分类暂无测试</p>
                </div>
            )}
        </main>
    )
}
