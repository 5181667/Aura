import { prisma } from "@/lib/prisma"
import TestEngine from "./TestEngine"
import styles from "../tests.module.css"

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const test = await prisma.test.findUnique({
        where: { id }
    })

    if (!test) return <div>测试不存在</div>

    return (
        <div className={styles.container}>
            <TestEngine test={test} />
        </div>
    )
}
