"use client"

import { useState } from 'react'
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
    Loader2
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
    loading?: boolean
    onRetry?: () => void
    error?: string | null
}

type TabId = 'overview' | 'love' | 'growth' | 'career' | 'work' | 'data'

export default function PremiumReport({ report, loading, onRetry, error }: PremiumReportProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview')

    const tabs = [
        { id: 'overview' as TabId, label: '总览', icon: <Crown size={18} /> },
        { id: 'love' as TabId, label: '恋爱分析', icon: <Heart size={18} /> },
        { id: 'growth' as TabId, label: '个人成长', icon: <TrendingUp size={18} /> },
        { id: 'career' as TabId, label: '事业分析', icon: <Briefcase size={18} /> },
        { id: 'work' as TabId, label: '工作分析', icon: <Monitor size={18} /> },
        { id: 'data' as TabId, label: '数据图表', icon: <BarChart3 size={18} /> },
    ]

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <Loader2 className={styles.spinner} size={48} />
                </div>
                <h3>AI 正在生成您的专属报告...</h3>
                <p>正在分析恋爱特点、职业发展、个人成长等多个维度</p>
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

    // 总览页
    const renderOverview = () => (
        <div className={styles.overviewContent}>
            {/* 类型卡片 */}
            <div className={styles.typeCard}>
                <div className={styles.typeHeader}>
                    <span className={styles.typeLabel}>您的类型</span>
                    <h2 className={styles.typeCode}>{report.score}</h2>
                </div>
                <p className={styles.typeDesc}>
                    {report.statistics?.populationPercentage}
                </p>
            </div>

            {/* 维度分析概览 */}
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

            {/* 知名人物 */}
            <div className={styles.famousPeople}>
                <h3><Star size={18} /> 同类型知名人物</h3>
                <div className={styles.peopleList}>
                    {report.statistics?.famousPeople?.map((person: string) => (
                        <span key={person} className={styles.personTag}>{person}</span>
                    ))}
                </div>
            </div>
        </div>
    )

    // 恋爱分析页
    const renderLoveAnalysis = () => (
        <div className={styles.loveContent}>
            {/* 概述 */}
            <div className={styles.sectionCard}>
                <h3><Heart size={20} /> 恋爱特点概述</h3>
                <p className={styles.overview}>{report.loveAnalysis?.overview}</p>
            </div>

            {/* 依恋类型 */}
            <div className={styles.sectionCard}>
                <h3>依恋类型</h3>
                <p>{report.loveAnalysis?.attachmentStyle}</p>
            </div>

            {/* 理想伴侣特质 */}
            <div className={styles.sectionCard}>
                <h3>理想伴侣特质</h3>
                <div className={styles.tagList}>
                    {report.loveAnalysis?.idealPartnerTraits?.map((trait: string) => (
                        <span key={trait} className={styles.tag}>{trait}</span>
                    ))}
                </div>
            </div>

            {/* 恋爱沟通 */}
            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>恋爱中的沟通方式</h3>
                    <p>{report.loveAnalysis?.communicationInLove}</p>
                </div>
                <div className={styles.sectionCard}>
                    <h3>冲突解决方式</h3>
                    <p>{report.loveAnalysis?.conflictResolution}</p>
                </div>
            </div>

            {/* 约会建议 */}
            <div className={styles.sectionCard}>
                <h3><CheckCircle size={18} /> 约会建议</h3>
                <ul className={styles.adviceList}>
                    {report.loveAnalysis?.datingAdvice?.map((advice: string, idx: number) => (
                        <li key={idx}>
                            <ChevronRight size={16} />
                            {advice}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 红绿灯信号 */}
            <div className={styles.twoColumn}>
                <div className={`${styles.sectionCard} ${styles.greenCard}`}>
                    <h3><CheckCircle size={18} /> 适合你的恋爱信号</h3>
                    <ul className={styles.signalList}>
                        {report.loveAnalysis?.greenFlags?.map((flag: string, idx: number) => (
                            <li key={idx}>{flag}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.sectionCard} ${styles.redCard}`}>
                    <h3><AlertTriangle size={18} /> 需要警惕的陷阱</h3>
                    <ul className={styles.signalList}>
                        {report.loveAnalysis?.redFlags?.map((flag: string, idx: number) => (
                            <li key={idx}>{flag}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 匹配类型 */}
            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>最匹配的类型</h3>
                    <div className={styles.typeTagList}>
                        {report.loveAnalysis?.compatibleTypes?.map((type: string) => (
                            <span key={type} className={`${styles.typeTag} ${styles.compatible}`}>{type}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.sectionCard}>
                    <h3>不太匹配的类型</h3>
                    <div className={styles.typeTagList}>
                        {report.loveAnalysis?.incompatibleTypes?.map((type: string) => (
                            <span key={type} className={`${styles.typeTag} ${styles.incompatible}`}>{type}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 长期关系建议 */}
            <div className={styles.sectionCard}>
                <h3>长期关系维护建议</h3>
                <p>{report.loveAnalysis?.longTermRelationship}</p>
            </div>
        </div>
    )

    // 个人成长页
    const renderGrowth = () => (
        <div className={styles.growthContent}>
            <div className={styles.sectionCard}>
                <h3><TrendingUp size={20} /> 成长概述</h3>
                <p className={styles.overview}>{report.personalGrowth?.overview}</p>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3><CheckCircle size={18} /> 核心优势</h3>
                    <ul className={styles.strengthList}>
                        {report.personalGrowth?.coreStrengths?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.sectionCard}>
                    <h3><Target size={18} /> 成长盲点</h3>
                    <ul className={styles.weaknessList}>
                        {report.personalGrowth?.blindSpots?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.sectionCard}>
                <h3>成长路径</h3>
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
                <h3>建议养成的习惯</h3>
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

    // 事业分析页
    const renderCareer = () => (
        <div className={styles.careerContent}>
            <div className={styles.sectionCard}>
                <h3><Briefcase size={20} /> 事业发展概述</h3>
                <p className={styles.overview}>{report.careerAnalysis?.overview}</p>
            </div>

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>适合的行业</h3>
                    <div className={styles.tagList}>
                        {report.careerAnalysis?.idealIndustries?.map((industry: string) => (
                            <span key={industry} className={styles.industryTag}>{industry}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.sectionCard}>
                    <h3>适合的职位</h3>
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

            <div className={styles.twoColumn}>
                <div className={styles.sectionCard}>
                    <h3>领导风格</h3>
                    <p>{report.careerAnalysis?.leadershipStyle}</p>
                </div>
                <div className={styles.sectionCard}>
                    <h3>团队协作</h3>
                    <p>{report.careerAnalysis?.teamDynamics}</p>
                </div>
            </div>

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

            <div className={styles.sectionCard}>
                <h3>五年职业规划</h3>
                <p className={styles.fiveYearPlan}>{report.careerAnalysis?.fiveYearPath}</p>
            </div>

            <div className={styles.sectionCard}>
                <h3>薪资发展潜力</h3>
                <p>{report.careerAnalysis?.salaryPotential}</p>
            </div>
        </div>
    )

    // 工作分析页
    const renderWork = () => (
        <div className={styles.workContent}>
            <div className={styles.sectionCard}>
                <h3><Monitor size={20} /> 效率提升建议</h3>
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
                <div className={styles.sectionCard}>
                    <h3>会议表现</h3>
                    <p>{report.workAnalysis?.meetingBehavior}</p>
                </div>
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

    // 数据图表页
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

        const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4']

        return (
            <div className={styles.dataContent}>
                {/* 雷达图 */}
                {radarData.length > 0 && (
                    <div className={styles.chartCard}>
                        <h3>能力雷达图</h3>
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
                                        name="能力值"
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

                {/* 维度条形图 */}
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

                {/* 兼容性分数 */}
                {compatibilityData.length > 0 && (
                    <div className={styles.chartCard}>
                        <h3><Users size={18} /> 类型兼容性</h3>
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

                {/* 统计信息 */}
                <div className={styles.statsCard}>
                    <h3>统计数据</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>人口占比</span>
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
            case 'love': return renderLoveAnalysis()
            case 'growth': return renderGrowth()
            case 'career': return renderCareer()
            case 'work': return renderWork()
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
