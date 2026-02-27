"use client"

import { useState, useEffect, useCallback } from 'react'
import {
    Ticket, PlusCircle, Trash2, Copy, CheckSquare, Square,
    ChevronLeft, ChevronRight, Loader2, CheckCircle, X, Package
} from 'lucide-react'
import styles from './redemption-codes.module.css'

// 测试类型配置
const TEST_TYPE_OPTIONS = [
    { value: 'MBTI', label: 'MBTI', color: '#8b5cf6' },
    { value: 'BIG_FIVE', label: '大五人格', color: '#06b6d4' },
    { value: 'DISC', label: 'DISC', color: '#10b981' },
    { value: 'EQ', label: '情商', color: '#f59e0b' },
    { value: 'HOLLAND', label: '霍兰德', color: '#ec4899' },
    { value: 'ENNEAGRAM', label: '九型人格', color: '#6366f1' },
    { value: 'ALL', label: '通用（全部类型）', color: '#94a3b8' },
]

const typeLabel = (type: string) => TEST_TYPE_OPTIONS.find(t => t.value === type)?.label || type
const typeColor = (type: string) => TEST_TYPE_OPTIONS.find(t => t.value === type)?.color || '#94a3b8'

interface RedemptionCode {
    id: string
    code: string
    testType: string
    batchName: string | null
    isUsed: boolean
    usedBy: string | null
    usedAt: string | null
    usedForTestResultId: string | null
    expiresAt: string | null
    createdAt: string
    user: {
        id: string
        name: string | null
        email: string | null
    } | null
}

interface Stats {
    total: number
    used: number
    unused: number
    expired: number
}

