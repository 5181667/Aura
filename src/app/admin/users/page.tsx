import { prisma } from "@/lib/prisma"
import UserTable from "./UserTable"
import styles from "../admin.module.css"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
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

    return (
        <div>
            <header className={styles.header}>
                <h1>用户管理</h1>
                <p>管理平台所有用户账号</p>
            </header>

            <section className={`${styles.section} glass`}>
                <div className={styles.sectionHeader}>
                    <h2>全部用户 ({users.length})</h2>
                </div>
                <UserTable users={users} />
            </section>
        </div>
    )
}
