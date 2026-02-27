const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// 测试题库配置
const testConfigs = [
  {
    filename: 'mbti-60.json',
    type: 'MBTI',
    category: 'personality',
    isSystem: true
  },
  {
    filename: 'big-five-50.json',
    type: 'BIG_FIVE',
    category: 'personality',
    isSystem: true
  },
  {
    filename: 'disc-28.json',
    type: 'DISC',
    category: 'personality',
    isSystem: true
  },
  {
    filename: 'eq-40.json',
    type: 'EQ',
    category: 'emotion',
    isSystem: true
  },
  {
    filename: 'holland-60.json',
    type: 'HOLLAND',
    category: 'career',
    isSystem: true
  },
  {
    filename: 'enneagram-36.json',
    type: 'ENNEAGRAM',
    category: 'personality',
    isSystem: true
  },
  {
    filename: 'phq9-9.json',
    type: 'DEPRESSION',
    category: 'mental_health',
    isSystem: true
  }
]

async function seedTests() {
  console.log('🚀 开始初始化系统测试数据...\n')

  for (const config of testConfigs) {
    const filePath = path.join(__dirname, '../src/data/questions', config.filename)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${config.filename}，跳过`)
      continue
    }

    // 读取题库文件
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const testData = JSON.parse(fileContent)

    // 检查是否已存在同类型的系统测试
    const existingTest = await prisma.test.findFirst({
      where: {
        type: config.type,
        isSystem: true
      }
    })

    if (existingTest) {
      // 更新现有测试
      await prisma.test.update({
        where: { id: existingTest.id },
        data: {
          title: testData.title,
          description: testData.description,
          questions: testData.questions,
          scoring: {
            dimensions: testData.dimensions,
            dimensionLabels: testData.dimensionLabels,
            questionCount: testData.questionCount,
            estimatedTime: testData.estimatedTime
          }
        }
      })
      console.log(`✅ 更新测试: ${testData.title} (${testData.questions.length}题)`)
    } else {
      // 创建新测试
      await prisma.test.create({
        data: {
          title: testData.title,
          description: testData.description,
          type: config.type,
          category: config.category,
          questions: testData.questions,
          scoring: {
            dimensions: testData.dimensions,
            dimensionLabels: testData.dimensionLabels,
            questionCount: testData.questionCount,
            estimatedTime: testData.estimatedTime
          },
          isPublished: true,
          isSystem: config.isSystem
        }
      })
      console.log(`✅ 创建测试: ${testData.title} (${testData.questions.length}题)`)
    }
  }

  console.log('\n✨ 系统测试数据初始化完成！')

  // 显示当前测试统计
  const testCount = await prisma.test.count()
  const publishedCount = await prisma.test.count({ where: { isPublished: true } })
  console.log(`\n📊 当前数据库共有 ${testCount} 个测试，${publishedCount} 个已发布`)
}

async function main() {
  try {
    await seedTests()
  } catch (error) {
    console.error('❌ 初始化失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
