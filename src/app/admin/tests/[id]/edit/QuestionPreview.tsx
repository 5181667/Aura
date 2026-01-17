"use client"

import { useState } from 'react'
import styles from './editor.module.css'

export default function QuestionPreview({ title, description, questions }: any) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (questions.length === 0) {
        return (
            <div className={styles.previewEmpty}>
                <p>暂无题目可预览</p>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]

    return (
        <div className={styles.preview}>
            <div className={styles.previewHeader}>
                <h4>{title || '未命名测试'}</h4>
                <p>{description || '暂无描述'}</p>
            </div>

            <div className={styles.previewProgress}>
                <div
                    className={styles.previewProgressBar}
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className={styles.previewQuestion}>
                <span className={styles.previewStep}>
                    问题 {currentIndex + 1} / {questions.length}
                </span>
                <h3>{currentQuestion.question}</h3>

                <div className={styles.previewOptions}>
                    {currentQuestion.options.map((option: any, index: number) => (
                        <button
                            key={index}
                            className={styles.previewOption}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.previewNav}>
                <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="btn-premium"
                    style={{ fontSize: '0.9rem' }}
                >
                    上一题
                </button>
                <button
                    onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="btn-premium"
                    style={{ fontSize: '0.9rem' }}
                >
                    下一题
                </button>
            </div>
        </div>
    )
}
