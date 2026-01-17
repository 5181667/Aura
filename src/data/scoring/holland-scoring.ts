// Holland 霍兰德职业兴趣评分算法

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

// Holland 维度标签
const dimensionLabels: Record<string, string> = {
  'R': '现实型 Realistic',
  'I': '研究型 Investigative',
  'A': '艺术型 Artistic',
  'S': '社会型 Social',
  'E': '企业型 Enterprising',
  'C': '常规型 Conventional'
}

// Holland 类型职业建议
export const hollandCareerSuggestions: Record<string, { description: string; careers: string[] }> = {
  'R': {
    description: '喜欢使用工具、机器，偏好具体的任务，善于动手操作',
    careers: ['工程师', '技术员', '建筑师', '机械师', '飞行员', '农业专家', '运动员']
  },
  'I': {
    description: '喜欢思考、分析、研究，善于解决抽象问题',
    careers: ['科学家', '研究员', '医生', '程序员', '数据分析师', '大学教授', '心理学家']
  },
  'A': {
    description: '喜欢创造性工作，重视自我表达和独特性',
    careers: ['艺术家', '设计师', '音乐家', '作家', '演员', '摄影师', '建筑设计师']
  },
  'S': {
    description: '喜欢与人互动，善于帮助、教导和关心他人',
    careers: ['教师', '护士', '社工', '心理咨询师', '人力资源', '培训师', '医生']
  },
  'E': {
    description: '喜欢领导、说服和管理，追求权力和地位',
    careers: ['企业家', '销售经理', '市场总监', '律师', '政治家', '公关专家', '项目经理']
  },
  'C': {
    description: '喜欢有序、系统的工作，善于处理数据和细节',
    careers: ['会计师', '银行职员', '行政人员', '秘书', '档案管理员', '审计师', '统计员']
  }
}

export function calculateHolland(answers: Answer[]): TestResult {
  // 初始化维度得分
  const dimensions: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  
  // 累加得分
  answers.forEach(ans => {
    if (dimensions.hasOwnProperty(ans.dimension)) {
      dimensions[ans.dimension] += ans.value
      counts[ans.dimension]++
    }
  })
  
  // 计算每个维度的百分比分数
  const dimensionScores: DimensionScore[] = []
  
  for (const dim of ['R', 'I', 'A', 'S', 'E', 'C']) {
    const rawScore = dimensions[dim]
    const count = counts[dim]
    const minPossible = count * 1
    const maxPossible = count * 5
    
    // 归一化到 0-100
    const percentage = normalize(rawScore, minPossible, maxPossible)
    
    dimensionScores.push({
      dimension: dim,
      rawScore,
      percentage,
      label: dimensionLabels[dim]
    })
  }
  
  // 按分数排序，取前三个作为职业代码
  const sortedDims = [...dimensionScores].sort((a, b) => b.percentage - a.percentage)
  const hollandCode = sortedDims.slice(0, 3).map(d => d.dimension).join('')
  
  return {
    type: 'HOLLAND',
    score: hollandCode,
    dimensions: dimensionScores
  }
}

// 获取职业建议
export function getHollandCareerSuggestions(primaryType: string) {
  return hollandCareerSuggestions[primaryType] || hollandCareerSuggestions['R']
}

// 根据三位代码获取综合职业建议
export function getHollandCodeCareers(code: string): string[] {
  const careers: Set<string> = new Set()
  for (const letter of code) {
    const suggestion = hollandCareerSuggestions[letter]
    if (suggestion) {
      suggestion.careers.forEach(c => careers.add(c))
    }
  }
  return Array.from(careers).slice(0, 10)
}
