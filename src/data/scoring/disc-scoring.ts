// DISC 评分算法

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

// DISC 维度标签
const dimensionLabels: Record<string, string> = {
  'D': '支配型 Dominance',
  'I': '影响型 Influence',
  'S': '稳健型 Steadiness',
  'C': '谨慎型 Compliance'
}

// DISC 类型描述
export const discTypeDescriptions: Record<string, { traits: string[]; strengths: string[]; weaknesses: string[] }> = {
  'D': {
    traits: ['果断', '竞争', '直接', '独立', '结果导向'],
    strengths: ['决策力强', '行动迅速', '敢于承担风险', '目标明确'],
    weaknesses: ['可能显得强势', '缺乏耐心', '忽视他人感受']
  },
  'I': {
    traits: ['热情', '乐观', '善于社交', '有感染力', '善于表达'],
    strengths: ['人际关系好', '善于激励他人', '创造力强', '适应力强'],
    weaknesses: ['可能不够专注', '容易忽视细节', '决策可能冲动']
  },
  'S': {
    traits: ['稳定', '耐心', '忠诚', '善于倾听', '团队导向'],
    strengths: ['可靠踏实', '善于合作', '创造和谐环境', '支持他人'],
    weaknesses: ['抗拒变化', '难以果断决策', '可能过于顺从']
  },
  'C': {
    traits: ['精确', '分析', '系统', '谨慎', '注重质量'],
    strengths: ['注重细节', '高标准', '逻辑清晰', '准确性高'],
    weaknesses: ['可能过于完美主义', '决策较慢', '可能过于挑剔']
  }
}

export function calculateDISC(answers: Answer[]): TestResult {
  // 初始化维度得分
  const dimensions: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  const counts: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  
  // 累加得分（每道题只选一个维度得分）
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })
  
  // 计算总分以归一化
  const totalScore = Object.values(dimensions).reduce((a, b) => a + b, 0)
  
  // 计算每个维度的百分比
  const dimensionScores: DimensionScore[] = []
  let primaryType = 'D'
  let maxScore = 0
  
  for (const dim of ['D', 'I', 'S', 'C']) {
    const rawScore = dimensions[dim]
    const percentage = totalScore > 0 ? Math.round((rawScore / totalScore) * 100) : 25
    
    if (rawScore > maxScore) {
      maxScore = rawScore
      primaryType = dim
    }
    
    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: dimensionLabels[dim]
    })
  }
  
  // 确定主导类型和辅助类型
  const sortedDims = dimensionScores.sort((a, b) => b.rawScore - a.rawScore)
  const typeCode = sortedDims[0].dimension + (sortedDims[1].rawScore > 0 ? sortedDims[1].dimension : '')
  
  // 重新排序回 D-I-S-C 顺序
  const orderedScores = ['D', 'I', 'S', 'C'].map(d => 
    dimensionScores.find(s => s.dimension === d)!
  )
  
  return {
    type: 'DISC',
    score: typeCode,
    dimensions: orderedScores
  }
}

// 获取 DISC 类型描述
export function getDISCDescription(primaryType: string) {
  return discTypeDescriptions[primaryType] || discTypeDescriptions['D']
}
