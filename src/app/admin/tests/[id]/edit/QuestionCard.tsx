"use client"

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './editor.module.css'

export default function QuestionCard({ question, index, onUpdate, onDelete, onDuplicate }: any) {
    const [expanded, setExpanded] = useState(false)
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: question.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const updateQuestionText = (text: string) => {
        onUpdate(question.id, { question: text })
    }

    const updateOption = (optionIndex: number, field: string, value: any) => {
        const newOptions = [...question.options]
        if (field === 'text') {
            newOptions[optionIndex].text = value
        } else if (field === 'dimension') {
            newOptions[optionIndex].score.dimension = value
        } else if (field === 'value') {
            newOptions[optionIndex].score.value = parseInt(value)
        }
        onUpdate(question.id, { options: newOptions })
    }

    const addOption = () => {
        const newOptions = [...question.options, {
            text: `选项 ${String.fromCharCode(65 + question.options.length)}`,
            score: { dimension: 'EI', value: 0 }
        }]
        onUpdate(question.id, { options: newOptions })
    }

    const removeOption = (optionIndex: number) => {
        if (question.options.length <= 2) {
            alert('至少需要两个选项')
            return
        }
        const newOptions = question.options.filter((_: any, i: number) => i !== optionIndex)
        onUpdate(question.id, { options: newOptions })
    }

    return (
        <div ref={setNodeRef} style={style} className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <div className={styles.questionTitle}>
                    <span className={styles.dragHandle} {...attributes} {...listeners}>
                        ⋮⋮
                    </span>
                    <span className={styles.questionNumber}>问题 {index + 1}</span>
                    <span className={styles.questionText}>{question.question}</span>
                </div>
                <div className={styles.questionActions}>
                    <button onClick={() => setExpanded(!expanded)} className={styles.iconBtn}>
                        {expanded ? '▼' : '▶'}
                    </button>
                    <button onClick={() => onDuplicate(question.id)} className={styles.iconBtn}>
                        📋
                    </button>
                    <button onClick={() => onDelete(question.id)} className={styles.iconBtn}>
                        🗑️
                    </button>
                </div>
            </div>

            {expanded && (
                <div className={styles.questionContent}>
                    <div className={styles.formGroup}>
                        <label>问题内容</label>
                        <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestionText(e.target.value)}
                            className="input-premium"
                        />
                    </div>

                    <div className={styles.optionsSection}>
                        <div className={styles.optionsHeader}>
                            <label>选项配置</label>
                            <button onClick={addOption} className={styles.addOptionBtn}>
                                + 添加选项
                            </button>
                        </div>

                        {question.options.map((option: any, optionIndex: number) => (
                            <div key={optionIndex} className={styles.optionRow}>
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(optionIndex, 'text', e.target.value)}
                                    className="input-premium"
                                    placeholder="选项文本"
                                />
                                <select
                                    value={option.score.dimension}
                                    onChange={(e) => updateOption(optionIndex, 'dimension', e.target.value)}
                                    className="input-premium"
                                    style={{ width: '120px' }}
                                >
                                    <option value="EI">外向-内向</option>
                                    <option value="SN">实感-直觉</option>
                                    <option value="TF">思考-情感</option>
                                    <option value="JP">判断-感知</option>
                                </select>
                                <input
                                    type="number"
                                    value={option.score.value}
                                    onChange={(e) => updateOption(optionIndex, 'value', e.target.value)}
                                    className="input-premium"
                                    style={{ width: '80px' }}
                                    min="-5"
                                    max="5"
                                />
                                <button
                                    onClick={() => removeOption(optionIndex)}
                                    className={styles.removeOptionBtn}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
