"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, CheckCircle, Loader2, AlertCircle, Ticket, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import styles from './PaymentDialog.module.css'

interface PaymentDialogProps {
    isOpen: boolean
    testResultId: string
    onClose: () => void
    onSuccess: () => void
}

type DialogStep = 'guide' | 'redeem' | 'submitting' | 'success'

export default function PaymentDialog({ isOpen, testResultId, onClose, onSuccess }: PaymentDialogProps) {
    const [step, setStep] = useState<DialogStep>('guide')
    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)

    const amount = 9.9

    const handleSubmit = async () => {
        const trimmed = code.trim()
        if (!trimmed) {
            setError('请输入兑换码')
            return
        }

        setStep('submitting')
        setError(null)

        try {
            const response = await fetch('/api/redemption/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: trimmed, testResultId })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setStep('success')
                setTimeout(() => onSuccess(), 1500)
            } else {
                setError(data.message || '兑换失败')
                setStep('redeem')
            }
        } catch {
            setError('网络错误，请重试')
            setStep('redeem')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && step === 'redeem') {
            handleSubmit()
        }
    }

    const handleClose = () => {
        setStep('guide')
        setCode('')
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

                        {/* Step 1: 闲鱼购买引导 */}
                        {step === 'guide' && (
                            <>
                                <div className={styles.header}>
                                    <ShoppingBag size={28} className={styles.headerIcon} />
                                    <h2>解锁高级报告</h2>
                                    <p>扫码前往闲鱼购买，获取兑换码后即可解锁</p>
                                </div>

                                <div className={styles.priceSection}>
                                    <span className={styles.price}>¥{amount.toFixed(2)}</span>
                                    <span className={styles.priceLabel}>一次性购买</span>
                                </div>

                                <div className={styles.qrcodeSection}>
                                    <div className={styles.qrcodeWrapper}>
                                        <Image
                                            src="/xianyu-qr.png"
                                            alt="闲鱼购买二维码"
                                            width={200}
                                            height={200}
                                            className={styles.qrcode}
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                <div className={styles.stepsGuide}>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepNum}>1</span>
                                        <span>打开闲鱼 APP 扫描上方二维码</span>
                                    </div>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepNum}>2</span>
                                        <span>完成购买后，闲鱼客服发送兑换码</span>
                                    </div>
                                    <div className={styles.stepItem}>
                                        <span className={styles.stepNum}>3</span>
                                        <span>输入兑换码即可解锁高级报告</span>
                                    </div>
                                </div>

                                <button className={styles.payBtn} onClick={() => setStep('redeem')}>
                                    <Ticket size={18} />
                                    我已购买，输入兑换码
                                    <ArrowRight size={18} />
                                </button>

                                <div className={styles.features}>
                                    <div className={styles.feature}>
                                        <CheckCircle size={16} />
                                        <span>恋爱深度分析</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <CheckCircle size={16} />
                                        <span>事业发展建议</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <CheckCircle size={16} />
                                        <span>个人成长路径</span>
                                    </div>
                                    <div className={styles.feature}>
                                        <CheckCircle size={16} />
                                        <span>数据可视化图表</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: 输入兑换码 */}
                        {step === 'redeem' && (
                            <>
                                <div className={styles.header}>
                                    <Ticket size={28} className={styles.headerIcon} />
                                    <h2>输入兑换码</h2>
                                    <p>请输入从闲鱼客服获取的兑换码</p>
                                </div>

                                <div className={styles.inputSection}>
                                    <input
                                        type="text"
                                        className={`${styles.codeInput} ${error ? styles.inputError : ''}`}
                                        value={code}
                                        onChange={e => {
                                            setCode(e.target.value.toUpperCase())
                                            setError(null)
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="请输入兑换码"
                                        maxLength={12}
                                        autoFocus
                                    />
                                    {error && (
                                        <div className={styles.errorMsg}>
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={styles.payBtn}
                                    onClick={handleSubmit}
                                    disabled={!code.trim()}
                                >
                                    <Ticket size={18} />
                                    立即兑换
                                </button>

                                <button
                                    className={styles.backBtn}
                                    onClick={() => { setStep('guide'); setError(null) }}
                                >
                                    还没购买？返回查看二维码
                                </button>
                            </>
                        )}

                        {/* 提交中 */}
                        {step === 'submitting' && (
                            <div className={styles.loadingState}>
                                <Loader2 size={48} className={styles.spinner} />
                                <h3>正在验证兑换码...</h3>
                            </div>
                        )}

                        {/* 兑换成功 */}
                        {step === 'success' && (
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
