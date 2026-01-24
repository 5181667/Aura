import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ResultClient from "@/app/results/[id]/ResultClient"
import styles from "../results.module.css"

export const dynamic = 'force-dynamic'

export default async function AdminResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    const isAdmin = (session?.user as any)?.role === "ADMIN"
    
    if (!isAdmin) {
        redirect("/dashboard")
    }

    const result = await prisma.testResult.findUnique({
        where: { id },
        include: {
            user: true,
            test: true,
            premiumReport: true
        }
    })

    if (!result) {
        return (
            <div className={styles.notFoundContainer}>
                <h1>测试结果不存在</h1>
                <p>未找到对应的历史记录</p>
                <a href="/admin/results" className={styles.backBtn}>
                    返回列表
                </a>
            </div>
        )
    }

    // 使用全屏包装器 + ResultClient 组件
    return (
        <div className={styles.fullscreenWrapper}>
            <ResultClient 
                result={result} 
                isLoggedIn={true}
                isGuest={false}
                isPro={false}
                isAdmin={true}
            />
        </div>
    )
}
