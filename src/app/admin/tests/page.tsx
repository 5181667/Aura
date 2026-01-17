import { prisma } from "@/lib/prisma"
import Link from "next/link"
import TestsTable from "./TestsTable"
import styles from "../admin.module.css"

export const dynamic = 'force-dynamic'

export default async function AdminTestsPage() {
    const tests = await prisma.test.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    results: true
                }
            }
        }
    })

    return (
        <div>
            <header className={styles.header}>
                <h1>测试管理</h1>
                <p>管理平台所有测试类型</p>
            </header>

            <section className={`${styles.section} glass`}>
                <div className={styles.sectionHeader}>
                    <h2>全部测试 ({tests.length})</h2>
                    <Link href="/admin/tests/create" className="btn-premium">
                        + 创建新测试
                    </Link>
                </div>
                <TestsTable tests={tests} />
            </section>
        </div>
    )
}
