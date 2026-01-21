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

// ============ 高级付费报告 ============

// 高级报告数据结构
export interface PremiumReportData {
  // 基础信息
  testType: string
  score: string
  generatedAt: string
  
  // 维度百分比详解
  dimensionAnalysis: {
    dimension: string
    label: string
    percentage: number
    description: string
    strengths: string[]
    challenges: string[]
  }[]
  
  // 恋爱分析（细分领域）
  loveAnalysis: {
    overview: string
    attachmentStyle: string
    idealPartnerTraits: string[]
    communicationInLove: string
    conflictResolution: string
    datingAdvice: string[]
    redFlags: string[]
    greenFlags: string[]
    compatibleTypes: string[]
    incompatibleTypes: string[]
    longTermRelationship: string
  }
  
  // 个人成长
  personalGrowth: {
    overview: string
    coreStrengths: string[]
    blindSpots: string[]
    growthPath: string[]
    recommendedBooks: string[]
    habits: string[]
    mindsetShifts: string[]
    shortTermGoals: string[]
    longTermGoals: string[]
  }
  
  // 事业分析
  careerAnalysis: {
    overview: string
    idealIndustries: string[]
    idealRoles: string[]
    workStyle: string
    leadershipStyle: string
    teamDynamics: string
    careerRisks: string[]
    careerAdvantages: string[]
    fiveYearPath: string
    salaryPotential: string
  }
  
  // 工作分析（日常工作场景）
  workAnalysis: {
    productivityTips: string[]
    communicationStyle: string
    meetingBehavior: string
    stressResponse: string
    collaborationStyle: string
    feedbackPreference: string
    idealWorkEnvironment: string
    workLifeBalance: string
  }
  
  // 图表数据
  charts: {
    radarData: Record<string, number>
    dimensionBars: { label: string; value: number; color: string }[]
    compatibilityScores: { type: string; score: number }[]
  }
  
  // 统计数据
  statistics: {
    populationPercentage: string
    famousPeople: string[]
    typicalCareers: string[]
    globalDistribution: string
    genderDistribution: string
  }
}

