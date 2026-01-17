const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const discTest = await prisma.test.create({
        data: {
            title: "DISC 性格测评",
            description: "通过四个维度了解你的行为风格，在团队中找到最适合自己的位置。",
            type: "DISC",
            questions: [
                {
                    id: 1,
                    question: "在面临压力时，你通常会：",
                    options: [
                        { text: "迅速采取行动，直面问题 (D)", score: { dimension: "D", value: 1 } },
                        { text: "寻找他人的支持和理解 (I)", score: { dimension: "I", value: 1 } },
                        { text: "保持现状，谨慎观察 (S)", score: { dimension: "S", value: 1 } },
                        { text: "分析细节，寻找逻辑漏洞 (C)", score: { dimension: "C", value: 1 } }
                    ]
                },
                {
                    id: 2,
                    question: "在团队合作中，你最看重：",
                    options: [
                        { text: "效率和结果 (D)", score: { dimension: "D", value: 1 } },
                        { text: "氛围和人际关系 (I)", score: { dimension: "I", value: 1 } },
                        { text: "稳定和分工明确 (S)", score: { dimension: "S", value: 1 } },
                        { text: "标准和精确度 (C)", score: { dimension: "C", value: 1 } }
                    ]
                },
                {
                    id: 3,
                    question: "当别人对你的工作提出建议时，你会：",
                    options: [
                        { text: "辩论自己的观点，坚持立场 (D)", score: { dimension: "D", value: 1 } },
                        { text: "欣然接受并尝试将其变得更有趣 (I)", score: { dimension: "I", value: 1 } },
                        { text: "由于担心冲突而选择接受 (S)", score: { dimension: "S", value: 1 } },
                        { text: "核对事实，看建议是否有专业依据 (C)", score: { dimension: "C", value: 1 } }
                    ]
                },
                {
                    id: 4,
                    question: "你更喜欢的任务类型是：",
                    options: [
                        { text: "具有挑战性、能够控制局面的 (D)", score: { dimension: "D", value: 1 } },
                        { text: "需要创意、能与人互动的 (I)", score: { dimension: "I", value: 1 } },
                        { text: "流程固定、环境友好的 (S)", score: { dimension: "S", value: 1 } },
                        { text: "需要高度专注、逻辑严密的 (C)", score: { dimension: "C", value: 1 } }
                    ]
                }
            ]
        }
    })
    console.log("Seeded DISC test:", discTest.title)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
