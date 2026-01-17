// DeepSeek API 集成模块

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 单次测试分析结果接口
export interface SingleTestAnalysis {
  testType: string
  summary: string
  typeDescription: string
  dimensionBreakdown: {
    dimension: string
    score: number
    analysis: string
  }[]
  strengths: string[]
  weaknesses: string[]
  careerSuggestions: string[]
  relationshipTips: string[]
  growthAdvice: string[]
}

// 全面综合分析结果接口
export interface FullAnalysisResult {
  overallProfile: {
    summary: string
    coreTraits: string[]
    consistencyScore: number
  }
  crossTestInsights: {
    mbtiVsBigFive?: string
    discVsHolland?: string
    eqImpact?: string
    enneagramDepth?: string
  }
  integratedAdvice: {
    careerPath: {
      idealCareers: string[]
      avoidCareers: string[]
      developmentPath: string
    }
    personalGrowth: {
      priorityAreas: string[]
      actionPlan: string[]
      resources: string[]
    }
    relationships: {
      communicationStyle: string
      idealPartnerTypes: string[]
      teamRoleAdvice: string
    }
    lifeBalance: {
      stressManagement: string[]
      energyManagement: string
      workLifeBalance: string
    }
  }
  visualData: {
    radarChartData: Record<string, number>
    trendAnalysis?: object
    typeDistribution?: object
  }
}

// 测试结果数据
interface TestResultData {
  testType: string
  score: string
  dimensions: {
    dimension: string
    percentage: number
    label?: string
  }[]
}

// 生成单次测试分析的 Prompt
function generateSingleAnalysisPrompt(testResult: TestResultData): string {
  const testTypeNames: Record<string, string> = {
    'MBTI': 'MBTI 16型人格',
    'BIG_FIVE': '大五人格',
    'DISC': 'DISC 行为风格',
    'EQ': '情商',
    'HOLLAND': '霍兰德职业兴趣',
    'ENNEAGRAM': '九型人格'
  }

  return `你是一位专业的心理咨询师和职业规划专家。请根据以下${testTypeNames[testResult.testType] || testResult.testType}测试结果，提供详细的分析报告。

【测试结果】
- 测试类型：${testTypeNames[testResult.testType] || testResult.testType}
- 结果类型：${testResult.score}
- 各维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请按以下JSON格式输出分析报告：
{
  "testType": "${testResult.testType}",
  "summary": "100-150字的总体概述",
  "typeDescription": "对该类型的详细描述，200-300字",
  "dimensionBreakdown": [
    {
      "dimension": "维度名称",
      "score": 分数,
      "analysis": "该维度的详细分析"
    }
  ],
  "strengths": ["优势1", "优势2", "优势3"],
  "weaknesses": ["可改进点1", "可改进点2"],
  "careerSuggestions": ["职业建议1", "职业建议2", "职业建议3"],
  "relationshipTips": ["人际关系建议1", "人际关系建议2"],
  "growthAdvice": ["个人成长建议1", "个人成长建议2", "个人成长建议3"]
}

注意事项：
1. 分析要基于测试数据，具体且有针对性
2. 语言要专业但易懂，避免过于学术化
3. 建议要切实可行，有操作性
4. 只输出JSON，不要其他内容`
}

// 生成全面综合分析的 Prompt
function generateFullAnalysisPrompt(testResults: TestResultData[]): string {
  const testSummaries = testResults.map(result => {
    const testTypeNames: Record<string, string> = {
      'MBTI': 'MBTI 16型人格',
      'BIG_FIVE': '大五人格',
      'DISC': 'DISC 行为风格',
      'EQ': '情商',
      'HOLLAND': '霍兰德职业兴趣',
      'ENNEAGRAM': '九型人格'
    }
    return `【${testTypeNames[result.testType] || result.testType}】
- 结果：${result.score}
- 维度：${result.dimensions.map(d => `${d.label || d.dimension}(${d.percentage}%)`).join(', ')}`
  }).join('\n\n')

  return `你是一位资深心理咨询师和职业规划专家，具有以下专业背景：
- 熟悉 MBTI、大五人格、DISC、情商、霍兰德职业兴趣、九型人格等主流心理测评工具
- 了解各测评工具之间的关联性和差异性
- 能够进行跨测评的交叉验证和综合分析

请根据以下用户的多项测试结果，进行全面综合分析：

${testSummaries}

请按以下JSON格式输出综合分析报告：
{
  "overallProfile": {
    "summary": "200-300字的整体性格画像描述",
    "coreTraits": ["核心特质1", "核心特质2", "核心特质3", "核心特质4", "核心特质5"],
    "consistencyScore": 0-100之间的一致性评分
  },
  "crossTestInsights": {
    "mbtiVsBigFive": "MBTI与大五人格的关联分析（如有）",
    "discVsHolland": "DISC与霍兰德的职业匹配分析（如有）",
    "eqImpact": "情商对其他维度的影响分析（如有）",
    "enneagramDepth": "九型人格揭示的深层动机（如有）"
  },
  "integratedAdvice": {
    "careerPath": {
      "idealCareers": ["最适合的职业1", "职业2", "职业3", "职业4", "职业5"],
      "avoidCareers": ["不太适合的职业1", "职业2"],
      "developmentPath": "职业发展路径建议，100-150字"
    },
    "personalGrowth": {
      "priorityAreas": ["重点发展领域1", "领域2", "领域3"],
      "actionPlan": ["具体行动1", "行动2", "行动3", "行动4"],
      "resources": ["推荐资源1", "资源2"]
    },
    "relationships": {
      "communicationStyle": "沟通风格描述，50-100字",
      "idealPartnerTypes": ["适合的伴侣类型1", "类型2"],
      "teamRoleAdvice": "团队角色建议，50-100字"
    },
    "lifeBalance": {
      "stressManagement": ["压力管理建议1", "建议2", "建议3"],
      "energyManagement": "能量管理建议，50-100字",
      "workLifeBalance": "工作生活平衡建议，50-100字"
    }
  },
  "visualData": {
    "radarChartData": {
      "开放性": 分数,
      "尽责性": 分数,
      "外向性": 分数,
      "宜人性": 分数,
      "情绪稳定": 分数
    }
  }
}

注意事项：
1. 分析应基于所有测试数据，进行交叉验证
2. 如发现测试结果不一致，需指出并分析可能原因
3. 建议要具体可行，避免空洞
4. 只输出JSON，不要其他内容`
}

