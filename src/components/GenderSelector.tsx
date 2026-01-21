"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, X } from 'lucide-react'
import styles from './GenderSelector.module.css'

interface GenderSelectorProps {
    isOpen: boolean
    onSelect: (gender: string | null) => void
    onClose: () => void
}

export default function GenderSelector({ isOpen, onSelect, onClose }: GenderSelectorProps) {
    const [selected, setSelected] = useState<string | null>(null)

    const genderOptions = [
        { id: 'male', label: '男', emoji: '👨' },
        { id: 'female', label: '女', emoji: '👩' },
        { id: null, label: '不想说', emoji: '🤐' }
    ]

    const handleConfirm = () => {
        onSelect(selected)
        onClose()
    }

    const handleSkip = () => {
        onSelect(null)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={styles.dialog}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <button className={styles.closeBtn} onClick={handleSkip}>
                            <X size={20} />
                        </button>

                        <div className={styles.header}>
                            <div className={styles.iconWrapper}>
                                <User size={28} />
                            </div>
                            <h2>完善您的信息</h2>
                            <p>告诉我们您的性别，以便提供更精准的分析</p>
                        </div>

                        <div className={styles.options}>
                            {genderOptions.map((option) => (
                                <motion.button
                                    key={option.id ?? 'skip'}
                                    className={`${styles.option} ${selected === option.id ? styles.selected : ''}`}
                                    onClick={() => setSelected(option.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className={styles.emoji}>{option.emoji}</span>
                                    <span className={styles.label}>{option.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button 
                                className={styles.confirmBtn}
                                onClick={handleConfirm}
                            >
                                继续
                            </button>
                        </div>

                        <p className={styles.hint}>
                            此信息仅用于个性化分析，不会公开显示
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
