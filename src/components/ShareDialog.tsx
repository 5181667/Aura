"use client"

import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import styles from './ShareDialog.module.css'

interface ShareDialogProps {
    resultId: string
    onClose: () => void
}

export default function ShareDialog({ resultId, onClose }: ShareDialogProps) {
    const [loading, setLoading] = useState(false)
    const [shareLink, setShareLink] = useState<string>("")

    const generateShareLink = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/share/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultId })
            })
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.message || '生成分享链接失败')
            }
            
            const link = `${window.location.origin}/share/${data.token}`
            setShareLink(link)
            await navigator.clipboard.writeText(link)
            alert('链接已复制到剪贴板！')
        } catch (error) {
            const message = error instanceof Error ? error.message : '生成失败，请重试'
            alert(message)
        } finally {
            setLoading(false)
        }
    }

    const generateImage = async () => {
        setLoading(true)
        try {
            const element = document.getElementById('result-content')
            if (!element) return

            const canvas = await html2canvas(element, {
                backgroundColor: '#030306',
                scale: 2,
            })

            const link = document.createElement('a')
            link.download = `personality-test-result-${Date.now()}.png`
            link.href = canvas.toDataURL()
            link.click()
        } catch (error) {
            alert('生成图片失败')
        } finally {
            setLoading(false)
        }
    }

    const downloadPDF = async () => {
        setLoading(true)
        try {
            const element = document.getElementById('result-content')
            if (!element) return

            const canvas = await html2canvas(element, {
                backgroundColor: '#030306',
                scale: 2,
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            })

            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            pdf.save(`personality-test-${Date.now()}.pdf`)
        } catch (error) {
            alert('生成 PDF 失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.dialog} glass`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>分享你的测试结果</h3>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    <button 
                        className={`${styles.shareBtn} btn-premium`}
                        onClick={generateShareLink}
                        disabled={loading}
                    >
                        📎 生成分享链接
                    </button>

                    {shareLink && (
                        <div className={styles.linkBox}>
                            <input 
                                type="text" 
                                value={shareLink} 
                                readOnly 
                                className={styles.linkInput}
                            />
                        </div>
                    )}

                    <button 
                        className={`${styles.shareBtn} btn-premium`}
                        onClick={generateImage}
                        disabled={loading}
                    >
                        🖼️ 生成精美图片
                    </button>

                    <button 
                        className={`${styles.shareBtn} btn-premium`}
                        onClick={downloadPDF}
                        disabled={loading}
                    >
                        📄 下载 PDF 报告
                    </button>
                </div>
            </div>
        </div>
    )
}
