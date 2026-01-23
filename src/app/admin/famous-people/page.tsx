'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Users, ChevronDown, ChevronUp, X } from 'lucide-react'
import { famousPeopleData, type FamousPerson } from '@/data/famous-people-bios'
import styles from './famous-people.module.css'

const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

export default function FamousPeoplePage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [expandedPerson, setExpandedPerson] = useState<string | null>(null)
    const [selectedPerson, setSelectedPerson] = useState<FamousPerson | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // 获取所有人物或按类型筛选
    const getAllPeople = (): FamousPerson[] => {
        if (selectedType) {
            return famousPeopleData[selectedType] || []
        }
        return Object.values(famousPeopleData).flat()
    }

    // 搜索过滤
    const filteredPeople = getAllPeople().filter(person => {
        const searchLower = searchTerm.toLowerCase()
        return (
            person.nameCn.toLowerCase().includes(searchLower) ||
            person.nameEn.toLowerCase().includes(searchLower) ||
            person.bio.toLowerCase().includes(searchLower)
        )
    })

    // 按MBTI类型分组
    const groupedPeople = mbtiTypes.reduce((acc, type) => {
        const people = filteredPeople.filter(p => p.mbtiType === type)
        if (people.length > 0) {
            acc[type] = people
        }
        return acc
    }, {} as Record<string, FamousPerson[]>)

    const toggleType = (type: string) => {
        setExpandedPerson(expandedPerson === type ? null : type)
    }

    const openPersonModal = (person: FamousPerson) => {
        setSelectedPerson(person)
        setCurrentImageIndex(0)
    }

    const closeModal = () => {
        setSelectedPerson(null)
    }

    const nextImage = () => {
        if (selectedPerson) {
            setCurrentImageIndex((prev) =>
                (prev + 1) % selectedPerson.images.length
            )
        }
    }

    const prevImage = () => {
        if (selectedPerson) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedPerson.images.length - 1 : prev - 1
            )
        }
    }

    const totalCount = Object.values(famousPeopleData).flat().length

    return (
        <div className={styles.container}>
            {/* 页面标题 */}
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <Users size={28} />
                    <h1>代表人物管理</h1>
                </div>
                <p className={styles.subtitle}>
                    共 {totalCount} 位名人 · {mbtiTypes.length} 种人格类型
                </p>
            </div>

            {/* 搜索和筛选 */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="搜索人物名称或简介..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.typeFilters}>
                    <button
                        className={`${styles.typeBtn} ${selectedType === null ? styles.active : ''}`}
                        onClick={() => setSelectedType(null)}
                    >
                        全部
                    </button>
                    {mbtiTypes.map(type => (
                        <button
                            key={type}
                            className={`${styles.typeBtn} ${selectedType === type ? styles.active : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 人物列表 */}
            <div className={styles.content}>
                {Object.entries(groupedPeople).map(([type, people]) => (
                    <div key={type} className={styles.typeSection}>
                        <button
                            className={styles.typeSectionHeader}
                            onClick={() => toggleType(type)}
                        >
                            <span className={styles.typeLabel}>{type}</span>
                            <span className={styles.typeCount}>{people.length} 人</span>
                            {expandedPerson === type ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        <div className={`${styles.peopleGrid} ${expandedPerson === type ? styles.collapsed : ''}`}>
                            {people.map(person => (
                                <div
                                    key={person.id}
                                    className={styles.personCard}
                                    onClick={() => openPersonModal(person)}
                                >
                                    <div className={styles.personAvatar}>
                                        <Image
                                            src={person.images[0]}
                                            alt={person.nameCn}
                                            fill
                                            className={styles.avatarImg}
                                            sizes="60px"
                                        />
                                    </div>
                                    <div className={styles.personInfo}>
                                        <h3>{person.nameCn}</h3>
                                        <span className={styles.personNameEn}>{person.nameEn}</span>
                                        <p className={styles.personBioPreview}>{person.bio}</p>
                                    </div>
                                    <span className={styles.personType}>{person.mbtiType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredPeople.length === 0 && (
                    <div className={styles.noResults}>
                        没有找到匹配的人物
                    </div>
                )}
            </div>

            {/* 详情弹窗 */}
            {selectedPerson && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={closeModal}>
                            <X size={20} />
                        </button>

                        <div className={styles.modalImageSection}>
                            <button className={styles.imageNav} onClick={prevImage}>‹</button>
                            <div className={styles.modalImage}>
                                <Image
                                    src={selectedPerson.images[currentImageIndex]}
                                    alt={selectedPerson.nameCn}
                                    fill
                                    className={styles.modalImg}
                                    sizes="300px"
                                />
                            </div>
                            <button className={styles.imageNav} onClick={nextImage}>›</button>
                        </div>

                        <div className={styles.imageIndicators}>
                            {selectedPerson.images.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`${styles.indicator} ${idx === currentImageIndex ? styles.active : ''}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                />
                            ))}
                        </div>

                        <div className={styles.modalInfo}>
                            <h2>{selectedPerson.nameCn}</h2>
                            <span className={styles.modalNameEn}>{selectedPerson.nameEn}</span>
                            <span className={styles.modalType}>{selectedPerson.mbtiType}</span>
                            <p className={styles.modalBio}>{selectedPerson.bio}</p>
                            <div className={styles.modalMeta}>
                                <span>共 {selectedPerson.images.length} 张图片</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
