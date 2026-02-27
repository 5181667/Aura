"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, Clock, Target, Sparkles } from "lucide-react"
import { calculateScore } from "@/data/scoring"
import { useToast } from "@/components/Toast"
import { getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import GenderSelector from "@/components/GenderSelector"
import LoadingButton from "@/components/LoadingButton"
import styles from "./engine.module.css"

const testBannerImages: Record<string, string> = {
    'TALENT': '/images/tests/talent-cover.png',
    'MENTAL_AGE': '/images/tests/mental-age-cover.png',
}

interface TestEngineProps {
    test: {
        id: string
        title: string
        description: string
        type: string
        questions: any[]
        scoring?: any
    }
}

// 维度对应的颜色主题
const dimensionColors: Record<string, { primary: string; secondary: string }> = {
    // MBTI
    'E': { primary: '#f59e0b', secondary: '#fbbf24' }, // 外向 - 温暖橙
    'I': { primary: '#6366f1', secondary: '#818cf8' }, // 内向 - 宁静紫
    'S': { primary: '#10b981', secondary: '#34d399' }, // 感知 - 稳定绿
    'N': { primary: '#8b5cf6', secondary: '#a78bfa' }, // 直觉 - 神秘紫
    'T': { primary: '#06b6d4', secondary: '#22d3ee' }, // 思考 - 冷静青
    'F': { primary: '#ec4899', secondary: '#f472b6' }, // 情感 - 温柔粉
    'J': { primary: '#3b82f6', secondary: '#60a5fa' }, // 判断 - 决断蓝
    'P': { primary: '#14b8a6', secondary: '#2dd4bf' }, // 感知 - 灵活绿
    // DISC
    'D': { primary: '#ef4444', secondary: '#f87171' }, // 支配 - 力量红
    // Big Five
    'O': { primary: '#a855f7', secondary: '#c084fc' }, // 开放性 - 创意紫
    'C': { primary: '#0ea5e9', secondary: '#38bdf8' }, // 尽责性 - 专注蓝
    'A': { primary: '#22c55e', secondary: '#4ade80' }, // 亲和性 - 和谐绿
    // EQ
    'SA': { primary: '#8b5cf6', secondary: '#a78bfa' }, // 自我认知
    'SM': { primary: '#06b6d4', secondary: '#22d3ee' }, // 自我管理
    'MO': { primary: '#f59e0b', secondary: '#fbbf24' }, // 动机
    'EM': { primary: '#ec4899', secondary: '#f472b6' }, // 同理心
    'SS': { primary: '#10b981', secondary: '#34d399' }, // 社交技能
    // Depression（5维度）
    'EMO': { primary: '#8b5cf6', secondary: '#a78bfa' }, // 情绪症状 - 紫色
    'SOM': { primary: '#06b6d4', secondary: '#22d3ee' }, // 躯体症状 - 青色
    'COG': { primary: '#f59e0b', secondary: '#fbbf24' }, // 认知症状 - 橙色
    'BEH': { primary: '#ef4444', secondary: '#f87171' }, // 行为症状 - 红色
    'SOC': { primary: '#6366f1', secondary: '#818cf8' }, // 社会功能 - 靛蓝
    'DEP': { primary: '#6366f1', secondary: '#818cf8' }, // 兼容旧数据
    // 天赋发掘
    'LI': { primary: '#f97316', secondary: '#fb923c' }, // 语言智能 - 橙色
    'LM': { primary: '#3b82f6', secondary: '#60a5fa' }, // 逻辑数理 - 蓝色
    'SV': { primary: '#a855f7', secondary: '#c084fc' }, // 空间视觉 - 紫色
    'MU': { primary: '#ec4899', secondary: '#f472b6' }, // 音乐节奏 - 粉色
    'BK': { primary: '#ef4444', secondary: '#f87171' }, // 身体运动 - 红色
    'IP': { primary: '#22c55e', secondary: '#4ade80' }, // 人际交往 - 绿色
    'IA': { primary: '#6366f1', secondary: '#818cf8' }, // 自我认知 - 靛蓝
    'NA': { primary: '#14b8a6', secondary: '#2dd4bf' }, // 自然观察 - 青绿
    // 心理年龄
    'CM': { primary: '#0ea5e9', secondary: '#38bdf8' }, // 认知成熟度 - 天蓝
    'VM': { primary: '#f59e0b', secondary: '#fbbf24' }, // 价值观成熟度 - 琥珀
    'ID': { primary: '#8b5cf6', secondary: '#a78bfa' }, // 独立自主性 - 紫色
    // 默认
    'default': { primary: '#8b5cf6', secondary: '#ec4899' }
}

export default function TestEngine({ test }: TestEngineProps) {
    const { showToast } = useToast()
    const router = useRouter()
    const [started, setStarted] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [showGenderSelector, setShowGenderSelector] = useState(false)
    const [pendingResultId, setPendingResultId] = useState<string | null>(null)
    const pendingKey = `pending-test-submit:${test.id}`

    const questions = test.questions as any[]
    const progress = ((currentIndex + 1) / questions.length) * 100
    const estimatedTime = test.scoring?.estimatedTime || `${Math.ceil(questions.length * 0.3)}分钟`

    // 获取当前问题的维度颜色
    const currentQuestion = questions[currentIndex]
    const currentDimension = currentQuestion?.options?.[0]?.score?.dimension || 'default'
    const currentColors = dimensionColors[currentDimension] || dimensionColors['default']

    const handleStart = () => {
        setStarted(true)
    }

    const handleAnswer = useCallback((option: any) => {
        const newAnswer = {
            questionId: questions[currentIndex].id,
            dimension: option.score.dimension,
            value: option.score.value
        }

        const newAnswers = [...answers, newAnswer]
        setAnswers(newAnswers)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            submitResult(newAnswers)
        }
    }, [currentIndex, answers, questions])

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setAnswers(answers.slice(0, -1))
        }
    }, [currentIndex, answers])

    // 键盘快捷键支持
    useEffect(() => {
        if (!started || submitting) return

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key
            const optionCount = currentQuestion?.options?.length || 0

            // 数字键 1-9 选择选项
            if (key >= '1' && key <= '9') {
                const index = parseInt(key) - 1
                if (index < optionCount) {
                    handleAnswer(currentQuestion.options[index])
                }
            }

            // 退格键返回上一题
            if (key === 'Backspace' && currentIndex > 0) {
                e.preventDefault()
                handlePrevious()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [started, submitting, currentIndex, currentQuestion, handleAnswer, handlePrevious])

    const submitResult = async (finalAnswers: any[]) => {
        setSubmitting(true)

        try {
            // 使用评分算法计算结果
            const result = calculateScore(test.type, finalAnswers)

            // 提交到后端（支持游客提交）
            const response = await fetch('/api/tests/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId: test.id,
                    score: result.score,
                    details: { answers: finalAnswers },
                    dimensions: result.dimensions
                })
            })

            if (response.ok) {
                const data = await response.json()
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(pendingKey)
                    // 如果是游客，保存结果ID到本地以便后续关联
                    if (data.isGuest) {
                        const guestResults = JSON.parse(localStorage.getItem('guest-results') || '[]')
                        guestResults.push({
                            resultId: data.resultId,
                            testId: test.id,
                            createdAt: Date.now()
                        })
                        localStorage.setItem('guest-results', JSON.stringify(guestResults))
                    }
                }

                // 已登录用户自动触发 AI 分析
                const session = await getSession()
                if (session) {
                    fetch('/api/ai/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resultId: data.resultId })
                    }).catch(console.error)

                    // 检查是否需要显示性别选择（首次测试）
                    try {
                        const genderRes = await fetch('/api/user/gender')
                        const genderData = await genderRes.json()
                        if (!genderData.hasGender) {
                            // 首次测试，显示性别选择弹窗
                            setPendingResultId(data.resultId)
                            setShowGenderSelector(true)
                            setSubmitting(false)
                            return
                        }
                    } catch (e) {
                        console.error('Check gender error:', e)
                    }
                }

                // 跳转到结果页
                window.location.href = `/results/${data.resultId}`
            } else {
                const errorData = await response.json().catch(() => null)
                const message = errorData?.message || '提交失败'
                throw new Error(message)
            }
        } catch (error) {
            console.error('Submit error:', error)
            showToast(error instanceof Error ? error.message : '提交失败，请重试', 'error')
            setSubmitting(false)
        }
    }

    // 处理性别选择
    const handleGenderSelect = async (gender: string | null) => {
        try {
            // 保存性别
            await fetch('/api/user/gender', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gender })
            })
        } catch (e) {
            console.error('Save gender error:', e)
        }

        // 跳转到结果页
        if (pendingResultId) {
            window.location.href = `/results/${pendingResultId}`
        }
    }

    const handleGenderClose = () => {
        setShowGenderSelector(false)
        if (pendingResultId) {
            window.location.href = `/results/${pendingResultId}`
        }
    }

    useEffect(() => {
        const resumePendingSubmit = async () => {
            if (typeof window === 'undefined') return
            const stored = localStorage.getItem(pendingKey)
            if (!stored) return

            try {
                const pending = JSON.parse(stored)
                if (!pending?.answers?.length) return
                setStarted(true)
                submitResult(pending.answers)
            } catch (error) {
                console.error('Resume submit error:', error)
            }
        }

        resumePendingSubmit()
    }, [pendingKey])

    // 开始界面
    if (!started) {
        return (
            <div className={`${styles.introCard} glass`}>
                {testBannerImages[test.type] && (
                    <div className={styles.introBanner}>
                        <Image
                            src={testBannerImages[test.type]}
                            alt={test.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).parentElement!.style.display = 'none'
                            }}
                        />
                    </div>
                )}
                <div className={styles.introIcon}>
                    <Sparkles size={48} />
                </div>
                <h2>{test.title}</h2>
                <p className={styles.introDesc}>{test.description}</p>

                <div className={styles.introMeta}>
                    <div className={styles.metaItem}>
                        <Target size={20} />
                        <span>{questions.length} 道题目</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Clock size={20} />
                        <span>预计 {estimatedTime}</span>
                    </div>
                </div>

                <div className={styles.introTips}>
                    <h4>答题须知</h4>
                    <ul>
                        <li>请根据真实感受作答，没有对错之分</li>
                        <li>尽量选择第一直觉的答案</li>
                        <li>可以随时返回修改上一题的答案</li>
                        <li>完成后将获得 AI 智能分析报告</li>
                    </ul>
                </div>

                <LoadingButton
                    className="btn-premium w-full md:w-auto"
                    onClick={() => {
                        setStarted(true)
                    }}
                >
                    开始测试
                </LoadingButton>
            </div>
        )
    }

    // 提交中
    if (submitting) {
        return (
            <div className={`${styles.resultCard} glass`}>
                <div className={styles.loadingSpinner}>
                    <Sparkles className={styles.sparkle} />
                </div>
                <h2>正在计算结果...</h2>
                <p className={styles.description}>AI 正在分析您的答案，请稍候</p>
            </div>
        )
    }

    return (
        <div className={styles.engineWrapper}>
            {/* 动态呼吸背景光斑 */}
            <div className={styles.atmosphereContainer}>
                <motion.div
                    className={styles.atmosphereOrb}
                    animate={{
                        background: `radial-gradient(circle, ${currentColors.primary}40 0%, ${currentColors.secondary}15 40%, transparent 70%)`
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.div
                    className={styles.atmosphereOrbSecondary}
                    animate={{
                        background: `radial-gradient(circle, ${currentColors.secondary}25 0%, ${currentColors.primary}10 40%, transparent 70%)`
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            {/* 进度条 */}
            <div className={styles.progressContainer}>
                <motion.div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                    animate={{
                        background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* 进度信息 */}
            <div className={styles.progressInfo}>
                <span className={styles.progressText}>
                    {currentIndex + 1} / {questions.length}
                </span>
                <motion.span
                    className={styles.progressPercent}
                    animate={{ color: currentColors.primary }}
                    transition={{ duration: 0.5 }}
                >
                    {Math.round(progress)}%
                </motion.span>
            </div>

            {/* 主内容容器 - 毛玻璃面板 */}
            <div className={styles.glassPanel}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={styles.questionCard}
                    >
                        <span className={styles.step}>问题 {currentIndex + 1}</span>
                        <h3>{currentQuestion.question}</h3>

                        <div className={styles.optionsGrid}>
                            {currentQuestion.options.map((option: any, idx: number) => (
                                <motion.button
                                    key={idx}
                                    className={styles.optionBtn}
                                    onClick={() => handleAnswer(option)}
                                    whileHover={{ scale: 1.02, x: 8 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        '--hover-color': currentColors.primary
                                    } as React.CSSProperties}
                                >
                                    <span className={styles.keyHint}>{idx + 1}</span>
                                    <span className={styles.optionText}>{option.text}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* 底部操作区 */}
                        <div className={styles.actionBar}>
                            {currentIndex > 0 && (
                                <button
                                    className={styles.prevBtn}
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft size={18} />
                                    上一题
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 键盘提示 - 桌面端显示 */}
            <div className={styles.keyboardHint}>
                <kbd>1</kbd>-<kbd>{Math.min(currentQuestion.options.length, 9)}</kbd> 选择
                {currentIndex > 0 && <><span className={styles.hintDivider}>|</span><kbd>←</kbd> 返回上一题</>}
            </div>

            {/* 性别选择弹窗 */}
            <GenderSelector
                isOpen={showGenderSelector}
                onSelect={handleGenderSelect}
                onClose={handleGenderClose}
            />
        </div>
    )
}
