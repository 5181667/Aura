import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import styles from "./tests.module.css"

export default async function TestsPage() {
    const session = await getServerSession(authOptions)
    const tests = await prisma.test.findMany()

    return (
        <div className={styles.container}>
            <nav className={`${styles.navbar} glass`}>
                <Link href="/" className={styles.logo}>AuraTest</Link>
                <div className={styles.navLinks}>
                    {session ? (
                        <Link href="/dashboard">个人中心</Link>
                    ) : (
                        <Link href="/login">登录</Link>
                    )}
                </div>
            </nav>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>探索测试</h1>
                    <p>从性格到情感，多方位了解真实的自己</p>
                </header>

                <div className={styles.testGrid}>
                    {tests.map((test: any) => (
                        <div key={test.id} className={`${styles.testCard} glass`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.tag}>{test.type}</span>
                                <h2>{test.title}</h2>
                            </div>
                            <p>{test.description}</p>
                            <Link href={`/tests/${test.id}`} className="btn-premium" style={{ display: "inline-block", marginTop: "1rem" }}>
                                开始测试
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