export default function RedemptionCodesPage() {
    const [codes, setCodes] = useState<RedemptionCode[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats>({ total: 0, used: 0, unused: 0, expired: 0 })
    const [batches, setBatches] = useState<string[]>([])

    // 筛选
    const [statusFilter, setStatusFilter] = useState('all')
    const [batchFilter, setBatchFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')

    // 分页
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // 选择
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // 生成表单
    const [generateCount, setGenerateCount] = useState(10)
    const [generateBatch, setGenerateBatch] = useState('')
    const [generateExpiry, setGenerateExpiry] = useState('')
    const [generateType, setGenerateType] = useState('MBTI')
    const [generating, setGenerating] = useState(false)

    // 生成结果弹窗
    const [showResult, setShowResult] = useState(false)
    const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

    // 复制状态
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // 加载数据
    const fetchCodes = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '20',
                status: statusFilter,
            })
            if (batchFilter) params.set('batchName', batchFilter)
            if (typeFilter) params.set('testType', typeFilter)

            const res = await fetch(`/api/admin/redemption-codes?${params}`)
            const data = await res.json()

            if (res.ok) {
                setCodes(data.codes)
                setTotal(data.total)
                setTotalPages(data.totalPages)
                setStats(data.stats)
                setBatches(data.batches)
            }
        } catch (err) {
            console.error('Failed to fetch codes:', err)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter, batchFilter, typeFilter])

    useEffect(() => {
        fetchCodes()
    }, [fetchCodes])

    // 批量生成
    const handleGenerate = async () => {
        if (generateCount < 1 || generateCount > 500) return
        setGenerating(true)
        try {
            const res = await fetch('/api/admin/redemption-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    count: generateCount,
                    testType: generateType,
                    batchName: generateBatch || null,
                    expiresAt: generateExpiry || null,
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setGeneratedCodes(data.codes)
                setShowResult(true)
                fetchCodes()
            } else {
                alert(data.message || '生成失败')
            }
        } catch (err) {
            alert('生成失败')
        } finally {
            setGenerating(false)
        }
    }

    // 批量删除
    const handleBatchDelete = async () => {
        if (selectedIds.size === 0) return
        if (!confirm(`确定删除 ${selectedIds.size} 个兑换码？此操作不可恢复。`)) return

        try {
            const res = await fetch('/api/admin/redemption-codes/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setSelectedIds(new Set())
                fetchCodes()
            } else {
                alert(data.message || '删除失败')
            }
        } catch (err) {
            alert('删除失败')
        }
    }

    // 单个删除
    const handleDelete = async (id: string) => {
        if (!confirm('确定删除此兑换码？')) return
        try {
            const res = await fetch('/api/admin/redemption-codes/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] })
            })
            if (res.ok) fetchCodes()
        } catch (err) {
            alert('删除失败')
        }
    }

    // 复制单个兑换码
    const copyCode = async (code: string, id: string) => {
        await navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    // 批量复制选中的兑换码
    const copySelectedCodes = async () => {
        const selectedCodes = codes
            .filter(c => selectedIds.has(c.id))
            .map(c => c.code)
        await navigator.clipboard.writeText(selectedCodes.join('\n'))
        alert(`已复制 ${selectedCodes.length} 个兑换码`)
    }

    // 复制生成结果中的所有兑换码
    const copyAllGeneratedCodes = async () => {
        await navigator.clipboard.writeText(generatedCodes.join('\n'))
        alert(`已复制 ${generatedCodes.length} 个兑换码`)
    }

    // 全选/取消全选
    const toggleSelectAll = () => {
        if (selectedIds.size === codes.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(codes.map(c => c.id)))
        }
    }

    // 切换选择
    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        setSelectedIds(next)
    }

    // 获取状态
    const getCodeStatus = (code: RedemptionCode) => {
        if (code.isUsed) return 'used'
        if (code.expiresAt && new Date(code.expiresAt) < new Date()) return 'expired'
        return 'unused'
    }

    const statusBadgeClass = (status: string) => {
        switch (status) {
            case 'used': return styles.badgeUsed
            case 'expired': return styles.badgeExpired
            default: return styles.badgeUnused
        }
    }

    const statusLabel = (status: string) => {
        switch (status) {
            case 'used': return '已使用'
            case 'expired': return '已过期'
            default: return '可使用'
        }
    }

    return (
        <div className={styles.container}>
            {/* 页面标题 */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <Ticket size={28} />
                    <h1>兑换码管理</h1>
                </div>
            </div>

            {/* 统计概览 */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.total}</span>
                    <span className={styles.statLabel}>总数量</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.unused}</span>
                    <span className={styles.statLabel}>可使用</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.used}</span>
                    <span className={styles.statLabel}>已使用</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{stats.expired}</span>
                    <span className={styles.statLabel}>已过期</span>
                </div>
            </div>

            {/* 批量生成 */}
            <div className={styles.generateSection}>
                <div className={styles.generateTitle}>
                    <PlusCircle size={20} />
                    <span>批量生成兑换码</span>
                </div>
                <div className={styles.generateForm}>
                    <div className={styles.formGroup}>
                        <label>测试类型</label>
                        <select
                            className={styles.formInput}
                            value={generateType}
                            onChange={e => setGenerateType(e.target.value)}
                        >
                            {TEST_TYPE_OPTIONS.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>生成数量</label>
                        <input
                            type="number"
                            className={styles.formInput}
                            value={generateCount}
                            onChange={e => setGenerateCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                            min={1}
                            max={500}
                            placeholder="1-500"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>批次名称（可选）</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={generateBatch}
                            onChange={e => setGenerateBatch(e.target.value)}
                            placeholder="如：2026年2月活动"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>过期时间（可选）</label>
                        <input
                            type="datetime-local"
                            className={styles.formInput}
                            value={generateExpiry}
                            onChange={e => setGenerateExpiry(e.target.value)}
                        />
                    </div>
                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                生成中...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={18} />
                                生成 {generateCount} 个
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 筛选工具栏 */}
            <div className={styles.toolbar}>
                <div className={styles.filters}>
                    <select
                        className={styles.filterSelect}
                        value={typeFilter}
                        onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
                    >
                        <option value="">全部类型</option>
                        {TEST_TYPE_OPTIONS.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <select
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                    >
                        <option value="all">全部状态</option>
                        <option value="unused">可使用</option>
                        <option value="used">已使用</option>
                        <option value="expired">已过期</option>
                    </select>
                    <select
                        className={styles.filterSelect}
                        value={batchFilter}
                        onChange={e => { setBatchFilter(e.target.value); setPage(1) }}
                    >
                        <option value="">全部批次</option>
                        {batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 批量操作栏 */}
            {selectedIds.size > 0 && (
                <div className={styles.batchBar}>
                    <span className={styles.selectedCount}>
                        已选择 {selectedIds.size} 项
                    </span>
                    <div className={styles.batchActions}>
                        <button className={`${styles.batchBtn} ${styles.copy}`} onClick={copySelectedCodes}>
                            <Copy size={14} />
                            复制选中
                        </button>
                        <button className={`${styles.batchBtn} ${styles.danger}`} onClick={handleBatchDelete}>
                            <Trash2 size={14} />
                            批量删除
                        </button>
                    </div>
                </div>
            )}

            {/* 表格 */}
            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={36} className={styles.spinner} />
                    <p>加载中...</p>
                </div>
            ) : codes.length === 0 ? (
                <div className={styles.emptyState}>
                    <Package size={48} />
                    <h3>暂无兑换码</h3>
                    <p>使用上方表单批量生成兑换码</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.checkboxCol}>
                                    <button className={styles.checkboxBtn} onClick={toggleSelectAll}>
                                        {selectedIds.size === codes.length ? (
                                            <CheckSquare size={18} className={styles.checked} />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </th>
                                <th>兑换码</th>
                                <th>适用类型</th>
                                <th>批次</th>
                                <th>状态</th>
                                <th>使用者</th>
                                <th>使用时间</th>
                                <th>过期时间</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.map(code => {
                                const codeStatus = getCodeStatus(code)
                                const isSelected = selectedIds.has(code.id)
                                return (
                                    <tr
                                        key={code.id}
                                        className={isSelected ? styles.selected : ''}
                                    >
                                        <td className={styles.checkboxCol}>
                                            <button
                                                className={styles.checkboxBtn}
                                                onClick={() => toggleSelect(code.id)}
                                            >
                                                {isSelected ? (
                                                    <CheckSquare size={18} className={styles.checked} />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            <div className={styles.codeCell}>
                                                <span className={styles.codeText}>{code.code}</span>
                                                <button
                                                    className={`${styles.copyBtn} ${copiedId === code.id ? styles.copied : ''}`}
                                                    onClick={() => copyCode(code.code, code.id)}
                                                    title="复制"
                                                >
                                                    {copiedId === code.id ? (
                                                        <CheckCircle size={14} />
                                                    ) : (
                                                        <Copy size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={styles.typeTag}
                                                style={{ color: typeColor(code.testType), borderColor: typeColor(code.testType) }}
                                            >
                                                {typeLabel(code.testType)}
                                            </span>
                                        </td>
                                        <td>
                                            {code.batchName ? (
                                                <span className={styles.batchTag}>{code.batchName}</span>
                                            ) : (
                                                <span className={styles.noBatch}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${statusBadgeClass(codeStatus)}`}>
                                                {statusLabel(codeStatus)}
                                            </span>
                                        </td>
                                        <td>
                                            {code.user ? (
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{code.user.name || '未命名'}</span>
                                                    <span className={styles.userEmail}>{code.user.email}</span>
                                                </div>
                                            ) : (
                                                <span className={styles.noBatch}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={styles.timeCell}>
                                                {code.usedAt
                                                    ? new Date(code.usedAt).toLocaleString('zh-CN')
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.timeCell}>
                                                {code.expiresAt
                                                    ? new Date(code.expiresAt).toLocaleString('zh-CN')
                                                    : '永久有效'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.timeCell}>
                                                {new Date(code.createdAt).toLocaleString('zh-CN')}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.iconBtn}
                                                onClick={() => handleDelete(code.id)}
                                                title="删除"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        共 {total} 条，第 {page}/{totalPages} 页
                    </span>
                    <div className={styles.pageButtons}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (page <= 3) {
                                pageNum = i + 1
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = page - 2 + i
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`${styles.pageBtn} ${page === pageNum ? styles.active : ''}`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* 生成结果弹窗 */}
            {showResult && (
                <div className={styles.resultModal}>
                    <div className={styles.resultModalContent}>
                        <div className={styles.resultHeader}>
                            <h3>
                                <CheckCircle size={20} style={{ color: '#10b981' }} />
                                生成成功
                            </h3>
                            <button className={styles.closeBtn} onClick={() => setShowResult(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.resultBody}>
                            <div className={styles.resultInfo}>
                                <CheckCircle size={18} />
                                <span>成功生成 {generatedCodes.length} 个兑换码</span>
                            </div>
                            <div className={styles.codesList}>
                                {generatedCodes.map(code => (
                                    <span key={code} className={styles.codeItem}>{code}</span>
                                ))}
                            </div>
                            <div className={styles.resultActions}>
                                <button
                                    className={styles.resultBtn}
                                    onClick={() => setShowResult(false)}
                                >
                                    关闭
                                </button>
                                <button
                                    className={`${styles.resultBtn} ${styles.primary}`}
                                    onClick={copyAllGeneratedCodes}
                                >
                                    <Copy size={16} />
                                    一键复制全部
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
