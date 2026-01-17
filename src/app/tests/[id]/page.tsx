import { prisma } from "@/lib/prisma"
import TestEngine from "./TestEngine"
import styles from "../tests.module.css"

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const test = await prisma.test.findUnique({
        where: { id }
    })

    if (!test) return <div>测试不存在</div>

    // 转换数据类型以匹配 TestEngine 的期望
    const testData = {
        id: test.id,
        title: test.title,
        description: test.description,
        type: test.type,
        questions: (test.questions || []) as any[],
        scoring: test.scoring as any
    }

    return (
        <div className={styles.container}>
            <TestEngine test={testData} />
        </div>
    )
}
