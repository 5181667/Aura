"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Share2, ChevronRight, Sparkles, Brain, Target, Heart, Briefcase, Users, Eye, Zap, Calendar, Activity, Crown, LogIn, X, RefreshCw, Loader2, ArrowLeft, User, Mail, Clock, Shield } from 'lucide-react'
import ShareDialog from '@/components/ShareDialog'
import Navbar from '@/components/Navbar'
import MBTICharacter from '@/components/MBTICharacter'
import PaymentDialog from '@/components/PaymentDialog'
import RedeemCodeDialog from '@/components/RedeemCodeDialog'
import PremiumReport from '@/components/PremiumReport'
import FamousPeopleGallery from '@/components/FamousPeopleGallery'
import { getMBTIProfile, getDimensionComparisons, type DimensionComparison } from '@/data/mbti-profiles'
import { getBigFiveProfile } from '@/data/big-five-profiles'
import { getDISCProfile } from '@/data/disc-profiles'
import { getEQProfile, eqDimensionProfiles } from '@/data/eq-profiles'
import { getHollandProfile } from '@/data/holland-profiles'
import { getEnneagramProfile, getWingDescription } from '@/data/enneagram-profiles'
import { getDepressionProfile } from '@/data/depression-profiles'
import { getTalentProfile } from '@/data/talent-profiles'
import { getMentalAgeProfile } from '@/data/mental-age-profiles'
import { getDepressionLevel, getDepressionPercentage } from '@/data/scoring/depression-scoring'
import { useTheme } from '@/providers/ThemeProvider'
import styles from './result.module.css'

// 统一 Profile 接口
interface UnifiedProfile {
    title: string
    tagline: string
    emoji: string
    color: string
    colorSecondary: string
    tags: string[]
    description: string
    strengths: string[]
    weaknesses: string[]
    careers: string[]
    famousPeople: string[]
    extraInfo?: { label: string; value: string }[]
}

// 根据测试类型构建统一 Profile
function buildUnifiedProfile(testType: string, score: string, dimensions: any[] | null): UnifiedProfile | null {
    switch (testType) {
        case 'BIG_FIVE': {
            const p = getBigFiveProfile(dimensions || [])
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: p.careers, famousPeople: p.famousPeople }
        }
        case 'DISC': {
            const p = getDISCProfile(score)
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: p.careers, famousPeople: p.famousPeople, extraInfo: [{ label: '沟通风格', value: p.communicationStyle }, { label: '领导风格', value: p.leadershipStyle }, { label: '理想环境', value: p.idealEnvironment }] }
        }
        case 'EQ': {
            const eqScore = parseInt(score) || 50
            const p = getEQProfile(eqScore)
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.improvements, careers: p.tips, famousPeople: [] }
        }
        case 'HOLLAND': {
            const p = getHollandProfile(score)
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: p.careers, famousPeople: p.famousPeople, extraInfo: [{ label: '工作风格', value: p.workStyle }, { label: '理想环境', value: p.idealEnvironment }] }
        }
        case 'ENNEAGRAM': {
            const p = getEnneagramProfile(score)
            const wing = getWingDescription(score)
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: p.careers, famousPeople: p.famousPeople, extraInfo: [{ label: '核心动机', value: p.coreMotivation }, { label: '核心恐惧', value: p.coreFear }, { label: '成长路径', value: p.growthPath }, ...(wing ? [{ label: '翼型', value: wing }] : [])] }
        }
        case 'DEPRESSION': {
            const depScore = parseInt(score) || 0
            const p = getDepressionProfile(depScore)
            const level = getDepressionLevel(depScore)
            return {
                title: p.title,
                tagline: p.tagline,
                emoji: p.emoji,
                color: p.color,
                colorSecondary: p.colorSecondary,
                tags: [],
                description: p.description,
                strengths: p.selfCareSteps.slice(0, 3),
                weaknesses: [],
                careers: [],
                famousPeople: [],
                extraInfo: [
                    { label: '建议措施', value: p.suggestion },
                    ...(p.warningNote ? [{ label: '重要提示', value: p.warningNote }] : [])
                ]
            }
        }
        case 'TALENT': {
            const p = getTalentProfile(score, dimensions || [])
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: p.careers, famousPeople: p.famousPeople, extraInfo: [{ label: '发展建议', value: p.developmentTips[0] || '' }] }
        }
        case 'MENTAL_AGE': {
            const mentalAge = parseInt(score) || 25
            const p = getMentalAgeProfile(mentalAge)
            return { title: p.title, tagline: p.tagline, emoji: p.emoji, color: p.color, colorSecondary: p.colorSecondary, tags: p.tags, description: p.description, strengths: p.strengths, weaknesses: p.weaknesses, careers: [], famousPeople: [], extraInfo: [{ label: '心理年龄', value: `${mentalAge}岁` }, { label: '心态阶段', value: p.ageRange }] }
        }
        default:
            return null
    }
}

