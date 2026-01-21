"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import MBTICharacter, { MBTICharacterMini } from './MBTICharacter'
import { getMBTIProfile } from '@/data/mbti-profiles'
import styles from './DashboardMBTI.module.css'

interface DashboardMBTIProps {
    mbtiType: string | null
    userName?: string
}

export default function DashboardMBTI({ mbtiType, userName }: DashboardMBTIProps) {
    if (!mbtiType) return null
    
    const profile = getMBTIProfile(mbtiType)
    if (!profile) return null

    return (
        <motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className={styles.characterSection}>
                <MBTICharacter 
                    type={mbtiType} 
                    size="lg" 
                    animated={true}
                    showGlow={true}
                />
            </div>
            
            <div className={styles.infoSection}>
                <motion.div 
                    className={styles.typeHeader}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className={styles.emoji}>{profile.emoji}</span>
                    <div className={styles.typeInfo}>
                        <h3 className={styles.typeName}>{profile.type}</h3>
                        <p className={styles.typeTitle}>{profile.title}</p>
                    </div>
                </motion.div>
                
                <motion.p 
                    className={styles.tagline}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    "{profile.tagline}"
                </motion.p>
                
                <motion.div 
                    className={styles.tags}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {profile.tags.slice(0, 3).map((tag, idx) => (
                        <motion.span 
                            key={tag} 
                            className={styles.tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                        >
                            #{tag}
                        </motion.span>
                    ))}
                </motion.div>
                
                <Link 
                    href={`/results?type=MBTI`}
                    className={styles.viewBtn}
                >
                    查看完整分析
                </Link>
            </div>
        </motion.div>
    )
}

// 小版本用于状态栏
export function MBTIStatusBadge({ mbtiType }: { mbtiType: string | null }) {
    if (!mbtiType) return null
    
    const profile = getMBTIProfile(mbtiType)
    if (!profile) return null
    
    return (
        <motion.div 
            className={styles.statusBadge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
        >
            <MBTICharacterMini type={mbtiType} size={32} />
            <span className={styles.statusType}>{mbtiType}</span>
        </motion.div>
    )
}
