"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart,
    TrendingUp,
    Briefcase,
    Monitor,
    BarChart3,
    Crown,
    ChevronRight,
    BookOpen,
    Target,
    Users,
    AlertTriangle,
    CheckCircle,
    Star,
    Loader2,
    Lightbulb,
    MessageCircle,
    Compass,
    Brain
} from 'lucide-react'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import styles from './PremiumReport.module.css'

interface PremiumReportProps {
    report: any
    testType?: string
    loading?: boolean
    onRetry?: () => void
    error?: string | null
}

type TabId = 'overview' | 'relationship' | 'growth' | 'career' | 'work' | 'insights' | 'data'

// 按测试类型获取 tab 配置
function getTabConfig(testType?: string): { id: TabId; label: string; icon: React.ReactNode }[] {
    const base: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: '总览', icon: <Crown size={18} /> },
    ]

    switch (testType) {
        case 'HOLLAND':
            return [
                ...base,
                { id: 'career', label: '职业深度分析', icon: <Compass size={18} /> },
                { id: 'relationship', label: '职业社交', icon: <Users size={18} /> },
                { id: 'growth', label: '个人成长', icon: <TrendingUp size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '专属解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'DISC':
            return [
                ...base,
                { id: 'relationship', label: '人际沟通', icon: <MessageCircle size={18} /> },
                { id: 'career', label: '事业分析', icon: <Briefcase size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'growth', label: '个人成长', icon: <TrendingUp size={18} /> },
                { id: 'insights', label: '专属解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'EQ':
            return [
                ...base,
                { id: 'relationship', label: '人际关系', icon: <Heart size={18} /> },
                { id: 'growth', label: '情商提升', icon: <Brain size={18} /> },
                { id: 'career', label: '职场情商', icon: <Briefcase size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '专属解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'ENNEAGRAM':
            return [
                ...base,
                { id: 'growth', label: '内在成长', icon: <TrendingUp size={18} /> },
                { id: 'relationship', label: '恋爱分析', icon: <Heart size={18} /> },
                { id: 'career', label: '事业分析', icon: <Briefcase size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '专属解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'DEPRESSION':
            return [
                ...base,
                { id: 'growth', label: '康复指导', icon: <TrendingUp size={18} /> },
                { id: 'relationship', label: '情感支持', icon: <Heart size={18} /> },
                { id: 'work', label: '工作调适', icon: <Monitor size={18} /> },
                { id: 'insights', label: '专业指导', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'TALENT':
            return [
                ...base,
                { id: 'career', label: '天赋变现', icon: <Compass size={18} /> },
                { id: 'growth', label: '天赋发展', icon: <TrendingUp size={18} /> },
                { id: 'relationship', label: '天赋社交', icon: <Users size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '深度解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'MENTAL_AGE':
            return [
                ...base,
                { id: 'growth', label: '成熟度提升', icon: <Brain size={18} /> },
                { id: 'relationship', label: '人际成熟度', icon: <Heart size={18} /> },
                { id: 'career', label: '职场表现', icon: <Briefcase size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '深度解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
        case 'MBTI':
        case 'BIG_FIVE':
        default:
            return [
                ...base,
                { id: 'relationship', label: '恋爱分析', icon: <Heart size={18} /> },
                { id: 'growth', label: '个人成长', icon: <TrendingUp size={18} /> },
                { id: 'career', label: '事业分析', icon: <Briefcase size={18} /> },
                { id: 'work', label: '工作分析', icon: <Monitor size={18} /> },
                { id: 'insights', label: '专属解读', icon: <Lightbulb size={18} /> },
                { id: 'data', label: '数据图表', icon: <BarChart3 size={18} /> },
            ]
    }
}

// 获取总览卡片标题（按测试类型差异化）
function getOverviewLabel(testType?: string): string {
    switch (testType) {
        case 'BIG_FIVE': return '您的人格画像'
        case 'DISC': return '您的行为风格'
        case 'EQ': return '您的情商水平'
        case 'HOLLAND': return '您的职业兴趣代码'
        case 'ENNEAGRAM': return '您的核心类型'
        case 'DEPRESSION': return '您的评估结果'
        case 'TALENT': return '您的天赋代码'
        case 'MENTAL_AGE': return '您的心理年龄'
        default: return '您的类型'
    }
}

// 获取加载提示语（按测试类型差异化）
function getLoadingHint(testType?: string): string {
    switch (testType) {
        case 'HOLLAND': return '正在深度分析职业兴趣、行业匹配和发展路径'
        case 'DISC': return '正在分析行为风格、沟通策略和团队协作模式'
        case 'EQ': return '正在分析情绪管理能力、人际关系和成长路径'
        case 'ENNEAGRAM': return '正在解读核心动机、整合方向和成长路径'
        case 'DEPRESSION': return '正在生成专业分析报告和个性化康复建议'
        case 'BIG_FIVE': return '正在分析五大人格因素的交互效应和成长建议'
        default: return '正在分析恋爱特点、职业发展、个人成长等多个维度'
    }
}

export default function PremiumReport({ report, testType, loading, onRetry, error }: PremiumReportProps) {
    const tabs = useMemo(() => getTabConfig(testType), [testType])
    const [activeTab, setActiveTab] = useState<TabId>('overview')

    // 兼容旧数据：优先用 relationshipAnalysis，回退到 loveAnalysis
    const relData = report?.relationshipAnalysis || report?.loveAnalysis
    // 兼容旧数据的 advice 字段：优先 advice，回退 datingAdvice
    const relAdvice = relData?.advice || relData?.datingAdvice
    // 兼容旧数据的 communicationInRelationship 字段
    const relComm = relData?.communicationInRelationship || relData?.communicationInLove

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <Loader2 className={styles.spinner} size={48} />
                </div>
                <h3>AI 正在生成您的专属报告...</h3>
                <p>{getLoadingHint(testType)}</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertTriangle size={48} className={styles.errorIcon} />
                <h3>报告生成遇到问题</h3>
                <p>{error}</p>
                {onRetry && (
                    <button className={styles.retryBtn} onClick={onRetry}>
                        重新生成
                    </button>
                )}
            </div>
        )
    }

    if (!report) return null

    // ===== 总览页 =====
    const renderOverview = () => (
        <div className={styles.overviewContent}>
            <div className={styles.typeCard}>
                <div className={styles.typeHeader}>
                    <span className={styles.typeLabel}>{getOverviewLabel(testType)}</span>
                    <h2 className={styles.typeCode}>{report.score}</h2>
                </div>
                <p className={styles.typeDesc}>
                    {report.statistics?.populationPercentage}
                </p>
            </div>

            <div className={styles.dimensionsOverview}>
                <h3>维度分析</h3>
                <div className={styles.dimensionsList}>
                    {report.dimensionAnalysis?.map((dim: any, idx: number) => (
                        <motion.div
                            key={dim.dimension}
                            className={styles.dimensionItem}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className={styles.dimensionHeader}>
                                <span className={styles.dimensionLabel}>{dim.label}</span>
                                <span className={styles.dimensionValue}>{dim.percentage}%</span>
                            </div>
                            <div className={styles.dimensionBar}>
                                <motion.div
                                    className={styles.dimensionFill}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dim.percentage}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                />
                            </div>
                            <p className={styles.dimensionDesc}>{dim.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {report.statistics?.famousPeople?.length > 0 && (
                <div className={styles.famousPeople}>
                    <h3><Star size={18} /> {testType === 'DEPRESSION' ? '曾勇敢面对的名人' : '同类型知名人物'}</h3>
                    <div className={styles.peopleList}>
                        {report.statistics.famousPeople.map((person: string) => (
                            <span key={person} className={styles.personTag}>{person}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    // ===== 关系/恋爱分析页 =====
    const renderRelationshipAnalysis = () => {
        if (!relData) return null
        const isLoveContext = testType === 'MBTI' || testType === 'BIG_FIVE' || testType === 'ENNEAGRAM' || testType === 'MENTAL_AGE'
        const isWorkContext = testType === 'HOLLAND' || testType === 'DISC' || testType === 'TALENT'

        return (
            <div className={styles.loveContent}>
                <div className={styles.sectionCard}>
                    <h3>
                        {isWorkContext ? <Users size={20} /> : <Heart size={20} />}
                        {' '}
                        {isWorkContext ? '人际互动概述' : testType === 'DEPRESSION' ? '情感支持分析' : '关系特点概述'}
                    </h3>
                    <p className={styles.overview}>{relData.overview}</p>
                </div>

                {relData.attachmentStyle && (
                    <div className={styles.sectionCard}>
                        <h3>依恋类型</h3>
                        <p>{relData.attachmentStyle}</p>
                    </div>
                )}

                {relData.idealPartnerTraits?.length > 0 && (
                    <div className={styles.sectionCard}>
                        <h3>{testType === 'EQ' ? '理想关系特质' : '理想伴侣特质'}</h3>
                        <div className={styles.tagList}>
                            {relData.idealPartnerTraits.map((trait: string) => (
                                <span key={trait} className={styles.tag}>{trait}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.twoColumn}>
                    <div className={styles.sectionCard}>
                        <h3>{isWorkContext ? '沟通风格' : '关系中的沟通方式'}</h3>
                        <p>{relComm}</p>
                    </div>
                    <div className={styles.sectionCard}>
                        <h3>冲突解决方式</h3>
                        <p>{relData.conflictResolution}</p>
                    </div>
                </div>

                {relAdvice?.length > 0 && (
                    <div className={styles.sectionCard}>
                        <h3><CheckCircle size={18} /> {isWorkContext ? '沟通改善建议' : testType === 'DEPRESSION' ? '关系维护建议' : '实用建议'}</h3>
                        <ul className={styles.adviceList}>
                            {relAdvice.map((advice: string, idx: number) => (
                                <li key={idx}>
                                    <ChevronRight size={16} />
                                    {advice}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.twoColumn}>
                    {relData.greenFlags?.length > 0 && (
                        <div className={`${styles.sectionCard} ${styles.greenCard}`}>
                            <h3><CheckCircle size={18} /> {isWorkContext ? '积极信号' : '适合你的信号'}</h3>
                            <ul className={styles.signalList}>
                                {relData.greenFlags.map((flag: string, idx: number) => (
                                    <li key={idx}>{flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {relData.redFlags?.length > 0 && (
                        <div className={`${styles.sectionCard} ${styles.redCard}`}>
                            <h3><AlertTriangle size={18} /> 需要警惕的模式</h3>
                            <ul className={styles.signalList}>
                                {relData.redFlags.map((flag: string, idx: number) => (
                                    <li key={idx}>{flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {(relData.compatibleTypes?.length > 0 || relData.incompatibleTypes?.length > 0) && (
                    <div className={styles.twoColumn}>
                        {relData.compatibleTypes?.length > 0 && (
                            <div className={styles.sectionCard}>
                                <h3>{isWorkContext ? '最佳合作类型' : '最匹配的类型'}</h3>
                                <div className={styles.typeTagList}>
                                    {relData.compatibleTypes.map((type: string) => (
                                        <span key={type} className={`${styles.typeTag} ${styles.compatible}`}>{type}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {relData.incompatibleTypes?.length > 0 && (
                            <div className={styles.sectionCard}>
                                <h3>{isWorkContext ? '需注意协作的类型' : '不太匹配的类型'}</h3>
                                <div className={styles.typeTagList}>
                                    {relData.incompatibleTypes.map((type: string) => (
                                        <span key={type} className={`${styles.typeTag} ${styles.incompatible}`}>{type}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {relData.longTermRelationship && (
                    <div className={styles.sectionCard}>
                        <h3>{testType === 'DEPRESSION' ? '持续关系支持' : '长期关系建议'}</h3>
                        <p>{relData.longTermRelationship}</p>
                    </div>
                )}
            </div>
        )
    }

    // ===== 个人成长页 =====
    const renderGrowth = () => (
        <div className={styles.growthContent}>
            <div className={styles.sectionCard}>
                <h3><TrendingUp size={20} /> {testType === 'DEPRESSION' ? '康复指导概述' : testType === 'EQ' ? '情商提升路线图' : '成长概述'}</h3>
                <p className={styles.overview}>{report.personalGrowth?.overview}</p>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3><CheckCircle size={18} /> {testType === 'DEPRESSION' ? '积极资源' : '核心优势'}</h3>
                    <ul className={styles.strengthList}>
                        {report.personalGrowth?.coreStrengths?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.sectionCard}>
                    <h3><Target size={18} /> {testType === 'DEPRESSION' ? '需关注的方面' : '成长盲点'}</h3>
                    <ul className={styles.weaknessList}>
                        {report.personalGrowth?.blindSpots?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3>{testType === 'DEPRESSION' ? '康复路径' : testType === 'EQ' ? '提升路径' : '成长路径'}</h3>
                <div className={styles.pathList}>
                    {report.personalGrowth?.growthPath?.map((path: string, idx: number) => (
                        <div key={idx} className={styles.pathItem}>
                            <span className={styles.pathNumber}>{idx + 1}</span>
                            <span>{path}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3><BookOpen size={18} /> 推荐书籍</h3>
                <div className={styles.bookList}>
                    {report.personalGrowth?.recommendedBooks?.map((book: string, idx: number) => (
                        <div key={idx} className={styles.bookItem}>{book}</div>
                    ))}
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3>{testType === 'DEPRESSION' ? '有益的日常习惯' : testType === 'EQ' ? '情商训练习惯' : '建议养成的习惯'}</h3>
                <div className={styles.habitList}>
                    {report.personalGrowth?.habits?.map((habit: string, idx: number) => (
                        <span key={idx} className={styles.habitTag}>{habit}</span>
                    ))}
                </div>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>短期目标 (3个月)</h3>
                    <ul className={styles.goalList}>
                        {report.personalGrowth?.shortTermGoals?.map((goal: string, idx: number) => (
                            <li key={idx}>{goal}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.sectionCard}>
                    <h3>长期目标 (1年)</h3>
                    <ul className={styles.goalList}>
                        {report.personalGrowth?.longTermGoals?.map((goal: string, idx: number) => (
                            <li key={idx}>{goal}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )

    // ===== 事业分析页 =====
    const renderCareer = () => (
        <div className={styles.careerContent}>
            <div className={styles.sectionCard}>
                <h3><Briefcase size={20} /> {testType === 'HOLLAND' ? '职业深度分析' : testType === 'DEPRESSION' ? '工作适应建议' : '事业发展概述'}</h3>
                <p className={styles.overview}>{report.careerAnalysis?.overview}</p>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>{testType === 'DEPRESSION' ? '适合的工作环境' : '适合的行业'}</h3>
                    <div className={styles.tagList}>
                        {report.careerAnalysis?.idealIndustries?.map((industry: string) => (
                            <span key={industry} className={styles.industryTag}>{industry}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.sectionCard}>
                    <h3>{testType === 'DEPRESSION' ? '适合的工作类型' : '适合的职位'}</h3>
                    <div className={styles.tagList}>
                        {report.careerAnalysis?.idealRoles?.map((role: string) => (
                            <span key={role} className={styles.roleTag}>{role}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3>工作风格</h3>
                <p>{report.careerAnalysis?.workStyle}</p>
            </div>

            {(report.careerAnalysis?.leadershipStyle || report.careerAnalysis?.teamDynamics) && (
                <div className={styles.twoColumn}>
                    {report.careerAnalysis?.leadershipStyle && (
                        <div className={styles.sectionCard}>
                            <h3>领导风格</h3>
                            <p>{report.careerAnalysis.leadershipStyle}</p>
                        </div>
                    )}
                    <div className={styles.sectionCard}>
                        <h3>团队协作</h3>
                        <p>{report.careerAnalysis?.teamDynamics}</p>
                    </div>
                </div>
            )}

            <div className={styles.twoColumn}>
                <div className={`${styles.sectionCard} ${styles.greenCard}`}>
                    <h3>职业优势</h3>
                    <ul className={styles.advantageList}>
                        {report.careerAnalysis?.careerAdvantages?.map((adv: string, idx: number) => (
                            <li key={idx}>{adv}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.sectionCard} ${styles.redCard}`}>
                    <h3>职业风险</h3>
                    <ul className={styles.riskList}>
                        {report.careerAnalysis?.careerRisks?.map((risk: string, idx: number) => (
                            <li key={idx}>{risk}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {report.careerAnalysis?.fiveYearPath && (
                <div className={styles.sectionCard}>
                    <h3>五年职业规划</h3>
                    <p className={styles.fiveYearPlan}>{report.careerAnalysis.fiveYearPath}</p>
                </div>
            )}

            {report.careerAnalysis?.salaryPotential && (
                <div className={styles.sectionCard}>
                    <h3>薪资发展潜力</h3>
                    <p>{report.careerAnalysis.salaryPotential}</p>
                </div>
            )}
        </div>
    )

    // ===== 工作分析页 =====
    const renderWork = () => (
        <div className={styles.workContent}>
            <div className={styles.sectionCard}>
                <h3><Monitor size={20} /> {testType === 'DEPRESSION' ? '工作状态调整' : '效率提升建议'}</h3>
                <ul className={styles.tipsList}>
                    {report.workAnalysis?.productivityTips?.map((tip: string, idx: number) => (
                        <li key={idx}>
                            <span className={styles.tipNumber}>{idx + 1}</span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>职场沟通风格</h3>
                    <p>{report.workAnalysis?.communicationStyle}</p>
                </div>
                {report.workAnalysis?.meetingBehavior && (
                    <div className={styles.sectionCard}>
                        <h3>会议表现</h3>
                        <p>{report.workAnalysis.meetingBehavior}</p>
                    </div>
                )}
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>压力应对</h3>
                    <p>{report.workAnalysis?.stressResponse}</p>
                </div>
                <div className={styles.sectionCard}>
                    <h3>协作风格</h3>
                    <p>{report.workAnalysis?.collaborationStyle}</p>
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3>理想工作环境</h3>
                <p>{report.workAnalysis?.idealWorkEnvironment}</p>
            </div>

            <div className={styles.sectionCard}>
                <h3>工作生活平衡</h3>
                <p>{report.workAnalysis?.workLifeBalance}</p>
            </div>
        </div>
    )

    // ===== 测试专属深度解读页 =====
    const renderInsights = () => {
        const insights = report.testSpecificInsights
        if (!insights) return (
            <div className={styles.growthContent}>
                <div className={styles.sectionCard}>
                    <h3><Lightbulb size={20} /> 深度解读</h3>
                    <p className={styles.overview}>该报告暂无专属深度解读内容。</p>
                </div>
            </div>
        )

        return (
            <div className={styles.growthContent}>
                <div className={styles.sectionCard}>
                    <h3><Lightbulb size={20} /> {insights.title}</h3>
                </div>
                {insights.sections?.map((section: any, idx: number) => (
                    <motion.div
                        key={idx}
                        className={styles.sectionCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                    >
                        <h3>{section.heading}</h3>
                        <p className={styles.overview}>{section.content}</p>
                    </motion.div>
                ))}
            </div>
        )
    }

    // ===== 数据图表页 =====
    const renderData = () => {
        const radarData = report.charts?.radarData
            ? Object.entries(report.charts.radarData).map(([key, value]) => ({
                subject: key,
                value: value as number,
                fullMark: 100
            }))
            : []

        const barData = report.charts?.dimensionBars || []
        const compatibilityData = report.charts?.compatibilityScores || []

        const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444', '#a855f7', '#14b8a6', '#f97316']

        return (
            <div className={styles.dataContent}>
                {radarData.length > 0 && (
                    <div className={styles.chartCard}>
                        <h3>{testType === 'HOLLAND' ? '职业兴趣雷达图' : testType === 'EQ' ? '情商维度雷达图' : '能力雷达图'}</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="var(--border-color)" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: 'var(--text-main)', fontSize: 12 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                    />
                                    <Radar
                                        name="得分"
                                        dataKey="value"
                                        stroke="var(--primary)"
                                        fill="var(--primary)"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {barData.length > 0 && (
                    <div className={styles.chartCard}>
                        <h3>维度得分分布</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                                    <YAxis
                                        dataKey="label"
                                        type="category"
                                        width={80}
                                        tick={{ fill: 'var(--text-main)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {barData.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {compatibilityData.length > 0 && (
                    <div className={styles.chartCard}>
                        <h3><Users size={18} /> {testType === 'DISC' || testType === 'HOLLAND' ? '类型协作度' : testType === 'ENNEAGRAM' ? '类型互动分析' : '类型兼容性'}</h3>
                        <div className={styles.compatibilityList}>
                            {compatibilityData.map((item: any, idx: number) => (
                                <div key={idx} className={styles.compatibilityItem}>
                                    <span className={styles.compatibilityType}>{item.type}</span>
                                    <div className={styles.compatibilityBar}>
                                        <motion.div
                                            className={styles.compatibilityFill}
                                            style={{
                                                background: item.score >= 80 ? '#10b981' :
                                                    item.score >= 60 ? '#f59e0b' : '#ef4444'
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                        />
                                    </div>
                                    <span className={styles.compatibilityScore}>{item.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.statsCard}>
                    <h3>统计数据</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{testType === 'DEPRESSION' ? '流行率' : '人口占比'}</span>
                            <span className={styles.statValue}>{report.statistics?.populationPercentage}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>性别分布</span>
                            <span className={styles.statValue}>{report.statistics?.genderDistribution}</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>全球分布</span>
                        <p className={styles.statDesc}>{report.statistics?.globalDistribution}</p>
                    </div>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview()
            case 'relationship': return renderRelationshipAnalysis()
            case 'growth': return renderGrowth()
            case 'career': return renderCareer()
            case 'work': return renderWork()
            case 'insights': return renderInsights()
            case 'data': return renderData()
            default: return renderOverview()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Crown className={styles.headerIcon} />
                <h2>高级分析报告</h2>
                <p className={styles.headerSubtitle}>AI 深度解读，专属于你</p>
            </div>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={styles.content}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