// 通用雷达图组件
function GenericRadar({ data, color }: { data: { label: string; value: number }[]; color: string }) {
    const size = 280
    const centerX = size / 2
    const centerY = size / 2
    const maxRadius = size * 0.35
    const count = data.length

    const getPolygonPoints = (values: number[]) => {
        return values.map((val, i) => {
            const angle = (i * 2 * Math.PI) / count - Math.PI / 2
            const radius = (val / 100) * maxRadius
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return `${x},${y}`
        }).join(' ')
    }

    const gridLevels = [20, 40, 60, 80, 100]

    return (
        <div className={styles.radarContainer}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id="genericRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="genericRadarGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {gridLevels.map((level, i) => (
                    <polygon key={level} points={getPolygonPoints(Array(count).fill(level))} fill="none" stroke="var(--border-color)" strokeWidth="1" opacity={0.3 + i * 0.1} />
                ))}
                {data.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    return <line key={i} x1={centerX} y1={centerY} x2={centerX + maxRadius * Math.cos(angle)} y2={centerY + maxRadius * Math.sin(angle)} stroke="var(--border-color)" strokeWidth="1" opacity="0.3" />
                })}
                <motion.polygon points={getPolygonPoints(data.map(d => d.value))} fill="url(#genericRadarGrad)" stroke={color} strokeWidth="2.5" filter="url(#genericRadarGlow)" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ transformOrigin: `${centerX}px ${centerY}px` }} />
                {data.map((item, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    const r = (item.value / 100) * maxRadius
                    return <motion.circle key={i} cx={centerX + r * Math.cos(angle)} cy={centerY + r * Math.sin(angle)} r="5" fill={color} stroke="var(--surface)" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} />
                })}
                {data.map((item, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    const labelR = maxRadius + 40
                    const x = centerX + labelR * Math.cos(angle)
                    const y = centerY + labelR * Math.sin(angle)
                    return (
                        <g key={`label-${i}`}>
                            <text x={x} y={y - 8} textAnchor="middle" className={styles.radarLabel}>{item.label}</text>
                            <text x={x} y={y + 10} textAnchor="middle" className={styles.radarValue}>{item.value}%</text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

interface ResultClientProps {
    result: any
    isLoggedIn?: boolean
    isGuest?: boolean
}

// 维度图标映射
const dimensionIconsMap: Record<string, React.ReactNode> = {
    'E': <Users size={16} />,
    'I': <Brain size={16} />,
    'S': <Eye size={16} />,
    'N': <Sparkles size={16} />,
    'T': <Activity size={16} />,
    'F': <Heart size={16} />,
    'J': <Calendar size={16} />,
    'P': <Zap size={16} />,
    'A': <Target size={16} />,
}

// 双向对抗进度条组件
function DimensionBar({ comparison, index }: { comparison: DimensionComparison; index: number }) {
    const leftPct = comparison.leftPercentage
    const rightPct = comparison.rightPercentage
    const isLeftDominant = leftPct > rightPct

    return (
        <motion.div
            className={styles.dimensionBar}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
            {/* 标签行 - 两端对齐 */}
            <div className={styles.dimensionLabels}>
                <div className={`${styles.dimLabel} ${isLeftDominant ? styles.dominant : styles.secondary}`}>
                    <span className={styles.dimIcon}>
                        {dimensionIconsMap[comparison.leftLetter]}
                    </span>
                    <span className={styles.dimText}>{comparison.leftLabel}</span>
                    <span className={styles.dimPercent}>{leftPct}%</span>
                </div>
                <div className={`${styles.dimLabel} ${!isLeftDominant ? styles.dominant : styles.secondary}`}>
                    <span className={styles.dimPercent}>{rightPct}%</span>
                    <span className={styles.dimText}>{comparison.rightLabel}</span>
                    <span className={styles.dimIcon}>
                        {dimensionIconsMap[comparison.rightLetter]}
                    </span>
                </div>
            </div>

            {/* 双向进度条 */}
            <div className={styles.dualBarTrack}>
                {/* 左侧条 */}
                <motion.div
                    className={`${styles.dualBarFill} ${styles.leftFill}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${leftPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    style={{ opacity: isLeftDominant ? 1 : 0.35 }}
                />
                {/* 中间分隔线 */}
                <div className={styles.dualBarDivider} />
                {/* 右侧条 */}
                <motion.div
                    className={`${styles.dualBarFill} ${styles.rightFill}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${rightPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    style={{ opacity: !isLeftDominant ? 1 : 0.35 }}
                />
            </div>
        </motion.div>
    )
}

// 性格雷达图组件 - 展示主导特质强度
function PersonalityRadar({ comparisons }: { comparisons: DimensionComparison[] }) {
    // 转换数据：只取主导特质
    const radarData = comparisons.map(comp => {
        const isLeftDominant = comp.leftPercentage > comp.rightPercentage
        return {
            label: isLeftDominant ? comp.leftLabel : comp.rightLabel,
            letter: isLeftDominant ? comp.leftLetter : comp.rightLetter,
            value: isLeftDominant ? comp.leftPercentage : comp.rightPercentage
        }
    })

    // 计算雷达图坐标
    const size = 280
    const centerX = size / 2
    const centerY = size / 2
    const maxRadius = size * 0.35
    const count = radarData.length

    // 生成多边形路径
    const getPolygonPoints = (values: number[], scale: number = 1) => {
        return values.map((val, i) => {
            const angle = (i * 2 * Math.PI) / count - Math.PI / 2
            const radius = (val / 100) * maxRadius * scale
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return `${x},${y}`
        }).join(' ')
    }

    // 生成网格线
    const gridLevels = [20, 40, 60, 80, 100]

    return (
        <div className={styles.radarContainer}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 网格背景 */}
                {gridLevels.map((level, i) => (
                    <polygon
                        key={level}
                        points={getPolygonPoints(Array(count).fill(level))}
                        fill="none"
                        stroke="var(--border-color)"
                        strokeWidth="1"
                        opacity={0.3 + i * 0.1}
                    />
                ))}

                {/* 轴线 */}
                {radarData.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    const x = centerX + maxRadius * Math.cos(angle)
                    const y = centerY + maxRadius * Math.sin(angle)
                    return (
                        <line
                            key={i}
                            x1={centerX}
                            y1={centerY}
                            x2={x}
                            y2={y}
                            stroke="var(--border-color)"
                            strokeWidth="1"
                            opacity="0.3"
                        />
                    )
                })}

                {/* 数据区域 */}
                <motion.polygon
                    points={getPolygonPoints(radarData.map(d => d.value))}
                    fill="url(#radarGradient)"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    filter="url(#radarGlow)"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                />

                {/* 数据点 */}
                {radarData.map((item, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    const radius = (item.value / 100) * maxRadius
                    const x = centerX + radius * Math.cos(angle)
                    const y = centerY + radius * Math.sin(angle)
                    return (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="5"
                            fill="var(--primary)"
                            stroke="var(--surface)"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        />
                    )
                })}

                {/* 标签 */}
                {radarData.map((item, i) => {
                    const angle = (i * 2 * Math.PI) / count - Math.PI / 2
                    const labelRadius = maxRadius + 45
                    const x = centerX + labelRadius * Math.cos(angle)
                    const y = centerY + labelRadius * Math.sin(angle)
                    return (
                        <g key={i}>
                            <text
                                x={x}
                                y={y - 8}
                                textAnchor="middle"
                                className={styles.radarLabel}
                            >
                                {item.label}
                            </text>
                            <text
                                x={x}
                                y={y + 10}
                                textAnchor="middle"
                                className={styles.radarValue}
                            >
                                {item.value}%
                            </text>
                        </g>
                    )
                })}
            </svg>

            <p className={styles.radarHint}>形状越饱满，性格特质越鲜明</p>
        </div>
    )
}

interface ResultClientProps {
    result: any
    isLoggedIn?: boolean
    isGuest?: boolean
    isPro?: boolean
    isAdmin?: boolean
}

export default function ResultClient({ result, isLoggedIn = false, isGuest = false, isPro = false, isAdmin = false }: ResultClientProps) {
    const [showShare, setShowShare] = useState(false)
    const [showGuestBanner, setShowGuestBanner] = useState(isGuest)
    const [showPayment, setShowPayment] = useState(false)
    const [showRedeemCode, setShowRedeemCode] = useState(false)
    const [premiumReport, setPremiumReport] = useState<any>(result.premiumReport?.reportData || null)
    const [isPremiumPaid, setIsPremiumPaid] = useState(result.premiumReport?.paymentStatus === 'PAID')
    const [generatingReport, setGeneratingReport] = useState(false)
    const [reportError, setReportError] = useState<string | null>(null)
    const { setThemeByMBTI } = useTheme()

    // 获取 MBTI Profile
    const profile = getMBTIProfile(result.score)
    const isMBTI = result.test.type === 'MBTI' && profile

    // 高级报告状态：已支付 OR 是会员
    const canAccessPremium = isPremiumPaid || isPro
    const hasPremiumReport = canAccessPremium && premiumReport

    // 自动切换到对应 MBTI 类型的主题
    useEffect(() => {
        if (isMBTI && result.score) {
            setThemeByMBTI(result.score)
        }
    }, [isMBTI, result.score, setThemeByMBTI])

    // 检查URL参数，如果支付成功则生成报告
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('payment') === 'success' && isPremiumPaid && !premiumReport) {
            generateReport()
        }
    }, [isPremiumPaid, premiumReport])

    // 生成高级报告
    const generateReport = async () => {
        setGeneratingReport(true)
        setReportError(null)

        try {
            const response = await fetch('/api/premium-report/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testResultId: result.id })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setPremiumReport(data.report)
            } else {
                throw new Error(data.message || '生成报告失败')
            }
        } catch (err) {
            setReportError(err instanceof Error ? err.message : '生成报告失败')
        } finally {
            setGeneratingReport(false)
        }
    }

    // 支付成功回调
    const handlePaymentSuccess = () => {
        setShowPayment(false)
        setIsPremiumPaid(true)
        generateReport()
    }

    // 兑换码成功回调
    const handleRedeemSuccess = () => {
        setShowRedeemCode(false)
        setIsPremiumPaid(true)
        generateReport()
    }

    // 维度数据处理
    const dimensionArray = Array.isArray(result.dimensions) ? result.dimensions : null
    const dimensionComparisons = dimensionArray ? getDimensionComparisons(dimensionArray) : []

    // 游客提示横幅组件（管理员模式下不显示）
    const GuestBanner = () => (
        showGuestBanner && !isLoggedIn && !isAdmin ? (
            <motion.div
                className={styles.guestBanner}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.guestBannerContent}>
                    <LogIn size={20} />
                    <span>登录后可永久保存测试结果，随时查看</span>
                    <Link href={`/login?returnUrl=${encodeURIComponent(`/results/${result.id}`)}`} className={styles.guestBannerBtn}>
                        立即登录
                    </Link>
                </div>
                <button className={styles.guestBannerClose} onClick={() => setShowGuestBanner(false)}>
                    <X size={18} />
                </button>
            </motion.div>
        ) : null
    )

    // 高级报告购买/展示区域
    const PremiumSection = () => {
        // 已有报告 - 展示完整内容
        if (hasPremiumReport) {
            return (
                <motion.section
                    className={styles.premiumSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                >
                    <PremiumReport report={premiumReport} testType={result.test.type} />
                </motion.section>
            )
        }

        // 正在生成报告
        if (generatingReport) {
            return (
                <motion.section
                    className={styles.premiumSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PremiumReport report={null} testType={result.test.type} loading={true} />
                </motion.section>
            )
        }

        // 支付成功/是Pro用户 但生成失败/未生成 - 显示生成/重试
        if (canAccessPremium && !premiumReport) {
            return (
                <motion.section
                    className={styles.premiumSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.premiumBuyTitle}>
                        <Crown size={24} color="#FFD700" />
                        <span>{isPro ? '尊贵会员特权' : '已解锁高级报告'}</span>
                    </div>

                    {reportError && (
                        <div className={styles.errorMsg}>
                            <p>{reportError}</p>
                        </div>
                    )}

                    <div className={styles.premiumAction}>
                        <p className={styles.premiumDesc}>
                            {isPro ? '作为 Pro 会员，您可以免费生成无限次深度 AI 分析报告。' : '您已购买此报告，点击下方按钮开始生成。'}
                        </p>
                        <button
                            className={styles.premiumBuyBtn}
                            onClick={generateReport}
                            disabled={generatingReport}
                        >
                            {generatingReport ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    AI 思考中...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    立即生成详细解读
                                </>
                            )}
                        </button>
                    </div>
                </motion.section>
            )
        }

        // 根据测试类型定制高级报告文案
        const premiumDescMap: Record<string, { desc: string; features: { icon: React.ReactNode; text: string }[] }> = {
            'MBTI': { desc: '获取 AI 深度分析，包含恋爱特点、理想伴侣、职业发展、个人成长等全方位解读。', features: [{ icon: <Heart size={14} />, text: '恋爱深度分析' }, { icon: <Briefcase size={14} />, text: '事业发展规划' }, { icon: <Target size={14} />, text: '个人成长路径' }, { icon: <Brain size={14} />, text: '数据可视化图表' }] },
            'BIG_FIVE': { desc: '获取大五人格深度解读，了解各维度如何影响你的人际关系、职业匹配和生活方式。', features: [{ icon: <Brain size={14} />, text: '五维深度解析' }, { icon: <Users size={14} />, text: '人际关系指南' }, { icon: <Briefcase size={14} />, text: '职业匹配分析' }, { icon: <Target size={14} />, text: '个性化成长建议' }] },
            'DISC': { desc: '获取 DISC 行为风格深度报告，解锁沟通策略、领导力发展和团队协作指南。', features: [{ icon: <Users size={14} />, text: '沟通策略分析' }, { icon: <Crown size={14} />, text: '领导力发展' }, { icon: <Briefcase size={14} />, text: '团队协作指南' }, { icon: <Target size={14} />, text: '冲突解决方案' }] },
            'EQ': { desc: '获取情商深度分析，解锁个性化的情绪管理策略和人际关系优化方案。', features: [{ icon: <Heart size={14} />, text: '情绪管理策略' }, { icon: <Users size={14} />, text: '社交能力提升' }, { icon: <Brain size={14} />, text: '自我认知深化' }, { icon: <Target size={14} />, text: '定制行动计划' }] },
            'HOLLAND': { desc: '获取职业兴趣深度分析，解锁精准的职业规划路径和行业匹配建议。', features: [{ icon: <Briefcase size={14} />, text: '职业路径规划' }, { icon: <Target size={14} />, text: '行业匹配分析' }, { icon: <Brain size={14} />, text: '能力发展建议' }, { icon: <Users size={14} />, text: '职场人际指南' }] },
            'ENNEAGRAM': { desc: '获取九型人格深度报告，解锁内在动机分析、成长路线图和关系指南。', features: [{ icon: <Brain size={14} />, text: '内在动机分析' }, { icon: <Target size={14} />, text: '个性化成长路线' }, { icon: <Heart size={14} />, text: '亲密关系指南' }, { icon: <Briefcase size={14} />, text: '职业发展建议' }] },
            'DEPRESSION': { desc: '获取专业深度分析报告，包含个性化的情绪管理方案、生活调节建议和康复指导。', features: [{ icon: <Heart size={14} />, text: '专业情绪分析' }, { icon: <Target size={14} />, text: '个性化调节方案' }, { icon: <Brain size={14} />, text: '认知行为建议' }, { icon: <Users size={14} />, text: '社会支持指南' }] }
        }
        const premiumConfig = premiumDescMap[result.test.type] || premiumDescMap['MBTI']

        // 未购买 - 显示购买入口
        return (
            <motion.section
                className={styles.premiumBuySection}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
            >
                <div className={styles.premiumBuyTitle}>
                    <Crown size={24} />
                    <span>解锁高级分析报告</span>
                </div>
                <p className={styles.premiumBuyDesc}>
                    {premiumConfig.desc}
                </p>
                <div className={styles.premiumFeatures}>
                    {premiumConfig.features.map((f, i) => (
                        <span key={i}>{f.icon} {f.text}</span>
                    ))}
                </div>
                <button className={styles.premiumBuyBtn} onClick={() => setShowPayment(true)}>
                    <Crown size={18} />
                    扫码购买解锁
                    <span className={styles.premiumPrice}>¥9.9</span>
                </button>
                <button className={styles.redeemCodeBtn} onClick={() => setShowRedeemCode(true)}>
                    已有兑换码？直接兑换
                </button>
            </motion.section>
        )
    }

    // 管理员信息面板组件
    const AdminInfoPanel = () => (
        isAdmin ? (
            <motion.div
                className={styles.adminPanel}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Link href="/admin/results" className={styles.adminBackBtn}>
                    <ArrowLeft size={18} />
                    返回管理后台
                </Link>
                <div className={styles.adminInfo}>
                    <div className={styles.adminInfoItem}>
                        <User size={16} />
                        <span>{result.user?.name || "游客"}</span>
                    </div>
                    <div className={styles.adminInfoItem}>
                        <Mail size={16} />
                        <span>{result.user?.email || "未绑定邮箱"}</span>
                    </div>
                    <div className={styles.adminInfoItem}>
                        <Clock size={16} />
                        <span>{new Date(result.createdAt).toLocaleString("zh-CN")}</span>
                    </div>
                    <div className={styles.adminInfoItem}>
                        <Shield size={16} />
                        <span className={styles.adminBadge}>管理员查看模式</span>
                    </div>
                </div>
            </motion.div>
        ) : null
    )

    // 非 MBTI 的丰富结果显示
    const unifiedProfile = !isMBTI ? buildUnifiedProfile(result.test.type, result.score, dimensionArray) : null

    if (!isMBTI) {
        // 有 profile 数据时展示丰富结果
        if (unifiedProfile) {
            const isEQ = result.test.type === 'EQ'
            const isDepression = result.test.type === 'DEPRESSION'
            const depLevel = isDepression ? getDepressionLevel(parseInt(result.score) || 0) : null
            const depPct = isDepression ? getDepressionPercentage(parseInt(result.score) || 0) : 0
            return (
                <div className={styles.container}>
                    <AdminInfoPanel />
                    <GuestBanner />

                    {/* 动态背景 */}
                    <div
                        className={styles.heroBg}
                        style={{
                            '--profile-color': unifiedProfile.color,
                            '--profile-color-secondary': unifiedProfile.colorSecondary
                        } as React.CSSProperties}
                    >
                        <div className={styles.heroOrb} />
                        <div className={styles.heroOrbSecondary} />
                    </div>

                    <Navbar />

                    <main className={styles.main} id="result-content">
                        {/* 沉浸式头部 */}
                        <motion.section
                            className={styles.heroSection}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className={styles.heroContent}>
                                <div className={styles.heroText}>
                                    <motion.div
                                        className={styles.typeEmoji}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        {unifiedProfile.emoji}
                                    </motion.div>

                                    <motion.h1
                                        className={styles.typeCode}
                                        style={{ color: unifiedProfile.color }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {isEQ ? `EQ ${result.score}` : result.score}
                                    </motion.h1>

                                    <motion.h2
                                        className={styles.typeTitle}
                                        style={{ color: unifiedProfile.color }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {unifiedProfile.title}
                                    </motion.h2>

                                    <motion.p
                                        className={styles.typeTagline}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        &ldquo;{unifiedProfile.tagline}&rdquo;
                                    </motion.p>
                                </div>
                            </div>
                        </motion.section>

                        {/* 抑郁测试专属：严重程度仪表盘和免责声明 */}
                        {isDepression && depLevel && (
                            <motion.section
                                className={styles.introSection}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.6 }}
                            >
                                {/* 严重程度仪表盘 */}
                                <div className={styles.depressionGauge}>
                                    <div className={styles.gaugeLabel}>严重程度</div>
                                    <div className={styles.gaugeLevelBadge} style={{ background: depLevel.color, color: '#fff' }}>
                                        {depLevel.label}
                                    </div>
                                    <div className={styles.gaugeTrack}>
                                        <motion.div
                                            className={styles.gaugeFill}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${depPct}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            style={{ background: `linear-gradient(90deg, #22c55e, #f59e0b, #ef4444, #dc2626)` }}
                                        />
                                    </div>
                                    <div className={styles.gaugeScale}>
                                        <span>0 无</span>
                                        <span>15 轻度</span>
                                        <span>30 中度</span>
                                        <span>45 中重度</span>
                                        <span>60+ 重度</span>
                                    </div>
                                    <div className={styles.gaugeScore}>
                                        得分：<strong>{result.score}</strong> / 90
                                    </div>
                                </div>

                                {/* 免责声明 */}
                                <div className={styles.depressionDisclaimer}>
                                    <Shield size={20} />
                                    <div>
                                        <strong>重要声明</strong>
                                        <p>本量表综合参考 PHQ-9、BDI-II、SDS 等国际权威工具设计，仅供自我筛查参考，不能替代专业精神科诊断。如果您正在经历心理困扰，请寻求专业帮助。</p>
                                        {parseInt(result.score) >= 30 && (
                                            <p className={styles.hotline}>
                                                24小时心理援助热线：<strong>400-161-9995</strong> | <strong>010-82951332</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* 核心解读 */}
                        <motion.section
                            className={styles.introSection}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className={styles.tagCloud}>
                                {unifiedProfile.tags.map((tag, idx) => (
                                    <motion.span
                                        key={tag}
                                        className={styles.tag}
                                        style={{ borderColor: unifiedProfile.color, color: unifiedProfile.color }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + idx * 0.1 }}
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>

                            <p className={styles.description}>{unifiedProfile.description}</p>

                            <div className={styles.traitsGrid}>
                                <div className={styles.traitCard}>
                                    <div className={styles.traitHeader}>
                                        <Sparkles size={20} style={{ color: '#10b981' }} />
                                        <h3>亮点优势</h3>
                                    </div>
                                    <ul className={styles.traitList}>
                                        {unifiedProfile.strengths.map(s => (
                                            <li key={s}><ChevronRight size={16} />{s}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles.traitCard}>
                                    <div className={styles.traitHeader}>
                                        <Target size={20} style={{ color: '#f59e0b' }} />
                                        <h3>{isEQ ? '提升方向' : '成长空间'}</h3>
                                    </div>
                                    <ul className={styles.traitList}>
                                        {unifiedProfile.weaknesses.map(w => (
                                            <li key={w}><ChevronRight size={16} />{w}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.section>

                        {/* 数据可视化 */}
                        {dimensionArray && dimensionArray.length > 0 && (
                            <motion.section
                                className={styles.dataSection}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                            >
                                <div className={styles.dataGrid}>
                                    <div className={styles.dimensionsCard}>
                                        <div className={styles.cardHeader}>
                                            <Brain size={22} />
                                            <h3>维度分析</h3>
                                        </div>
                                        <div className={styles.richDimList}>
                                            {dimensionArray.map((dim: any, idx: number) => (
                                                <motion.div
                                                    key={dim.dimension}
                                                    className={styles.richDimItem}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                                >
                                                    <div className={styles.richDimHeader}>
                                                        <span className={styles.richDimLabel}>{dim.label || dim.dimension}</span>
                                                        <span className={styles.richDimPercent} style={{ color: unifiedProfile.color }}>{dim.percentage || 0}%</span>
                                                    </div>
                                                    <div className={styles.richDimBar}>
                                                        <motion.div
                                                            className={styles.richDimFill}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${dim.percentage || 0}%` }}
                                                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                                                            style={{ background: `linear-gradient(90deg, ${unifiedProfile.color}, ${unifiedProfile.colorSecondary})` }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {dimensionArray.length >= 3 && (
                                        <div className={styles.radarCard}>
                                            <div className={styles.cardHeader}>
                                                <Sparkles size={22} />
                                                <h3>能力雷达</h3>
                                            </div>
                                            <div className={styles.radarWrapper}>
                                                <GenericRadar
                                                    data={dimensionArray.map((d: any) => ({
                                                        label: (d.label || d.dimension).split(' ')[0].substring(0, 4),
                                                        value: d.percentage || 0
                                                    }))}
                                                    color={unifiedProfile.color}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}

                        {/* 额外信息卡片 */}
                        {unifiedProfile.extraInfo && unifiedProfile.extraInfo.length > 0 && (
                            <motion.section
                                className={styles.extraSection}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.85, duration: 0.6 }}
                            >
                                <div className={styles.insightGrid}>
                                    {unifiedProfile.extraInfo.map((info, idx) => (
                                        <motion.div
                                            key={info.label}
                                            className={styles.insightCard}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 + idx * 0.1 }}
                                        >
                                            <h4 className={styles.insightLabel} style={{ color: unifiedProfile.color }}>{info.label}</h4>
                                            <p className={styles.insightValue}>{info.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* 职业建议和代表人物 */}
                        <motion.section
                            className={styles.extraSection}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <div className={styles.extraGrid}>
                                {unifiedProfile.careers.length > 0 && (
                                    <div className={styles.extraCard}>
                                        <div className={styles.extraHeader}>
                                            <Briefcase size={20} />
                                            <h4>{isEQ ? '实用建议' : '适合的职业'}</h4>
                                        </div>
                                        <div className={styles.extraTags}>
                                            {unifiedProfile.careers.map(c => (
                                                <span key={c} className={styles.extraTag}>{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {unifiedProfile.famousPeople.length > 0 && (
                                    <div className={styles.extraCard}>
                                        <div className={styles.extraHeader}>
                                            <Users size={20} />
                                            <h4>代表人物</h4>
                                        </div>
                                        <div className={styles.extraTags}>
                                            {unifiedProfile.famousPeople.map(p => (
                                                <span key={p} className={styles.extraTag}>{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* 高级报告区域 */}
                        {isAdmin ? (
                            hasPremiumReport && (
                                <motion.section
                                    className={styles.premiumSection}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.6 }}
                                >
                                    <PremiumReport report={premiumReport} testType={result.test.type} />
                                </motion.section>
                            )
                        ) : (
                            <PremiumSection />
                        )}

                        {/* 操作按钮 */}
                        {!isAdmin && (
                            <motion.div
                                className={styles.actions}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                <button className="btn-premium" onClick={() => setShowShare(true)}>
                                    <Share2 size={18} />
                                    分享结果
                                </button>
                                <Link href="/tests" className={styles.secondaryBtn}>
                                    继续探索更多测试
                                    <ChevronRight size={18} />
                                </Link>
                            </motion.div>
                        )}
                    </main>

                    {showShare && (
                        <ShareDialog resultId={result.id} onClose={() => setShowShare(false)} />
                    )}

                    {showPayment && (
                        <PaymentDialog
                            isOpen={showPayment}
                            testResultId={result.id}
                            onClose={() => setShowPayment(false)}
                            onSuccess={handlePaymentSuccess}
                        />
                    )}

                    {showRedeemCode && (
                        <RedeemCodeDialog
                            isOpen={showRedeemCode}
                            testResultId={result.id}
                            onClose={() => setShowRedeemCode(false)}
                            onSuccess={handleRedeemSuccess}
                        />
                    )}
                </div>
            )
        }

        // Fallback: 未知类型的简单结果
        return (
            <div className={styles.container}>
                <AdminInfoPanel />
                <GuestBanner />
                <Navbar />
                <main className={styles.main}>
                    <div className={styles.genericResult}>
                        <h1>{result.test.title}</h1>
                        <div className={styles.genericScore}>{result.score}</div>
                        {dimensionArray && (
                            <div className={styles.genericDimensions}>
                                {dimensionArray.map((dim: any) => (
                                    <div key={dim.dimension} className={styles.genericDimItem}>
                                        <span>{dim.label || dim.dimension}</span>
                                        <div className={styles.genericBar}>
                                            <div style={{ width: `${dim.percentage || 0}%` }} />
                                        </div>
                                        <span>{dim.percentage || 0}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                {showShare && <ShareDialog resultId={result.id} onClose={() => setShowShare(false)} />}
            </div>
        )
    }

    // MBTI 专属的精美结果页面
    return (
        <div className={styles.container}>
            <AdminInfoPanel />
            <GuestBanner />

            {/* 动态背景 */}
            <div
                className={styles.heroBg}
                style={{
                    '--profile-color': profile.color,
                    '--profile-color-secondary': profile.colorSecondary
                } as React.CSSProperties}
            >
                <div className={styles.heroOrb} />
                <div className={styles.heroOrbSecondary} />
            </div>

            <Navbar />

            <main className={styles.main} id="result-content">
                {/* Zone A: 沉浸式头部 */}
                <motion.section
                    className={styles.heroSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.heroContent}>
                        <div className={styles.avatarWrapper}>
                            <MBTICharacter
                                type={profile.type}
                                size="xl"
                                animated={true}
                                showGlow={true}
                            />
                        </div>

                        <div className={styles.heroText}>
                            <motion.div
                                className={styles.typeEmoji}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                            >
                                {profile.emoji}
                            </motion.div>

                            <motion.h1
                                className={styles.typeCode}
                                style={{ color: profile.color }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {result.score}
                            </motion.h1>

                            <motion.h2
                                className={styles.typeTitle}
                                style={{ color: profile.color }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {profile.title}
                            </motion.h2>

                            <motion.p
                                className={styles.typeTagline}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                "{profile.tagline}"
                            </motion.p>
                        </div>
                    </div>
                </motion.section>

                {/* Zone B: 核心解读 */}
                <motion.section
                    className={styles.introSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    {/* 标签云 */}
                    <div className={styles.tagCloud}>
                        {profile.tags.map((tag, idx) => (
                            <motion.span
                                key={tag}
                                className={styles.tag}
                                style={{ borderColor: profile.color, color: profile.color }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                            >
                                #{tag}
                            </motion.span>
                        ))}
                    </div>

                    {/* 描述 */}
                    <p className={styles.description}>{profile.description}</p>

                    {/* 亮点与盲点双栏 */}
                    <div className={styles.traitsGrid}>
                        <div className={styles.traitCard}>
                            <div className={styles.traitHeader}>
                                <Sparkles size={20} style={{ color: '#10b981' }} />
                                <h3>亮点优势</h3>
                            </div>
                            <ul className={styles.traitList}>
                                {profile.strengths.map(s => (
                                    <li key={s}>
                                        <ChevronRight size={16} />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.traitCard}>
                            <div className={styles.traitHeader}>
                                <Target size={20} style={{ color: '#f59e0b' }} />
                                <h3>成长空间</h3>
                            </div>
                            <ul className={styles.traitList}>
                                {profile.weaknesses.map(w => (
                                    <li key={w}>
                                        <ChevronRight size={16} />
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* Zone C: 数据可视化 */}
                <motion.section
                    className={styles.dataSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <div className={styles.dataGrid}>
                        {/* 维度倾向分析 - 双向对抗进度条 */}
                        <div className={styles.dimensionsCard}>
                            <div className={styles.cardHeader}>
                                <Brain size={22} />
                                <h3>维度倾向分析</h3>
                            </div>
                            <div className={styles.dimensionsList}>
                                {dimensionComparisons.map((comp, idx) => (
                                    <DimensionBar
                                        key={comp.dimension}
                                        comparison={comp}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 性格雷达图 - 展示主导特质强度 */}
                        <div className={styles.radarCard}>
                            <div className={styles.cardHeader}>
                                <Sparkles size={22} />
                                <h3>性格雷达</h3>
                            </div>
                            <div className={styles.radarWrapper}>
                                <PersonalityRadar comparisons={dimensionComparisons} />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 额外信息：职业建议 */}
                <motion.section
                    className={styles.extraSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <div className={styles.extraGrid}>
                        <div className={styles.extraCard}>
                            <div className={styles.extraHeader}>
                                <Briefcase size={20} />
                                <h4>适合的职业</h4>
                            </div>
                            <div className={styles.extraTags}>
                                {profile.careers.map(career => (
                                    <span key={career} className={styles.extraTag}>{career}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.famousPeopleCard}>
                            <div className={styles.extraHeader}>
                                <Users size={20} />
                                <h4>代表人物</h4>
                            </div>
                            <FamousPeopleGallery
                                mbtiType={profile.type}
                                themeColor={profile.color}
                            />
                        </div>
                    </div>
                </motion.section>

                {/* 高级报告区域（管理员模式下只显示已生成的报告） */}
                {isAdmin ? (
                    hasPremiumReport && (
                        <motion.section
                            className={styles.premiumSection}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                        >
                            <PremiumReport report={premiumReport} testType={result.test.type} />
                        </motion.section>
                    )
                ) : (
                    <PremiumSection />
                )}

                {/* 操作按钮（管理员模式下不显示） */}
                {!isAdmin && (
                    <motion.div
                        className={styles.actions}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <button className="btn-premium" onClick={() => setShowShare(true)}>
                            <Share2 size={18} />
                            分享我的性格说明书
                        </button>
                        <Link href="/tests" className={styles.secondaryBtn}>
                            继续探索更多测试
                            <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                )}
            </main>

            {showShare && (
                <ShareDialog resultId={result.id} onClose={() => setShowShare(false)} />
            )}

            {showPayment && (
                <PaymentDialog
                    isOpen={showPayment}
                    testResultId={result.id}
                    onClose={() => setShowPayment(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {showRedeemCode && (
                <RedeemCodeDialog
                    isOpen={showRedeemCode}
                    testResultId={result.id}
                    onClose={() => setShowRedeemCode(false)}
                    onSuccess={handleRedeemSuccess}
                />
            )}
        </div>
    )
}
