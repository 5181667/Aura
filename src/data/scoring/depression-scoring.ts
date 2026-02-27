// 综合抑郁评估量表评分算法（30题·5维度）
// 基于 PHQ-9、BDI-II、SDS 等国际权威量表综合设计

interface Answer {
  questionId: string
  dimension: string
  value: number
}

interface DimensionScore {
  dimension: string
  rawScore: number
  percentage: number
  label?: string
}

interface TestResult {
  type: string
  score: string
  dimensions: DimensionScore[]
  confidence?: number
}

// 维度标签
const dimensionLabels: Record<string, string> = {
  'EMO': '情绪症状',
  'SOM': '躯体症状',
  'COG': '认知症状',
  'BEH': '行为症状',
  'SOC': '社会功能'
}

// 严重程度等级（总分 0-90）
export interface DepressionLevel {
  level: string
  label: string
  range: [number, number]
  color: string
  description: string
  suggestion: string
}

export const depressionLevels: DepressionLevel[] = [
  {
    level: 'none',
    label: '无抑郁症状',
    range: [0, 14],
    color: '#22c55e',
    description: '您目前没有明显的抑郁症状，心理状态良好。',
    suggestion: '继续保持健康的生活方式，规律作息、适量运动、维持良好的社交关系。'
  },
  {
    level: 'mild',
    label: '轻度抑郁',
    range: [15, 29],
    color: '#f59e0b',
    description: '您可能正在经历一些轻度的情绪困扰，通常可以通过自我调节来改善。',
    suggestion: '建议关注自己的情绪变化，增加运动和社交活动。如果症状持续超过两周，建议咨询专业人士。'
  },
  {
    level: 'moderate',
    label: '中度抑郁',
    range: [30, 44],
    color: '#f97316',
    description: '您的抑郁症状已达到中度水平，这些症状可能正在影响您的日常生活和工作。',
    suggestion: '强烈建议尽快预约心理咨询师或精神科医生进行专业评估。适当的干预可以显著改善您的状态。'
  },
  {
    level: 'moderately_severe',
    label: '中重度抑郁',
    range: [45, 59],
    color: '#ef4444',
    description: '您正在经历较为严重的抑郁症状，这已经在很大程度上影响了您的正常生活。',
    suggestion: '请尽快寻求专业心理/精神科医生的帮助。药物治疗联合心理治疗通常是最有效的方案。请不要独自承受。'
  },
  {
    level: 'severe',
    label: '重度抑郁',
    range: [60, 90],
    color: '#dc2626',
    description: '您目前的抑郁症状非常严重，需要立即获得专业帮助。',
    suggestion: '请立即联系专业精神科医生或前往医院精神科就诊。如果有自伤念头，请立即拨打24小时心理援助热线：400-161-9995 或 010-82951332。'
  }
]

export function calculateDepression(answers: Answer[]): TestResult {
  // 按维度聚合分数
  const dimScores: Record<string, number[]> = {}

  answers.forEach(ans => {
    const dim = ans.dimension
    if (!dimScores[dim]) dimScores[dim] = []
    dimScores[dim].push(ans.value)
  })

  // 计算总分与各维度得分
  let totalScore = 0
  const dimensions: DimensionScore[] = []

  // 确保维度顺序固定：EMO、SOM、COG、BEH、SOC
  const dimOrder = ['EMO', 'SOM', 'COG', 'BEH', 'SOC']

  for (const dim of dimOrder) {
    const scores = dimScores[dim] || []
    const rawScore = scores.reduce((sum, v) => sum + v, 0)
    const maxPossible = scores.length * 3 // 每题最高3分
    totalScore += rawScore

    dimensions.push({
      dimension: dim,
      rawScore,
      percentage: maxPossible > 0 ? Math.round((rawScore / maxPossible) * 100) : 0,
      label: dimensionLabels[dim] || dim
    })
  }

  return {
    type: 'DEPRESSION',
    score: `${totalScore}`,
    dimensions,
    confidence: totalScore
  }
}

// 获取抑郁等级
export function getDepressionLevel(score: number): DepressionLevel {
  for (const level of depressionLevels) {
    if (score >= level.range[0] && score <= level.range[1]) {
      return level
    }
  }
  return depressionLevels[depressionLevels.length - 1]
}

// 获取严重程度百分比（用于仪表盘显示，基于 0-90 满分）
export function getDepressionPercentage(score: number): number {
  return Math.round((score / 90) * 100)
}
