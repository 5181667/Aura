"use client"

import { useState } from 'react'
import { formatLastActive } from '@/lib/formatLastActive'
import styles from './friends.module.css'

export default function FriendSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/friends/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            const data = await res.json()
            setResults(data.users || [])
        } catch (error) {
            alert('搜索失败')
        } finally {
            setLoading(false)
        }
    }

    const handleSendRequest = async (userId: string) => {
        try {
            const res = await fetch('/api/friends/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiverId: userId })
            })
            
            if (res.ok) {
                setSentRequests(new Set([...sentRequests, userId]))
                alert('好友请求已发送！')
            } else {
                const data = await res.json()
                alert(data.message || '发送失败')
            }
        } catch (error) {
            alert('网络错误')
        }
    }

    return (
        <div className={styles.searchArea}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="输入邮箱或昵称搜索..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input-premium"
                />
                <button type="submit" className="btn-premium" disabled={loading}>
                    {loading ? '搜索中...' : '搜索'}
                </button>
            </form>

            {results.length > 0 && (
                <div className={styles.searchResults}>
                    {results.map((user) => (
                        <div key={user.id} className={styles.userCard}>
                            <div className={styles.avatar}>
                                {user.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className={styles.info}>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                                <span className={styles.status}>
                                    {formatLastActive(user.lastActiveAt)}
                                </span>
                            </div>
                            <button
                                className="btn-premium"
                                onClick={() => handleSendRequest(user.id)}
                                disabled={sentRequests.has(user.id)}
                            >
                                {sentRequests.has(user.id) ? '已发送' : '添加好友'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
