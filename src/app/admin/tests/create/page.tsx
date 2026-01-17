"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../admin.module.css'

export default function CreateTestPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("MBTI")
    const [category, setCategory] = useState("personality")
    const [creating, setCreating] = useState(false)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)

        try {
            const res = await fetch('/api/admin/tests/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    category,
                    questions: []
                })
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/admin/tests/${data.testId}/edit`)
            } else {
                alert('创建失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div>
            <header className={styles.header}>
                <h1>创建新测试</h1>
                <p>填写基本信息，然后添加题目</p>
            </header>

            <section className={`${styles.section} glass`} style={{ maxWidth: '600px' }}>
                <form onSubmit={handleCreate}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                            测试标题
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-premium"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                            测试描述
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-premium"
                            rows={4}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                                类型
                            </label>
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="input-premium"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                                分类
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input-premium"
                            >
                                <option value="personality">性格测试</option>
                                <option value="emotion">情感测试</option>
                                <option value="career">职业测试</option>
                                <option value="intelligence">智力测试</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-premium"
                            style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="btn-premium"
                            style={{ flex: 1 }}
                            disabled={creating}
                        >
                            {creating ? '创建中...' : '创建并编辑'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
