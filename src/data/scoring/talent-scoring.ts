// 天赋发掘测试评分算法 - 基于霍华德·加德纳多元智能理论

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
  'LI': '语言智能',
  'LM': '逻辑数理智能',
  'SV': '空间视觉智能',
  'MU': '音乐节奏智能',
  'BK': '身体运动智能',
  'IP': '人际交往智能',
  'IA': '自我认知智能',
  'NA': '自然观察智能'
}

export const talentDescriptions: Record<string, { name: string; description: string }> = {
  'LI': { name: '语言智能', description: '擅长用文字和语言表达思想，对阅读、写作和口头表达有天然的亲近感' },
  'LM': { name: '逻辑数理智能', description: '擅长逻辑推理、数学运算和抽象思考，善于发现规律和解决复杂问题' },
  'SV': { name: '空间视觉智能', description: '擅长视觉化思维、空间想象和图形设计，对色彩和构图有敏锐感知' },
  'MU': { name: '音乐节奏智能', description: '对音调、节奏和旋律有天然的敏感度，善于音乐欣赏和创作' },
  'BK': { name: '身体运动智能', description: '擅长身体协调和运动控制，善于通过身体来表达和解决问题' },
  'IP': { name: '人际交往智能', description: '擅长理解他人、社交互动和团队合作，善于影响和激励他人' },
  'IA': { name: '自我认知智能', description: '善于自我反思、情绪觉察和内在探索，对自身有深度理解' },
  'NA': { name: '自然观察智能', description: '善于观察自然现象、分类事物和感知环境变化，对自然有深厚兴趣' }
}

export function calculateTalent(answers: Answer[]): TestResult {
  const dims = ['LI', 'LM', 'SV', 'MU', 'BK', 'IP', 'IA', 'NA']
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

  for (const dim of dims) {
    const rawScore = scores[dim]
    const count = counts[dim] || 1
    const percentage = normalize(rawScore, count, count * 5)

    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: dimensionLabels[dim]
    })
  }

  const sorted = [...dimensionScores].sort((a, b) => b.percentage - a.percentage)
  const top3 = sorted.slice(0, 3).map(d => d.dimension)
  const talentCode = top3.join('')

  return {
    type: 'TALENT',
    score: talentCode,
    dimensions: dimensionScores,
    confidence: sorted[0].percentage
  }
}

export function getTalentDescription(dimension: string): string {
  return talentDescriptions[dimension]?.description || ''
}

export function getTalentName(dimension: string): string {
  return talentDescriptions[dimension]?.name || dimension
}
