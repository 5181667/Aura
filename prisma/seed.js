const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const mbtiTest = await prisma.test.create({
        data: {
            title: "16型人格测试 (MBTI)",
            description: "发现你的性格类型，了解你的优势和盲点。",
            type: "MBTI",
            questions: [
                {
                    id: 1,
                    question: "在社交场合，你通常是：",
                    options: [
                        { text: "充满期待地与他人交谈 (E)", score: { dimension: "EI", value: 1 } },
                        { text: "感到疲惫并渴望独处 (I)", score: { dimension: "EI", value: -1 } }
                    ]
                },
                {
                    id: 2,
                    question: "你更倾向于关注：",
                    options: [
                        { text: "当下的具体细节 (S)", score: { dimension: "SN", value: 1 } },
                        { text: "未来的可能性和想法 (N)", score: { dimension: "SN", value: -1 } }
                    ]
                },
                {
                    id: 3,
                    question: "在做决策时，你通常：",
                    options: [
                        { text: "客观严谨且逻辑性强 (T)", score: { dimension: "TF", value: 1 } },
                        { text: "考虑他人的情感和价值观 (F)", score: { dimension: "TF", value: -1 } }
                    ]
                },
                {
                    id: 4,
                    question: "你眼中的理想生活是：",
                    options: [
                        { text: "有条不紊、严格执行计划 (J)", score: { dimension: "JP", value: 1 } },
                        { text: "随遇而安、保持灵活开放 (P)", score: { dimension: "JP", value: -1 } }
                    ]
                }
                // Simplified for testing, real MBTI has more questions
            ]
        }
    })
    console.log("Seeded MBTI test:", mbtiTest.title)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
