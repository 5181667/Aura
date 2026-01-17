// 九型人格评分算法

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

// 九型人格类型标签
const typeLabels: Record<string, string> = {
  '1': '完美主义者 The Perfectionist',
  '2': '助人者 The Helper',
  '3': '成就者 The Achiever',
  '4': '艺术家 The Individualist',
  '5': '观察者 The Investigator',
  '6': '忠诚者 The Loyalist',
  '7': '热情者 The Enthusiast',
  '8': '领导者 The Challenger',
  '9': '和平者 The Peacemaker'
}

// 九型人格类型详细描述
export const enneagramTypeDescriptions: Record<string, {
  coreMotivation: string
  coreFear: string
  strengths: string[]
  weaknesses: string[]
  growthPath: string
}> = {
  '1': {
    coreMotivation: '追求完美和正确',
    coreFear: '害怕犯错或不道德',
    strengths: ['有原则', '公正', '高标准', '自律', '有组织'],
    weaknesses: ['过于挑剔', '不够灵活', '自我批评过度'],
    growthPath: '学习接受不完美，培养宽容和灵活性'
  },
  '2': {
    coreMotivation: '被需要和被爱',
    coreFear: '害怕不被爱或不被需要',
    strengths: ['关爱他人', '善解人意', '慷慨', '热情', '支持性强'],
    weaknesses: ['忽视自身需求', '可能过度干涉', '需要认可'],
    growthPath: '学习关爱自己，设定健康的界限'
  },
  '3': {
    coreMotivation: '成功和被认可',
    coreFear: '害怕失败或毫无价值',
    strengths: ['高效', '适应力强', '自信', '目标导向', '激励他人'],
    weaknesses: ['过于注重形象', '可能忽视真实感受', '工作狂倾向'],
    growthPath: '关注内在价值，培养真实性和深度关系'
  },
  '4': {
    coreMotivation: '独特性和真实性',
    coreFear: '害怕平庸或没有身份认同',
    strengths: ['创造力强', '敏感', '真实', '有深度', '艺术性'],
    weaknesses: ['情绪化', '可能自怜', '与他人比较'],
    growthPath: '学习欣赏平凡，培养情绪平衡'
  },
  '5': {
    coreMotivation: '知识和理解',
    coreFear: '害怕无能或被侵入',
    strengths: ['分析能力强', '独立', '观察敏锐', '专注', '客观'],
    weaknesses: ['可能过于疏离', '囤积资源', '难以表达情感'],
    growthPath: '学习参与生活，表达情感和需求'
  },
  '6': {
    coreMotivation: '安全和支持',
    coreFear: '害怕被抛弃或没有支持',
    strengths: ['忠诚', '负责', '有准备', '可靠', '善于预见问题'],
    weaknesses: ['过度焦虑', '优柔寡断', '可能过于多疑'],
    growthPath: '培养自信，学习信任自己和他人'
  },
  '7': {
    coreMotivation: '快乐和自由',
    coreFear: '害怕痛苦或被限制',
    strengths: ['乐观', '多才多艺', '热情', '冒险精神', '点子多'],
    weaknesses: ['难以专注', '逃避痛苦', '可能过于肤浅'],
    growthPath: '学习面对困难，培养深度和专注'
  },
  '8': {
    coreMotivation: '控制和自我保护',
    coreFear: '害怕被控制或伤害',
    strengths: ['自信', '果断', '保护性', '直接', '领导力强'],
    weaknesses: ['过于强势', '难以示弱', '可能具有攻击性'],
    growthPath: '学习脆弱的力量，培养温和和开放'
  },
  '9': {
    coreMotivation: '和平与和谐',
    coreFear: '害怕冲突或分离',
    strengths: ['包容', '平和', '善于调解', '有耐心', '支持性'],
    weaknesses: ['回避冲突', '忽视自身需求', '可能被动'],
    growthPath: '学习表达自己，承认并追求自身需求'
  }
}

export function calculateEnneagram(answers: Answer[]): TestResult {
  // 初始化九种类型得分
  const dimensions: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
  }
  const counts: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
  }
  
  // 累加得分
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })
  
  // 计算每个类型的百分比分数
  const dimensionScores: DimensionScore[] = []
  
  for (const type of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
    const rawScore = dimensions[type]
    const count = counts[type]
    const minPossible = count * 1
    const maxPossible = count * 5
    
    // 归一化到 0-100
    const percentage = count > 0 ? normalize(rawScore, minPossible, maxPossible) : 0
    
    dimensionScores.push({
      dimension: type,
      rawScore,
      percentage,
      label: typeLabels[type]
    })
  }
  
  // 按分数排序，找出主要类型和翼型
  const sortedDims = [...dimensionScores].sort((a, b) => b.percentage - a.percentage)
  const primaryType = sortedDims[0].dimension
  
  // 计算翼型（相邻两个数字中分数较高的）
  const prevType = primaryType === '1' ? '9' : String(parseInt(primaryType) - 1)
  const nextType = primaryType === '9' ? '1' : String(parseInt(primaryType) + 1)
  
  const prevScore = dimensionScores.find(d => d.dimension === prevType)?.percentage || 0
  const nextScore = dimensionScores.find(d => d.dimension === nextType)?.percentage || 0
  
  const wing = prevScore > nextScore ? prevType : nextType
  const enneagramCode = `${primaryType}w${wing}`
  
  return {
    type: 'ENNEAGRAM',
    score: enneagramCode,
    dimensions: dimensionScores
  }
}

// 获取九型人格类型描述
export function getEnneagramDescription(type: string) {
  // 提取主类型数字
  const mainType = type.charAt(0)
  return enneagramTypeDescriptions[mainType] || enneagramTypeDescriptions['9']
}

// 获取类型名称
export function getEnneagramTypeName(type: string): string {
  const mainType = type.charAt(0)
  return typeLabels[mainType] || '未知类型'
}
