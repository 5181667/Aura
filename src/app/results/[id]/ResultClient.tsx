"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Share2, ChevronRight, Sparkles, Brain, Target, Heart, Briefcase, Users } from 'lucide-react'
import RadarChart from '@/components/RadarChart'
import ShareDialog from '@/components/ShareDialog'
import Navbar from '@/components/Navbar'
import { getMBTIProfile, getDimensionComparisons, type MBTIProfile, type DimensionComparison } from '@/data/mbti-profiles'
import { useTheme } from '@/providers/ThemeProvider'
import styles from './result.module.css'

// MBTI 小人 SVG 组件
function MBTIAvatar({ type, color }: { type: string; color: string }) {
    // 根据类型特点生成不同的形象
    const getAvatarStyle = () => {
        const firstLetter = type[0] // E/I
        const lastLetter = type[3] // J/P
        
        return {
            headSize: firstLetter === 'E' ? 36 : 32,
            bodyWidth: lastLetter === 'J' ? 50 : 44,
            pose: firstLetter === 'E' ? 'open' : 'relaxed'
        }
    }
    
    const style = getAvatarStyle()
    
    return (
        <svg viewBox="0 0 200 280" className={styles.avatarSvg}>
            <defs>
                <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* 光环效果 */}
            <circle cx="100" cy="70" r="50" fill={color} opacity="0.1" filter="url(#glow)" />
            
            {/* 头部 */}
            <circle 
                cx="100" 
                cy="70" 
                r={style.headSize} 
                fill={`url(#grad-${type})`}
                filter="url(#glow)"
            />
            
            {/* 眼睛 */}
            <ellipse cx="88" cy="65" rx="4" ry="5" fill="white" opacity="0.9" />
            <ellipse cx="112" cy="65" rx="4" ry="5" fill="white" opacity="0.9" />
            <circle cx="88" cy="66" r="2" fill="#1e1b2e" />
            <circle cx="112" cy="66" r="2" fill="#1e1b2e" />
            
            {/* 微笑 */}
            <path 
                d="M 90 80 Q 100 90 110 80" 
                stroke="white" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.8"
            />
            
            {/* 身体 */}
            <path 
                d={`M ${100 - style.bodyWidth/2} 105 
                    Q ${100 - style.bodyWidth/2 - 10} 150 ${100 - style.bodyWidth/2} 200
                    L ${100 + style.bodyWidth/2} 200
                    Q ${100 + style.bodyWidth/2 + 10} 150 ${100 + style.bodyWidth/2} 105
                    Q 100 115 ${100 - style.bodyWidth/2} 105`}
                fill={`url(#grad-${type})`}
                filter="url(#glow)"
            />
            
            {/* 手臂 - 根据E/I调整姿势 */}
            {style.pose === 'open' ? (
                <>
                    <path d="M 50 110 Q 30 140 45 180" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 150 110 Q 170 140 155 180" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
                </>
            ) : (
                <>
                    <path d="M 55 115 Q 50 150 70 175" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 145 115 Q 150 150 130 175" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
                </>
            )}
            
            {/* 腿部 */}
            <path d="M 80 200 L 75 260" stroke={color} strokeWidth="10" strokeLinecap="round" />
            <path d="M 120 200 L 125 260" stroke={color} strokeWidth="10" strokeLinecap="round" />
            
            {/* 装饰元素 - 根据类型添加不同配饰 */}
            {type.includes('T') && (
                <rect x="85" y="130" width="30" height="20" rx="3" fill="white" opacity="0.3" />
            )}
            {type.includes('F') && (
                <path d="M 100 135 L 105 145 L 100 142 L 95 145 Z" fill="#ec4899" opacity="0.8" />
            )}
        </svg>
    )
}

