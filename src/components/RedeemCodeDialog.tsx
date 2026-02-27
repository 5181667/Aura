"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import styles from './RedeemCodeDialog.module.css'

interface RedeemCodeDialogProps {
    isOpen: boolean
    testResultId: string
    onClose: () => void
    onSuccess: () => void
}

type RedeemStatus = 'input' | 'submitting' | 'success'

export default function RedeemCodeDialog({ isOpen, testResultId, onClose, onSuccess }: RedeemCodeDialogProps) {
    const [code, setCode] = useState('')
    const [status, setStatus] = useState<RedeemStatus>('input')
    const [error, setError] = useState<string | null>(null)

    // 提交兑换码
    const handleSubmit = async () => {
        const trimmed = code.trim()
        if (!trimmed) {
            setError('请输入兑换码')
            return
        }

        setStatus('submitting')
        setError(null)

        try {
            const response = await fetch('/api/redemption/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: trimmed, testResultId })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setStatus('success')
                // 延迟回调
                setTimeout(() => {
                    onSuccess()
                }, 1500)
            } else {
                setError(data.message || '兑换失败')
                setStatus('input')
            }
        } catch {
            setError('网络错误，请重试')
            setStatus('input')
        }
    }

    // 处理回车键
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && status === 'input') {
            handleSubmit()
        }
    }

    // 关闭并重置
    const handleClose = () => {
        setCode('')
        setStatus('input')
        setError(null)
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
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <X size={20} />
                        </button>

                        {/* 输入状态 / 提交中 */}
                        {status !== 'success' && (
                            <>
                                <div className={styles.header}>
                                    <div className={styles.iconWrapper}>
                                        <Ticket size={32} />
                                    </div>
                                    <h2>使用兑换码</h2>
                                    <p>输入兑换码即可免费解锁高级分析报告</p>
                                </div>

                                <div className={styles.inputSection}>
                                    <input
                                        type="text"
                                        className={`${styles.codeInput} ${error ? styles.error : ''}`}
                                        value={code}
                                        onChange={e => {
                                            setCode(e.target.value.toUpperCase())
                                            setError(null)
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="请输入兑换码"
                                        maxLength={12}
                                        autoFocus
                                        disabled={status === 'submitting'}
                                    />
                                    {error && (
                                        <div className={styles.errorMsg}>
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={styles.submitBtn}
                                    onClick={handleSubmit}
                                    disabled={status === 'submitting' || !code.trim()}
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 size={20} className={styles.spinner} />
                                            验证中...
                                        </>
                                    ) : (
                                        <>
                                            <Ticket size={20} />
                                            立即兑换
                                        </>
                                    )}
                                </button>

                                <p className={styles.hint}>
                                    兑换码可从活动或管理员处获取
                                </p>
                            </>
                        )}

                        {/* 成功状态 */}
                        {status === 'success' && (
                            <div className={styles.successState}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                >
                                    <CheckCircle size={64} className={styles.successIcon} />
                                </motion.div>
                                <h3>兑换成功</h3>
                                <p>正在为您生成高级分析报告...</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
