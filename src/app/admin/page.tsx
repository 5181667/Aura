import { prisma } from "@/lib/prisma"
import styles from "./admin.module.css"

export default async function AdminPage() {
    const stats = await Promise.all([
        prisma.user.count(),
        prisma.test.count(),
        prisma.testResult.count(),
        prisma.friendRequest.count({ where: { status: "PENDING" } })
    ])

    const [totalUsers, totalTests, totalResults, pendingRequests] = stats

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    })

    return (
        <div>
            <header className={styles.header}>
                <h1>管理仪表盘</h1>
                <p>平台运营数据概览</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>总用户数</div>
                    <div className={styles.statValue}>{totalUsers}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>测试类型</div>
                    <div className={styles.statValue}>{totalTests}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>完成测试</div>
                    <div className={styles.statValue}>{totalResults}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statLabel}>待处理申请</div>
                    <div className={styles.statValue}>{pendingRequests}</div>
                </div>
            </div>

            <section className={`${styles.section} glass`}>
                <h2>最近注册用户</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>邮箱</th>
                            <th>注册时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString('zh-CN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
