"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import QuestionCard from './QuestionCard'
import QuestionPreview from './QuestionPreview'
import styles from './editor.module.css'

interface Question {
    id: string
    question: string
    options: Array<{
        text: string
        score: {
            dimension: string
            value: number
        }
    }>
}

export default function TestEditor({ test }: { test: any }) {
    const router = useRouter()
    const [title, setTitle] = useState(test.title)
    const [description, setDescription] = useState(test.description)
    const [type, setType] = useState(test.type)
    const [category, setCategory] = useState(test.category)
    const [questions, setQuestions] = useState<Question[]>(test.questions || [])
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setQuestions((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            question: '新问题',
            options: [
                { text: '选项 A', score: { dimension: 'EI', value: 1 } },
                { text: '选项 B', score: { dimension: 'EI', value: -1 } }
            ]
        }
        setQuestions([...questions, newQuestion])
    }

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
    }

    const deleteQuestion = (id: string) => {
        if (confirm('确定删除这个问题吗？')) {
            setQuestions(questions.filter(q => q.id !== id))
        }
    }

    const duplicateQuestion = (id: string) => {
        const question = questions.find(q => q.id === id)
        if (question) {
            const newQuestion = {
                ...question,
                id: `q-${Date.now()}`
            }
            setQuestions([...questions, newQuestion])
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/tests/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: test.id,
                    title,
                    description,
                    type,
                    category,
                    questions
                })
            })

            if (res.ok) {
                alert('保存成功！')
                router.push('/admin/tests')
            } else {
                alert('保存失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.editorContainer}>
            <header className={styles.editorHeader}>
                <div>
                    <h1>编辑测试</h1>
                    <p>拖拽排序，实时预览</p>
                </div>
                <div className={styles.headerActions}>
                    <button 
                        onClick={() => router.back()} 
                        className="btn-premium"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="btn-premium"
                        disabled={saving}
                    >
                        {saving ? '保存中...' : '保存更改'}
                    </button>
                </div>
            </header>

            <div className={styles.editorLayout}>
                <div className={styles.editorPanel}>
                    <section className={`${styles.metaSection} glass`}>
                        <h3>基本信息</h3>
                        <div className={styles.formGroup}>
                            <label>测试标题</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-premium"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>测试描述</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-premium"
                                rows={3}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>类型</label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="input-premium"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>分类</label>
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
                    </section>

                    <section className={`${styles.questionsSection} glass`}>
                        <div className={styles.sectionHeader}>
                            <h3>题目列表 ({questions.length})</h3>
                            <button onClick={addQuestion} className="btn-premium">
                                + 添加题目
                            </button>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={questions.map(q => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {questions.map((question, index) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        index={index}
                                        onUpdate={updateQuestion}
                                        onDelete={deleteQuestion}
                                        onDuplicate={duplicateQuestion}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {questions.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>还没有题目，点击上方按钮添加第一个题目</p>
                            </div>
                        )}
                    </section>
                </div>

                <div className={styles.previewPanel}>
                    <div className={`${styles.previewSticky} glass`}>
                        <h3>实时预览</h3>
                        <QuestionPreview
                            title={title}
                            description={description}
                            questions={questions}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