// 生成高级报告的 Prompt
function generatePremiumReportPrompt(testResult: TestResultData, gender?: string): string {
  const testTypeNames: Record<string, string> = {
    'MBTI': 'MBTI 16型人格',
    'BIG_FIVE': '大五人格',
    'DISC': 'DISC 行为风格',
    'EQ': '情商',
    'HOLLAND': '霍兰德职业兴趣',
    'ENNEAGRAM': '九型人格'
  }

  const genderContext = gender ? `用户性别：${gender === 'male' ? '男' : '女'}` : ''

  return `你是一位资深心理咨询师、职业规划专家和情感顾问，拥有20年从业经验。请基于以下测试结果，生成一份详尽的付费高级分析报告。

【测试结果】
- 测试类型：${testTypeNames[testResult.testType] || testResult.testType}
- 结果类型：${testResult.score}
${genderContext}
- 各维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请按以下JSON格式输出完整的高级分析报告。报告要求：
1. 内容要非常详细、专业、有深度
2. 针对用户的具体测试结果进行个性化分析
3. 每个建议都要具体可操作
4. 恋爱分析要细化到具体场景
5. 职业建议要结合当前就业市场趋势

JSON格式：
{
  "testType": "${testResult.testType}",
  "score": "${testResult.score}",
  "generatedAt": "${new Date().toISOString()}",
  
  "dimensionAnalysis": [
    {
      "dimension": "维度代码",
      "label": "维度名称",
      "percentage": 数值,
      "description": "200字以上的详细分析",
      "strengths": ["优势1", "优势2", "优势3"],
      "challenges": ["挑战1", "挑战2"]
    }
  ],
  
  "loveAnalysis": {
    "overview": "300字的恋爱特点总体分析",
    "attachmentStyle": "依恋类型分析，100字",
    "idealPartnerTraits": ["理想伴侣特质1", "特质2", "特质3", "特质4", "特质5"],
    "communicationInLove": "恋爱中的沟通方式分析，150字",
    "conflictResolution": "冲突解决方式分析，150字",
    "datingAdvice": ["约会建议1", "建议2", "建议3", "建议4", "建议5"],
    "redFlags": ["需要警惕的恋爱陷阱1", "陷阱2", "陷阱3"],
    "greenFlags": ["适合的恋爱信号1", "信号2", "信号3"],
    "compatibleTypes": ["最匹配类型1", "类型2", "类型3"],
    "incompatibleTypes": ["不太匹配类型1", "类型2"],
    "longTermRelationship": "长期关系维护建议，200字"
  },
  
  "personalGrowth": {
    "overview": "300字的个人成长总体分析",
    "coreStrengths": ["核心优势1", "优势2", "优势3", "优势4", "优势5"],
    "blindSpots": ["盲点1", "盲点2", "盲点3"],
    "growthPath": ["成长路径建议1", "建议2", "建议3", "建议4"],
    "recommendedBooks": ["《推荐书籍1》- 简要说明", "《书籍2》", "《书籍3》"],
    "habits": ["建议养成的习惯1", "习惯2", "习惯3", "习惯4"],
    "mindsetShifts": ["需要转变的思维1", "思维2", "思维3"],
    "shortTermGoals": ["3个月目标1", "目标2", "目标3"],
    "longTermGoals": ["1年目标1", "目标2", "目标3"]
  },
  
  "careerAnalysis": {
    "overview": "300字的事业发展总体分析",
    "idealIndustries": ["最适合行业1", "行业2", "行业3", "行业4", "行业5"],
    "idealRoles": ["最适合职位1", "职位2", "职位3", "职位4", "职位5"],
    "workStyle": "工作风格分析，150字",
    "leadershipStyle": "领导风格分析，100字",
    "teamDynamics": "团队协作分析，150字",
    "careerRisks": ["职业风险1", "风险2", "风险3"],
    "careerAdvantages": ["职业优势1", "优势2", "优势3", "优势4"],
    "fiveYearPath": "五年职业发展路径规划，200字",
    "salaryPotential": "薪资发展潜力分析，100字"
  },
  
  "workAnalysis": {
    "productivityTips": ["提升效率建议1", "建议2", "建议3", "建议4", "建议5"],
    "communicationStyle": "职场沟通风格，100字",
    "meetingBehavior": "会议表现特点，80字",
    "stressResponse": "压力应对方式，100字",
    "collaborationStyle": "协作风格，100字",
    "feedbackPreference": "反馈偏好，80字",
    "idealWorkEnvironment": "理想工作环境，100字",
    "workLifeBalance": "工作生活平衡建议，100字"
  },
  
  "charts": {
    "radarData": {
      "维度1": 数值,
      "维度2": 数值,
      "维度3": 数值,
      "维度4": 数值,
      "维度5": 数值
    },
    "dimensionBars": [
      {"label": "维度名", "value": 数值, "color": "#颜色代码"}
    ],
    "compatibilityScores": [
      {"type": "类型名", "score": 0-100的兼容度分数}
    ]
  },
  
  "statistics": {
    "populationPercentage": "该类型在人群中的占比，如：约占人口的2-4%",
    "famousPeople": ["知名人物1", "人物2", "人物3", "人物4", "人物5"],
    "typicalCareers": ["典型职业1", "职业2", "职业3", "职业4", "职业5"],
    "globalDistribution": "全球分布特点，80字",
    "genderDistribution": "性别分布特点，50字"
  }
}

重要提示：
1. 所有分析必须基于用户的具体测试结果
2. 维度分析要覆盖所有测试维度
3. 恋爱分析要非常详细，这是用户最关心的内容
4. 职业建议要结合2024-2025年就业市场趋势
5. 只输出JSON，不要任何其他内容
6. 确保JSON格式正确，可以被解析`
}

// 生成高级报告
export async function generatePremiumReport(testResult: TestResultData, gender?: string): Promise<PremiumReportData> {
  const prompt = generatePremiumReportPrompt(testResult, gender)
  const response = await callDeepSeekAPI(prompt)
  return parseJSONResponse<PremiumReportData>(response)
}

