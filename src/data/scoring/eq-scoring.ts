// EQ 情商评分算法

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

function normalize(value: number, min: number, max: number): number {
  return Math.round(((value - min) / (max - min)) * 100)
}

// EQ 维度标签
const dimensionLabels: Record<string, string> = {
  'SA': '自我认知',
  'SM': '自我管理',
  'MO': '自我激励',
  'EM': '同理心',
  'SS': '社交技能'
}

// EQ 等级描述
export const eqLevelDescriptions: Record<string, { range: [number, number]; description: string }> = {
  'excellent': { range: [80, 100], description: '优秀 - 您具有出色的情商，能够很好地理解和管理自己的情绪，与他人建立良好关系' },
  'good': { range: [60, 79], description: '良好 - 您的情商水平较高，在大多数情况下能够有效处理情绪和人际关系' },
  'average': { range: [40, 59], description: '中等 - 您的情商处于平均水平，有一定的提升空间' },
  'developing': { range: [20, 39], description: '发展中 - 您的情商还有较大提升空间，建议关注情绪管理技能的培养' },
  'low': { range: [0, 19], description: '需加强 - 建议您重点关注情商各维度的发展，可考虑专业指导' }
}

export function calculateEQ(answers: Answer[]): TestResult {
  // 初始化维度得分
  const dimensions: Record<string, number> = { SA: 0, SM: 0, MO: 0, EM: 0, SS: 0 }
  const counts: Record<string, number> = { SA: 0, SM: 0, MO: 0, EM: 0, SS: 0 }
  
  // 累加得分
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })
  
  // 计算每个维度的百分比分数
  const dimensionScores: DimensionScore[] = []
  let totalPercentage = 0
  
  for (const dim of ['SA', 'SM', 'MO', 'EM', 'SS']) {
    const rawScore = dimensions[dim]
    const count = counts[dim]
    const minPossible = count * 1
    const maxPossible = count * 5
    
    // 归一化到 0-100
    const percentage = normalize(rawScore, minPossible, maxPossible)
    totalPercentage += percentage
    
    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: dimensionLabels[dim]
    })
  }
  
  // 计算总体 EQ 分数
  const overallEQ = Math.round(totalPercentage / 5)
  
  // 确定 EQ 等级
  let level = 'average'
  for (const [key, value] of Object.entries(eqLevelDescriptions)) {
    if (overallEQ >= value.range[0] && overallEQ <= value.range[1]) {
      level = key
      break
    }
  }
  
  return {
    type: 'EQ',
    score: `${overallEQ}`,
    dimensions: dimensionScores,
    confidence: overallEQ
  }
}

// 获取 EQ 等级描述
export function getEQLevel(score: number): string {
  for (const [key, value] of Object.entries(eqLevelDescriptions)) {
    if (score >= value.range[0] && score <= value.range[1]) {
      return value.description
    }
  }
  return eqLevelDescriptions.average.description
}
