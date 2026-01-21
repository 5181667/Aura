"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatLastActive } from '@/lib/formatLastActive'
import {
    Search, CheckSquare, Square, Users, Ban, UserCheck,
    Trash2, Mail, Eye, ChevronLeft, ChevronRight, X,
    Shield, ShieldOff, MoreVertical, Filter, Download, Crown
} from 'lucide-react'
import styles from './users.module.css'

interface User {
    id: string
    name: string | null
    email: string | null
    role: string
    isPro: boolean
    isActive?: boolean
    lastActiveAt: string | null
    createdAt: string
    _count: {
        testResults: number
        friends: number
    }
}

interface UserDetailData {
    user: User & {
        image: string | null
        updatedAt: string
        testResults: {
            id: string
            score: string
            createdAt: string
            test: {
                id: string
                title: string
                type: string
            }
        }[]
        fullAnalysis: {
            id: string
            analyzedAt: string
            includedTests: string[]
        } | null
    }
    stats: {
        totalTests: number
        hasFullAnalysis: boolean
        lastTestAt: string | null
    }
}

const ITEMS_PER_PAGE = 15

export default function UserTable({ users: initialUsers }: { users: User[] }) {
    const router = useRouter()
    const [users, setUsers] = useState(initialUsers)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
    const [showUserDetail, setShowUserDetail] = useState<string | null>(null)
    const [userDetail, setUserDetail] = useState<UserDetailData | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [filterRole, setFilterRole] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailContent, setEmailContent] = useState('')

    // Toggle Pro Status
    const toggleProStatus = async (userId: string, isPro: boolean) => {
        setUpdatingUserId(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}/pro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPro }),
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, isPro } : u))
            } else {
                alert('更新失败')
            }
        } catch (error) {
            console.error(error)
            alert('操作出错')
        } finally {
            setUpdatingUserId(null)
        }
    }

    // 过滤用户
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesRole = filterRole === 'all' || user.role === filterRole
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && user.isActive !== false) ||
                (filterStatus === 'inactive' && user.isActive === false)

            return matchesSearch && matchesRole && matchesStatus
        })
    }, [users, searchQuery, filterRole, filterStatus])

    // 分页
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // 全选/取消全选当前页
    const toggleSelectAll = () => {
        const currentPageIds = paginatedUsers.map(u => u.id)
        const allSelected = currentPageIds.every(id => selectedUsers.has(id))

        if (allSelected) {
            const newSelected = new Set(selectedUsers)
            currentPageIds.forEach(id => newSelected.delete(id))
            setSelectedUsers(newSelected)
        } else {
            const newSelected = new Set(selectedUsers)
            currentPageIds.forEach(id => newSelected.add(id))
            setSelectedUsers(newSelected)
        }
    }

    // 切换单个用户选择
    const toggleSelect = (userId: string) => {
        const newSelected = new Set(selectedUsers)
        if (newSelected.has(userId)) {
            newSelected.delete(userId)
        } else {
            newSelected.add(userId)
        }
        setSelectedUsers(newSelected)
    }

    // 批量操作
    const handleBatchAction = async (action: string, data?: any) => {
        if (selectedUsers.size === 0) {
            alert('请先选择用户')
            return
        }

        const actionNames: Record<string, string> = {
            'activate': '启用',
            'deactivate': '禁用',
            'delete': '删除',
            'setRole': '修改角色'
        }

        if (!confirm(`确定要${actionNames[action] || action} ${selectedUsers.size} 个用户吗？`)) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/users/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userIds: Array.from(selectedUsers),
                    action,
                    data
                })
            })

            const result = await res.json()

            if (res.ok) {
                alert(result.message)
                setSelectedUsers(new Set())
                router.refresh()
            } else {
                alert(result.message || '操作失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setLoading(false)
        }
    }

    // 单个用户操作
    const handleSingleAction = async (userId: string, action: string, value?: any) => {
        setLoading(true)
        try {
            let endpoint = ''
            let method = 'POST'
            let body: any = {}

            switch (action) {
                case 'toggleStatus':
                    endpoint = '/api/admin/users/toggle-status'
                    body = { userId, isActive: value }
                    break
                case 'toggleRole':
                    endpoint = '/api/admin/users/role'
                    body = { userId, role: value }
                    break
                case 'delete':
                    endpoint = `/api/admin/users/delete?userId=${userId}`
                    method = 'DELETE'
                    break
            }

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(method !== 'DELETE' && { body: JSON.stringify(body) })
            })

            const result = await res.json()

            if (res.ok) {
                alert(result.message)
                router.refresh()
            } else {
                alert(result.message || '操作失败')
            }
        } catch (error) {
            alert('网络错误')
        } finally {
            setLoading(false)
        }
    }

    // 查看用户详情
    const viewUserDetail = async (userId: string) => {
        setShowUserDetail(userId)
        setDetailLoading(true)
        try {
            const res = await fetch(`/api/admin/users/${userId}`)
            if (res.ok) {
                const data = await res.json()
                setUserDetail(data)
            } else {
                alert('获取用户详情失败')
                setShowUserDetail(null)
            }
        } catch (error) {
            alert('网络错误')
            setShowUserDetail(null)
        } finally {
            setDetailLoading(false)
        }
    }

    // 发送邮件（模拟）
    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailContent.trim()) {
            alert('请填写邮件主题和内容')
            return
        }

        const targetEmails = selectedUsers.size > 0
            ? users.filter(u => selectedUsers.has(u.id) && u.email).map(u => u.email)
            : showUserDetail
                ? [userDetail?.user.email]
                : []

        if (targetEmails.length === 0) {
            alert('没有有效的邮箱地址')
            return
        }

        // 这里可以集成实际的邮件发送服务
        alert(`邮件将发送到 ${targetEmails.length} 个用户:\n主题: ${emailSubject}\n\n(注: 需要配置邮件服务)`)
        setShowEmailModal(false)
        setEmailSubject('')
        setEmailContent('')
    }

    // 导出用户数据
    const exportUsers = () => {
        const dataToExport = selectedUsers.size > 0
            ? users.filter(u => selectedUsers.has(u.id))
            : filteredUsers

        const csv = [
            ['ID', '用户名', '邮箱', '角色', '状态', '测试次数', '好友数', '最后活跃', '注册时间'].join(','),
            ...dataToExport.map(u => [
                u.id,
                u.name || '',
                u.email || '',
                u.role,
                u.isActive !== false ? '正常' : '已禁用',
                u._count.testResults,
                u._count.friends,
                u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleString('zh-CN') : '',
                new Date(u.createdAt).toLocaleString('zh-CN')
            ].join(','))
        ].join('\n')

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `用户数据_${new Date().toLocaleDateString('zh-CN')}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const isAllCurrentPageSelected = paginatedUsers.length > 0 &&
        paginatedUsers.every(u => selectedUsers.has(u.id))

    return (
        <div className={styles.container}>
            {/* 工具栏 */}
            <div className={styles.toolbar}>
                <div className={styles.searchSection}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="搜索用户（姓名或邮箱）..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    <div className={styles.filters}>
                        <select
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value)
                                setCurrentPage(1)
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="all">全部角色</option>
                            <option value="USER">普通用户</option>
                            <option value="ADMIN">管理员</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value)
                                setCurrentPage(1)
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="all">全部状态</option>
                            <option value="active">正常</option>
                            <option value="inactive">已禁用</option>
                        </select>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.actionBtn}
                        onClick={exportUsers}
                        title="导出数据"
                    >
                        <Download size={16} />
                        导出
                    </button>
                </div>
            </div>

            {/* 批量操作栏 */}
            {selectedUsers.size > 0 && (
                <div className={styles.batchBar}>
                    <span className={styles.selectedCount}>
                        <Users size={16} />
                        已选择 {selectedUsers.size} 个用户
                    </span>
                    <div className={styles.batchActions}>
                        <button
                            onClick={() => handleBatchAction('activate')}
                            className={`${styles.batchBtn} ${styles.success}`}
                            disabled={!!loading}
                        >
                            <UserCheck size={16} />
                            批量启用
                        </button>
                        <button
                            onClick={() => handleBatchAction('deactivate')}
                            className={`${styles.batchBtn} ${styles.warning}`}
                            disabled={!!loading}
                        >
                            <Ban size={16} />
                            批量禁用
                        </button>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className={`${styles.batchBtn} ${styles.info}`}
                            disabled={!!loading}
                        >
                            <Mail size={16} />
                            发送邮件
                        </button>
                        <button
                            onClick={() => handleBatchAction('delete')}
                            className={`${styles.batchBtn} ${styles.danger}`}
                            disabled={!!loading}
                        >
                            <Trash2 size={16} />
                            批量删除
                        </button>
                        <button
                            onClick={() => setSelectedUsers(new Set())}
                            className={styles.batchBtn}
                        >
                            <X size={16} />
                            取消选择
                        </button>
                    </div>
                </div>
            )}

            {/* 用户表格 */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.checkboxCol}>
                                <button
                                    onClick={toggleSelectAll}
                                    className={styles.checkboxBtn}
                                >
                                    {isAllCurrentPageSelected ? (
                                        <CheckSquare size={18} />
                                    ) : (
                                        <Square size={18} />
                                    )}
                                </button>
                            </th>
                            <th>用户</th>
                            <th>角色</th>
                            <th>状态</th>
                            <th>测试次数</th>
                            <th>好友数</th>
                            <th>最后活跃</th>
                            <th>注册时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className={`${selectedUsers.has(user.id) ? styles.selected : ''} ${user.isActive === false ? styles.disabled : ''}`}
                            >
                                <td>
                                    <button
                                        onClick={() => toggleSelect(user.id)}
                                        className={styles.checkboxBtn}
                                    >
                                        {selectedUsers.has(user.id) ? (
                                            <CheckSquare size={18} className={styles.checked} />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </td>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className={styles.userMeta}>
                                            <span className={styles.userName}>{user.name || '未命名'}</span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${user.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeUser}`}>
                                        {user.role === 'ADMIN' ? (
                                            <><Shield size={12} /> 管理员</>
                                        ) : (
                                            <><Users size={12} /> 用户</>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`${styles.badge} ${user.isPro ? styles.pro : styles.basic}`}
                                        onClick={() => toggleProStatus(user.id, !user.isPro)}
                                        disabled={updatingUserId === user.id}
                                        style={{ cursor: 'pointer', border: 'none' }}
                                    >
                                        {updatingUserId === user.id ? (
                                            <span className={styles.loadingDot}>...</span>
                                        ) : (
                                            <>
                                                {user.isPro ? <Crown size={12} fill="#FFD700" color="#FFD700" /> : <Crown size={12} />}
                                                {user.isPro ? 'PRO' : '普通'}
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td>
                                    <span className={`${styles.status} ${user.isActive !== false ? styles.statusActive : styles.statusInactive}`}>
                                        {user.isActive !== false ? '正常' : '已禁用'}
                                    </span>
                                </td>
                                <td className={styles.timeCell}>
                                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                                </td>
                                <td className={styles.timeCell}>
                                    {formatLastActive(user.lastActiveAt)}
                                </td>
                                <td>
                                    <div className={styles.stats}>
                                        <span title="测试次数">📝 {user._count?.testResults || 0}</span>
                                        <span title="好友数量">👥 {user._count?.friends || 0}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button
                                            onClick={() => viewUserDetail(user.id)}
                                            className={styles.iconBtn}
                                            title="查看详情"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleSingleAction(
                                                user.id,
                                                'toggleStatus',
                                                user.isActive === false
                                            )}
                                            className={styles.iconBtn}
                                            title={user.isActive !== false ? '禁用账号' : '启用账号'}
                                            disabled={loading}
                                        >
                                            {user.isActive !== false ? <Ban size={16} /> : <UserCheck size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleSingleAction(
                                                user.id,
                                                'toggleRole',
                                                user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                                            )}
                                            className={styles.iconBtn}
                                            title={user.role === 'ADMIN' ? '降为用户' : '升为管理员'}
                                            disabled={loading}
                                        >
                                            {user.role === 'ADMIN' ? <ShieldOff size={16} /> : <Shield size={16} />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('确定要删除此用户吗？此操作不可恢复！')) {
                                                    handleSingleAction(user.id, 'delete')
                                                }
                                            }}
                                            className={`${styles.iconBtn} ${styles.dangerBtn}`}
                                            title="删除用户"
                                            disabled={loading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        共 {filteredUsers.length} 个用户，第 {currentPage} / {totalPages} 页
                    </span>
                    <div className={styles.pageButtons}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={styles.pageBtn}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page: number
                            if (totalPages <= 5) {
                                page = i + 1
                            } else if (currentPage <= 3) {
                                page = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i
                            } else {
                                page = currentPage - 2 + i
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                                >
                                    {page}
                                </button>
                            )
                        })}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={styles.pageBtn}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* 用户详情弹窗 */}
            {showUserDetail && (
                <div className={styles.modal} onClick={() => setShowUserDetail(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>用户详情</h3>
                            <button onClick={() => setShowUserDetail(null)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className={styles.modalLoading}>加载中...</div>
                        ) : userDetail ? (
                            <div className={styles.modalBody}>
                                <div className={styles.detailHeader}>
                                    <div className={styles.detailAvatar}>
                                        {userDetail.user.image ? (
                                            <img src={userDetail.user.image} alt="" />
                                        ) : (
                                            userDetail.user.name?.[0]?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className={styles.detailInfo}>
                                        <h4>{userDetail.user.name || '未命名'}</h4>
                                        <p>{userDetail.user.email}</p>
                                        <div className={styles.detailBadges}>
                                            <span className={`${styles.badge} ${userDetail.user.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeUser}`}>
                                                {userDetail.user.role === 'ADMIN' ? '管理员' : '用户'}
                                            </span>
                                            <span className={`${styles.status} ${userDetail.user.isActive !== false ? styles.statusActive : styles.statusInactive}`}>
                                                {userDetail.user.isActive !== false ? '正常' : '已禁用'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.detailStats}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{userDetail.stats.totalTests}</span>
                                        <span className={styles.statLabel}>测试次数</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{userDetail.stats.hasFullAnalysis ? '是' : '否'}</span>
                                        <span className={styles.statLabel}>综合分析</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>
                                            {userDetail.stats.lastTestAt
                                                ? new Date(userDetail.stats.lastTestAt).toLocaleDateString('zh-CN')
                                                : '-'}
                                        </span>
                                        <span className={styles.statLabel}>最后测试</span>
                                    </div>
                                </div>

                                <div className={styles.detailSection}>
                                    <h5>账号信息</h5>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>用户ID</span>
                                            <span className={styles.infoValue}>{userDetail.user.id}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>注册时间</span>
                                            <span className={styles.infoValue}>
                                                {new Date(userDetail.user.createdAt).toLocaleString('zh-CN')}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>最后活跃</span>
                                            <span className={styles.infoValue}>
                                                {formatLastActive(userDetail.user.lastActiveAt)}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>更新时间</span>
                                            <span className={styles.infoValue}>
                                                {new Date(userDetail.user.updatedAt).toLocaleString('zh-CN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {userDetail.user.testResults.length > 0 && (
                                    <div className={styles.detailSection}>
                                        <h5>最近测试记录</h5>
                                        <div className={styles.testList}>
                                            {userDetail.user.testResults.slice(0, 5).map(result => (
                                                <div key={result.id} className={styles.testItem}>
                                                    <span className={styles.testTitle}>{result.test.title}</span>
                                                    <span className={styles.testType}>{result.test.type}</span>
                                                    <span className={styles.testScore}>{result.score}</span>
                                                    <span className={styles.testTime}>
                                                        {new Date(result.createdAt).toLocaleDateString('zh-CN')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.modalActions}>
                                    <button
                                        onClick={() => {
                                            setShowEmailModal(true)
                                        }}
                                        className={`${styles.modalBtn} ${styles.primary}`}
                                    >
                                        <Mail size={16} />
                                        发送邮件
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleSingleAction(
                                                userDetail.user.id,
                                                'toggleStatus',
                                                userDetail.user.isActive === false
                                            )
                                            setShowUserDetail(null)
                                        }}
                                        className={`${styles.modalBtn} ${userDetail.user.isActive !== false ? styles.warning : styles.success}`}
                                    >
                                        {userDetail.user.isActive !== false ? <Ban size={16} /> : <UserCheck size={16} />}
                                        {userDetail.user.isActive !== false ? '禁用账号' : '启用账号'}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* 发送邮件弹窗 */}
            {showEmailModal && (
                <div className={styles.modal} onClick={() => setShowEmailModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>发送邮件</h3>
                            <button onClick={() => setShowEmailModal(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.emailInfo}>
                                <Mail size={16} />
                                将发送到 {selectedUsers.size > 0 ? selectedUsers.size : 1} 个用户
                            </div>
                            <div className={styles.formGroup}>
                                <label>邮件主题</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="请输入邮件主题..."
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>邮件内容</label>
                                <textarea
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    placeholder="请输入邮件内容..."
                                    rows={6}
                                    className={styles.formTextarea}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className={styles.modalBtn}
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    className={`${styles.modalBtn} ${styles.primary}`}
                                >
                                    <Mail size={16} />
                                    发送邮件
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
