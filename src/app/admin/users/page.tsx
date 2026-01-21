import { prisma } from "@/lib/prisma"
import UserTable from "./UserTable"
import styles from "../admin.module.css"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const rawUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPro: true,
            isActive: true,
            lastActiveAt: true,
            createdAt: true,
            _count: {
                select: {
                    testResults: true,
                    friends: true,
                }
            }
        }
    })

    // 序列化 Date 对象为 ISO 字符串，以便传递给客户端组件
    const users = rawUsers.map(user => ({
        ...user,
        lastActiveAt: user.lastActiveAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString()
    }))

    // 统计数据
    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        active: users.filter(u => u.isActive !== false).length,
        inactive: users.filter(u => u.isActive === false).length
    }

    return (
        <div>
            <header className={styles.header}>
                <h1>用户管理</h1>
                <p>管理平台所有用户账号 · 共 {stats.total} 人 · {stats.admins} 位管理员 · {stats.inactive} 人已禁用</p>
            </header>

            <section className={`${styles.section} glass`}>
                <UserTable users={users} />
            </section>
        </div>
    )
}
