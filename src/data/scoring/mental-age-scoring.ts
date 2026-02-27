// 心理年龄测试评分算法

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

const dimensionLabels: Record<string, string> = {
  'EM': '情绪成熟度',
  'CM': '认知成熟度',
  'SA': '社会适应力',
  'VM': '价值观成熟度',
  'ID': '独立自主性'
}

export const mentalAgeLevelDescriptions: Record<string, { range: [number, number]; ageRange: string; label: string; description: string }> = {
  'child': { range: [0, 25], ageRange: '12-17岁', label: '少年心态', description: '您的心理年龄偏年轻，内心保持着少年般的纯真和好奇心，但在情绪管理和独立性方面还有成长空间。' },
  'young': { range: [26, 45], ageRange: '18-24岁', label: '青年心态', description: '您的心理年龄处于青年阶段，正在积极探索自我和世界，对新事物充满热情，正处于快速成长期。' },
  'mature': { range: [46, 65], ageRange: '25-35岁', label: '成熟心态', description: '您的心理年龄已达到成熟阶段，能够理性处理问题，有清晰的价值观和良好的社会适应能力。' },
  'wise': { range: [66, 80], ageRange: '36-50岁', label: '睿智心态', description: '您的心理年龄展现出超越年龄的智慧，拥有深厚的人生阅历感，善于洞察事物本质。' },
  'sage': { range: [81, 100], ageRange: '50岁以上', label: '通达心态', description: '您的心理年龄非常成熟，拥有超然的人生智慧，能以平和豁达的心态面对生活中的一切。' }
}

export function calculateMentalAge(answers: Answer[]): TestResult {
  const dims = ['EM', 'CM', 'SA', 'VM', 'ID']
  const scores: Record<string, number> = {}
  const counts: Record<string, number> = {}
  dims.forEach(d => { scores[d] = 0; counts[d] = 0 })

  answers.forEach(ans => {
    if (scores.hasOwnProperty(ans.dimension)) {
      scores[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })

  const dimensionScores: DimensionScore[] = []
  let totalPercentage = 0

  for (const dim of dims) {
    const rawScore = scores[dim]
    const count = counts[dim] || 1
    const percentage = normalize(rawScore, count, count * 5)
    totalPercentage += percentage

    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: dimensionLabels[dim]
    })
  }

  const overallMaturity = Math.round(totalPercentage / 5)

  // 将成熟度百分比映射到心理年龄（12-65岁范围）
  const mentalAge = Math.round(12 + (overallMaturity / 100) * 53)

  return {
    type: 'MENTAL_AGE',
    score: `${mentalAge}`,
    dimensions: dimensionScores,
    confidence: overallMaturity
  }
}

export function getMentalAgeLevel(maturityScore: number): string {
  for (const [, value] of Object.entries(mentalAgeLevelDescriptions)) {
    if (maturityScore >= value.range[0] && maturityScore <= value.range[1]) {
      return value.description
    }
  }
  return mentalAgeLevelDescriptions.mature.description
}

export function getMentalAgeLevelLabel(maturityScore: number): string {
  for (const [, value] of Object.entries(mentalAgeLevelDescriptions)) {
    if (maturityScore >= value.range[0] && maturityScore <= value.range[1]) {
      return value.label
    }
  }
  return '成熟心态'
}
