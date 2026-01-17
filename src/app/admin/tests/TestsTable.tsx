"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../admin.module.css'

export default function TestsTable({ tests }: { tests: any[] }) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTests = tests.filter(test =>
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const togglePublish = async (testId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/tests/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, isPublished: !currentStatus })
            })

            if (res.ok) {
                alert(currentStatus ? '已下架' : '已发布')
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
                    placeholder="搜索测试（标题或类型）..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-premium"
                    style={{ width: '100%', maxWidth: '400px' }}
                />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>类型</th>
                        <th>分类</th>
                        <th>完成次数</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTests.map((test) => (
                        <tr key={test.id}>
                            <td style={{ fontWeight: 600 }}>{test.title}</td>
                            <td>{test.type}</td>
                            <td>{test.category}</td>
                            <td>{test._count.results}</td>
                            <td>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    background: test.isPublished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    border: `1px solid ${test.isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    color: test.isPublished ? '#10b981' : '#ef4444'
                                }}>
                                    {test.isPublished ? '已发布' : '已下架'}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {new Date(test.createdAt).toLocaleDateString('zh-CN')}
                            </td>
                            <td>
                                <div className={styles.actionButtons}>
                                    <Link href={`/admin/tests/${test.id}/edit`}>
                                        <button>编辑</button>
                                    </Link>
                                    <button onClick={() => togglePublish(test.id, test.isPublished)}>
                                        {test.isPublished ? '下架' : '发布'}
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
