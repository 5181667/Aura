"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Smartphone, CheckCircle, Loader2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import styles from './PaymentDialog.module.css'

interface PaymentDialogProps {
    isOpen: boolean
    testResultId: string
    onClose: () => void
    onSuccess: () => void
}

type PaymentStatus = 'selecting' | 'creating' | 'pending' | 'checking' | 'success' | 'error'
type PaymentMethod = 'alipay' | 'wechat'

// 检测是否为移动端
function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
}

export default function PaymentDialog({ isOpen, testResultId, onClose, onSuccess }: PaymentDialogProps) {
    const [status, setStatus] = useState<PaymentStatus>('selecting')
    const [orderId, setOrderId] = useState<string | null>(null)
    const [qrcode, setQrcode] = useState<string | null>(null)
    const [payUrl, setPayUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pollCount, setPollCount] = useState(0)
    const [mobile] = useState(() => isMobile())
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay')
    const [paymentMethodUsed, setPaymentMethodUsed] = useState<PaymentMethod>('alipay')
    const [wechatAvailable, setWechatAvailable] = useState(false)

    const amount = 9.9

    // 拉取可用支付方式（未配置 AppID 时不展示微信）
    useEffect(() => {
        if (!isOpen || status !== 'selecting') return
        fetch('/api/payment/methods')
            .then((r) => r.json())
            .then((data) => setWechatAvailable(!!data?.wechat))
            .catch(() => setWechatAvailable(false))
    }, [isOpen, status])

    // 创建支付订单
    const createOrder = async () => {
        setStatus('creating')
        setError(null)

        try {
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testResultId,
                    clientType: mobile ? 'mobile' : 'pc',
                    paymentMethod,
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setOrderId(data.orderId)
                setQrcode(data.qrcode)
                setPayUrl(data.payUrl || null)
                setPaymentMethodUsed(data.paymentMethod || paymentMethod)
                setStatus('pending')
                setPollCount(0)

                if (mobile && data.payUrl) {
                    window.location.href = data.payUrl
                }
            } else {
                throw new Error(data.message || '创建订单失败')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '创建订单失败')
            setStatus('error')
        }
    }

    // 检查支付状态
    const checkPayment = useCallback(async () => {
        if (!orderId || status !== 'pending') return

        try {
            const response = await fetch(`/api/payment/check?orderId=${orderId}`)
            const data = await response.json()

            if (data.status === 'paid') {
                setStatus('success')
                setTimeout(() => {
                    onSuccess()
                }, 1500)
            } else if (data.status === 'closed') {
                setError('交易已关闭，请重新支付')
                setStatus('error')
            } else {
                setPollCount(prev => prev + 1)
            }
        } catch (err) {
            console.error('Check payment error:', err)
        }
    }, [orderId, status, onSuccess])

    // 轮询检查支付状态
    useEffect(() => {
        if (status !== 'pending' || !orderId) return

        // 每 3 秒检查一次，最多 100 次（约 5 分钟）
        if (pollCount >= 100) {
            setError('支付超时，请刷新页面重试')
            setStatus('error')
            return
        }

        const timer = setTimeout(checkPayment, 3000)
        return () => clearTimeout(timer)
    }, [status, orderId, pollCount, checkPayment])

    // 重置状态
    const handleClose = () => {
        setStatus('selecting')
        setOrderId(null)
        setQrcode(null)
        setPayUrl(null)
        setError(null)
        setPollCount(0)
        onClose()
    }

    // 跳转支付宝支付页面
    const openPayUrl = () => {
        if (payUrl) {
            window.open(payUrl, '_blank')
        }
    }

    // 手动刷新支付状态
    const manualCheck = async () => {
        setStatus('checking')
        try {
            if (!orderId) return
            const response = await fetch(`/api/payment/check?orderId=${orderId}`)
            const data = await response.json()

            if (data.status === 'paid') {
                setStatus('success')
                setTimeout(() => onSuccess(), 1500)
            } else {
                setStatus('pending')
            }
        } catch {
            setStatus('pending')
        }
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

                        {/* 选择 & 确认支付 */}
                        {status === 'selecting' && (
                            <>
                                <div className={styles.header}>
                                    <CreditCard size={28} className={styles.headerIcon} />
                                    <h2>解锁高级报告</h2>
                                    <p>获取 AI 深度分析，包含恋爱、事业、成长等全方位解读</p>
                                </div>

                                <div className={styles.priceSection}>
                                    <span className={styles.price}>¥{amount.toFixed(2)}</span>
                                    <span className={styles.priceLabel}>一次性购买</span>
                                </div>

                                <div className={styles.methodSection}>
                                    <p className={styles.methodLabel}>支付方式</p>
                                    <div className={styles.methods}>
                                        <button
                                            type="button"
                                            className={`${styles.methodBtn} ${paymentMethod === 'alipay' ? styles.selected : ''}`}
                                            onClick={() => setPaymentMethod('alipay')}
                                        >
                                            <span className={styles.methodIcon}>💳</span>
                                            <span>支付宝</span>
                                        </button>
                                        {wechatAvailable && (
                                            <button
                                                type="button"
                                                className={`${styles.methodBtn} ${paymentMethod === 'wechat' ? styles.selected : ''}`}
                                                onClick={() => setPaymentMethod('wechat')}
                                            >
                                                <span className={styles.methodIcon}>💚</span>
                                                <span>微信支付</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button className={styles.payBtn} onClick={createOrder}>
                                    立即支付 ¥{amount.toFixed(2)}
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

                        {/* 创建订单中 */}
                        {status === 'creating' && (
                            <div className={styles.loadingState}>
                                <Loader2 size={48} className={styles.spinner} />
                                <h3>正在创建订单...</h3>
                            </div>
                        )}

                        {/* 等待支付 */}
                        {status === 'pending' && (
                            <>
                                <div className={styles.header}>
                                    <Smartphone size={28} className={styles.headerIcon} />
                                    <h2>
                                        {paymentMethodUsed === 'wechat' ? '微信支付' : mobile ? '支付宝支付' : '扫码支付'}
                                    </h2>
                                    <p>
                                        {paymentMethodUsed === 'wechat'
                                            ? '请使用微信扫一扫扫描二维码完成支付'
                                            : mobile
                                                ? '正在跳转支付宝，请完成支付后返回'
                                                : '请使用支付宝扫描二维码完成支付'}
                                    </p>
                                </div>

                                {/* PC 端显示二维码 */}
                                {!mobile && (
                                    <div className={styles.qrcodeSection}>
                                        {qrcode ? (
                                            <img src={qrcode} alt="支付二维码" className={styles.qrcode} />
                                        ) : payUrl && paymentMethodUsed === 'alipay' ? (
                                            <div className={styles.qrcodePlaceholder}>
                                                <p>二维码暂不可用</p>
                                                <button className={styles.linkBtn} onClick={openPayUrl}>
                                                    <ExternalLink size={16} style={{ marginRight: 4 }} />
                                                    点击跳转支付宝支付
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.qrcodePlaceholder}>
                                                <Loader2 size={24} className={styles.miniSpinner} />
                                                <p>加载中...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={styles.waitingInfo}>
                                    <Loader2 size={16} className={styles.miniSpinner} />
                                    <span>等待支付中... 支付完成后自动跳转</span>
                                </div>

                                <div className={styles.actions}>
                                    <button className={styles.refreshBtn} onClick={manualCheck}>
                                        <RefreshCw size={16} />
                                        已完成支付？点击刷新
                                    </button>
                                    {payUrl && paymentMethodUsed === 'alipay' && !mobile && (
                                        <button className={styles.linkBtn} onClick={openPayUrl}>
                                            <ExternalLink size={16} style={{ marginRight: 4 }} />
                                            打开支付宝支付页面
                                        </button>
                                    )}
                                    {payUrl && paymentMethodUsed === 'alipay' && mobile && (
                                        <button className={styles.linkBtn} onClick={() => payUrl && (window.location.href = payUrl)}>
                                            <ExternalLink size={16} style={{ marginRight: 4 }} />
                                            重新打开支付宝
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* 检查中 */}
                        {status === 'checking' && (
                            <div className={styles.loadingState}>
                                <Loader2 size={48} className={styles.spinner} />
                                <h3>正在确认支付状态...</h3>
                            </div>
                        )}

                        {/* 支付成功 */}
                        {status === 'success' && (
                            <div className={styles.successState}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                >
                                    <CheckCircle size={64} className={styles.successIcon} />
                                </motion.div>
                                <h3>支付成功</h3>
                                <p>正在为您生成高级分析报告...</p>
                            </div>
                        )}

                        {/* 错误状态 */}
                        {status === 'error' && (
                            <div className={styles.errorState}>
                                <AlertCircle size={48} className={styles.errorIcon} />
                                <h3>支付遇到问题</h3>
                                <p>{error}</p>
                                <button className={styles.retryBtn} onClick={() => setStatus('selecting')}>
                                    重新支付
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
