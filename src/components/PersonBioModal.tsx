'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { type FamousPerson } from '@/data/famous-people-bios'
import styles from './PersonBioModal.module.css'

interface PersonBioModalProps {
    person: FamousPerson | null
    isOpen: boolean
    onClose: () => void
    themeColor?: string
}

export default function PersonBioModal({ person, isOpen, onClose, themeColor }: PersonBioModalProps) {
    if (!person) return null

    // 随机选择一张图片展示
    const displayImage = person.images[Math.floor(Math.random() * person.images.length)]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 背景遮罩 */}
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* 模态框 */}
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            '--theme-color': themeColor || 'var(--primary)',
                        } as React.CSSProperties}
                    >
                        {/* 关闭按钮 */}
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>

                        {/* 头像区域 */}
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarGlow} />
                            <div className={styles.avatarWrapper}>
                                <Image
                                    src={displayImage}
                                    alt={person.nameCn}
                                    fill
                                    className={styles.avatar}
                                    sizes="120px"
                                />
                            </div>
                        </div>

                        {/* 信息区域 */}
                        <div className={styles.infoSection}>
                            <h3 className={styles.name}>{person.nameCn}</h3>
                            <span className={styles.nameEn}>{person.nameEn}</span>

                            <div className={styles.mbtiTag} style={{ backgroundColor: themeColor }}>
                                {person.mbtiType}
                            </div>

                            <p className={styles.bio}>{person.bio}</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
