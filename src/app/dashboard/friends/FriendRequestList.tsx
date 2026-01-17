"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './friends.module.css'

export default function FriendRequestList({ requests }: { requests: any[] }) {
    const router = useRouter()
    const [processing, setProcessing] = useState<string | null>(null)

    const handleAccept = async (requestId: string) => {
        setProcessing(requestId)
        try {
            const res = await fetch('/api/friends/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId })
            })

            if (res.ok) {
                alert('已接受好友请求！')
                router.refresh()
            } else {
                alert('操作失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (requestId: string) => {
        setProcessing(requestId)
        try {
            const res = await fetch('/api/friends/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId })
            })

            if (res.ok) {
                alert('已拒绝好友请求')
                router.refresh()
            } else {
                alert('操作失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className={styles.requestList}>
            {requests.map((request) => (
                <div key={request.id} className={styles.requestCard}>
                    <div className={styles.avatar}>
                        {request.sender.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className={styles.info}>
                        <h3>{request.sender.name}</h3>
                        <p>{request.sender.email}</p>
                    </div>
                    <div className={styles.actions}>
                        <button
                            className="btn-premium"
                            onClick={() => handleAccept(request.id)}
                            disabled={processing === request.id}
                        >
                            接受
                        </button>
                        <button
                            className="btn-premium"
                            onClick={() => handleReject(request.id)}
                            disabled={processing === request.id}
                            style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                        >
                            拒绝
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
