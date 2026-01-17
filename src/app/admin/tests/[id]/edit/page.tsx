import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import TestEditor from "./TestEditor"

export default async function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const test = await prisma.test.findUnique({
        where: { id }
    })

    if (!test) {
        notFound()
    }

    return <TestEditor test={test} />
}
