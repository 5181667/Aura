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
    rawScore?: number
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
    'ENNEAGRAM': '九型人格',
    'DEPRESSION': '综合抑郁评估'
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
      'ENNEAGRAM': '九型人格',
      'DEPRESSION': '综合抑郁评估'
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

// 高级报告数据结构（兼容所有测试类型）
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

  // 关系/恋爱分析（通用字段，按测试类型含义不同）
  // MBTI/BIG_FIVE/ENNEAGRAM: 恋爱分析; DISC/EQ: 人际关系分析; HOLLAND: 职业社交分析; DEPRESSION: 情感支持分析
  relationshipAnalysis: {
    overview: string
    attachmentStyle?: string           // MBTI/BIG_FIVE/ENNEAGRAM 专用
    idealPartnerTraits?: string[]      // MBTI/BIG_FIVE/ENNEAGRAM 专用
    communicationInRelationship: string
    conflictResolution: string
    advice: string[]
    redFlags: string[]
    greenFlags: string[]
    compatibleTypes?: string[]         // 仅 MBTI/ENNEAGRAM/DISC 有类型概念
    incompatibleTypes?: string[]       // 仅 MBTI/ENNEAGRAM/DISC 有类型概念
    longTermRelationship?: string
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

  // 事业/职业分析
  careerAnalysis: {
    overview: string
    idealIndustries: string[]
    idealRoles: string[]
    workStyle: string
    leadershipStyle?: string           // DEPRESSION 无此项
    teamDynamics: string
    careerRisks: string[]
    careerAdvantages: string[]
    fiveYearPath?: string              // DEPRESSION 无此项
    salaryPotential?: string           // DEPRESSION 无此项
  }

  // 工作分析（日常工作场景）
  workAnalysis: {
    productivityTips: string[]
    communicationStyle: string
    meetingBehavior?: string
    stressResponse: string
    collaborationStyle: string
    feedbackPreference?: string
    idealWorkEnvironment: string
    workLifeBalance: string
  }

  // 测试类型专属深度解读
  testSpecificInsights?: {
    title: string
    sections: {
      heading: string
      content: string
    }[]
  }

  // 图表数据
  charts: {
    radarData: Record<string, number>
    dimensionBars: { label: string; value: number; color: string }[]
    compatibilityScores?: { type: string; score: number }[]  // 非所有测试都有
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

// 通用 JSON 输出格式说明（所有测试共用的基础字段）
const COMMON_JSON_HEADER = (testType: string, score: string) => `{
  "testType": "${testType}",
  "score": "${score}",
  "generatedAt": "${new Date().toISOString()}",
  "dimensionAnalysis": [
    { "dimension": "维度代码", "label": "维度中文名", "percentage": 数值, "description": "200字以上的详细分析", "strengths": ["优势1","优势2","优势3"], "challenges": ["挑战1","挑战2"] }
  ],`

const COMMON_JSON_GROWTH = `
  "personalGrowth": {
    "overview": "300字的个人成长总体分析",
    "coreStrengths": ["核心优势1","优势2","优势3","优势4","优势5"],
    "blindSpots": ["盲点1","盲点2","盲点3"],
    "growthPath": ["成长路径建议1","建议2","建议3","建议4"],
    "recommendedBooks": ["《推荐书籍1》- 简要说明","《书籍2》","《书籍3》"],
    "habits": ["建议养成的习惯1","习惯2","习惯3","习惯4"],
    "mindsetShifts": ["需要转变的思维1","思维2","思维3"],
    "shortTermGoals": ["3个月目标1","目标2","目标3"],
    "longTermGoals": ["1年目标1","目标2","目标3"]
  },`

const COMMON_JSON_FOOTER = `
  "charts": {
    "radarData": { "各维度中文名": "对应百分比数值" },
    "dimensionBars": [{"label":"维度名","value":数值,"color":"#颜色代码"}]
  },
  "statistics": {
    "populationPercentage": "该类型/水平在人群中的占比",
    "famousPeople": ["知名人物1","人物2","人物3","人物4","人物5"],
    "typicalCareers": ["典型职业1","职业2","职业3","职业4","职业5"],
    "globalDistribution": "全球分布特点，80字",
    "genderDistribution": "性别分布特点，50字"
  }
}`

const COMMON_RULES = `
重要提示：
1. 所有分析必须紧密基于用户的具体测试维度得分，不同得分应产生截然不同的分析内容
2. 维度分析要覆盖所有测试维度，不可遗漏
3. 每个建议都要具体可操作，避免空洞的鸡汤
4. 只输出JSON，不要任何其他内容
5. 确保JSON格式正确，可以被解析`

// ---- MBTI 专属 prompt ----
function generateMBTIPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通荣格分析心理学和 MBTI 理论的资深心理咨询师。你深入理解荣格的8种认知功能（Si/Se/Ni/Ne/Ti/Te/Fi/Fe）以及它们在16型人格中的功能栈排列。

【理论框架】
MBTI 基于卡尔·荣格的心理类型理论，通过4个二分维度（E/I外向/内向、S/N感觉/直觉、T/F思考/情感、J/P判断/感知）将人格分为16种类型。每种类型有其独特的认知功能栈（主导功能、辅助功能、第三功能、劣势功能），这决定了个体的信息处理方式和决策风格。

【测试结果】
- 测试类型：MBTI 16型人格
- 用户类型：${testResult.score}${genderContext}
- 各维度倾向度：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份专业的 MBTI 高级分析报告。要求：
1. 分析必须引用该类型的认知功能栈（如 INTJ 的 Ni-Te-Fi-Se），解释各功能如何影响行为
2. 维度分析中要指出倾向度强弱（如 60% 表示轻微倾向，90% 表示强烈倾向）
3. 恋爱匹配要基于认知功能互补理论
4. 职业建议要结合2025-2026年就业市场趋势

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "300字，基于认知功能分析恋爱中的表现模式",
    "attachmentStyle": "结合该类型的Fi/Fe位置分析依恋类型",
    "idealPartnerTraits": ["基于认知功能互补的伴侣特质1","特质2","特质3","特质4","特质5"],
    "communicationInRelationship": "恋爱中的沟通方式分析，引用T/F维度",
    "conflictResolution": "冲突解决方式，引用J/P维度",
    "advice": ["约会建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["该类型需要警惕的恋爱陷阱1","陷阱2","陷阱3"],
    "greenFlags": ["适合该类型的恋爱信号1","信号2","信号3"],
    "compatibleTypes": ["最匹配的MBTI类型1","类型2","类型3"],
    "incompatibleTypes": ["不太匹配的MBTI类型1","类型2"],
    "longTermRelationship": "长期关系维护建议，200字"
  },
${COMMON_JSON_GROWTH}
  "careerAnalysis": {
    "overview": "300字，基于认知功能分析职业适配性",
    "idealIndustries": ["最适合行业1","行业2","行业3","行业4","行业5"],
    "idealRoles": ["最适合职位1","职位2","职位3","职位4","职位5"],
    "workStyle": "基于J/P和E/I维度分析工作风格",
    "leadershipStyle": "基于Te/Fe分析领导风格",
    "teamDynamics": "基于E/I和T/F分析团队角色",
    "careerRisks": ["职业风险1","风险2","风险3"],
    "careerAdvantages": ["职业优势1","优势2","优势3","优势4"],
    "fiveYearPath": "五年职业发展路径",
    "salaryPotential": "薪资发展潜力分析"
  },
  "workAnalysis": {
    "productivityTips": ["基于认知功能的效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "职场沟通风格",
    "meetingBehavior": "会议表现特点",
    "stressResponse": "基于劣势功能分析压力反应",
    "collaborationStyle": "协作风格",
    "feedbackPreference": "反馈偏好",
    "idealWorkEnvironment": "理想工作环境",
    "workLifeBalance": "工作生活平衡建议"
  },
  "testSpecificInsights": {
    "title": "认知功能深度解读",
    "sections": [
      { "heading": "认知功能栈分析", "content": "300字，详细解释该类型的主导-辅助-第三-劣势功能及其在日常生活中的表现" },
      { "heading": "功能发展建议", "content": "200字，如何发展第三功能和劣势功能" },
      { "heading": "阴影功能与压力", "content": "200字，该类型在极端压力下的阴影功能表现（grip experience）" }
    ]
  },
${COMMON_JSON_FOOTER}

${COMMON_RULES}
6. compatibleTypes/incompatibleTypes 必须是具体的 MBTI 类型代码（如 ENFP、INFJ）`
}

// ---- 大五人格专属 prompt ----
function generateBigFivePremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通大五人格理论（Five-Factor Model）的心理学研究者，熟悉 Costa 和 McCrae 的 NEO-PI-R 量表体系及其在临床和组织心理学中的应用。

【理论框架】
大五人格模型（OCEAN）是当代人格心理学中实证基础最坚实的模型，由五个独立维度构成：
- 开放性(O): 对新经验的接受程度，与创造力、好奇心相关
- 尽责性(C): 自律、计划性和目标导向程度
- 外向性(E): 社交能量和积极情绪的倾向
- 宜人性(A): 合作、信任和利他倾向
- 神经质(N): 情绪不稳定性和负面情绪的易感性
与 MBTI 不同，大五人格是连续谱系模型，每个维度都是从低到高的连续分布，没有"类型"之分。

【测试结果】
- 测试类型：大五人格（50题）
- 得分模式：${testResult.score}${genderContext}
- 五维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份基于大五人格理论的高级分析报告。要求：
1. 分析必须基于连续谱系（如"您的外向性为72%，高于多数人，表明..."），而非简单的高/低分类
2. 注意维度间的交互效应（如高开放性+高尽责性 = 有纪律的创新者）
3. 引用相关心理学研究结论（如"研究表明，高尽责性者的职业成就显著更高"）
4. 不使用"类型匹配"概念，改用维度组合特征

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "300字，基于五因素分析亲密关系中的行为模式，特别关注宜人性(A)和神经质(N)的影响",
    "attachmentStyle": "基于E/N/A组合推断依恋倾向",
    "idealPartnerTraits": ["基于维度互补分析的伴侣特质1","特质2","特质3","特质4","特质5"],
    "communicationInRelationship": "基于E和A维度分析沟通风格",
    "conflictResolution": "基于A和N维度分析冲突处理方式",
    "advice": ["关系建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["该维度组合需警惕的关系模式1","模式2","模式3"],
    "greenFlags": ["有利的关系信号1","信号2","信号3"],
    "longTermRelationship": "长期关系维护建议"
  },
${COMMON_JSON_GROWTH}
  "careerAnalysis": {
    "overview": "300字，基于C/E/O维度组合分析职业适配性",
    "idealIndustries": ["行业1","行业2","行业3","行业4","行业5"],
    "idealRoles": ["职位1","职位2","职位3","职位4","职位5"],
    "workStyle": "基于C和E维度分析工作风格",
    "leadershipStyle": "基于E/A/C维度分析领导风格",
    "teamDynamics": "基于A/E维度分析团队角色",
    "careerRisks": ["风险1","风险2","风险3"],
    "careerAdvantages": ["优势1","优势2","优势3","优势4"],
    "fiveYearPath": "五年职业发展路径",
    "salaryPotential": "薪资发展潜力（引用相关研究数据）"
  },
  "workAnalysis": {
    "productivityTips": ["基于C维度的效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "职场沟通风格",
    "meetingBehavior": "会议表现特点",
    "stressResponse": "基于N维度分析压力反应",
    "collaborationStyle": "协作风格",
    "feedbackPreference": "反馈偏好",
    "idealWorkEnvironment": "理想工作环境",
    "workLifeBalance": "工作生活平衡建议"
  },
  "testSpecificInsights": {
    "title": "大五因素深度交互分析",
    "sections": [
      { "heading": "维度交互效应", "content": "300字，分析用户五个维度之间的交互作用（如O×C、E×A组合产生的独特行为模式）" },
      { "heading": "与人群常模对比", "content": "200字，将用户得分与一般人群常模对比，指出哪些维度显著偏离平均" },
      { "heading": "人格稳定性与发展", "content": "200字，基于研究说明各维度随年龄的自然变化趋势" }
    ]
  },
${COMMON_JSON_FOOTER}

${COMMON_RULES}
6. 注意：大五人格没有"类型匹配"概念，relationshipAnalysis 中不要包含 compatibleTypes/incompatibleTypes`
}

// ---- DISC 专属 prompt ----
function generateDISCPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通 DISC 行为风格理论的组织心理学顾问，熟悉 William Moulton Marston 的行为模型及其在企业管理和团队建设中的应用。

【理论框架】
DISC 模型基于 Marston 的理论，将行为风格分为四个维度：
- D(Dominance 支配型): 目标导向、决断力强、追求掌控
- I(Influence 影响型): 社交能力强、乐观、有感染力
- S(Steadiness 稳定型): 耐心、可靠、追求和谐稳定
- C(Compliance 谨慎型): 注重细节、追求质量和精准
每个人都是四种维度的不同组合，主导维度决定核心行为风格。DISC 是职场行为工具，重点在于理解工作中的行为表现和沟通偏好。

【测试结果】
- 测试类型：DISC 行为风格（28题）
- 主导类型：${testResult.score}${genderContext}
- 四维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份 DISC 行为风格高级分析报告。要求：
1. 重点分析工作场景中的行为表现，DISC 本质上是职场行为工具
2. 人际关系部分聚焦于"沟通风格与人际互动"而非恋爱分析
3. 工作分析要非常详细，这是 DISC 的核心应用场景
4. 给出与不同 DISC 类型同事的协作策略

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "300字，分析该DISC风格在人际互动中的表现模式（注意：聚焦沟通和社交风格，非恋爱）",
    "communicationInRelationship": "沟通风格的详细分析，包括如何与不同类型的人有效沟通",
    "conflictResolution": "冲突处理风格与策略",
    "advice": ["人际沟通改善建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["该风格在人际关系中需警惕的模式1","模式2","模式3"],
    "greenFlags": ["该风格的人际优势1","优势2","优势3"],
    "compatibleTypes": ["最容易合作的DISC类型1","类型2"],
    "incompatibleTypes": ["需要特别注意沟通方式的DISC类型1","类型2"]
  },
${COMMON_JSON_GROWTH}
  "careerAnalysis": {
    "overview": "400字，基于DISC类型深度分析职业发展方向（这是DISC的核心领域）",
    "idealIndustries": ["行业1","行业2","行业3","行业4","行业5"],
    "idealRoles": ["职位1","职位2","职位3","职位4","职位5"],
    "workStyle": "200字，详细的工作风格分析",
    "leadershipStyle": "150字，该DISC类型的领导力特点",
    "teamDynamics": "200字，在团队中的角色和与各类型的协作策略",
    "careerRisks": ["风险1","风险2","风险3"],
    "careerAdvantages": ["优势1","优势2","优势3","优势4"],
    "fiveYearPath": "五年职业发展路径",
    "salaryPotential": "薪资发展潜力"
  },
  "workAnalysis": {
    "productivityTips": ["效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "200字，与不同层级同事的沟通策略",
    "meetingBehavior": "100字，会议中的典型表现和改进建议",
    "stressResponse": "150字，压力下的行为变化和应对方式",
    "collaborationStyle": "150字，与D/I/S/C四种类型同事的具体协作建议",
    "feedbackPreference": "如何给予和接收反馈",
    "idealWorkEnvironment": "理想工作环境",
    "workLifeBalance": "工作生活平衡建议"
  },
  "testSpecificInsights": {
    "title": "DISC 行为深度解读",
    "sections": [
      { "heading": "行为风格组合分析", "content": "300字，分析主导维度与次要维度的组合效应（如 DI 型、SC 型等）" },
      { "heading": "压力下的行为转变", "content": "200字，该类型在高压环境下的行为变化规律" },
      { "heading": "四象限协作指南", "content": "300字，与D/I/S/C四种类型的人分别如何高效协作的具体策略" }
    ]
  },
  "charts": {
    "radarData": { "D支配": 数值, "I影响": 数值, "S稳定": 数值, "C谨慎": 数值 },
    "dimensionBars": [{"label":"维度名","value":数值,"color":"#颜色代码"}],
    "compatibilityScores": [{"type":"DISC类型","score":0-100}]
  },
  "statistics": {
    "populationPercentage": "该DISC类型在人群中的占比",
    "famousPeople": ["该类型知名人物1","人物2","人物3","人物4","人物5"],
    "typicalCareers": ["典型职业1","职业2","职业3","职业4","职业5"],
    "globalDistribution": "全球分布特点",
    "genderDistribution": "性别分布特点"
  }
}

${COMMON_RULES}
6. DISC 是职场工具，relationshipAnalysis 应聚焦"人际沟通风格"而非恋爱
7. compatibleTypes/incompatibleTypes 用 DISC 类型（D/I/S/C 及组合）`
}

// ---- EQ 情商专属 prompt ----
function generateEQPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通情商理论的心理学专家，熟悉 Daniel Goleman 的情商模型以及 Salovey 和 Mayer 的情绪智力理论。

【理论框架】
情商(EQ)基于 Goleman 的五维度模型：
- 自我认知(SA): 识别自身情绪、了解情绪对行为的影响
- 自我管理(SM): 调控情绪、适应变化、保持积极态度
- 内驱力(MO): 成就动机、乐观精神、承诺感
- 共情能力(EM): 理解他人情绪、预判他人需求
- 社交技巧(SS): 影响力、冲突管理、团队合作
研究表明，EQ 在职业成功和人际幸福中的预测力甚至超过 IQ。情商是可以通过有意识的练习来提升的。

【测试结果】
- 测试类型：情商测评（40题·5维度）
- 综合情商水平：${testResult.score}${genderContext}
- 五维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份情商高级分析报告。要求：
1. 核心聚焦于情绪管理和人际关系能力的分析
2. 人际关系分析要覆盖亲密关系、友谊、家庭关系等多种场景
3. 职业部分聚焦于"情商在职场中的应用"而非职业方向匹配
4. 给出科学可操作的情商提升训练方案

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "400字，全面分析情商水平对各类人际关系的影响（亲密关系、友谊、家庭、社交）",
    "attachmentStyle": "基于SA和EM维度推断依恋倾向和情感连接方式",
    "idealPartnerTraits": ["能与该情商水平良好互动的伴侣特质1","特质2","特质3","特质4","特质5"],
    "communicationInRelationship": "200字，情商维度如何影响沟通效果",
    "conflictResolution": "200字，各维度得分如何影响冲突处理能力",
    "advice": ["提升关系质量的建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["该情商模式下需警惕的关系问题1","问题2","问题3"],
    "greenFlags": ["该情商模式的关系优势1","优势2","优势3"],
    "longTermRelationship": "情商在长期关系维护中的作用"
  },
  "personalGrowth": {
    "overview": "400字，基于五维度得分制定个性化的情商提升路线图（这是EQ报告的核心部分）",
    "coreStrengths": ["情商优势1","优势2","优势3","优势4","优势5"],
    "blindSpots": ["情商盲点1","盲点2","盲点3"],
    "growthPath": ["情商提升路径1","路径2","路径3","路径4"],
    "recommendedBooks": ["《推荐书籍1》","《书籍2》","《书籍3》"],
    "habits": ["情商训练习惯1","习惯2","习惯3","习惯4","习惯5"],
    "mindsetShifts": ["认知调整1","调整2","调整3"],
    "shortTermGoals": ["近期情商训练目标1","目标2","目标3"],
    "longTermGoals": ["长期情商发展目标1","目标2","目标3"]
  },
  "careerAnalysis": {
    "overview": "300字，分析情商在职场中的应用和影响",
    "idealIndustries": ["高情商者适合的行业1","行业2","行业3","行业4","行业5"],
    "idealRoles": ["适合的角色1","角色2","角色3","角色4","角色5"],
    "workStyle": "基于SM和MO维度分析工作风格",
    "leadershipStyle": "基于情商维度分析领导力特点",
    "teamDynamics": "基于EM和SS维度分析团队影响力",
    "careerRisks": ["风险1","风险2","风险3"],
    "careerAdvantages": ["情商优势带来的职场优势1","优势2","优势3","优势4"],
    "fiveYearPath": "情商提升与职业发展结合的路径",
    "salaryPotential": "情商对收入的影响（引用研究数据）"
  },
  "workAnalysis": {
    "productivityTips": ["基于情商维度的效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "职场中的情商沟通风格",
    "meetingBehavior": "会议中的情商表现",
    "stressResponse": "基于SM维度的情绪调控分析",
    "collaborationStyle": "基于EM和SS维度的协作风格",
    "feedbackPreference": "给予和接收反馈的情商策略",
    "idealWorkEnvironment": "最能发挥情商优势的工作环境",
    "workLifeBalance": "情绪管理与工作生活平衡"
  },
  "testSpecificInsights": {
    "title": "情商五维度深度训练方案",
    "sections": [
      { "heading": "最需提升的维度分析", "content": "300字，找出得分最低的1-2个维度，详细分析其表现和影响" },
      { "heading": "21天情商训练计划", "content": "300字，制定一个具体的21天情商提升训练计划" },
      { "heading": "情绪觉察日记指南", "content": "200字，如何通过情绪日记系统性提升自我认知" }
    ]
  },
${COMMON_JSON_FOOTER}

${COMMON_RULES}
6. EQ 没有"类型匹配"概念，relationshipAnalysis 中不要包含 compatibleTypes/incompatibleTypes
7. 个人成长部分要特别详细，这是情商报告的最大价值`
}

// ---- 霍兰德职业兴趣专属 prompt ----
function generateHollandPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通霍兰德职业兴趣理论（RIASEC）的职业规划专家，熟悉 John Holland 的职业人格理论及其在职业咨询中的实际应用。

【理论框架】
霍兰德理论将职业兴趣分为六种类型（RIASEC六边形模型）：
- R(Realistic 实际型): 喜欢操作工具和机械，偏好具体任务
- I(Investigative 研究型): 喜欢探索和分析，偏好思考和研究
- A(Artistic 艺术型): 喜欢创造和表达，偏好自由和想象
- S(Social 社会型): 喜欢帮助和教导他人，偏好人际互动
- E(Enterprising 企业型): 喜欢领导和说服，偏好竞争和影响
- C(Conventional 常规型): 喜欢规则和秩序，偏好系统和细节
六边形上相邻类型相似度高（一致性），对角类型差异大（分化性）。用户的三字母代码（如 RIA）代表其最突出的三种兴趣。

【测试结果】
- 测试类型：霍兰德职业兴趣测评（60题·6维度）
- 三字母代码：${testResult.score}${genderContext}
- 六维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份霍兰德职业兴趣高级分析报告。要求：
1. 核心聚焦于职业规划和发展，这是霍兰德测评的唯一目的
2. 职业分析要非常深入、详细，包括具体行业细分、岗位名称、薪资范围
3. 人际分析部分聚焦于"职业社交与职场人脉"
4. 引用六边形模型分析维度间的一致性和分化性
5. 结合2025-2026年就业市场趋势

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "200字，分析该职业兴趣类型在职业社交和人脉拓展中的特点",
    "communicationInRelationship": "职业社交中的沟通风格和网络建设策略",
    "conflictResolution": "职场人际冲突的处理方式",
    "advice": ["职业社交建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["需要警惕的职场人际模式1","模式2","模式3"],
    "greenFlags": ["该类型的职场社交优势1","优势2","优势3"]
  },
${COMMON_JSON_GROWTH}
  "careerAnalysis": {
    "overview": "500字，深度职业发展分析（这是霍兰德报告的核心价值，要非常详细）",
    "idealIndustries": ["最适合行业1","行业2","行业3","行业4","行业5","行业6","行业7"],
    "idealRoles": ["最适合职位1","职位2","职位3","职位4","职位5","职位6","职位7"],
    "workStyle": "200字，基于RIASEC组合分析工作风格偏好",
    "leadershipStyle": "基于E维度得分分析领导潜力",
    "teamDynamics": "基于S和E维度分析团队角色",
    "careerRisks": ["风险1","风险2","风险3","风险4"],
    "careerAdvantages": ["优势1","优势2","优势3","优势4","优势5"],
    "fiveYearPath": "300字，非常详细的五年职业发展路径规划",
    "salaryPotential": "150字，不同发展方向的薪资潜力分析"
  },
  "workAnalysis": {
    "productivityTips": ["效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "职场沟通风格",
    "meetingBehavior": "会议表现特点",
    "stressResponse": "工作压力应对方式",
    "collaborationStyle": "团队协作风格",
    "feedbackPreference": "反馈偏好",
    "idealWorkEnvironment": "200字，非常详细的理想工作环境描述",
    "workLifeBalance": "工作生活平衡建议"
  },
  "testSpecificInsights": {
    "title": "RIASEC 职业深度规划",
    "sections": [
      { "heading": "六边形一致性分析", "content": "300字，分析用户三字母代码在六边形上的分布，一致性高表示兴趣集中，分化性低表示兴趣广泛" },
      { "heading": "新兴职业匹配", "content": "300字，结合AI/数字化趋势，推荐匹配该兴趣类型的新兴职业方向" },
      { "heading": "职业转型路径", "content": "200字，如果需要转行，基于RIASEC提供最平滑的转型路径" }
    ]
  },
  "charts": {
    "radarData": { "R实际型": 数值, "I研究型": 数值, "A艺术型": 数值, "S社会型": 数值, "E企业型": 数值, "C常规型": 数值 },
    "dimensionBars": [{"label":"维度名","value":数值,"color":"#颜色代码"}]
  },
  "statistics": {
    "populationPercentage": "该三字母代码在人群中的分布",
    "famousPeople": ["该类型知名人物1","人物2","人物3","人物4","人物5"],
    "typicalCareers": ["典型职业1","职业2","职业3","职业4","职业5","职业6","职业7"],
    "globalDistribution": "全球职业兴趣分布特点",
    "genderDistribution": "性别分布特点"
  }
}

${COMMON_RULES}
6. 霍兰德是纯职业工具，relationshipAnalysis 聚焦"职业社交"而非恋爱
7. careerAnalysis 是报告核心，字数要最多、内容要最详细`
}

// ---- 九型人格专属 prompt ----
function generateEnneagramPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  return `你是一位精通九型人格（Enneagram）理论的心理咨询师，深入理解 Don Riso 和 Russ Hudson 的整合理论，包括九种类型的核心动机、恐惧、整合方向、解离方向和翼型系统。

【理论框架】
九型人格是一个动态的人格系统，九种类型分布在三个智慧中心：
- 身体中心（8/9/1）：核心情绪是愤怒，关注自主和控制
- 心灵中心（2/3/4）：核心情绪是羞耻，关注自我价值和形象
- 思维中心（5/6/7）：核心情绪是恐惧，关注安全和确定性
每种类型有：
- 核心动机（deepest desire）和核心恐惧（basic fear）
- 整合方向（成长时趋向的类型）和解离方向（压力下趋向的类型）
- 翼型（相邻类型的影响）
- 9个发展层级（从健康到不健康）

【测试结果】
- 测试类型：九型人格（36题·9维度）
- 主要类型：${testResult.score}${genderContext}
- 各类型得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%`).join('\n')}

请生成一份九型人格高级分析报告。要求：
1. 核心聚焦于内在动机、恐惧和成长路径，这是九型人格的独特价值
2. 必须分析整合方向和解离方向，以及翼型影响
3. 恋爱分析要基于核心动机和恐惧来分析亲密关系模式
4. 个人成长部分要最详细，这是九型人格的最大应用价值

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "300字，基于核心动机和恐惧分析亲密关系中的行为模式",
    "attachmentStyle": "基于核心恐惧推断依恋类型",
    "idealPartnerTraits": ["伴侣特质1","特质2","特质3","特质4","特质5"],
    "communicationInRelationship": "基于核心动机分析沟通模式",
    "conflictResolution": "基于解离方向分析压力下的冲突行为",
    "advice": ["恋爱建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["该类型需警惕的关系陷阱1","陷阱2","陷阱3"],
    "greenFlags": ["该类型的关系优势1","优势2","优势3"],
    "compatibleTypes": ["最匹配的九型类型1","类型2","类型3"],
    "incompatibleTypes": ["需特别注意的类型组合1","类型2"],
    "longTermRelationship": "基于整合方向分析长期关系中的成长空间"
  },
  "personalGrowth": {
    "overview": "500字，基于整合/解离方向制定详细的个人成长路线图（这是九型人格报告的核心价值）",
    "coreStrengths": ["核心优势1","优势2","优势3","优势4","优势5"],
    "blindSpots": ["核心恐惧导致的盲点1","盲点2","盲点3"],
    "growthPath": ["成长路径1","路径2","路径3","路径4"],
    "recommendedBooks": ["《推荐书籍1》","《书籍2》","《书籍3》"],
    "habits": ["习惯1","习惯2","习惯3","习惯4","习惯5"],
    "mindsetShifts": ["需要转变的核心信念1","信念2","信念3"],
    "shortTermGoals": ["近期目标1","目标2","目标3"],
    "longTermGoals": ["长期目标1","目标2","目标3"]
  },
  "careerAnalysis": {
    "overview": "300字，基于核心动机分析职业倾向",
    "idealIndustries": ["行业1","行业2","行业3","行业4","行业5"],
    "idealRoles": ["职位1","职位2","职位3","职位4","职位5"],
    "workStyle": "基于核心动机的工作风格",
    "leadershipStyle": "该类型的领导力特点",
    "teamDynamics": "团队中的角色和互动模式",
    "careerRisks": ["核心恐惧在职场中的表现1","风险2","风险3"],
    "careerAdvantages": ["优势1","优势2","优势3","优势4"],
    "fiveYearPath": "职业发展路径",
    "salaryPotential": "薪资潜力"
  },
  "workAnalysis": {
    "productivityTips": ["效率建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "职场沟通风格",
    "meetingBehavior": "会议表现",
    "stressResponse": "200字，基于解离方向详细分析压力反应",
    "collaborationStyle": "协作风格",
    "feedbackPreference": "反馈偏好",
    "idealWorkEnvironment": "理想工作环境",
    "workLifeBalance": "工作生活平衡"
  },
  "testSpecificInsights": {
    "title": "九型人格动态系统解读",
    "sections": [
      { "heading": "整合与解离方向", "content": "300字，详细分析健康状态下趋向哪个类型（整合），压力下趋向哪个类型（解离），以及如何利用这个规律促进成长" },
      { "heading": "翼型影响分析", "content": "200字，分析相邻两个翼型对主类型的修饰作用" },
      { "heading": "三大智慧中心", "content": "200字，分析该类型所属的智慧中心（身体/心灵/思维），以及核心情绪（愤怒/羞耻/恐惧）的管理策略" }
    ]
  },
  "charts": {
    "radarData": { "1号完美": 数值, "2号助人": 数值, "3号成就": 数值, "4号自我": 数值, "5号思考": 数值, "6号忠诚": 数值, "7号活跃": 数值, "8号挑战": 数值, "9号和平": 数值 },
    "dimensionBars": [{"label":"类型名","value":数值,"color":"#颜色代码"}],
    "compatibilityScores": [{"type":"九型类型","score":0-100}]
  },
  "statistics": {
    "populationPercentage": "该类型在人群中的占比",
    "famousPeople": ["该类型知名人物1","人物2","人物3","人物4","人物5"],
    "typicalCareers": ["典型职业1","职业2","职业3","职业4","职业5"],
    "globalDistribution": "全球分布特点",
    "genderDistribution": "性别分布特点"
  }
}

${COMMON_RULES}
6. 个人成长部分是九型人格报告的核心，要最详细
7. compatibleTypes/incompatibleTypes 用九型类型号码和名称（如"2号助人型"、"7号活跃型"）`
}

