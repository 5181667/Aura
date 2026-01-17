import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import FriendList from "./FriendList"
import AvatarUpload from "@/components/AvatarUpload"
import TestTimeline from "@/components/TestTimeline"
import styles from "./dashboard.module.css"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return <div>请先登录</div>
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            testResults: {
                include: { test: true },
                orderBy: { createdAt: "desc" }
            },
            friends: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    lastActiveAt: true,
                }
            },
        }
    })

    return (
        <div className={styles.container}>
            <nav className={`${styles.navbar} glass`}>
                <Link href="/" className={styles.logo}>AuraTest</Link>
                <div className={styles.navLinks}>
                    <Link href="/tests">探索测试</Link>
                    {(session.user as any).role === 'ADMIN' && (
                        <Link href="/admin">管理后台</Link>
                    )}
                </div>
            </nav>

            <main className={styles.main}>
                <header className={styles.profileHeader}>
                    <AvatarUpload 
                        currentImage={user?.image} 
                        userName={user?.name || undefined}
                    />
                    <div className={styles.userInfo}>
                        <h1>{user?.name}</h1>
                        <p>{user?.email}</p>
                    </div>
                </header>

                <div className={styles.grid}>
                    <section className={`${styles.timelineSection} glass`}>
                        <h3>测试历史轨迹</h3>
                        {user?.testResults.length === 0 ? (
                            <p className={styles.empty}>暂无测试记录，<Link href="/tests">开始第一个测试</Link></p>
                        ) : (
                            <TestTimeline results={user?.testResults as any} />
                        )}
                    </section>

                    <section className={`${styles.friendsSection} glass`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>我的好友</h3>
                            <Link href="/dashboard/friends" className="btn-premium" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                管理好友
                            </Link>
                        </div>
                        <FriendList friends={user?.friends} currentUserId={(session.user as any).id} />
                    </section>
                </div>
            </main>
        </div>
    )
}
