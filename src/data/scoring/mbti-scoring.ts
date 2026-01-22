// MBTI 评分算法

export interface Answer {
  questionId: string
  dimension: string
  value: number
}

export interface DimensionScore {
  dimension: string
  rawScore: number
  percentage: number
  label?: string
}

export interface TestResult {
  type: string
  score: string
  dimensions: DimensionScore[]
  confidence?: number
}

function sigmoid(x: number, k: number = 0.1): number {
  return 1 / (1 + Math.exp(-k * x))
}

// MBTI 维度标签映射
const dimensionLabels: Record<string, [string, string]> = {
  'EI': ['外向 Extraversion', '内向 Introversion'],
  'SN': ['感觉 Sensing', '直觉 iNtuition'],
  'TF': ['思考 Thinking', '情感 Feeling'],
  'JP': ['判断 Judging', '知觉 Perceiving'],
  'AT': ['自信 Assertive', '敏感 Turbulent']
}

// MBTI 类型描述
export const mbtiTypeDescriptions: Record<string, string> = {
  'INTJ': '建筑师 - 富有想象力和战略性的思想家',
  'INTP': '逻辑学家 - 善于创新的发明家',
  'ENTJ': '指挥官 - 大胆、富有想象力的领导者',
  'ENTP': '辩论家 - 聪明好奇的思想家',
  'INFJ': '提倡者 - 安静而神秘的理想主义者',
  'INFP': '调停者 - 诗意、善良的利他主义者',
  'ENFJ': '主人公 - 富有魅力的鼓舞人心的领导者',
  'ENFP': '竞选者 - 热情、有创造力的社交达人',
  'ISTJ': '物流师 - 实际且注重事实的个人',
  'ISFJ': '守卫者 - 专注且温暖的保护者',
  'ESTJ': '总经理 - 出色的管理者',
  'ESFJ': '执政官 - 极有同情心的社交者',
  'ISTP': '鉴赏家 - 大胆而实际的实验家',
  'ISFP': '探险家 - 灵活有魅力的艺术家',
  'ESTP': '企业家 - 聪明、精力充沛的感知者',
  'ESFP': '表演者 - 自发的、精力充沛的娱乐者'
}

export function calculateMBTI(answers: Answer[]): TestResult {
  // 初始化维度得分
  const dimensions: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 }
  const counts: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 }

  // 累加得分
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })

  // 计算每个维度的概率和类型字母
  const dimensionScores: DimensionScore[] = []
  let typeString = ''
  let totalConfidence = 0

  // 处理前4个维度 (E/I, S/N, T/F, J/P)
  for (const dim of ['EI', 'SN', 'TF', 'JP']) {
    const rawScore = dimensions[dim]
    const maxPossible = counts[dim] * 2 // 最大可能分数

    // 使用 sigmoid 转换为概率
    const probability = sigmoid(rawScore, 0.15) * 100

    // 确定类型字母
    let letter: string
    let label: string

    if (dim === 'EI') {
      letter = rawScore >= 0 ? 'E' : 'I'
      label = rawScore >= 0 ? dimensionLabels.EI[0] : dimensionLabels.EI[1]
    } else if (dim === 'SN') {
      letter = rawScore >= 0 ? 'S' : 'N'
      label = rawScore >= 0 ? dimensionLabels.SN[0] : dimensionLabels.SN[1]
    } else if (dim === 'TF') {
      letter = rawScore >= 0 ? 'T' : 'F'
      label = rawScore >= 0 ? dimensionLabels.TF[0] : dimensionLabels.TF[1]
    } else {
      letter = rawScore >= 0 ? 'J' : 'P'
      label = rawScore >= 0 ? dimensionLabels.JP[0] : dimensionLabels.JP[1]
    }

    typeString += letter

    // 计算维度置信度（偏离中心的程度）
    const deviation = maxPossible > 0 ? Math.abs(rawScore) / maxPossible : 0
    totalConfidence += deviation

    // 如果是负向维度（I, N, F, P），百分比应该是 100 - probability
    // 这样 3% 的 N 就会显示为 97% 的 N
    const displayPercentage = rawScore < 0 ? 100 - Math.round(probability) : Math.round(probability)

    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage: displayPercentage,
      label
    })
  }

  // 处理AT维度 (Assertive/Turbulent)
  const atRawScore = dimensions.AT
  const atMaxPossible = counts.AT * 2
  const atProbability = sigmoid(atRawScore, 0.15) * 100

  // 正分 = Assertive (-A), 负分 = Turbulent (-T)
  const atLetter = atRawScore >= 0 ? 'A' : 'T'
  const atLabel = atRawScore >= 0 ? dimensionLabels.AT[0] : dimensionLabels.AT[1]
  const atDeviation = atMaxPossible > 0 ? Math.abs(atRawScore) / atMaxPossible : 0
  const atDisplayPercentage = atRawScore < 0 ? 100 - Math.round(atProbability) : Math.round(atProbability)

  // 添加 -A 或 -T 后缀
  typeString += '-' + atLetter

  dimensionScores.push({
    dimension: 'AT',
    rawScore: atRawScore,
    percentage: atDisplayPercentage,
    label: atLabel
  })

  totalConfidence += atDeviation

  // 整体置信度（0-100）
  const confidence = Math.round((totalConfidence / 5) * 100)

  return {
    type: 'MBTI',
    score: typeString,
    dimensions: dimensionScores,
    confidence
  }
}

// 获取 MBTI 类型描述（不包含 -A/-T 后缀）
export function getMBTIDescription(type: string): string {
  // 移除 -A 或 -T 后缀
  const baseType = type.replace(/-[AT]$/, '')
  return mbtiTypeDescriptions[baseType] || '未知类型'
}