// 维度对比条组件 - 参考 16Personalities 风格
function DimensionBar({ comparison }: { comparison: DimensionComparison }) {
    const isLeftActive = comparison.activeLeft
    const leftPct = comparison.leftPercentage
    const rightPct = comparison.rightPercentage
    
    // 维度图标映射
    const dimensionIcons: Record<string, React.ReactNode> = {
        'E': <Users size={16} />,
        'I': <Brain size={16} />,
        'S': <Target size={16} />,
        'N': <Sparkles size={16} />,
        'T': <Brain size={16} />,
        'F': <Heart size={16} />,
        'J': <Target size={16} />,
        'P': <Sparkles size={16} />
    }
    
    return (
        <div className={styles.dimensionBar}>
            {/* 标签行 */}
            <div className={styles.dimensionLabels}>
                <div className={`${styles.dimLabel} ${isLeftActive ? styles.active : styles.inactive}`}>
                    <span className={styles.dimIcon}>
                        {dimensionIcons[comparison.leftLetter] || <Brain size={16} />}
                    </span>
                    <span className={styles.dimText}>{comparison.leftLabel}</span>
                </div>
                <div className={`${styles.dimLabel} ${!isLeftActive ? styles.active : styles.inactive}`} style={{ textAlign: 'right' }}>
                    <span className={styles.dimText}>{comparison.rightLabel}</span>
                    <span className={styles.dimIcon}>
                        {dimensionIcons[comparison.rightLetter] || <Brain size={16} />}
                    </span>
                </div>
            </div>
            
            {/* 进度条 */}
            <div className={styles.barTrack}>
                {isLeftActive ? (
                    // 左边激活 - 从左到右填充
                    <motion.div 
                        className={`${styles.barFill} ${styles.fillActive}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${leftPct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className={styles.percentInBar}>{leftPct}%</span>
                    </motion.div>
                ) : (
                    // 右边激活 - 从右到左填充
                    <>
                        <div style={{ flex: 1 }} />
                        <motion.div 
                            className={`${styles.barFill} ${styles.fillActive} ${styles.fillRight}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${rightPct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className={styles.percentInBar}>{rightPct}%</span>
                        </motion.div>
                    </>
                )}
                {/* 中央分割线 */}
                <div 
                    className={styles.barDivider} 
                    style={{ left: isLeftActive ? `${leftPct}%` : `${100 - rightPct}%` }}
                />
            </div>
        </div>
    )
}

export default function ResultClient({ result }: { result: any }) {
    const [showShare, setShowShare] = useState(false)
    const { setThemeByMBTI } = useTheme()
    
    // 获取 MBTI Profile
    const profile = getMBTIProfile(result.score)
    const isMBTI = result.test.type === 'MBTI' && profile
    
    // 自动切换到对应 MBTI 类型的主题
    useEffect(() => {
        if (isMBTI && result.score) {
            setThemeByMBTI(result.score)
        }
    }, [isMBTI, result.score, setThemeByMBTI])
    
    // 维度数据处理
    const dimensionArray = Array.isArray(result.dimensions) ? result.dimensions : null
    const dimensionComparisons = dimensionArray ? getDimensionComparisons(dimensionArray) : []
    
    // 雷达图数据
    const radarData = dimensionArray
        ? Object.fromEntries(
            dimensionArray.map((dim: any) => [
                dim.label || dim.dimension,
                Number(dim.percentage ?? dim.rawScore ?? 0)
            ])
        )
        : {}

    // 非 MBTI 的通用结果显示
    if (!isMBTI) {
        return (
            <div className={styles.container}>
                <Navbar />
                
                <main className={styles.main}>
                    <div className={styles.genericResult}>
                        <h1>{result.test.title}</h1>
                        <div className={styles.genericScore}>{result.score}</div>
                        <div className={styles.genericActions}>
                            <button className="btn-premium" onClick={() => setShowShare(true)}>
                                <Share2 size={18} />
                                分享结果
                            </button>
                        </div>
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
                
                {showShare && (
                    <ShareDialog resultId={result.id} onClose={() => setShowShare(false)} />
                )}
            </div>
        )
    }

    // MBTI 专属的精美结果页面
    return (
        <div className={styles.container}>
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
                            <MBTIAvatar type={profile.type} color={profile.color} />
                            <div className={styles.avatarGlow} style={{ background: profile.color }} />
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
                                {profile.type}
                            </motion.h1>
                            
                            <motion.h2 
                                className={styles.typeTitle}
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
                        {/* 维度对比条 */}
                        <div className={styles.dimensionsCard}>
                            <div className={styles.cardHeader}>
                                <Brain size={22} />
                                <h3>维度偏好分析</h3>
                            </div>
                            <div className={styles.dimensionsList}>
                                {dimensionComparisons.map((comp, idx) => (
                                    <motion.div
                                        key={comp.dimension}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + idx * 0.1 }}
                                    >
                                        <DimensionBar comparison={comp} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        
                        {/* 雷达图 */}
                        <div className={styles.radarCard}>
                            <div className={styles.cardHeader}>
                                <Sparkles size={22} />
                                <h3>性格雷达图</h3>
                            </div>
                            <div className={styles.radarWrapper}>
                                <RadarChart data={radarData} size={280} />
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
                        
                        <div className={styles.extraCard}>
                            <div className={styles.extraHeader}>
                                <Users size={20} />
                                <h4>代表人物</h4>
                            </div>
                            <div className={styles.extraTags}>
                                {profile.famousPeople.map(person => (
                                    <span key={person} className={styles.extraTag}>{person}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 操作按钮 */}
                <motion.div 
                    className={styles.actions}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
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
            </main>

            {showShare && (
                <ShareDialog resultId={result.id} onClose={() => setShowShare(false)} />
            )}
        </div>
    )
}
