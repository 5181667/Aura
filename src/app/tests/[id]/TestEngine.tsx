"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./engine.module.css"

export default function TestEngine({ test }: { test: any }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [result, setResult] = useState<string | null>(null)

    const questions = test.questions as any[]

    const handleAnswer = (option: any) => {
        const newAnswers = [...answers, option.score]
        setAnswers(newAnswers)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            calculateResult(newAnswers)
        }
    }

    const calculateResult = async (finalAnswers: any[]) => {
        // Calculate MBTI type
        const totals: any = { EI: 0, SN: 0, TF: 0, JP: 0 }
        finalAnswers.forEach(ans => {
            if (ans.dimension) {
                totals[ans.dimension] = (totals[ans.dimension] || 0) + ans.value
            }
        })

        const type =
            (totals.EI >= 0 ? "E" : "I") +
            (totals.SN >= 0 ? "S" : "N") +
            (totals.TF >= 0 ? "T" : "F") +
            (totals.JP >= 0 ? "J" : "P")

        // Calculate Big Five dimensions (normalized to 0-100)
        const dimensions = {
            openness: Math.min(100, Math.max(0, 50 + (totals.SN || 0) * 10)),
            conscientiousness: Math.min(100, Math.max(0, 50 + (totals.JP || 0) * 10)),
            extraversion: Math.min(100, Math.max(0, 50 + (totals.EI || 0) * 10)),
            agreeableness: Math.min(100, Math.max(0, 50 + (totals.TF || 0) * 10)),
            neuroticism: Math.min(100, Math.max(0, 50 - (totals.EI || 0) * 5)),
        }

        // Submit to backend
        try {
            const response = await fetch('/api/tests/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testId: test.id,
                    score: type,
                    details: { answers: finalAnswers },
                    dimensions
                })
            })

            if (response.ok) {
                const data = await response.json()
                // Redirect to result page
                window.location.href = `/results/${data.resultId}`
            } else {
                setResult(type)
            }
        } catch (error) {
            console.error('Submit error:', error)
            setResult(type)
        }
    }

    if (result) {
        return (
            <div className={`${styles.resultCard} glass`}>
                <h2>你的测试结果是：</h2>
                <div className={styles.typeDisplay}>{result}</div>
                <p className={styles.description}>这是基于你刚才的选择得出的初步结论。想看详细解读吗？</p>
                <button className="btn-premium" onClick={() => window.location.href = "/register"}>
                    保存结果并查看详细报告
                </button>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]

    return (
        <div className={styles.engineWrapper}>
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`${styles.questionCard} glass`}
                >
                    <span className={styles.step}>问题 {currentIndex + 1} / {questions.length}</span>
                    <h3>{currentQuestion.question}</h3>

                    <div className={styles.optionsGrid}>
                        {currentQuestion.options.map((option: any, idx: number) => (
                            <button
                                key={idx}
                                className={styles.optionBtn}
                                onClick={() => handleAnswer(option)}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
