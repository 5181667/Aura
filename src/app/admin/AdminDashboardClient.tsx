"use client"

import { useState } from 'react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { 
  Users, FileText, CheckCircle, TrendingUp, TrendingDown,
  Activity, Clock, Calendar, Eye, Award, Zap, Database,
  UserPlus, ClipboardList, BarChart3, PieChartIcon, RefreshCw
} from 'lucide-react'
import styles from './admin.module.css'

interface DashboardData {
  // 核心统计
  totalUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  activeUsersThisWeek: number
  
  totalTests: number
  publishedTests: number
  
  totalResults: number
  resultsToday: number
  resultsThisWeek: number
  
  // 图表数据
  userTrend: { date: string; count: number }[]
  testTypeDistribution: { name: string; value: number; color: string }[]
  dailyCompletions: { date: string; completions: number }[]
  popularTests: { name: string; completions: number; type: string }[]
  
  // 最近活动
  recentResults: {
    id: string
    userName: string
    testTitle: string
    score: string
    createdAt: string
  }[]
  recentUsers: {
    id: string
    name: string
    email: string
    createdAt: string
    testCount: number
  }[]
}

// 测试类型颜色映射
const typeColors: Record<string, string> = {
  'MBTI': '#8b5cf6',
  'BIG_FIVE': '#06b6d4',
  'DISC': '#10b981',
  'EQ': '#f59e0b',
  'HOLLAND': '#ec4899',
  'ENNEAGRAM': '#6366f1',
  'CUSTOM': '#94a3b8'
}