// ---- 抑郁评估专属 prompt ----
function generateDepressionPremiumPrompt(testResult: TestResultData, gender?: string): string {
  const genderContext = gender ? `\n用户性别：${gender === 'male' ? '男' : '女'}` : ''
  const totalScore = parseInt(testResult.score) || 0
  return `你是一位资深临床心理学家和精神科专家，拥有20年从业经验，熟悉 PHQ-9、BDI-II、SDS 等抑郁评估工具及 CBT（认知行为疗法）和 ACT（接受与承诺疗法）。

【理论框架】
本评估参考 PHQ-9/BDI-II/SDS 编制，通过5个症状维度评估抑郁状态：
- 情绪维度(EMO): 悲伤、绝望、快感缺失等核心情绪症状
- 躯体维度(SOM): 睡眠障碍、食欲变化、疲劳等身体症状
- 认知维度(COG): 注意力下降、自我否定、决策困难等思维症状
- 行为维度(BEH): 社交退缩、活动减少、拖延等行为症状
- 社会维度(SOC): 人际关系受损、社会功能下降
严重度分级：0-14 无/轻微、15-29 轻度、30-49 中度、50-69 中重度、70-90 重度

【测试结果】
- 测试类型：综合抑郁评估量表（30题·5维度，参考PHQ-9/BDI-II/SDS）
- 总分：${testResult.score}/90（${totalScore < 15 ? '无/轻微' : totalScore < 30 ? '轻度' : totalScore < 50 ? '中度' : totalScore < 70 ? '中重度' : '重度'}）${genderContext}
- 五大维度得分：
${testResult.dimensions.map(d => `  - ${d.label || d.dimension}: ${d.percentage}%${d.rawScore !== undefined ? `（原始分 ${d.rawScore}）` : ''}`).join('\n')}

请生成一份专业的深度分析报告。要求：
1. 语气要专业但温暖，给予希望和力量
2. ${totalScore >= 50 ? '分数较高，必须强烈建议寻求专业心理/精神科帮助' : totalScore >= 30 ? '分数中等，建议考虑寻求心理咨询' : '分数较低，以自我调节建议为主'}
3. 提供基于CBT/ACT的具体可操作建议
4. 关系分析聚焦"情感支持系统"而非恋爱

JSON 格式：
${COMMON_JSON_HEADER(testResult.testType, testResult.score)}
  "relationshipAnalysis": {
    "overview": "300字，当前情绪状态对各类人际关系的影响分析",
    "communicationInRelationship": "如何向亲近的人表达自己的需求和状态",
    "conflictResolution": "当前状态下的人际冲突处理建议",
    "advice": ["建立情感支持系统的建议1","建议2","建议3","建议4","建议5"],
    "redFlags": ["需要警惕的关系模式1","模式2","模式3"],
    "greenFlags": ["有益的关系信号1","信号2","信号3"],
    "longTermRelationship": "如何在亲密关系中获得和给予支持"
  },
  "personalGrowth": {
    "overview": "400字，个人康复和成长的总体路线图（这是抑郁报告的核心部分）",
    "coreStrengths": ["当前拥有的积极资源1","资源2","资源3","资源4","资源5"],
    "blindSpots": ["需要关注的方面1","方面2","方面3"],
    "growthPath": ["基于CBT的康复步骤1","步骤2","步骤3","步骤4"],
    "recommendedBooks": ["《推荐书籍1》","《书籍2》","《书籍3》"],
    "habits": ["有助改善情绪的习惯1","习惯2","习惯3","习惯4","习惯5"],
    "mindsetShifts": ["基于CBT的认知重构建议1","建议2","建议3"],
    "shortTermGoals": ["近期小目标1","目标2","目标3"],
    "longTermGoals": ["长期康复里程碑1","里程碑2","里程碑3"]
  },
  "careerAnalysis": {
    "overview": "200字，当前状态对工作的影响分析",
    "idealIndustries": ["适合当前状态的工作环境1","环境2","环境3"],
    "idealRoles": ["有利于恢复的工作类型1","类型2","类型3"],
    "workStyle": "工作节奏调整建议",
    "teamDynamics": "与同事相处建议",
    "careerRisks": ["需注意的职场风险1","风险2"],
    "careerAdvantages": ["可以利用的积极因素1","因素2","因素3"]
  },
  "workAnalysis": {
    "productivityTips": ["提升工作状态的建议1","建议2","建议3","建议4","建议5"],
    "communicationStyle": "如何在工作中适当寻求帮助",
    "stressResponse": "职场压力管理建议",
    "collaborationStyle": "当前状态下的协作建议",
    "idealWorkEnvironment": "有助于恢复的工作环境",
    "workLifeBalance": "工作与休息的平衡建议"
  },
  "testSpecificInsights": {
    "title": "专业康复指导",
    "sections": [
      { "heading": "症状维度优先级分析", "content": "300字，基于五维度得分排序，指出最需要优先关注的症状维度及原因" },
      { "heading": "自助调节方案", "content": "300字，基于CBT和ACT提供具体的自助调节技巧（如思维记录、行为激活、正念练习）" },
      { "heading": "${totalScore >= 30 ? '专业帮助指南' : '预防与维护'}", "content": "${totalScore >= 30 ? '200字，如何寻找合适的心理咨询师/精神科医生，首次就诊注意事项' : '200字，如何维持当前的健康状态，预防抑郁复发的策略'}" }
    ]
  },
${COMMON_JSON_FOOTER}

${COMMON_RULES}
6. 这是心理健康报告，语气必须温暖有关怀，给予希望
7. 不要使用"类型匹配"概念，relationshipAnalysis 中不要包含 compatibleTypes/incompatibleTypes
8. 不要包含 leadershipStyle、fiveYearPath、salaryPotential 等与当前无关的职业字段`
}

