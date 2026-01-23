'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getFamousPeopleByType, type FamousPerson } from '@/data/famous-people-bios'
import PersonBioModal from './PersonBioModal'
import styles from './FamousPeopleGallery.module.css'

interface FamousPeopleGalleryProps {
    mbtiType: string
    themeColor?: string
}

export default function FamousPeopleGallery({ mbtiType, themeColor }: FamousPeopleGalleryProps) {
    const people = getFamousPeopleByType(mbtiType)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
    const [selectedPerson, setSelectedPerson] = useState<FamousPerson | null>(null)
    const [randomImages, setRandomImages] = useState<Record<string, string>>({})

    // 在客户端挂载后随机选择图片，避免 hydration 错误
    useEffect(() => {
        const images: Record<string, string> = {}
        people.forEach(person => {
            const randomIndex = Math.floor(Math.random() * person.images.length)
            images[person.id] = person.images[randomIndex]
        })
        setRandomImages(images)
    }, [people])

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set(prev).add(id))
    }

    const handlePersonClick = (person: FamousPerson) => {
        setSelectedPerson(person)
    }

    if (people.length === 0) return null

    return (
        <>
            <div className={styles.galleryWrapper}>
                <div className={styles.gallery}>
                    {people.map((person, index) => (
                        <motion.div
                            key={person.id}
                            className={styles.personCard}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.05 + index * 0.08, duration: 0.4, type: 'spring' }}
                            style={{
                                '--theme-color': themeColor || 'var(--primary)',
                            } as React.CSSProperties}
                            onClick={() => handlePersonClick(person)}
                        >
                            <div className={styles.avatarWrapper}>
                                <div className={styles.avatarGlow} />
                                <div className={styles.avatarBorder}>
                                    {!imageErrors.has(person.id) ? (
                                        <Image
                                            src={randomImages[person.id] || person.images[0]}
                                            alt={person.nameCn}
                                            fill
                                            className={styles.avatar}
                                            onError={() => handleImageError(person.id)}
                                            sizes="(max-width: 768px) 64px, 80px"
                                        />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {person.nameCn.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.clickHint}>点击查看</div>
                            </div>
                            <motion.span
                                className={styles.personName}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 + index * 0.08 }}
                            >
                                {person.nameCn}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 人物简介弹窗 */}
            <PersonBioModal
                person={selectedPerson}
                isOpen={selectedPerson !== null}
                onClose={() => setSelectedPerson(null)}
                themeColor={themeColor}
            />
        </>
    )
}
