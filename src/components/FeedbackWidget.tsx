"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { useToast } from './Toast'
import styles from './FeedbackWidget.module.css'

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [contact, setContact] = useState('')
    const [isSending, setIsSending] = useState(false)
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setIsSending(true)
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, contact })
            })

            const data = await res.json()

            if (res.ok) {
                showToast('感谢您的反馈！我们会尽快处理', 'success')
                setIsOpen(false)
                setMessage('')
                setContact('')
            } else {
                throw new Error(data.message || '发送失败')
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : '发送失败，请稍后重试', 'error')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <>
            {/* 悬浮按钮 - FAB */}
            <motion.button
                className={styles.fab}
                onClick={() => setIsOpen(true)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* 反馈弹窗 */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <div className={styles.card}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    <MessageSquare size={20} />
                                    意见反馈
                                </div>
                                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        反馈内容
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="请描述您遇到的问题或建议..."
                                        className={`${styles.input} ${styles.textarea}`}
                                        required
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        联系方式 (选填)
                                    </label>
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="邮箱或微信号，方便我们联系您"
                                        className={styles.input}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending || !message.trim()}
                                    className={styles.submitBtn}
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            发送中...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            发送反馈
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
