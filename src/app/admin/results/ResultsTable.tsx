"use client"

import { useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { Search, Filter, ChevronLeft, ChevronRight, MapPin, Loader2 } from "lucide-react"
import styles from "./results.module.css"
import adminStyles from "../admin.module.css"

interface IPLocation {
    country?: string
    regionName?: string
    city?: string
    isp?: string
    lat?: number
    lon?: number
}

interface ResultRow {
    id: string
    score: string
    createdAt: string | Date
    aiAnalyzedAt: string | Date | null
    ipAddress: string | null
    user: {
        id: string
        name: string | null
        email: string | null
    } | null
    test: {
        title: string
        type: string
    }
    premiumReport: {
        paymentStatus: string
    } | null
}

const ITEMS_PER_PAGE = 20

function IPCell({ ip }: { ip: string | null }) {
    const [location, setLocation] = useState<IPLocation | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(false)

    const lookup = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!ip || loading) return
        if (location) {
            setExpanded(v => !v)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/ip-location?ip=${encodeURIComponent(ip)}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setLocation(data)
            setExpanded(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "解析失败")
        } finally {
            setLoading(false)
        }
    }, [ip, loading, location])

    if (!ip) {
        return <span className={styles.ipEmpty}>—</span>
    }

    return (
        <div className={styles.ipCell}>
            <div className={styles.ipRow}>
                <code className={styles.ipCode}>{ip}</code>
                <button
                    className={styles.ipLookupBtn}
                    onClick={lookup}
                    title="解析物理地址"
                    disabled={loading}
                >
                    {loading
                        ? <Loader2 size={12} className={styles.spinning} />
                        : <MapPin size={12} />
                    }
                </button>
            </div>
            {expanded && location && (
                <div className={styles.ipLocation}>
                    <span className={styles.ipLocationText}>
                        {[location.country, location.regionName, location.city].filter(Boolean).join(" · ")}
                    </span>
                    {location.isp && (
                        <span className={styles.ipIsp}>{location.isp}</span>
                    )}
                </div>
            )}
            {error && (
                <span className={styles.ipError}>{error}</span>
            )}
        </div>
    )
}

export default function ResultsTable({ results }: { results: ResultRow[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterUser, setFilterUser] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)

    const testTypes = useMemo(() => {
        const types = new Set(results.map(r => r.test.type))
        return Array.from(types)
    }, [results])

    const filteredResults = useMemo(() => {
        return results.filter(result => {
            const keyword = searchQuery.toLowerCase()
            const userName = result.user?.name?.toLowerCase() || ""
            const userEmail = result.user?.email?.toLowerCase() || ""
            const testTitle = result.test.title.toLowerCase()
            const score = result.score.toLowerCase()
            const ip = result.ipAddress?.toLowerCase() || ""

            const matchesSearch = !keyword ||
                userName.includes(keyword) ||
                userEmail.includes(keyword) ||
                testTitle.includes(keyword) ||
                score.includes(keyword) ||
                ip.includes(keyword)

            const matchesType = filterType === "all" || result.test.type === filterType
            const matchesUser = filterUser === "all" ||
                (filterUser === "guest" && !result.user) ||
                (filterUser === "registered" && !!result.user)

            return matchesSearch && matchesType && matchesUser
        })
    }, [results, searchQuery, filterType, filterUser])

    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.searchSection}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="搜索用户、测试标题、结果或IP..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.filterItem}>
                            <Filter size={16} />
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="all">全部类型</option>
                                {testTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <select
                            value={filterUser}
                            onChange={(e) => {
                                setFilterUser(e.target.value)
                                setCurrentPage(1)
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="all">全部用户</option>
                            <option value="registered">注册用户</option>
                            <option value="guest">游客</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={adminStyles.table}>
                    <thead>
                        <tr>
                            <th>用户</th>
                            <th>测试</th>
                            <th>结果</th>
                            <th>IP地址</th>
                            <th>AI分析</th>
                            <th>高级报告</th>
                            <th>完成时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedResults.map(result => (
                            <tr key={result.id}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {result.user?.name?.[0]?.toUpperCase() || "客"}
                                        </div>
                                        <div className={styles.userMeta}>
                                            <span className={styles.userName}>
                                                {result.user?.name || "游客"}
                                            </span>
                                            <span className={styles.userEmail}>
                                                {result.user?.email || "未绑定邮箱"}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.testInfo}>
                                        <span className={styles.testTitle}>{result.test.title}</span>
                                        <span className={styles.badge}>{result.test.type}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.score}>{result.score}</span>
                                </td>
                                <td>
                                    <IPCell ip={result.ipAddress} />
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${result.aiAnalyzedAt ? styles.statusSuccess : styles.statusMuted}`}>
                                        {result.aiAnalyzedAt ? "已分析" : "未分析"}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${result.premiumReport?.paymentStatus === "PAID" ? styles.statusGold : styles.statusMuted}`}>
                                        {result.premiumReport?.paymentStatus === "PAID" ? "已购买" : "未购买"}
                                    </span>
                                </td>
                                <td className={styles.timeCell}>
                                    {new Date(result.createdAt).toLocaleString("zh-CN")}
                                </td>
                                <td>
                                    <Link href={`/admin/results/${result.id}`} className={styles.detailLink}>
                                        查看详情
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {paginatedResults.length === 0 && (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    暂无符合条件的记录
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        共 {filteredResults.length} 条记录，第 {currentPage} / {totalPages} 页
                    </span>
                    <div className={styles.pageButtons}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={styles.pageBtn}
                        >
                            <ChevronLeft size={18} />
                        </button>
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
        </div>
    )
}
