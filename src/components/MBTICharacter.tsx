"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './MBTICharacter.module.css'

interface MBTICharacterProps {
    type: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    animated?: boolean
    showGlow?: boolean
    className?: string
}

// MBTI 类型对应的主题色
const mbtiColors: Record<string, { primary: string; secondary: string; glow: string }> = {
    // 分析师 (NT) - 紫色系
    'INTJ': { primary: '#8b5cf6', secondary: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' },
    'INTP': { primary: '#7c3aed', secondary: '#8b5cf6', glow: 'rgba(124, 58, 237, 0.4)' },
    'ENTJ': { primary: '#6d28d9', secondary: '#7c3aed', glow: 'rgba(109, 40, 217, 0.4)' },
    'ENTP': { primary: '#5b21b6', secondary: '#6d28d9', glow: 'rgba(91, 33, 182, 0.4)' },
    // 外交官 (NF) - 绿色系
    'INFJ': { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
    'INFP': { primary: '#059669', secondary: '#10b981', glow: 'rgba(5, 150, 105, 0.4)' },
    'ENFJ': { primary: '#047857', secondary: '#059669', glow: 'rgba(4, 120, 87, 0.4)' },
    'ENFP': { primary: '#065f46', secondary: '#047857', glow: 'rgba(6, 95, 70, 0.4)' },
    // 守护者 (SJ) - 蓝色系
    'ISTJ': { primary: '#0ea5e9', secondary: '#38bdf8', glow: 'rgba(14, 165, 233, 0.4)' },
    'ISFJ': { primary: '#0284c7', secondary: '#0ea5e9', glow: 'rgba(2, 132, 199, 0.4)' },
    'ESTJ': { primary: '#0369a1', secondary: '#0284c7', glow: 'rgba(3, 105, 161, 0.4)' },
    'ESFJ': { primary: '#075985', secondary: '#0369a1', glow: 'rgba(7, 89, 133, 0.4)' },
    // 探险家 (SP) - 黄/橙色系
    'ISTP': { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' },
    'ISFP': { primary: '#d97706', secondary: '#f59e0b', glow: 'rgba(217, 119, 6, 0.4)' },
    'ESTP': { primary: '#b45309', secondary: '#d97706', glow: 'rgba(180, 83, 9, 0.4)' },
    'ESFP': { primary: '#92400e', secondary: '#b45309', glow: 'rgba(146, 64, 14, 0.4)' },
}

// 尺寸配置
const sizeConfig = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 },
    xl: { width: 260, height: 260 },
}

// 粒子组件 - 只在客户端渲染
function Particles({ color }: { color: string }) {
    const [mounted, setMounted] = useState(false)
    const [particles, setParticles] = useState<Array<{
        left: number
        top: number
        duration: number
        delay: number
    }>>([])

    useEffect(() => {
        setParticles(
            Array.from({ length: 6 }, () => ({
                left: 15 + Math.random() * 70,
                top: 15 + Math.random() * 70,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
            }))
        )
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className={styles.particles}>
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className={styles.particle}
                    style={{
                        background: color,
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [-10, -30, -10],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

export default function MBTICharacter({
    type,
    size = 'lg',
    animated = true,
    showGlow = true,
    className = ''
}: MBTICharacterProps) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [mounted, setMounted] = useState(false)

    // 移除 -A/-T 后缀，只用 4 字母类型查找颜色和图片
    const normalizedType = (type?.toUpperCase() || 'INTJ').replace(/-[AT]$/, '')
    const colors = mbtiColors[normalizedType] || mbtiColors['INTJ']
    const dimensions = sizeConfig[size]

    useEffect(() => {
        setImageLoaded(false)
        setImageError(false)
    }, [normalizedType])

    useEffect(() => {
        setMounted(true)
    }, [])

    // 如果图片加载失败，显示备用的简单头像
    if (imageError) {
        return (
            <motion.div
                className={`${styles.container} ${styles[size]} ${className}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className={styles.fallbackAvatar}
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        width: dimensions.width,
                        height: dimensions.height,
                    }}
                    animate={animated ? { y: [-4, 4, -4] } : undefined}
                    transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                    <span className={styles.fallbackText}>{normalizedType}</span>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className={`${styles.container} ${styles[size]} ${className}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* 光晕效果 */}
            {showGlow && mounted && (
                <motion.div
                    className={styles.glow}
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        width: dimensions.width * 1.5,
                        height: dimensions.height * 1.5,
                    }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* 外圈装饰环 */}
            {mounted && (
                <motion.div
                    className={styles.ring}
                    style={{
                        borderColor: colors.primary,
                        width: dimensions.width * 1.15,
                        height: dimensions.height * 1.15,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            )}

            {/* 主角色图片 */}
            <motion.div
                className={styles.characterWrapper}
                animate={animated ? { y: [-4, 4, -4] } : undefined}
                transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
            >
                {/* 角色图片 */}
                <motion.img
                    src={`/avatars/mbti/${normalizedType}.svg`}
                    alt={`${normalizedType} Character`}
                    className={styles.character}
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: imageLoaded ? 1 : 0,
                        scale: imageLoaded ? 1 : 0.9
                    }}
                    transition={{ duration: 0.4 }}
                    whileHover={animated ? { scale: 1.05 } : undefined}
                />

                {/* 加载占位符 */}
                {!imageLoaded && !imageError && (
                    <div
                        className={styles.placeholder}
                        style={{
                            width: dimensions.width,
                            height: dimensions.height,
                            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                        }}
                    >
                        <div className={styles.placeholderPulse} />
                    </div>
                )}
            </motion.div>

            {/* 粒子效果 */}
            {animated && showGlow && mounted && (
                <Particles color={colors.primary} />
            )}
        </motion.div>
    )
}

// 迷你版本，用于列表和小头像显示
export function MBTICharacterMini({
    type,
    size = 40,
    className = ''
}: {
    type: string
    size?: number
    className?: string
}) {
    const [imageError, setImageError] = useState(false)
    const normalizedType = type?.toUpperCase() || 'INTJ'
    const colors = mbtiColors[normalizedType] || mbtiColors['INTJ']

    if (imageError) {
        return (
            <div
                className={`${styles.miniContainer} ${className}`}
                style={{
                    width: size,
                    height: size,
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
            >
                <span style={{ fontSize: size * 0.25 }}>{normalizedType.slice(0, 2)}</span>
            </div>
        )
    }

    return (
        <motion.div
            className={`${styles.miniContainer} ${className}`}
            style={{ width: size, height: size }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <img
                src={`/avatars/mbti/${normalizedType}.svg`}
                alt={normalizedType}
                style={{ width: size, height: size }}
                onError={() => setImageError(true)}
            />
        </motion.div>
    )
}
