import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import FriendSearch from "./FriendSearch"
import FriendRequestList from "./FriendRequestList"
import styles from "./friends.module.css"

export default async function FriendsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            friends: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    lastActiveAt: true,
                }
            },
            receivedRequests: {
                where: { status: "PENDING" },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            }
        }
    })

    return (
        <div className={styles.container}>
            <nav className={`${styles.navbar} glass`}>
                <Link href="/" className={styles.logo}>AuraTest</Link>
                <Link href="/dashboard">返回个人中心</Link>
            </nav>

            <main className={styles.main}>
                <h1>好友管理</h1>

                <section className={`${styles.section} glass`}>
                    <h2>搜索好友</h2>
                    <FriendSearch />
                </section>

                {user && user.receivedRequests.length > 0 && (
                    <section className={`${styles.section} glass`}>
                        <h2>好友申请 ({user.receivedRequests.length})</h2>
                        <FriendRequestList requests={user.receivedRequests} />
                    </section>
                )}

                <section className={`${styles.section} glass`}>
                    <h2>我的好友 ({user?.friends.length || 0})</h2>
                    <div className={styles.friendGrid}>
                        {user?.friends.length === 0 ? (
                            <p className={styles.empty}>暂无好友，快去搜索添加吧！</p>
                        ) : (
                            user?.friends.map((friend) => (
                                <div key={friend.id} className={styles.friendCard}>
                                    <div className={styles.avatar}>
                                        {friend.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className={styles.info}>
                                        <h3>{friend.name}</h3>
                                        <p>{friend.email}</p>
                                    </div>
                                    <Link 
                                        href={`/dashboard?chat=${friend.id}`}
                                        className="btn-premium"
                                    >
                                        发消息
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}