// 自定义 Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboardClient({ data }: { data: DashboardData }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    window.location.reload()
  }

  // 计算增长率
  const userGrowthRate = data.totalUsers > 0 
    ? ((data.newUsersThisWeek / data.totalUsers) * 100).toFixed(1)
    : '0'
  
  const completionGrowthRate = data.totalResults > 0
    ? ((data.resultsThisWeek / data.totalResults) * 100).toFixed(1)
    : '0'

  return (
    <div className={styles.dashboard}>
      {/* 页面头部 */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>管理仪表盘</h1>
          <p>实时监控平台运营状态与数据分析</p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.lastUpdate}>
            <Clock size={14} />
            更新于 {new Date().toLocaleTimeString('zh-CN')}
          </span>
          <button 
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
            刷新数据
          </button>
        </div>
      </header>

      {/* 核心指标卡片 */}
      <div className={styles.metricsGrid}>
        {/* 用户统计 */}
        <div className={`${styles.metricCard} ${styles.metricUsers}`}>
          <div className={styles.metricIcon}>
            <Users size={24} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>总用户数</span>
            <span className={styles.metricValue}>{data.totalUsers.toLocaleString()}</span>
            <div className={styles.metricTrend}>
              <TrendingUp size={14} />
              <span>+{data.newUsersToday} 今日</span>
              <span className={styles.trendSeparator}>|</span>
              <span>+{data.newUsersThisWeek} 本周</span>
            </div>
          </div>
          <div className={styles.metricBadge}>
            <UserPlus size={12} />
            {userGrowthRate}%
          </div>
        </div>

        {/* 活跃用户 */}
        <div className={`${styles.metricCard} ${styles.metricActive}`}>
          <div className={styles.metricIcon}>
            <Activity size={24} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>周活跃用户</span>
            <span className={styles.metricValue}>{data.activeUsersThisWeek.toLocaleString()}</span>
            <div className={styles.metricTrend}>
              <Zap size={14} />
              <span>
                {data.totalUsers > 0 
                  ? ((data.activeUsersThisWeek / data.totalUsers) * 100).toFixed(0)
                  : 0}% 活跃率
              </span>
            </div>
          </div>
        </div>

        {/* 测试数量 */}
        <div className={`${styles.metricCard} ${styles.metricTests}`}>
          <div className={styles.metricIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>测试类型</span>
            <span className={styles.metricValue}>{data.totalTests}</span>
            <div className={styles.metricTrend}>
              <CheckCircle size={14} />
              <span>{data.publishedTests} 已发布</span>
            </div>
          </div>
        </div>

        {/* 完成测试 */}
        <div className={`${styles.metricCard} ${styles.metricResults}`}>
          <div className={styles.metricIcon}>
            <ClipboardList size={24} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>测试完成</span>
            <span className={styles.metricValue}>{data.totalResults.toLocaleString()}</span>
            <div className={styles.metricTrend}>
              <TrendingUp size={14} />
              <span>+{data.resultsToday} 今日</span>
              <span className={styles.trendSeparator}>|</span>
              <span>+{data.resultsThisWeek} 本周</span>
            </div>
          </div>
          <div className={styles.metricBadge}>
            <BarChart3 size={12} />
            {completionGrowthRate}%
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className={styles.chartsGrid}>
        {/* 用户注册趋势 */}
        <div className={`${styles.chartCard} ${styles.chartWide}`}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <TrendingUp size={20} />
              <h3>用户注册趋势</h3>
            </div>
            <span className={styles.chartSubtitle}>近7天新增用户</span>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.userTrend}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="新增用户"
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fill="url(#userGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 测试类型分布 */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <PieChartIcon size={20} />
              <h3>测试类型分布</h3>
            </div>
            <span className={styles.chartSubtitle}>按完成次数统计</span>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.testTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.testTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom"
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 每日完成量 */}
        <div className={`${styles.chartCard} ${styles.chartWide}`}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <BarChart3 size={20} />
              <h3>每日测试完成量</h3>
            </div>
            <span className={styles.chartSubtitle}>近7天完成趋势</span>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.dailyCompletions}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="completions" 
                  name="完成数"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 热门测试排行 */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              <Award size={20} />
              <h3>热门测试排行</h3>
            </div>
            <span className={styles.chartSubtitle}>按完成次数排序</span>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.rankingList}>
              {data.popularTests.map((test, index) => (
                <div key={test.name} className={styles.rankingItem}>
                  <span className={`${styles.rankNumber} ${index < 3 ? styles.topRank : ''}`}>
                    {index + 1}
                  </span>
                  <div className={styles.rankInfo}>
                    <span className={styles.rankName}>{test.name}</span>
                    <span 
                      className={styles.rankType}
                      style={{ color: typeColors[test.type] || '#94a3b8' }}
                    >
                      {test.type}
                    </span>
                  </div>
                  <div className={styles.rankBar}>
                    <div 
                      className={styles.rankBarFill}
                      style={{ 
                        width: `${(test.completions / (data.popularTests[0]?.completions || 1)) * 100}%`,
                        backgroundColor: typeColors[test.type] || '#94a3b8'
                      }}
                    />
                  </div>
                  <span className={styles.rankValue}>{test.completions}</span>
                </div>
              ))}
              {data.popularTests.length === 0 && (
                <div className={styles.emptyRanking}>暂无数据</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className={styles.activityGrid}>
        {/* 最近测试完成 */}
        <div className={`${styles.activityCard} glass`}>
          <div className={styles.activityHeader}>
            <div className={styles.activityTitle}>
              <CheckCircle size={20} />
              <h3>最近测试完成</h3>
            </div>
            <span className={styles.activityCount}>{data.recentResults.length} 条记录</span>
          </div>
          <div className={styles.activityList}>
            {data.recentResults.map((result) => (
              <div key={result.id} className={styles.activityItem}>
                <div className={styles.activityAvatar}>
                  {result.userName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityUser}>{result.userName || '匿名用户'}</span>
                  <span className={styles.activityDetail}>
                    完成了 <strong>{result.testTitle}</strong>
                  </span>
                  <span className={styles.activityTime}>
                    <Clock size={12} />
                    {new Date(result.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className={styles.activityScore}>
                  {result.score}
                </div>
              </div>
            ))}
            {data.recentResults.length === 0 && (
              <div className={styles.emptyActivity}>暂无测试完成记录</div>
            )}
          </div>
        </div>

        {/* 新注册用户 */}
        <div className={`${styles.activityCard} glass`}>
          <div className={styles.activityHeader}>
            <div className={styles.activityTitle}>
              <UserPlus size={20} />
              <h3>新注册用户</h3>
            </div>
            <span className={styles.activityCount}>{data.recentUsers.length} 位用户</span>
          </div>
          <div className={styles.activityList}>
            {data.recentUsers.map((user) => (
              <div key={user.id} className={styles.activityItem}>
                <div className={styles.activityAvatar}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityUser}>{user.name || '未命名'}</span>
                  <span className={styles.activityDetail}>{user.email}</span>
                  <span className={styles.activityTime}>
                    <Calendar size={12} />
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className={styles.activityMeta}>
                  <Eye size={14} />
                  {user.testCount} 次测试
                </div>
              </div>
            ))}
            {data.recentUsers.length === 0 && (
              <div className={styles.emptyActivity}>暂无新注册用户</div>
            )}
          </div>
        </div>
      </div>

      {/* 系统信息 */}
      <div className={`${styles.systemInfo} glass`}>
        <div className={styles.systemHeader}>
          <Database size={20} />
          <h3>系统概览</h3>
        </div>
        <div className={styles.systemGrid}>
          <div className={styles.systemItem}>
            <span className={styles.systemLabel}>数据库状态</span>
            <span className={`${styles.systemValue} ${styles.statusOnline}`}>
              <span className={styles.statusDot} />
              正常运行
            </span>
          </div>
          <div className={styles.systemItem}>
            <span className={styles.systemLabel}>总测试结果</span>
            <span className={styles.systemValue}>{data.totalResults.toLocaleString()} 条</span>
          </div>
          <div className={styles.systemItem}>
            <span className={styles.systemLabel}>今日完成率</span>
            <span className={styles.systemValue}>
              {data.activeUsersThisWeek > 0 
                ? ((data.resultsToday / data.activeUsersThisWeek) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className={styles.systemItem}>
            <span className={styles.systemLabel}>平均完成/用户</span>
            <span className={styles.systemValue}>
              {data.totalUsers > 0 
                ? (data.totalResults / data.totalUsers).toFixed(1)
                : 0} 次
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
