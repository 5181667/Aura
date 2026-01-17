const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const SHORT_TEST_TYPES = ['MBTI', 'DISC']
const MAX_QUESTION_COUNT = 4

async function main() {
  const tests = await prisma.test.findMany({
    where: {
      type: { in: SHORT_TEST_TYPES },
      isSystem: false
    }
  })

  const shortTests = tests.filter((test) => {
    const questions = test.questions
    return Array.isArray(questions) && questions.length <= MAX_QUESTION_COUNT
  })

  if (shortTests.length === 0) {
    console.log('未发现题目数 <= 4 的短测试')
    return
  }

  const testIds = shortTests.map((test) => test.id)

  await prisma.testResult.deleteMany({
    where: {
      testId: { in: testIds }
    }
  })

  await prisma.test.deleteMany({
    where: {
      id: { in: testIds }
    }
  })

  console.log(`已删除 ${shortTests.length} 个短测试`)
}

main()
  .catch((error) => {
    console.error('清理失败:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
