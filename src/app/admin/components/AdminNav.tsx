"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "../admin.module.css"

export default function AdminNav() {
    const pathname = usePathname()

    const navItems = [
        { href: "/admin", label: "仪表盘", icon: "📊" },
        { href: "/admin/users", label: "用户管理", icon: "👥" },
        { href: "/admin/tests", label: "测试管理", icon: "📝" },
    ]

    return (
        <nav className={`${styles.adminNav} glass`}>
            <Link href="/" className={styles.logo}>
                AuraTest <span className={styles.adminBadge}>Admin</span>
            </Link>

            <div className={styles.navItems}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <Link href="/dashboard" className={styles.backLink}>
                ← 返回前台
            </Link>
        </nav>
    )
}
