import { prisma } from "@/lib/prisma"
import AdminDashboardClient from "./AdminDashboardClient"

export const dynamic = 'force-dynamic'

// 获取日期范围
function getDateRange(days: number) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)
  return { start, end }
}

// 获取今天的开始时间
function getTodayStart() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// 格式化日期为 MM/DD
function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 测试类型中文映射
const typeLabels: Record<string, string> = {
  'MBTI': 'MBTI',
  'BIG_FIVE': '大五人格',
  'DISC': 'DISC',
  'EQ': '情商测试',
  'HOLLAND': '霍兰德',
  'ENNEAGRAM': '九型人格',
  'CUSTOM': '自定义'
}

// 测试类型颜色
const typeColors: Record<string, string> = {
  'MBTI': '#8b5cf6',
  'BIG_FIVE': '#06b6d4',
  'DISC': '#10b981',
  'EQ': '#f59e0b',
  'HOLLAND': '#ec4899',
  'ENNEAGRAM': '#6366f1',
  'CUSTOM': '#94a3b8'
}

export default async function AdminPage() {
  const todayStart = getTodayStart()
  const { start: weekStart } = getDateRange(7)

  // 并行查询所有数据
  const [
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    activeUsersThisWeek,
    totalTests,
    publishedTests,
    totalResults,
    resultsToday,
    resultsThisWeek,
    recentResults,
    recentUsers,
    allTests,
    usersByDay,
    resultsByDay,
    resultsByTest
  ] = await Promise.all([
    // 用户统计
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.user.count({
      where: { createdAt: { gte: weekStart } }
    }),
    prisma.user.count({
      where: { lastActiveAt: { gte: weekStart } }
    }),
    
    // 测试统计
    prisma.test.count(),
    prisma.test.count({
      where: { isPublished: true }
    }),
    
    // 结果统计
    prisma.testResult.count(),
    prisma.testResult.count({
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.testResult.count({
      where: { createdAt: { gte: weekStart } }
    }),
    
    // 最近测试完成
    prisma.testResult.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        test: { select: { title: true } }
      }
    }),
    
    // 最近注册用户
    prisma.user.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { testResults: true } }
      }
    }),
    
    // 所有测试（用于类型分布）
    prisma.test.findMany({
      select: {
        type: true,
        _count: { select: { results: true } }
      }
    }),
    
    // 近7天用户注册（按天分组）
    prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: weekStart } },
      _count: true
    }),
    
    // 近7天测试完成（按天分组）
    prisma.testResult.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: weekStart } },
      _count: true
    }),
    
    // 按测试统计完成数
    prisma.testResult.groupBy({
      by: ['testId'],
      _count: true,
      orderBy: { _count: { testId: 'desc' } },
      take: 5
    })
  ])

  // 处理用户注册趋势数据（近7天）
  const userTrendMap = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    userTrendMap.set(formatDate(date), 0)
  }
  
  // 由于 groupBy 返回的是完整时间戳，需要手动按日期聚合
  const usersCreatedDates = await prisma.user.findMany({
    where: { createdAt: { gte: weekStart } },
    select: { createdAt: true }
  })
  
  usersCreatedDates.forEach(u => {
    const dateKey = formatDate(new Date(u.createdAt))
    if (userTrendMap.has(dateKey)) {
      userTrendMap.set(dateKey, (userTrendMap.get(dateKey) || 0) + 1)
    }
  })
  
  const userTrend = Array.from(userTrendMap).map(([date, count]) => ({
    date,
    count
  }))

  // 处理每日完成量数据（近7天）
  const completionMap = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    completionMap.set(formatDate(date), 0)
  }
  
  const resultsCreatedDates = await prisma.testResult.findMany({
    where: { createdAt: { gte: weekStart } },
    select: { createdAt: true }
  })
  
  resultsCreatedDates.forEach(r => {
    const dateKey = formatDate(new Date(r.createdAt))
    if (completionMap.has(dateKey)) {
      completionMap.set(dateKey, (completionMap.get(dateKey) || 0) + 1)
    }
  })
  
  const dailyCompletions = Array.from(completionMap).map(([date, completions]) => ({
    date,
    completions
  }))

  // 处理测试类型分布
  const typeDistributionMap = new Map<string, number>()
  allTests.forEach(test => {
    const current = typeDistributionMap.get(test.type) || 0
    typeDistributionMap.set(test.type, current + test._count.results)
  })
  
  const testTypeDistribution = Array.from(typeDistributionMap)
    .map(([type, value]) => ({
      name: typeLabels[type] || type,
      value,
      color: typeColors[type] || '#94a3b8'
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  // 处理热门测试排行
  const testInfoMap = new Map<string, { title: string; type: string }>()
  const allTestsWithInfo = await prisma.test.findMany({
    select: { id: true, title: true, type: true }
  })
  allTestsWithInfo.forEach(t => {
    testInfoMap.set(t.id, { title: t.title, type: t.type })
  })
  
  const popularTests = resultsByTest.map(item => {
    const info = testInfoMap.get(item.testId)
    return {
      name: info?.title || '未知测试',
      completions: item._count,
      type: info?.type || 'CUSTOM'
    }
  })

  // 格式化最近结果
  const formattedRecentResults = recentResults.map(r => ({
    id: r.id,
    userName: r.user.name || '匿名用户',
    testTitle: r.test.title,
    score: r.score,
    createdAt: r.createdAt.toISOString()
  }))

  // 格式化最近用户
  const formattedRecentUsers = recentUsers.map(u => ({
    id: u.id,
    name: u.name || '未命名',
    email: u.email || '',
    createdAt: u.createdAt.toISOString(),
    testCount: u._count.testResults
  }))

  const dashboardData = {
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    activeUsersThisWeek,
    totalTests,
    publishedTests,
    totalResults,
    resultsToday,
    resultsThisWeek,
    userTrend,
    testTypeDistribution,
    dailyCompletions,
    popularTests,
    recentResults: formattedRecentResults,
    recentUsers: formattedRecentUsers
  }

  return <AdminDashboardClient data={dashboardData} />
}