// 生成模拟高级报告（用于测试）
export function generateMockPremiumReport(testResult: TestResultData): PremiumReportData {
  return {
    testType: testResult.testType,
    score: testResult.score,
    generatedAt: new Date().toISOString(),
    
    dimensionAnalysis: testResult.dimensions.map(d => ({
      dimension: d.dimension,
      label: d.label || d.dimension,
      percentage: d.percentage,
      description: `您在${d.label || d.dimension}维度的得分为${d.percentage}%，这表明您在这方面具有独特的特点。这个得分反映了您在日常生活和工作中的行为倾向，对于理解自己的性格特点非常重要。`,
      strengths: ['善于深度思考', '有独到见解', '注重质量'],
      challenges: ['可能过于谨慎', '有时难以快速决策']
    })),
    
    loveAnalysis: {
      overview: '根据您的测试结果，您在恋爱关系中展现出独特的魅力。您倾向于建立深层的情感连接，重视伴侣之间的精神交流。您可能不是一见钟情的类型，但一旦建立感情，会非常专一和投入。',
      attachmentStyle: '您可能属于安全型依恋，能够在亲密关系中保持健康的独立性，同时也能与伴侣建立深厚的情感连接。',
      idealPartnerTraits: ['善于倾听', '有独立思考能力', '情绪稳定', '尊重个人空间', '有共同话题'],
      communicationInLove: '您在恋爱中倾向于深度、有意义的对话，而非表面的闲聊。您可能需要时间来组织思想后再表达，但一旦开口，往往能提出独到的见解。',
      conflictResolution: '面对冲突时，您倾向于先冷静分析问题的本质，然后寻找逻辑上合理的解决方案。建议在处理情感冲突时，也要关注伴侣的情绪需求。',
      datingAdvice: ['选择安静舒适的约会场所', '准备一些深度话题', '不要急于表白，给感情发展时间', '展示你的真实一面', '适当表达关心'],
      redFlags: ['过于情绪化的人可能让你疲惫', '不尊重你个人空间的伴侣', '缺乏深度思考能力的人'],
      greenFlags: ['能进行有深度对话的人', '理解你需要独处时间', '有自己的爱好和追求'],
      compatibleTypes: ['INFJ', 'INTJ', 'ENFP'],
      incompatibleTypes: ['ESTP', 'ESFP'],
      longTermRelationship: '在长期关系中，您需要确保有足够的个人空间来充电，同时也要主动投入时间维护关系。建议建立固定的"深度交流"时间，与伴侣分享内心世界。'
    },
    
    personalGrowth: {
      overview: '您的性格类型具有独特的成长路径。您的分析能力和独立思考是您最大的优势，但也需要注意培养社交能力和情绪表达。成长的关键在于找到内在世界与外部世界的平衡。',
      coreStrengths: ['深度思考能力', '独立解决问题', '高度专注', '追求卓越', '洞察力强'],
      blindSpots: ['可能忽视他人情绪', '有时过于完美主义', '社交场合可能不适'],
      growthPath: ['培养共情能力', '学习表达情感', '建立更广泛的社交网络', '接受不完美'],
      recommendedBooks: ['《内向者优势》- 了解自己的能量来源', '《非暴力沟通》- 提升人际沟通', '《思考快与慢》- 深化思维能力'],
      habits: ['每日冥想10分钟', '每周至少一次社交活动', '记录情绪日记', '定期运动'],
      mindsetShifts: ['接受"足够好"而非完美', '他人的情绪需求同样重要', '社交是可以学习的技能'],
      shortTermGoals: ['尝试一项新的社交活动', '学习一门情商课程', '找到一个可以倾诉的朋友'],
      longTermGoals: ['建立稳定的社交圈', '在工作中担任领导角色', '实现工作与生活的平衡']
    },
    
    careerAnalysis: {
      overview: '您的性格特点非常适合需要深度思考和专业知识的职业。您倾向于独立工作，能够长时间专注于复杂问题。2024-2025年，AI和数据分析领域的发展为您提供了很好的机会。',
      idealIndustries: ['科技/互联网', '金融/投资', '咨询/研究', '教育/学术', '医疗/生物技术'],
      idealRoles: ['数据科学家', '战略分析师', '产品经理', '研究员', '独立咨询顾问'],
      workStyle: '您倾向于深度工作模式，需要大块不受打扰的时间来思考和创造。开放式办公室可能会降低您的效率，远程工作或独立办公室更适合您。',
      leadershipStyle: '作为领导者，您更倾向于通过专业能力赢得尊重，而非个人魅力。您会给团队成员足够的自主权，但有时可能忽视团队建设。',
      teamDynamics: '在团队中，您通常扮演"思想者"的角色，负责提供深度分析和战略方向。您可能需要与执行力强的同事配合，以确保想法能够落地。',
      careerRisks: ['避免过于封闭，需要适当社交', '警惕完美主义导致的拖延', '关注行业变化，持续学习'],
      careerAdvantages: ['深度专业能力', '独立解决问题', '战略思维', '高度专注'],
      fiveYearPath: '第1-2年：在专业领域深耕，建立核心竞争力；第3年：开始承担更多项目管理职责；第4-5年：向专家或管理方向发展，考虑成为独立咨询顾问或团队负责人。',
      salaryPotential: '根据您的类型特点，在专业领域深耕可以获得高于平均的薪资回报。技术专家路线年薪潜力可达50-100万，管理路线潜力更高。'
    },
    
    workAnalysis: {
      productivityTips: ['使用番茄工作法保持专注', '上午处理需要深度思考的工作', '设置"免打扰"时间段', '使用任务管理工具', '定期回顾和调整优先级'],
      communicationStyle: '您倾向于书面沟通，能够清晰、逻辑地表达观点。面对面沟通时可能需要准备时间，但一旦准备充分，表达会非常有力。',
      meetingBehavior: '您在会议中通常先倾听、思考，然后再发言。您的发言往往经过深思熟虑，具有建设性。可能不擅长即兴发言。',
      stressResponse: '面对压力时，您可能会选择独处来理清思路。过度压力可能导致社交退缩，需要注意及时寻求支持。',
      collaborationStyle: '您更喜欢与少数人深度合作，而非大团队协作。一对一讨论或小组工作是您的舒适区。',
      feedbackPreference: '您倾向于接收具体、有建设性的反馈，而非笼统的表扬。您也更喜欢书面反馈，这样可以有时间思考和消化。',
      idealWorkEnvironment: '安静、有序、能够独立工作的环境最适合您。需要有私人空间来深度思考，同时也要有与同事交流的机会。',
      workLifeBalance: '您可能容易沉浸在工作中忘记休息。建议设定明确的工作时间边界，确保有足够的个人时间来恢复能量。'
    },
    
    charts: {
      radarData: {
        '分析能力': 85,
        '社交能力': 55,
        '执行力': 70,
        '创造力': 80,
        '领导力': 65
      },
      dimensionBars: testResult.dimensions.map(d => ({
        label: d.label || d.dimension,
        value: d.percentage,
        color: '#8b5cf6'
      })),
      compatibilityScores: [
        { type: 'INFJ', score: 95 },
        { type: 'INTJ', score: 90 },
        { type: 'ENFP', score: 85 },
        { type: 'ENTP', score: 80 },
        { type: 'INFP', score: 75 }
      ]
    },
    
    statistics: {
      populationPercentage: '约占人口的2-4%，是较为稀少的类型',
      famousPeople: ['爱因斯坦', '马克·扎克伯格', '比尔·盖茨', '伊隆·马斯克', '艾萨克·牛顿'],
      typicalCareers: ['软件工程师', '科学家', '战略顾问', '投资分析师', '大学教授'],
      globalDistribution: '在科技发达地区和高等教育程度较高的群体中更为常见，北欧和东亚地区比例略高。',
      genderDistribution: '男性比例略高于女性，但差异不显著，约为55:45。'
    }
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
