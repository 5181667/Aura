// 大五人格评分算法

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

// 大五人格维度标签
const dimensionLabels: Record<string, string> = {
  'O': '开放性 Openness',
  'C': '尽责性 Conscientiousness',
  'E': '外向性 Extraversion',
  'A': '宜人性 Agreeableness',
  'N': '神经质 Neuroticism'
}

// 维度解释
export const bigFiveInterpretations: Record<string, { high: string; low: string }> = {
  'O': {
    high: '富有想象力，对新观念开放，喜欢尝试新事物，创造力强',
    low: '务实保守，偏好熟悉的事物，关注具体细节'
  },
  'C': {
    high: '自律性强，有组织有计划，可靠守信',
    low: '灵活随性，适应力强，但可能缺乏条理'
  },
  'E': {
    high: '外向开朗，喜欢社交，精力充沛',
    low: '内向安静，喜欢独处，深思熟虑'
  },
  'A': {
    high: '友善合作，富有同理心，乐于助人',
    low: '独立自主，竞争意识强，直接坦率'
  },
  'N': {
    high: '情绪敏感，容易焦虑，对压力反应强烈',
    low: '情绪稳定，冷静沉着，抗压能力强'
  }
}

export function calculateBigFive(answers: Answer[]): TestResult {
  // 初始化维度得分
  const dimensions: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 }
  const counts: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 }
  
  // 累加得分
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })
  
  // 计算每个维度的百分比分数
  const dimensionScores: DimensionScore[] = []
  const scoreLabels: string[] = []
  
  for (const dim of ['O', 'C', 'E', 'A', 'N']) {
    const rawScore = dimensions[dim]
    const count = counts[dim]
    const minPossible = count * 1  // 最低分
    const maxPossible = count * 5  // 最高分
    
    // 归一化到 0-100
    const percentage = normalize(rawScore, minPossible, maxPossible)
    
    // 生成标签描述
    let levelLabel: string
    if (percentage >= 70) {
      levelLabel = '高'
    } else if (percentage >= 40) {
      levelLabel = '中'
    } else {
      levelLabel = '低'
    }
    
    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: `${dimensionLabels[dim]} - ${levelLabel}`
    })
    
    scoreLabels.push(`${dim}${percentage >= 50 ? '+' : '-'}`)
  }
  
  return {
    type: 'BIG_FIVE',
    score: scoreLabels.join(''),
    dimensions: dimensionScores
  }
}

// 获取维度解释
export function getBigFiveInterpretation(dimension: string, percentage: number): string {
  const interp = bigFiveInterpretations[dimension]
  if (!interp) return ''
  return percentage >= 50 ? interp.high : interp.low
}
