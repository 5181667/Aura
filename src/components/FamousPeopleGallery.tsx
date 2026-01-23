'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getFamousPeopleByType, type FamousPerson } from '@/data/famous-people-images'
import styles from './FamousPeopleGallery.module.css'

interface FamousPeopleGalleryProps {
    mbtiType: string
    themeColor?: string
}

export default function FamousPeopleGallery({ mbtiType, themeColor }: FamousPeopleGalleryProps) {
    const people = getFamousPeopleByType(mbtiType)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    const handleImageError = (name: string) => {
        setImageErrors(prev => new Set(prev).add(name))
    }

    if (people.length === 0) return null

    return (
        <div className={styles.gallery}>
            {people.map((person, index) => (
                <motion.div
                    key={person.name}
                    className={styles.personCard}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.15, duration: 0.5, type: 'spring' }}
                    style={{
                        '--theme-color': themeColor || 'var(--primary)',
                    } as React.CSSProperties}
                >
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarGlow} />
                        <div className={styles.avatarBorder}>
                            {!imageErrors.has(person.name) ? (
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    fill
                                    className={styles.avatar}
                                    onError={() => handleImageError(person.name)}
                                    sizes="(max-width: 768px) 80px, 100px"
                                />
                            ) : (
                                <div className={styles.avatarFallback}>
                                    {person.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <motion.span
                        className={styles.personName}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.15 }}
                    >
                        {person.name}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    )
}
