"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatLastActive } from '@/lib/formatLastActive'
import styles from '../admin.module.css'

export default function UserTable({ users }: { users: any[] }) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
        
        if (!confirm(`确定要将用户角色改为 ${newRole} 吗？`)) {
            return
        }

        try {
            const res = await fetch('/api/admin/users/role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            })

            if (res.ok) {
                alert('角色已更新')
                router.refresh()
            } else {
                alert('操作失败')
            }
        } catch (error) {
            alert('网络错误')
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="搜索用户（姓名或邮箱）..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-premium"
                    style={{ width: '100%', maxWidth: '400px' }}
                />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>邮箱</th>
                        <th>角色</th>
                        <th>测试次数</th>
                        <th>好友数</th>
                        <th>最后活跃</th>
                        <th>注册时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    background: user.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                    border: `1px solid ${user.role === 'ADMIN' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                                    color: user.role === 'ADMIN' ? '#ec4899' : '#8b5cf6'
                                }}>
                                    {user.role}
                                </span>
                            </td>
                            <td>{user._count.testResults}</td>
                            <td>{user._count.friends}</td>
                            <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {formatLastActive(user.lastActiveAt)}
                            </td>
                            <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                            </td>
                            <td>
                                <div className={styles.actionButtons}>
                                    <button onClick={() => toggleRole(user.id, user.role)}>
                                        切换角色
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