// 调用 DeepSeek API
async function callDeepSeekAPI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 未配置')
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的心理咨询师和职业规划专家，擅长分析各类心理测评结果并提供有价值的建议。请始终以JSON格式输出结果。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API 调用失败: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// 解析 JSON 响应
function parseJSONResponse<T>(content: string): T {
  // 尝试提取 JSON 内容
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 响应')
  }
  
  try {
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    throw new Error('JSON 解析失败')
  }
}

// 分析单次测试结果
export async function analyzeSingleTest(testResult: TestResultData): Promise<SingleTestAnalysis> {
  const prompt = generateSingleAnalysisPrompt(testResult)
  const response = await callDeepSeekAPI(prompt)
  return parseJSONResponse<SingleTestAnalysis>(response)
}

// 全面综合分析
export async function analyzeFullProfile(testResults: TestResultData[]): Promise<FullAnalysisResult> {
  if (testResults.length === 0) {
    throw new Error('没有测试结果可供分析')
  }

  const prompt = generateFullAnalysisPrompt(testResults)
  const response = await callDeepSeekAPI(prompt)
  return parseJSONResponse<FullAnalysisResult>(response)
}

// 生成模拟分析（用于 API Key 未配置时的演示）
export function generateMockSingleAnalysis(testResult: TestResultData): SingleTestAnalysis {
  return {
    testType: testResult.testType,
    summary: `根据您的${testResult.testType}测试结果（${testResult.score}），您展现出独特的性格特点。您的各维度得分显示了您在不同方面的倾向和特点。`,
    typeDescription: `您的类型是 ${testResult.score}，这种类型的人通常具有独特的思维方式和行为模式。他们在各自擅长的领域表现出色，同时也有需要注意和发展的方面。`,
    dimensionBreakdown: testResult.dimensions.map(d => ({
      dimension: d.dimension,
      score: d.percentage,
      analysis: `您在${d.label || d.dimension}维度的得分为${d.percentage}%，这表明您在这方面有明显的倾向。`
    })),
    strengths: ['善于分析问题', '具有创造力', '坚持原则'],
    weaknesses: ['可能过于追求完美', '需要更多社交互动'],
    careerSuggestions: ['研究员', '分析师', '咨询顾问', '策划师'],
    relationshipTips: ['学会表达情感', '多听取他人意见', '保持开放心态'],
    growthAdvice: ['培养耐心', '多参与团队活动', '学习情绪管理', '拓展社交圈']
  }
}

// 生成模拟全面分析
export function generateMockFullAnalysis(testResults: TestResultData[]): FullAnalysisResult {
  return {
    overallProfile: {
      summary: '根据您完成的多项心理测评，我们为您绘制了一幅全面的性格画像。您展现出独特的思维方式和行为模式，具有明确的优势领域，同时也有值得关注的发展方向。',
      coreTraits: ['分析能力强', '追求完美', '独立思考', '有责任心', '善于规划'],
      consistencyScore: 85
    },
    crossTestInsights: {
      mbtiVsBigFive: '您的MBTI类型与大五人格测试结果高度一致，都显示出您倾向于独立思考和深度分析。',
      discVsHolland: '您的DISC风格与霍兰德职业兴趣测试结果相呼应，表明您适合需要专业知识和分析能力的职业。',
      eqImpact: '您的情商水平对人际关系有积极影响，能够帮助您在团队中更好地合作。',
      enneagramDepth: '九型人格测试揭示了您内心深处的动机和恐惧，这对理解自己的行为模式很有帮助。'
    },
    integratedAdvice: {
      careerPath: {
        idealCareers: ['数据分析师', '战略咨询师', '产品经理', '研究员', '技术专家'],
        avoidCareers: ['高压销售', '重复性工作'],
        developmentPath: '建议先在专业领域深耕，积累足够的专业知识和经验后，可以考虑向管理或咨询方向发展。'
      },
      personalGrowth: {
        priorityAreas: ['人际沟通', '情绪管理', '执行力'],
        actionPlan: ['每周参加一次社交活动', '学习非暴力沟通技巧', '设定每日小目标并完成', '定期进行自我反思'],
        resources: ['《非暴力沟通》', '《高效能人士的七个习惯》']
      },
      relationships: {
        communicationStyle: '您倾向于理性、逻辑的沟通方式，建议在沟通中加入更多情感表达。',
        idealPartnerTypes: ['善于表达情感的人', '有耐心的倾听者'],
        teamRoleAdvice: '您适合担任团队中的分析师或策略制定者角色，建议与善于执行的团队成员配合。'
      },
      lifeBalance: {
        stressManagement: ['定期运动', '冥想或正念练习', '保持充足睡眠'],
        energyManagement: '注意在社交活动后给自己充足的独处时间来恢复能量。',
        workLifeBalance: '设定明确的工作和生活边界，避免过度工作导致身心疲惫。'
      }
    },
    visualData: {
      radarChartData: {
        '开放性': 75,
        '尽责性': 80,
        '外向性': 45,
        '宜人性': 65,
        '情绪稳定': 70
      }
    }
  }
}
