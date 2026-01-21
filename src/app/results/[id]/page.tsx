import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ResultClient from "./ResultClient"

export const dynamic = 'force-dynamic'

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const userId = session?.user ? (session.user as any).id : null

    if (!id) {
        console.error("ResultPage: ID is missing");
        return <div className="error-page">无效的请求参数</div>;
    }
    console.log(`Fetching result for id: ${id}`);

    let result;
    try {
        result = await prisma.testResult.findUnique({
            where: { id },
            include: {
                test: true,
                user: true,
                premiumReport: true,
            }
        });
    } catch (error) {
        console.error("Error fetching test result:", error);
        return <div className="error-page">获取结果失败，请稍后重试</div>;
    }

    if (!result) {
        return <div className="error-page">结果不存在</div>
    }

    // 权限检查：
    // 1. 游客结果（userId 为空）：任何人都可以查看
    // 2. 用户结果：只有本人可以查看
    const isOwner = result.userId === null || result.userId === userId
    if (!isOwner) {
        return <div className="error-page">无权访问此结果</div>
    }

    // 获取最新的用户 Pro 状态（解决 Session 缓存问题）
    let isPro = false
    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isPro: true }
        })
        isPro = user?.isPro || false
    }

    // 传递登录状态给客户端
    return <ResultClient
        result={result}
        isLoggedIn={!!session?.user}
        isGuest={result.userId === null}
        isPro={isPro}
    />
}
