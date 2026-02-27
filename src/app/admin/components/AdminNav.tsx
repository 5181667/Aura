"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, Users, FileText, Settings,
    ChevronLeft, Home, Shield, PlusCircle, Star, History, Ticket
} from "lucide-react"
import styles from "./AdminNav.module.css"

export default function AdminNav() {
    const pathname = usePathname()

    const navItems = [
        {
            href: "/admin",
            label: "仪表盘",
            icon: LayoutDashboard,
            description: "数据概览"
        },
        {
            href: "/admin/users",
            label: "用户管理",
            icon: Users,
            description: "管理用户账号"
        },
        {
            href: "/admin/tests",
            label: "测试管理",
            icon: FileText,
            description: "管理测试内容"
        },
        {
            href: "/admin/results",
            label: "历史测试",
            icon: History,
            description: "查看测试详情"
        },
        {
            href: "/admin/famous-people",
            label: "名人管理",
            icon: Star,
            description: "查看代表人物"
        },
        {
            href: "/admin/redemption-codes",
            label: "兑换码管理",
            icon: Ticket,
            description: "生成与管理兑换码"
        },
    ]

    const quickActions = [
        {
            href: "/admin/tests/create",
            label: "创建测试",
            icon: PlusCircle
        },
    ]

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin'
        }
        return pathname.startsWith(href)
    }

    return (
        <nav className={styles.sidebar}>
            {/* Logo 区域 */}
            <div className={styles.logoSection}>
                <Link href="/admin" className={styles.logo}>
                    <Shield size={28} className={styles.logoIcon} />
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>AuraTest</span>
                        <span className={styles.logoBadge}>管理后台</span>
                    </div>
                </Link>
            </div>

            {/* 主导航 */}
            <div className={styles.navSection}>
                <span className={styles.navLabel}>导航菜单</span>
                <ul className={styles.navList}>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${active ? styles.active : ''}`}
                                >
                                    <Icon size={20} className={styles.navIcon} />
                                    <div className={styles.navContent}>
                                        <span className={styles.navTitle}>{item.label}</span>
                                        <span className={styles.navDesc}>{item.description}</span>
                                    </div>
                                    {active && <div className={styles.activeIndicator} />}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* 快捷操作 */}
            <div className={styles.navSection}>
                <span className={styles.navLabel}>快捷操作</span>
                <ul className={styles.navList}>
                    {quickActions.map((item) => {
                        const Icon = item.icon
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${styles.quickAction}`}
                                >
                                    <Icon size={18} className={styles.navIcon} />
                                    <span className={styles.navTitle}>{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* 底部返回链接 */}
            <div className={styles.bottomSection}>
                <Link href="/dashboard" className={styles.backLink}>
                    <ChevronLeft size={18} />
                    <span>返回用户端</span>
                </Link>
                <Link href="/" className={styles.homeLink}>
                    <Home size={18} />
                    <span>网站首页</span>
                </Link>
            </div>
        </nav>
    )
}