// 生成高级报告的 Prompt（路由器函数）
function generatePremiumReportPrompt(testResult: TestResultData, gender?: string): string {
  switch (testResult.testType) {
    case 'MBTI':
      return generateMBTIPremiumPrompt(testResult, gender)
    case 'BIG_FIVE':
      return generateBigFivePremiumPrompt(testResult, gender)
    case 'DISC':
      return generateDISCPremiumPrompt(testResult, gender)
    case 'EQ':
      return generateEQPremiumPrompt(testResult, gender)
    case 'HOLLAND':
      return generateHollandPremiumPrompt(testResult, gender)
    case 'ENNEAGRAM':
      return generateEnneagramPremiumPrompt(testResult, gender)
    case 'DEPRESSION':
      return generateDepressionPremiumPrompt(testResult, gender)
    default:
      return generateMBTIPremiumPrompt(testResult, gender)
  }
}

// 生成高级报告
export async function generatePremiumReport(testResult: TestResultData, gender?: string): Promise<PremiumReportData> {
  const prompt = generatePremiumReportPrompt(testResult, gender)
  const response = await callDeepSeekAPI(prompt)
  return parseJSONResponse<PremiumReportData>(response)
}

// 生成模拟高级报告（按测试类型差异化）
export function generateMockPremiumReport(testResult: TestResultData): PremiumReportData {
  const base = {
    testType: testResult.testType,
    score: testResult.score,
    generatedAt: new Date().toISOString(),
    dimensionAnalysis: testResult.dimensions.map(d => ({
      dimension: d.dimension,
      label: d.label || d.dimension,
      percentage: d.percentage,
      description: `您在${d.label || d.dimension}维度的得分为${d.percentage}%。${d.percentage >= 70 ? '这是一个较高的得分，表明您在这方面有突出的倾向和优势。' : d.percentage <= 30 ? '这是一个较低的得分，但不代表缺点，它反映了您在其他方面可能更加突出。' : '这是一个中等水平的得分，表明您在这方面具有灵活的适应能力。'}`,
      strengths: ['待AI生成个性化内容'],
      challenges: ['待AI生成个性化内容']
    })),
  }

  switch (testResult.testType) {
    case 'MBTI':
      return { ...base, ...generateMBTIMock(testResult) }
    case 'BIG_FIVE':
      return { ...base, ...generateBigFiveMock(testResult) }
    case 'DISC':
      return { ...base, ...generateDISCMock(testResult) }
    case 'EQ':
      return { ...base, ...generateEQMock(testResult) }
    case 'HOLLAND':
      return { ...base, ...generateHollandMock(testResult) }
    case 'ENNEAGRAM':
      return { ...base, ...generateEnneagramMock(testResult) }
    case 'DEPRESSION':
      return { ...base, ...generateDepressionMock(testResult) }
    default:
      return { ...base, ...generateMBTIMock(testResult) }
  }
}

function generateMBTIMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  return {
    relationshipAnalysis: {
      overview: `作为${t.score}类型，您在亲密关系中倾向于建立深层的精神连接。您的认知功能栈决定了您在恋爱中的独特模式：重视价值观契合和智识交流，而非表面的吸引。`,
      attachmentStyle: '基于您的认知功能组合，您倾向于安全型或回避型依恋模式，需要在亲密和独立之间寻找平衡。',
      idealPartnerTraits: ['思维深度匹配', '情绪稳定性好', '尊重个人空间', '价值观一致', '有成长意愿'],
      communicationInRelationship: '您更倾向于有意义的深度对话。在情感表达上可能需要更多练习，建议主动分享内心感受。',
      conflictResolution: '面对冲突时倾向于分析问题本质而非即时情绪反应。建议在理性分析的同时也关注伴侣的情绪需求。',
      advice: ['选择安静的约会场所进行深度交流', '主动表达关心而非仅在内心感受', '给感情发展留出自然的时间', '学习伴侣的爱语并主动实践', '冲突中先共情再分析'],
      redFlags: ['不尊重个人空间和独处需求', '回避深层话题只谈表面', '情绪不稳定且缺乏自我调节'],
      greenFlags: ['能进行深度智识交流', '有独立的兴趣和追求', '对个人成长有持续动力'],
      compatibleTypes: ['ENFP', 'INFJ', 'ENTP'],
      incompatibleTypes: ['ESFP', 'ESTP'],
      longTermRelationship: '长期关系需要您在保持个人空间的同时主动投入维护关系的精力。建议建立固定的深度交流时间。'
    },
    personalGrowth: {
      overview: `${t.score}类型的成长关键在于平衡认知功能栈中的优势功能和劣势功能。您需要在发挥主导功能优势的同时，有意识地发展劣势功能。`,
      coreStrengths: ['深度分析能力', '独立思考精神', '战略规划能力', '持续学习动力', '专注执行力'],
      blindSpots: ['可能忽视他人情绪需求', '完美主义导致的行动延迟', '社交场合的能量消耗'],
      growthPath: ['识别并发展劣势认知功能', '培养情绪觉察和表达能力', '扩展舒适区参与社交', '接受"足够好"替代"完美"'],
      recommendedBooks: ['《内向者优势》- 理解自己的能量模式', '《非暴力沟通》- 提升情感表达', '《心流》- 深化专注力优势'],
      habits: ['每日10分钟正念冥想', '每周记录3次情绪日记', '每月尝试一个新的社交场景', '定期运动维持身心平衡'],
      mindsetShifts: ['接受不完美是成长的一部分', '他人的情绪需求和你的逻辑同样重要', '社交能力可以系统地学习和提升'],
      shortTermGoals: ['完成一次公开演讲或分享', '找到一位信任的倾诉对象', '尝试一项团体活动'],
      longTermGoals: ['建立稳定的社交支持网络', '实现职业和生活的动态平衡', '成为领域内有影响力的专家']
    },
    careerAnalysis: {
      overview: `${t.score}类型适合需要深度思考、独立分析和战略规划的职业。您的认知功能组合让您在需要长期专注和复杂问题解决的领域中表现出色。`,
      idealIndustries: ['科技/AI', '金融/量化分析', '咨询/战略', '学术/研究', '生物科技'],
      idealRoles: ['高级数据科学家', '战略分析师', '产品架构师', '独立咨询顾问', '技术研究员'],
      workStyle: '偏好深度工作模式，需要不受打扰的专注时间。远程工作或独立办公空间能大幅提升效率。',
      leadershipStyle: '通过专业能力和逻辑说服力赢得尊重，赋予团队自主权但需注意关系建设。',
      teamDynamics: '在团队中担任"思想者"和"战略家"角色，需要执行力强的搭档配合。',
      careerRisks: ['过度独立导致团队孤立', '完美主义影响项目推进', '需持续关注行业技术更新'],
      careerAdvantages: ['深度专业壁垒', '系统性思维能力', '战略全局观', '高质量输出标准'],
      fiveYearPath: '第1-2年：专业领域深耕建立核心竞争力；第3年：承担项目负责人角色；第4-5年：向技术专家或管理双通道发展。',
      salaryPotential: '技术专家路线年薪潜力50-120万，管理路线潜力更高。AI和数据领域的市场需求将持续增长。'
    },
    workAnalysis: {
      productivityTips: ['使用时间块管理法保护深度工作时间', '将创造性工作安排在精力最充沛的上午', '用番茄工作法应对需要持续专注的任务', '设立"免打扰"时间段并告知同事', '每周五回顾优先级并规划下周'],
      communicationStyle: '偏好书面沟通，表达精准有条理。面对面沟通前建议预留准备时间。',
      meetingBehavior: '倾向于先观察和思考再发言，发言质量高但需要主动争取表达机会。',
      stressResponse: '压力下倾向独处理清思路。过度压力可能导致社交退缩，需注意及时寻求支持。',
      collaborationStyle: '偏好小团队深度合作，一对一讨论比大组会议更高效。',
      feedbackPreference: '偏好具体、有建设性的反馈，书面形式更方便消化。',
      idealWorkEnvironment: '安静有序、有私人空间、允许灵活工作时间、技术氛围浓厚的环境。',
      workLifeBalance: '需设定明确的工作时间边界，避免沉浸工作忽略生活。'
    },
    testSpecificInsights: {
      title: '认知功能深度解读',
      sections: [
        { heading: '认知功能栈分析', content: `${t.score}类型的认知功能栈决定了您独特的信息处理和决策方式。主导功能是您最自然、最强大的心理活动模式，辅助功能提供平衡，第三功能在成长中逐渐发展，劣势功能是您最大的成长空间。` },
        { heading: '功能发展建议', content: '发展第三功能和劣势功能是个人成长的关键。建议从低压力的日常场景开始练习，逐步扩展舒适区。' },
        { heading: '阴影功能与压力', content: '在极端压力下，您可能会表现出与平时截然不同的行为模式（grip experience），这是劣势功能暂时占据主导的表现。识别这种状态是管理压力的第一步。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'][i % 5] })),
      compatibilityScores: [{ type: 'ENFP', score: 90 }, { type: 'INFJ', score: 88 }, { type: 'ENTP', score: 85 }, { type: 'INTJ', score: 82 }, { type: 'INFP', score: 78 }]
    },
    statistics: {
      populationPercentage: `${t.score}类型约占人口的2-4%`,
      famousPeople: ['艾萨克·牛顿', '尼古拉·特斯拉', '弗里达·卡罗', '阿尔伯特·爱因斯坦', '玛丽·居里'],
      typicalCareers: ['软件架构师', '科研工作者', '战略顾问', '投资分析师', '大学教授'],
      globalDistribution: '在高等教育程度较高和科技发达的地区更为常见，北欧和东亚地区比例略高。',
      genderDistribution: '性别分布因具体类型而异，总体较为均衡。'
    }
  }
}

function generateBigFiveMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const dims = Object.fromEntries(t.dimensions.map(d => [d.dimension, d.percentage]))
  return {
    relationshipAnalysis: {
      overview: `根据大五人格模型，您的宜人性(${dims['A'] || 50}%)和神经质(${dims['N'] || 50}%)是影响亲密关系质量的关键维度。您的独特维度组合塑造了您在关系中的互动模式。`,
      attachmentStyle: `基于您的外向性和神经质得分组合，您的依恋风格可能偏向${(dims['N'] || 50) > 60 ? '焦虑型' : '安全型'}。`,
      idealPartnerTraits: ['情绪稳定性好', '沟通意愿强', '有共同成长追求', '宽容度高', '有独立兴趣'],
      communicationInRelationship: `您的外向性得分(${dims['E'] || 50}%)和宜人性得分(${dims['A'] || 50}%)共同决定了您的关系沟通风格。`,
      conflictResolution: '您的冲突处理方式受宜人性和神经质维度的共同影响。建议在冲突中保持觉察，区分情绪反应和事实判断。',
      advice: ['基于你的开放性水平选择约会活动', '留意自己在关系中的情绪波动模式', '主动沟通需求而非期待伴侣猜测', '发挥宜人性优势建立信任', '共同制定可执行的关系目标'],
      redFlags: ['与你的核心人格维度严重冲突的互动模式', '持续引发高神经质反应的关系', '压抑你的开放性和好奇心'],
      greenFlags: ['让你感到安全和被接纳', '激发你的好奇心和成长', '互补的尽责性水平'],
      longTermRelationship: '研究表明，宜人性和情绪稳定性是长期关系满意度最重要的预测因素。'
    },
    personalGrowth: {
      overview: `大五人格研究表明，人格特质虽然相对稳定，但可以在有意识的努力下缓慢调整。您的成长重点在于发挥高分维度优势，同时关注低分维度的适度发展。`,
      coreStrengths: t.dimensions.filter(d => d.percentage >= 60).map(d => `${d.label || d.dimension}维度优势(${d.percentage}%)`).concat(['独特的维度组合']),
      blindSpots: t.dimensions.filter(d => d.percentage <= 40).map(d => `${d.label || d.dimension}维度较低(${d.percentage}%)可能带来的盲点`),
      growthPath: ['识别维度间的交互效应并加以利用', '在低分维度上设定微小的行为改变目标', '利用高分维度的优势补偿低分维度', '定期进行自我反思和进展评估'],
      recommendedBooks: ['《人格心理学》- 理解大五人格的科学基础', '《原子习惯》- 通过微习惯改变行为', '《自控力》- 提升自我调节能力'],
      habits: ['每日情绪觉察练习', '每周设定一个小型挑战', '定期运动维持身心状态', '记录个人成长日志'],
      mindsetShifts: ['人格特质是连续谱而非固定标签', '低分不等于缺陷，高分不等于优势', '行为变化可以通过持续练习实现'],
      shortTermGoals: ['针对最低分维度设定一个行为改善目标', '找到发挥最高分维度的新场景', '建立定期自我评估的习惯'],
      longTermGoals: ['各维度达到更加平衡和灵活的状态', '在职业中充分利用人格优势', '建立健康稳定的人际关系网络']
    },
    careerAnalysis: {
      overview: `研究表明，尽责性(${dims['C'] || 50}%)是职业成功最强的预测因素，外向性(${dims['E'] || 50}%)和开放性(${dims['O'] || 50}%)则影响职业方向偏好。您的维度组合指向特定的职业优势领域。`,
      idealIndustries: ['基于您维度组合的行业推荐'],
      idealRoles: ['基于尽责性和开放性的角色推荐'],
      workStyle: `您的尽责性(${dims['C'] || 50}%)和外向性(${dims['E'] || 50}%)决定了您的工作节奏偏好。`,
      leadershipStyle: `外向性和宜人性的组合影响您的领导风格特点。`,
      teamDynamics: '您在团队中的角色由宜人性和外向性共同决定。',
      careerRisks: ['需关注神经质对工作压力的放大效应', '避免低分维度成为职业发展瓶颈', '保持职业发展的灵活性'],
      careerAdvantages: t.dimensions.filter(d => d.percentage >= 65).map(d => `${d.label || d.dimension}(${d.percentage}%)带来的职业优势`),
      fiveYearPath: '基于您的大五维度组合制定的渐进式发展路径。',
      salaryPotential: '研究表明，尽责性和外向性与收入水平正相关。'
    },
    workAnalysis: {
      productivityTips: ['根据尽责性水平调整任务管理策略', '利用开放性特点寻找创新解决方案', '管理神经质对工作效率的影响', '设定清晰的每日优先级', '定期清理低价值任务'],
      communicationStyle: `您的外向性(${dims['E'] || 50}%)和宜人性(${dims['A'] || 50}%)决定了您的职场沟通风格。`,
      meetingBehavior: '基于外向性维度分析您的会议参与模式。',
      stressResponse: `您的神经质水平(${dims['N'] || 50}%)是压力反应的核心预测因素。`,
      collaborationStyle: '宜人性和外向性共同决定您的团队协作偏好。',
      feedbackPreference: '基于开放性和神经质分析您对反馈的接受和处理方式。',
      idealWorkEnvironment: '综合五个维度为您推荐最优工作环境。',
      workLifeBalance: '关注各维度对工作生活平衡的不同影响。'
    },
    testSpecificInsights: {
      title: '大五因素深度交互分析',
      sections: [
        { heading: '维度交互效应', content: '五个维度之间存在重要的交互作用。例如，高开放性+高尽责性 = 有纪律的创新者；高外向性+高宜人性 = 天然的团队协调者。您的独特组合产生了区别于任何单一维度的整体效应。' },
        { heading: '与人群常模对比', content: '将您的得分与一般人群常模对比，可以更准确地理解您在每个维度上的相对位置。超过70%或低于30%的维度值得特别关注。' },
        { heading: '人格稳定性与发展', content: '纵向研究表明，大五人格在成年后相对稳定，但宜人性和尽责性通常随年龄增长而略有上升，而外向性和开放性可能略有下降。了解这些趋势有助于规划长期发展。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: '大五人格是连续谱分布，您的维度组合模式在人群中具有独特性',
      famousPeople: ['人格心理学家 Lewis Goldberg', '积极心理学家 Martin Seligman', '企业家 Warren Buffett', '作家 J.K. Rowling', '科学家 Jane Goodall'],
      typicalCareers: ['基于您维度组合的典型职业方向'],
      globalDistribution: '大五人格在不同文化中展现出普遍性，但平均水平因文化而异。东亚文化中尽责性和宜人性平均得分较高。',
      genderDistribution: '研究显示女性在宜人性和神经质上平均略高，男性在外向性上平均略高，但个体差异远大于性别差异。'
    }
  }
}

function generateDISCMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  return {
    relationshipAnalysis: {
      overview: `作为${t.score}主导风格，您在人际互动中展现出鲜明的行为特征。DISC 模型帮助我们理解不同风格之间的沟通偏好和协作模式。`,
      communicationInRelationship: '您的沟通风格受主导维度影响。理解不同DISC类型的沟通需求，能显著提升人际互动效果。',
      conflictResolution: '不同DISC风格有截然不同的冲突处理偏好。了解自己的模式并学会灵活调整是关键。',
      advice: ['识别对方的DISC风格并调整沟通方式', '在高压情境中保持风格灵活性', '主动寻求互补风格的合作伙伴', '定期反思自己的沟通模式', '练习跨风格的有效沟通'],
      redFlags: ['总是要求他人适应你的风格', '忽视对方的沟通需求', '在压力下风格极端化'],
      greenFlags: ['能灵活调整沟通方式', '欣赏不同风格的价值', '在差异中找到互补优势'],
      compatibleTypes: ['互补型DISC风格'],
      incompatibleTypes: ['需特别注意沟通的DISC风格'],
    },
    personalGrowth: {
      overview: `${t.score}风格的成长关键在于保持核心优势的同时，发展行为灵活性。真正的成熟不是改变自己的风格，而是能够在需要时切换到其他风格。`,
      coreStrengths: ['基于主导维度的核心优势'],
      blindSpots: ['基于最低维度的盲点'],
      growthPath: ['识别自己的行为自动模式', '学习非主导维度的行为策略', '在安全环境中练习风格切换', '建立跨风格的行为工具箱'],
      recommendedBooks: ['《DISC行为风格》- 深入理解四种风格', '《关键对话》- 提升高压沟通能力', '《影响力》- 扩展说服和影响策略'],
      habits: ['每日复盘一次沟通互动', '每周刻意练习非主导风格', '记录成功的跨风格沟通案例', '定期寻求他人的行为反馈'],
      mindsetShifts: ['每种DISC风格都有独特价值', '行为灵活性比风格本身更重要', '了解他人风格是提升领导力的基础'],
      shortTermGoals: ['掌握识别他人DISC风格的能力', '在一个场景中成功使用非主导风格', '获得同事对你沟通改善的正面反馈'],
      longTermGoals: ['成为风格灵活的沟通高手', '建立多元化的高效团队', '发展适应性领导力']
    },
    careerAnalysis: {
      overview: `DISC 模型是职场行为分析的核心工具。${t.score}类型的行为风格在特定职业环境中具有天然优势，关键是找到匹配您风格的岗位和团队。`,
      idealIndustries: ['基于DISC类型的行业推荐'],
      idealRoles: ['基于行为风格的岗位推荐'],
      workStyle: `${t.score}类型在工作中的典型表现模式和节奏偏好。`,
      leadershipStyle: `${t.score}类型作为领导者的典型风格和发展空间。`,
      teamDynamics: '在团队中，不同DISC风格扮演不同角色。了解这些角色有助于建立高效团队。',
      careerRisks: ['风格盲点在职场中的表现', '过度依赖主导风格的风险', '团队冲突的潜在来源'],
      careerAdvantages: ['核心行为风格带来的职场优势'],
      fiveYearPath: '基于DISC风格的职业发展路径规划。',
      salaryPotential: 'DISC风格影响职业选择，而非直接决定薪资水平。关键在于找到风格匹配的高价值岗位。'
    },
    workAnalysis: {
      productivityTips: ['利用主导风格的效率优势', '在非舒适区任务中切换行为策略', '建立跨风格的工作流程', '优化会议和协作的参与方式', '管理精力而非仅管理时间'],
      communicationStyle: `${t.score}类型在职场中的沟通特征和优化建议。`,
      meetingBehavior: '您在会议中的典型表现和改进方向。',
      stressResponse: '压力下DISC行为风格可能极端化，了解自己的模式有助于主动管理。',
      collaborationStyle: '与D/I/S/C四种类型同事的具体协作建议。',
      feedbackPreference: '不同DISC类型对反馈有不同的偏好，了解自己的需求很重要。',
      idealWorkEnvironment: '基于行为风格偏好的理想工作环境描述。',
      workLifeBalance: 'DISC 风格影响工作生活平衡的方式各不相同。'
    },
    testSpecificInsights: {
      title: 'DISC 行为深度解读',
      sections: [
        { heading: '行为风格组合分析', content: `您的主导风格是${t.score}，但行为是四个维度的综合表现。分析各维度的相对强弱可以揭示更丰富的行为模式（如DI型、SC型等复合风格）。` },
        { heading: '压力下的行为转变', content: '在高压环境下，DISC风格通常会极端化：D变得更独断，I变得更散漫，S变得更回避，C变得更挑剔。识别这些模式是管理压力行为的第一步。' },
        { heading: '四象限协作指南', content: '与D型：直接高效、聚焦结果；与I型：热情互动、给予认可；与S型：耐心稳定、建立信任；与C型：提供数据、注重细节。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][i % 4] })),
      compatibilityScores: [{ type: 'I 影响型', score: 75 }, { type: 'S 稳定型', score: 70 }, { type: 'C 谨慎型', score: 65 }, { type: 'D 支配型', score: 60 }]
    },
    statistics: {
      populationPercentage: `${t.score}主导风格约占人群的20-30%`,
      famousPeople: ['基于该DISC类型的知名人物'],
      typicalCareers: ['基于该DISC风格的典型职业'],
      globalDistribution: 'DISC风格分布在不同文化和行业中有显著差异，企业文化对风格分布有重要影响。',
      genderDistribution: '性别对DISC风格的影响较小，职业选择和文化因素的影响更大。'
    }
  }
}

function generateEQMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const eqScore = parseInt(t.score) || 50
  const level = eqScore >= 80 ? '优秀' : eqScore >= 60 ? '良好' : eqScore >= 40 ? '中等' : '发展中'
  return {
    relationshipAnalysis: {
      overview: `您的综合情商水平为${level}(${t.score}%)。情商是预测人际关系质量的最重要因素之一。您的五个维度得分共同决定了您在亲密关系、友谊和家庭关系中的表现模式。`,
      attachmentStyle: '基于您的自我认知和共情能力得分，推断您的依恋倾向和情感连接方式。',
      idealPartnerTraits: ['情绪表达开放', '有同理心', '沟通意愿强', '情绪稳定', '支持个人成长'],
      communicationInRelationship: '情商直接影响关系中的沟通质量。自我认知帮助您表达需求，共情帮助您理解伴侣。',
      conflictResolution: '情商高的人在冲突中能更好地管理自身情绪，同时理解对方立场，找到双赢解决方案。',
      advice: ['练习在对话中命名自己的情绪', '在回应前先确认理解了对方的感受', '建立定期的关系check-in习惯', '学习非暴力沟通的四步法', '在冲突中使用"我"句式表达'],
      redFlags: ['持续压抑或忽视情绪', '难以理解他人的情绪状态', '在冲突中习惯性指责或逃避'],
      greenFlags: ['能准确识别和表达情绪', '对他人的情绪保持敏感和回应', '在压力下仍能保持理性沟通'],
      longTermRelationship: '长期关系的质量与双方的情商水平密切相关。持续提升情商是维护关系健康的基础。'
    },
    personalGrowth: {
      overview: `情商(EQ)是可以通过系统训练显著提升的能力。根据 Goleman 的研究，情商对个人成功和幸福的贡献度可能超过IQ。您当前的综合水平为${level}，以下是为您量身定制的提升方案。`,
      coreStrengths: t.dimensions.filter(d => d.percentage >= 60).map(d => `${d.label || d.dimension}(${d.percentage}%) - 这是您的情商优势维度`),
      blindSpots: t.dimensions.filter(d => d.percentage < 50).map(d => `${d.label || d.dimension}(${d.percentage}%) - 这是您最需要关注的提升领域`),
      growthPath: ['从最低分维度开始针对性训练', '建立日常情绪觉察练习', '在安全环境中练习新的情绪技能', '定期评估进展并调整训练计划'],
      recommendedBooks: ['《情商》Daniel Goleman - EQ理论奠基之作', '《非暴力沟通》- 提升共情和表达能力', '《正念》- 培养情绪觉察能力'],
      habits: ['每日3次情绪check-in（早中晚）', '每次冲突后进行情绪复盘', '每周记录3个共情练习', '每月评估五维度进展', '定期正念冥想训练'],
      mindsetShifts: ['所有情绪都有存在的价值和功能', '情绪管理不等于情绪压抑', '共情能力可以像肌肉一样锻炼'],
      shortTermGoals: ['掌握至少5种情绪词汇来精确描述感受', '在3个场景中成功使用情绪调节技巧', '获得至少一位亲友对你情商变化的正面反馈'],
      longTermGoals: ['各维度达到60%以上的水平', '成为朋友圈中被信赖的倾听者', '将高情商融入日常行为自动化']
    },
    careerAnalysis: {
      overview: `Goleman 的研究表明，在领导力岗位上，情商的重要性是IQ的两倍。您的情商维度组合决定了您在职场中的独特优势和发展方向。`,
      idealIndustries: ['人力资源/组织发展', '心理咨询/教育', '客户服务/体验', '市场营销/公关', '医疗/社工'],
      idealRoles: ['团队负责人', '项目经理', '客户关系经理', '培训师', '人力资源专家'],
      workStyle: '情商影响您的工作效率和人际效果。高自我管理助力自律，高社交技巧助力协作。',
      leadershipStyle: '基于您的情商维度组合分析领导力特点。共情和社交技巧是最重要的领导力EQ维度。',
      teamDynamics: '高情商者在团队中通常扮演"粘合剂"角色，能有效化解冲突、激励成员。',
      careerRisks: ['情商盲点可能在高压环境下暴露', '过度共情可能导致情绪耗竭', '需要在同理心和决断力之间平衡'],
      careerAdvantages: ['人际关系处理能力', '团队信任建设', '冲突化解能力', '客户关系维护'],
      fiveYearPath: '通过持续提升情商，逐步进入需要更高人际互动和领导力的角色。',
      salaryPotential: 'TalentSmart 研究显示，情商每提升1分，年薪平均增加$1,300。情商是薪资增长的隐形杠杆。'
    },
    workAnalysis: {
      productivityTips: ['利用情绪管理能力保持专注状态', '在高情绪时刻先暂停再行动', '用社交技巧争取更多资源和支持', '在会议前做好情绪准备', '利用共情优势建立职场同盟'],
      communicationStyle: '您的情商维度决定了您的职场沟通效果。高共情者更擅长倾听，高社交技巧者更擅长说服。',
      meetingBehavior: '情商在会议中体现为对气氛的感知、对发言时机的把握和对冲突的化解能力。',
      stressResponse: '自我管理维度直接决定压力下的情绪调控能力。内驱力维度影响压力中的韧性。',
      collaborationStyle: '高共情和社交技巧让您在团队协作中具有天然优势。',
      feedbackPreference: '情商帮助您更建设性地处理负面反馈，也更善于给出有温度的反馈。',
      idealWorkEnvironment: '开放、注重人际关系和情感表达的工作文化最能发挥您的情商优势。',
      workLifeBalance: '情绪管理能力是工作生活平衡的基础。学会设定情绪边界，避免工作情绪延伸到生活。'
    },
    testSpecificInsights: {
      title: '情商五维度深度训练方案',
      sections: [
        { heading: '最需提升的维度分析', content: `基于您的得分，最需要关注的维度将获得针对性的分析和训练建议。低于50%的维度是提升空间最大的领域。` },
        { heading: '21天情商训练计划', content: '第1-7天：情绪觉察训练（每天记录5次情绪状态）；第8-14天：情绪调节练习（学习3种调节技巧）；第15-21天：共情实践（每天进行1次深度倾听练习）。' },
        { heading: '情绪觉察日记指南', content: '每次记录包括：触发事件、情绪名称、身体感受、自动想法、行为反应、事后反思。通过系统记录，您可以发现自己的情绪模式并有针对性地改善。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: `综合情商水平${level}在人群中的分布情况`,
      famousPeople: ['Daniel Goleman（情商概念推广者）', 'Oprah Winfrey（高情商代表）', '马云（商业情商典范）', 'Brené Brown（情感研究者）', 'Nelson Mandela（共情领导者）'],
      typicalCareers: ['心理咨询师', '企业培训师', '人力资源总监', '销售总监', '社会工作者'],
      globalDistribution: '情商水平受文化、教育和个人经历影响较大。东方文化普遍更重视社交和谐维度，西方文化更强调自我表达维度。',
      genderDistribution: '研究显示女性在共情能力上平均略高，男性在自我管理上平均略高，但个体差异远大于性别差异。'
    }
  }
}

function generateHollandMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  return {
    relationshipAnalysis: {
      overview: `作为${t.score}型，您的职业兴趣类型也影响着您的职业社交方式。RIASEC 类型决定了您更倾向于与哪类人建立职业联系，以及如何拓展人脉。`,
      communicationInRelationship: '您的职业社交风格受RIASEC类型影响。不同类型的人在网络建设和人脉维护上有不同偏好。',
      conflictResolution: '在职场人际冲突中，了解对方的职业兴趣类型有助于找到共同语言和解决方案。',
      advice: ['参加匹配您兴趣类型的行业社交活动', '建立跨类型的职业人脉网络', '利用您的类型优势为他人提供价值', '在LinkedIn等平台展示您的类型特长', '定期维护职业关系'],
      redFlags: ['只与相同类型的人社交（信息茧房）', '忽视职业人脉的长期维护', '在不匹配的环境中强行社交'],
      greenFlags: ['与互补类型的人建立合作关系', '在职业社交中展现真实的兴趣和热情', '能为他人提供类型互补的帮助'],
    },
    personalGrowth: {
      overview: `Holland理论认为，职业满意度来自于个人兴趣类型与工作环境的匹配度。您的${t.score}类型揭示了您的核心职业兴趣，成长的关键在于找到最佳的人-环境匹配。`,
      coreStrengths: ['明确的职业兴趣方向', '在匹配环境中的天然动力', '对相关领域的持续好奇心', '类型一致性带来的决策清晰度', '在核心领域的快速学习能力'],
      blindSpots: ['可能忽视非核心类型的发展机会', '过度聚焦舒适区', '对不匹配环境的适应力不足'],
      growthPath: ['深耕核心兴趣类型的技能', '适度发展相邻类型的能力', '探索核心类型的新兴应用领域', '建立跨类型的协作能力'],
      recommendedBooks: ['《你的降落伞是什么颜色》- 职业规划经典', '《深度工作》- 提升核心竞争力', '《远见》- 长期职业战略思维'],
      habits: ['每月关注一个行业趋势报告', '每季度与一位业内前辈交流', '持续学习核心领域的新技能', '记录职业成就和成长日志'],
      mindsetShifts: ['职业满意度比薪资更影响长期幸福', '兴趣可以在不同岗位形态中实现', '跨类型能力是稀缺的竞争优势'],
      shortTermGoals: ['确定核心兴趣类型的3个细分方向', '完成一个提升核心竞争力的项目', '建立5个高质量的行业联系'],
      longTermGoals: ['成为核心领域的专家或意见领袖', '找到兴趣-能力-市场的最佳交叉点', '建立可持续的职业发展路径']
    },
    careerAnalysis: {
      overview: `这是您报告中最核心的部分。${t.score}型的职业兴趣指向特定的行业和岗位集群。Holland的六边形模型显示，您的三字母代码中相邻类型代表高度相关的职业领域，对角类型则代表差异最大的方向。`,
      idealIndustries: ['基于三字母代码推荐的7个最佳行业方向'],
      idealRoles: ['基于RIASEC组合的7个最佳岗位'],
      workStyle: `${t.score}型在工作中的典型表现：偏好的任务类型、工作节奏和环境需求。`,
      leadershipStyle: '基于E(企业型)维度得分分析您的领导潜力和风格偏好。',
      teamDynamics: '在团队中，不同RIASEC类型扮演互补角色。了解这些角色有助于找到最佳团队位置。',
      careerRisks: ['在不匹配的环境中长期工作的倦怠风险', '过度聚焦单一方向的市场风险', '忽视软技能发展的晋升瓶颈', '行业变化对特定兴趣类型的冲击'],
      careerAdvantages: ['清晰的职业方向减少试错成本', '天然的内在动机提升工作效率', '同类型社区提供丰富的发展资源', '兴趣驱动的学习效率远高于被动学习', '类型匹配带来的高职业满意度'],
      fiveYearPath: `基于${t.score}型的详细五年发展路径：第1年-行业入门/深耕，第2年-专业化发展，第3年-建立影响力，第4-5年-向更高层次发展。`,
      salaryPotential: '不同RIASEC类型的薪资天花板差异较大。E型在管理路线潜力最高，I型在技术专家路线潜力最高。您的组合类型在合适领域有可观的薪资发展空间。'
    },
    workAnalysis: {
      productivityTips: ['将核心兴趣融入日常工作任务', '在非兴趣任务中寻找与核心类型的连接点', '利用兴趣驱动力攻克困难任务', '建立符合类型偏好的工作流程', '定期评估工作内容与兴趣匹配度'],
      communicationStyle: '您在职场中的沟通风格受核心兴趣类型影响，不同类型偏好不同的沟通方式和频率。',
      meetingBehavior: 'RIASEC类型影响您在会议中的参与模式和贡献方式。',
      stressResponse: '当工作环境与核心兴趣类型严重不匹配时，压力和倦怠感会显著增加。',
      collaborationStyle: '与相邻类型的同事合作最自然，与对角类型的同事需要更多适应。',
      feedbackPreference: '不同RIASEC类型对反馈的接受方式和内容偏好有差异。',
      idealWorkEnvironment: `${t.score}型最适合的工作环境：物理环境、文化氛围和团队组成。`,
      workLifeBalance: '将核心兴趣融入生活爱好，可以实现工作和生活的自然衔接而非对立。'
    },
    testSpecificInsights: {
      title: 'RIASEC 职业深度规划',
      sections: [
        { heading: '六边形一致性分析', content: `您的三字母代码${t.score}在六边形上的分布揭示了您兴趣的集中度和多样性。相邻字母代表高一致性（兴趣集中），非相邻字母代表低一致性（兴趣多元）。` },
        { heading: '新兴职业匹配', content: '结合AI革命和数字化转型趋势，为您推荐匹配核心兴趣类型的新兴职业方向，包括传统职业的数字化升级版本。' },
        { heading: '职业转型路径', content: '如果当前工作与核心兴趣不匹配，基于RIASEC六边形提供最平滑的转型路径——沿六边形相邻方向转型成本最低。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][i % 6] })),
    },
    statistics: {
      populationPercentage: `${t.score}型职业兴趣组合在人群中的分布`,
      famousPeople: ['基于该RIASEC类型的知名人物'],
      typicalCareers: ['基于三字母代码的7个典型职业方向'],
      globalDistribution: 'RIASEC 分布受经济发展水平和产业结构影响。发达经济体中I型和A型比例较高，发展中经济体R型和C型比例较高。',
      genderDistribution: '传统上R型男性较多、S型女性较多，但随着性别平等进步，差异正在缩小。'
    }
  }
}

function generateEnneagramMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  return {
    relationshipAnalysis: {
      overview: `作为九型人格${t.score}号类型，您的核心动机和恐惧深刻影响着亲密关系中的行为模式。理解这些深层动力是改善关系质量的关键。`,
      attachmentStyle: '您的依恋类型受核心恐惧的影响。九型人格理论帮助我们看到依恋模式背后的深层心理动力。',
      idealPartnerTraits: ['理解并接纳您的核心需求', '不触发核心恐惧', '支持您的整合方向成长', '在情感安全中给予空间', '有互补的优势'],
      communicationInRelationship: '您在亲密关系中的沟通模式受核心动机驱动。了解这一点有助于更真诚地表达。',
      conflictResolution: '压力下您可能会向解离方向移动，表现出非典型行为。识别这种模式是管理冲突的第一步。',
      advice: ['觉察核心恐惧在关系中的投射', '向整合方向寻找关系改善的力量', '与伴侣分享您的核心需求和恐惧', '在冲突中觉察自动反应模式', '练习从伴侣的类型视角看问题'],
      redFlags: ['持续触发核心恐惧的关系模式', '让您长期处于解离方向的关系', '否定您核心需求的伴侣'],
      greenFlags: ['支持您向整合方向成长', '理解您的类型特点并接纳', '在关系中创造安全感'],
      compatibleTypes: ['基于九型理论的匹配类型'],
      incompatibleTypes: ['需特别注意的类型组合'],
      longTermRelationship: '长期关系是个人成长的最佳道场。通过九型人格的视角，您可以理解关系中的模式并有意识地成长。'
    },
    personalGrowth: {
      overview: `九型人格的最大价值在于揭示成长路径。${t.score}号类型的成长关键在于：从核心恐惧的束缚中解放，向整合方向移动，发展更健康的内在状态。这是一个终身的旅程。`,
      coreStrengths: ['核心动机带来的天然优势', '在健康状态下的卓越品质', '该类型独特的智慧和力量', '对核心领域的深刻洞察', '在整合方向的成长潜力'],
      blindSpots: ['核心恐惧驱动的自动反应', '在不健康状态下的负面模式', '对核心需求的过度执着'],
      growthPath: ['觉察核心恐惧的自动触发模式', '识别解离方向的行为信号', '有意识地练习整合方向的品质', '建立日常的自我观察练习'],
      recommendedBooks: ['《九型人格的智慧》Riso & Hudson - 最权威的九型指南', '《九型人格与人际关系》- 理解关系动力', '《觉醒》- 从自动模式中解放'],
      habits: ['每日自我观察：今天核心恐惧被触发了吗？', '每周练习一次整合方向的行为', '记录自动反应模式的觉察日志', '每月与信任的人分享成长洞察', '正念冥想增强自我觉察'],
      mindsetShifts: ['核心恐惧不等于现实', '成长不是改变类型，而是向更健康的层级发展', '每种类型在健康状态下都是光芒万丈的'],
      shortTermGoals: ['清楚识别自己的核心恐惧和动机', '在一个场景中成功觉察并超越自动反应', '学习整合方向类型的一个积极品质'],
      longTermGoals: ['从核心恐惧的束缚中获得更多自由', '在大多数时候维持健康的内在状态', '帮助身边的人也理解九型人格的智慧']
    },
    careerAnalysis: {
      overview: `${t.score}号类型的核心动机影响职业选择和工作满意度。当工作内容与核心动机一致时，您会展现出非凡的投入和创造力。`,
      idealIndustries: ['基于核心动机的行业推荐'],
      idealRoles: ['基于该类型特质的岗位推荐'],
      workStyle: '您的工作风格受核心动机和恐惧的共同影响。',
      leadershipStyle: '该类型在领导岗位上的独特优势和需注意的盲点。',
      teamDynamics: '九种类型在团队中形成丰富的互动动力。了解这些动力有助于建立高效团队。',
      careerRisks: ['核心恐惧在职场中的具体表现', '在不健康状态下的职业风险', '过度认同工作角色的风险'],
      careerAdvantages: ['核心动机带来的独特职业优势', '在健康状态下的卓越领导力', '对特定领域的深刻理解和热情', '该类型独有的工作品质'],
      fiveYearPath: '基于九型成长路径的职业发展规划。',
      salaryPotential: '薪资发展与九型类型无直接关系，但核心动机影响您选择追求的价值维度。'
    },
    workAnalysis: {
      productivityTips: ['了解核心动机如何影响工作效率', '在效率低下时觉察核心恐惧的干扰', '利用整合方向的能量提升表现', '设计与核心动机一致的工作流程', '管理解离方向的效率陷阱'],
      communicationStyle: '您在职场中的沟通模式受核心动机驱动，了解这一点有助于更有效地表达。',
      meetingBehavior: '九型类型影响您在会议中的参与方式和关注焦点。',
      stressResponse: '压力下您可能向解离方向移动。识别早期信号有助于主动管理压力状态。',
      collaborationStyle: '与不同九型类型的同事合作需要理解彼此的核心需求。',
      feedbackPreference: '核心恐惧影响您对反馈的接受方式。觉察这一点有助于更建设性地处理反馈。',
      idealWorkEnvironment: '满足核心需求、不持续触发核心恐惧的工作环境。',
      workLifeBalance: '核心动机影响您对工作投入的方式。觉察自动模式有助于建立健康平衡。'
    },
    testSpecificInsights: {
      title: '九型人格动态系统解读',
      sections: [
        { heading: '整合与解离方向', content: `${t.score}号类型在健康成长时会向特定方向（整合）发展，获得那个类型的积极品质。在压力和不健康状态下则向另一方向（解离）移动，表现出那个类型的消极面。了解这两个方向是自我成长的路线图。` },
        { heading: '翼型影响分析', content: '您的主要类型会受到相邻两个类型的修饰，形成独特的子类型（如1w9、1w2）。翼型为主类型增添了独特的色彩和能力。' },
        { heading: '三大智慧中心', content: '身体中心（8/9/1）处理愤怒，心灵中心（2/3/4）处理羞耻，思维中心（5/6/7）处理恐惧。了解您所属的智慧中心有助于理解核心情绪模式的管理策略。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#a855f7', '#14b8a6', '#f97316'][i % 9] })),
      compatibilityScores: [{ type: '整合方向类型', score: 90 }, { type: '相邻翼型', score: 80 }, { type: '解离方向类型', score: 50 }]
    },
    statistics: {
      populationPercentage: `${t.score}号类型约占人群的特定比例`,
      famousPeople: ['基于该九型类型的知名人物'],
      typicalCareers: ['基于核心动机的典型职业'],
      globalDistribution: '九型人格分布在不同文化中有差异。集体主义文化中2号和6号比例较高，个人主义文化中3号和7号比例较高。',
      genderDistribution: '九型人格本身没有性别差异，但社会性别角色期待可能影响类型的表达方式。'
    }
  }
}

function generateDepressionMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const totalScore = parseInt(t.score) || 0
  const severity = totalScore < 15 ? '无/轻微' : totalScore < 30 ? '轻度' : totalScore < 50 ? '中度' : totalScore < 70 ? '中重度' : '重度'
  return {
    relationshipAnalysis: {
      overview: `当前您的抑郁评估总分为${t.score}/90（${severity}）。情绪状态会影响各类人际关系的质量。了解这些影响有助于在康复过程中获得更好的社会支持。`,
      communicationInRelationship: '在当前情绪状态下，向亲近的人表达自己的需求和感受可能比较困难。这是正常的，可以从小步骤开始。',
      conflictResolution: '情绪低落时，冲突处理能力可能下降。建议在情绪激动时先给自己缓冲时间。',
      advice: ['向至少一位信任的人分享你的感受', '接受他人的善意帮助', '设定社交的合理期望', '保持基本的社交联系', '学会说"我需要帮助"'],
      redFlags: ['完全回避社交和人际联系', '在关系中持续自我否定', '忽视所有支持信号'],
      greenFlags: ['愿意向他人敞开一点点', '能接受他人的关心', '保持基本的社交活动'],
      longTermRelationship: '亲密关系可以是康复过程中的重要支持。与伴侣坦诚沟通你的状态，共同面对挑战。'
    },
    personalGrowth: {
      overview: `这份报告的核心目的是为您提供科学的自我关怀指导。当前评估等级为${severity}，${totalScore >= 30 ? '建议寻求专业心理帮助作为康复的重要一步。' : '以下自助方案可以帮助您改善当前状态。'}基于认知行为疗法(CBT)和接受与承诺疗法(ACT)的研究成果，我们为您制定了个性化的调节方案。`,
      coreStrengths: ['愿意了解自己的状态（完成了评估）', '寻求改善的意愿', '内在的韧性和力量', '过往克服困难的经验', '对自己的关注和照顾'],
      blindSpots: ['可能低估了自己的积极面', '可能过度泛化负面经验', '社会支持资源可能未被充分利用'],
      growthPath: ['接纳当前状态，不自我批判', '建立每日微小的积极行为', '逐步扩展活动范围', '持续评估和调整康复计划'],
      recommendedBooks: ['《伯恩斯新情绪疗法》- CBT自助经典', '《活出最乐观的自己》- 积极心理学', '《与自己和解》- 自我关怀指南'],
      habits: ['每天记录3件好事（哪怕很小）', '每天至少15分钟轻度运动', '保持规律的作息时间', '每天进行5分钟正念呼吸', '保持基本的社交联系'],
      mindsetShifts: ['情绪低落是可以改善的状态，不是永久的命运', '寻求帮助是勇敢的表现', '康复是一个过程，允许起伏'],
      shortTermGoals: ['建立一个稳定的日常作息', '找到一项能带来愉悦感的活动', '联系至少一位可以倾诉的人'],
      longTermGoals: ['恢复日常社会功能', '建立可持续的情绪管理方法', '建立预防复发的长期策略']
    },
    careerAnalysis: {
      overview: `当前情绪状态可能对工作产生影响，包括注意力、动力和人际互动。重要的是在康复过程中合理调整工作期望和节奏。`,
      idealIndustries: ['压力适中的工作环境', '有灵活工作安排的单位', '人际氛围温暖的团队'],
      idealRoles: ['节奏可控的岗位', '能获得成就感的工作', '有社交但不过度的角色'],
      workStyle: '建议在当前状态下适当降低工作强度，以康复为首要目标。',
      teamDynamics: '如果可能，向信任的同事或上级适度说明情况，争取理解和支持。',
      careerRisks: ['在低状态时做重大职业决策', '因工作压力加重症状', '社交退缩影响职业发展'],
      careerAdvantages: ['经历过挫折的人通常有更强的共情能力', '康复后往往获得更深的自我理解', '对心理健康的认知成为长期资产']
    },
    workAnalysis: {
      productivityTips: ['将任务分解为更小的步骤', '在精力最好的时段处理重要工作', '允许自己降低标准,完成比完美重要', '定期短休息维持状态', '使用清单减少认知负担'],
      communicationStyle: '如果需要，可以简要告知同事你状态不佳，大多数人会给予理解和支持。',
      stressResponse: '当前状态下压力耐受力可能下降，需要更主动的压力管理。',
      collaborationStyle: '在团队合作中，可以承担你能胜任的部分，不必勉强自己。',
      idealWorkEnvironment: '安静、有序、压力可控、同事友善的工作环境最有助于恢复。',
      workLifeBalance: '康复期间，工作生活平衡尤其重要。确保有足够的休息和自我照顾时间。'
    },
    testSpecificInsights: {
      title: '专业康复指导',
      sections: [
        { heading: '症状维度优先级分析', content: `基于您五个症状维度的得分，可以识别出最突出的症状领域。优先关注得分最高的维度，将有限的精力用在最需要的地方。` },
        { heading: '自助调节方案', content: '基于CBT的认知重构：识别自动化消极思维 → 检验这些想法的证据 → 生成更平衡的替代想法。基于ACT的接纳练习：观察而非对抗负面情绪 → 将注意力引向当下 → 采取与价值观一致的行动。' },
        { heading: totalScore >= 30 ? '专业帮助指南' : '预防与维护', content: totalScore >= 30 ? '建议寻求专业心理咨询或精神科医生的帮助。首次就诊时可以准备：症状持续时间、影响程度、已尝试的自助方法。' : '维持当前健康状态的策略：规律运动、充足睡眠、社交联系、正念练习。定期自我评估，关注情绪变化。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: '全球约有2.8亿人患有抑郁症，约占全球人口的3.8%',
      famousPeople: ['丘吉尔（曾公开谈论"黑狗"）', '林肯（一生与抑郁抗争）', 'Lady Gaga（心理健康倡导者）', '崔永元（勇敢分享经历）', 'J.K. Rowling（从低谷到成功）'],
      typicalCareers: [],
      globalDistribution: '抑郁症在全球各地区均有分布，高收入国家报告率较高（可能与诊断普及有关），但低收入国家的实际患病率可能更高。',
      genderDistribution: '女性患病率约为男性的1.5-2倍，但男性的求助率更低，需要更多关注。'
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
