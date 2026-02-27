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

async function callDeepSeekAPI(prompt: string, maxTokens = 8000): Promise<string> {
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
          content: '你是一位专业的心理咨询师和职业规划专家，擅长分析各类心理测评结果并提供有价值的建议。请始终以纯JSON格式输出结果，不要使用markdown代码块包裹。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API 调用失败: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

function parseJSONResponse<T>(content: string): T {
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 响应')
  }

  const attempts = [
    () => JSON.parse(jsonMatch[0]),
    () => JSON.parse(jsonMatch[0].replace(/,\s*([}\]])/g, '$1')),
    () => JSON.parse(jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, ' ').replace(/,\s*([}\]])/g, '$1')),
  ]

  for (const attempt of attempts) {
    try {
      return attempt()
    } catch { /* try next */ }
  }

  throw new Error('JSON 解析失败（已尝试多种修复策略）')
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
    dimensionAnalysis: testResult.dimensions.map(d => {
      const pct = d.percentage
      const label = d.label || d.dimension
      const hi = pct >= 70, lo = pct <= 30, mid = !hi && !lo
      return {
        dimension: d.dimension,
        label,
        percentage: pct,
        description: `您在${label}维度的得分为${pct}%。${hi ? '这是一个较高的得分，表明您在这方面有突出的倾向和优势，在相关场景中能自然地发挥出色。' : lo ? '这是一个较低的得分，但并非缺点——它反映了您的能量更多地分配在其他维度上，通过有意识的练习可以逐步发展。' : '这是一个中等水平的得分，表明您在这方面具有灵活的适应能力，能根据情境做出恰当的调整。'}`,
        strengths: hi ? [`${label}维度突出，在相关场景中具有天然竞争力`, `高${label}为人际互动和职业发展提供独特优势`]
          : mid ? [`${label}维度均衡，能灵活适应不同情境需求`, `中等水平的${label}提供了多样化发展的基础`]
          : [`低${label}意味着在其他维度上可能更加突出`, `${label}维度有较大的成长空间和发展潜力`],
        challenges: hi ? [`过高的${label}在某些场景下可能需要适度调节`, `注意在发挥${label}优势的同时平衡其他维度`]
          : mid ? [`${label}处于中间水平，在极端场景中可能不够突出`, `可以根据发展方向选择性地强化${label}`]
          : [`较低的${label}可能在特定场景中带来挑战`, `建议通过针对性练习逐步提升${label}的表达`]
      }
    }),
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
  const O = dims['O'] || 50, C = dims['C'] || 50, E = dims['E'] || 50, A = dims['A'] || 50, N = dims['N'] || 50
  const hi = (v: number) => v >= 60, lo = (v: number) => v <= 40
  const sorted = [...t.dimensions].sort((a, b) => b.percentage - a.percentage)
  const highest = sorted[0], lowest = sorted[sorted.length - 1]

  const industries: string[] = []
  if (hi(O)) industries.push('创意设计', '研发创新', '咨询策略')
  if (hi(C)) industries.push('金融会计', '项目管理', '质量管理')
  if (hi(E)) industries.push('市场营销', '销售管理', '公关传媒')
  if (hi(A)) industries.push('人力资源', '教育培训', '医疗护理')
  if (lo(N)) industries.push('危机管理', '高压决策岗位')
  if (industries.length < 3) industries.push('通用管理', '行政管理', '数据分析')

  const roles: string[] = []
  if (hi(O) && hi(C)) roles.push('产品经理', '战略咨询师', '研发项目负责人')
  else if (hi(O)) roles.push('创意总监', 'UX设计师', '内容策划')
  else if (hi(C)) roles.push('财务分析师', '运营经理', '质量总监')
  if (hi(E)) roles.push('销售总监', '市场经理', '公关经理')
  if (hi(A)) roles.push('HR经理', '培训师', '客户成功经理')
  if (roles.length < 3) roles.push('项目协调员', '数据分析师', '行政主管')

  const attachmentStyle = hi(N) && lo(A) ? '焦虑-回避型：您可能在关系中既渴望亲密又担心受伤，建议培养安全感和信任能力。'
    : hi(N) ? '焦虑型：高神经质可能导致您对关系中的信号过度敏感，建议练习区分真实威胁和情绪放大。'
    : lo(E) && lo(A) ? '回避型：您可能倾向于保持情感距离，建议在安全关系中练习渐进式的亲密和信任。'
    : '安全型倾向：您的情绪稳定性和人际温暖度支持建立安全、信任的关系模式。'

  const profileLabel = hi(O) && hi(C) ? '有纪律的创新者' : hi(E) && hi(A) ? '天然的团队协调者' : hi(C) && lo(N) ? '稳定高效的执行者' : hi(O) && lo(C) ? '自由创意型' : hi(A) && hi(E) ? '社交凝聚者' : hi(C) && hi(N) ? '谨慎的完美主义者' : '均衡发展型'

  return {
    relationshipAnalysis: {
      overview: `根据大五人格模型，您的宜人性(${A}%)和神经质(${N}%)是影响亲密关系质量的关键维度。研究表明，高宜人性有助于建立和谐的伴侣互动，而神经质水平直接影响情绪反应强度。您的外向性(${E}%)决定了社交需求和表达方式，开放性(${O}%)影响您对关系新体验的接受度，尽责性(${C}%)影响您对关系承诺的投入程度。`,
      attachmentStyle: attachmentStyle,
      idealPartnerTraits: [
        hi(N) ? '情绪稳定、能提供安全感的伴侣' : '能与您共同保持积极心态的伴侣',
        hi(O) ? '好奇心强、乐于探索新事物的人' : '脚踏实地、价值观稳定的人',
        hi(E) ? '社交活跃、能一起参与活动的人' : '享受二人世界、尊重独处时间的人',
        hi(A) ? '同样重视和谐、有同理心的人' : '独立自主、不过度依赖的人',
        '有个人成长意愿和自我反思能力的伴侣'
      ],
      communicationInRelationship: `您的外向性(${E}%)${hi(E) ? '较高，意味着您善于表达情感和需求，喜欢通过交流增进感情。但要注意给内向的伴侣留出安静空间。' : lo(E) ? '较低，意味着您更倾向于内心感受而非外在表达。建议刻意练习在关系中用语言分享内心世界。' : '处于中间水平，您能根据情境灵活调整沟通方式。'}宜人性(${A}%)${hi(A) ? '使您在沟通中更具同理心和包容性。' : lo(A) ? '提醒您在沟通中注意对方的感受，避免过于直接。' : '让您在表达诚实和顾及感受之间保持平衡。'}`,
      conflictResolution: `${hi(A) && lo(N) ? '您在冲突中倾向于冷静应对、寻找共识，这是非常健康的模式。但要注意不要因过度回避冲突而压抑自己的需求。' : hi(N) ? '您在冲突中的情绪反应可能较为强烈(神经质' + N + '%)。建议在冲突来临时先给自己10秒的情绪缓冲时间，区分情绪感受和事实判断后再回应。' : lo(A) ? '您在冲突中可能较为直接和坚持立场。建议在表达自己观点的同时，主动倾听对方的感受和需求。' : '您处理冲突的方式较为均衡。建议保持这种平衡，在需要时既能坚持原则也能妥协让步。'}`,
      advice: ['根据伴侣的人格维度调整互动方式', '定期进行情感check-in，主动分享感受', '在关系中保持个人成长的空间', '学习非暴力沟通技巧处理分歧', '共同制定关系目标并定期回顾'],
      redFlags: ['持续引发您神经质反应的互动模式', '压抑您的核心人格特质（如限制开放性的探索）', '在尽责性上严重不匹配导致生活摩擦'],
      greenFlags: ['在关系中感到情绪安全和被接纳', '能激发彼此的好奇心和成长动力', '在核心价值观上高度一致'],
      longTermRelationship: `研究表明，宜人性和情绪稳定性（低神经质）是长期关系满意度最强的预测因素。您的宜人性(${A}%)和神经质(${N}%)组合${hi(A) && lo(N) ? '非常有利于长期关系的维护。' : hi(N) ? '提示您需要在长期关系中特别关注情绪管理。' : '具有良好的长期关系发展基础。'}建议与伴侣建立定期沟通的机制，在信任中持续深化连接。`
    },
    personalGrowth: {
      overview: `大五人格研究（Costa & McCrae, 1992）表明，人格特质在成年后相对稳定，但可以在有意识的努力下逐步调整。您的维度组合呈现"${profileLabel}"特征：${highest ? `${highest.label || highest.dimension}(${highest.percentage}%)是您最突出的优势维度` : '各维度较为均衡'}${lowest ? `，${lowest.label || lowest.dimension}(${lowest.percentage}%)是最大的成长空间` : ''}。成长的关键不是改变所有维度，而是发挥优势、管理短板。`,
      coreStrengths: [
        ...t.dimensions.filter(d => d.percentage >= 60).map(d => {
          const labels: Record<string, string> = { O: '开放性带来的创造力和好奇心', C: '尽责性带来的自律和执行力', E: '外向性带来的社交能力和感染力', A: '宜人性带来的同理心和合作精神', N: '高敏感带来的深度情感体验' }
          return `${d.label || d.dimension}(${d.percentage}%): ${labels[d.dimension] || '突出优势'}`
        }),
        `独特的维度组合构成"${profileLabel}"特征`
      ],
      blindSpots: t.dimensions.filter(d => d.percentage <= 40).map(d => {
        const labels: Record<string, string> = { O: '较低的开放性可能限制创新思维和新体验', C: '较低的尽责性可能影响时间管理和目标坚持', E: '较低的外向性可能限制社交网络的拓展', A: '较低的宜人性可能在团队合作中产生摩擦', N: '极低的神经质可能导致对风险信号不够敏感' }
        return `${d.label || d.dimension}(${d.percentage}%): ${labels[d.dimension] || '需要关注的发展领域'}`
      }),
      growthPath: ['识别维度间的交互效应并加以利用（如高O+高C = 有纪律的创新者）', '在最低分维度上设定具体、微小的行为改变目标', '利用高分维度的优势来补偿低分维度', '每月进行一次自我评估，追踪行为变化'],
      recommendedBooks: ['《人格心理学》- 理解OCEAN模型的科学基础', '《原子习惯》- 通过微习惯实现持续改变', '《自控力》- 基于神经科学的自我调节策略'],
      habits: ['每日5分钟情绪觉察与命名练习', '每周设定一个小型"舒适区外"挑战', '每天至少30分钟中等强度运动', '记录个人成长日志，追踪维度行为变化'],
      mindsetShifts: ['人格特质是连续谱而非固定标签——您不是"内向的人"，而是"外向性在某个位置的人"', '低分不等于缺陷——不同维度水平适合不同的环境和角色', '有意识的行为练习可以逐步调整特质的表达方式'],
      shortTermGoals: [`针对${lowest ? lowest.label || lowest.dimension : '最低分维度'}设定一个具体的行为改善目标`, `找到一个新场景来发挥${highest ? highest.label || highest.dimension : '最高分维度'}的优势`, '建立每周自我评估的习惯'],
      longTermGoals: ['各维度达到更加灵活、情境适应性强的状态', '在职业中最大化发挥人格优势', '建立健康、稳定、满足的人际关系网络']
    },
    careerAnalysis: {
      overview: `研究表明（Barrick & Mount, 1991），尽责性(${C}%)是职业绩效最强的预测因素，跨行业、跨岗位稳定成立。外向性(${E}%)影响社交密集型岗位的适配度，开放性(${O}%)影响创新和研发方向的偏好。您的维度组合"${profileLabel}"指向特定的职业优势领域。`,
      idealIndustries: industries.slice(0, 5),
      idealRoles: roles.slice(0, 5),
      workStyle: `${hi(C) ? '您的高尽责性意味着您偏好有序、有计划的工作方式，能持续输出高质量结果。' : lo(C) ? '您较低的尽责性提示您需要外部结构（如截止日期、日程规划）来维持工作节奏。' : '您的尽责性处于中间水平，既能按计划执行又保持一定灵活性。'}${hi(E) ? '高外向性让您在社交互动频繁的岗位中如鱼得水。' : lo(E) ? '较低的外向性意味着您在需要深度专注的独立工作中更能发挥。' : ''}`,
      leadershipStyle: `${hi(E) && hi(A) ? '您是天然的变革型领导者——能用愿景激励团队，同时关怀每个成员的需求。' : hi(E) && lo(A) ? '您是高能量的目标驱动型领导——擅长推动结果，但需注意团队成员的感受。' : lo(E) && hi(C) ? '您是专家型领导者——以专业能力和严谨态度赢得尊重，偏好通过系统和流程来管理团队。' : '您的领导风格较为均衡，能根据情境在不同领导模式间切换。'}`,
      teamDynamics: `${hi(A) ? '高宜人性让您成为团队的粘合剂，善于化解冲突和促进合作。' : ''}${hi(E) ? '高外向性使您在团队中常常扮演沟通桥梁和气氛调节者的角色。' : lo(E) ? '您在团队中更适合承担需要深度思考的角色，如分析师或策略制定者。' : ''}建议找到互补维度的团队伙伴，形成优势互补。`,
      careerRisks: [hi(N) ? '高神经质可能在高压环境中放大焦虑，需要主动的压力管理策略' : '注意保持对潜在风险的敏感度', lo(C) ? '较低尽责性可能导致时间管理和项目推进方面的挑战' : '避免过度完美主义影响效率', '保持职业发展的灵活性，定期评估方向'],
      careerAdvantages: t.dimensions.filter(d => d.percentage >= 60).map(d => {
        const labels: Record<string, string> = { O: `开放性(${d.percentage}%)带来创新思维和快速学习能力`, C: `尽责性(${d.percentage}%)带来可靠的执行力和高质量输出`, E: `外向性(${d.percentage}%)带来人脉拓展和团队激励能力`, A: `宜人性(${d.percentage}%)带来团队凝聚力和客户信任`, N: `高敏感度(${d.percentage}%)带来对风险和细节的警觉` }
        return labels[d.dimension] || `${d.label}(${d.percentage}%)带来的职业优势`
      }),
      fiveYearPath: `第1-2年：发挥${highest?.label || '最强维度'}优势深耕专业领域，建立核心竞争力；第3年：承担更大责任${hi(E) ? '，发展跨团队影响力' : '，深化技术或管理能力'}；第4-5年：${hi(O) ? '探索创新方向或创业机会' : hi(C) ? '向高级管理或资深专家路线发展' : '在优势领域建立个人品牌和行业影响力'}。`,
      salaryPotential: `研究表明尽责性和外向性与收入水平正相关。您的尽责性(${C}%)${hi(C) ? '处于有利位置' : '需要通过建立工作系统来弥补'}，外向性(${E}%)${hi(E) ? '为商务社交和薪资谈判提供优势' : '建议通过准备充分的书面沟通来展现价值'}。在匹配的行业和角色中，具有良好的薪资发展空间。`
    },
    workAnalysis: {
      productivityTips: [
        hi(C) ? '利用您天然的计划能力，用时间块管理法安排每天的核心任务' : '建立外部结构（如日程表、截止日期提醒）来弥补自发性偏好',
        hi(O) ? '在常规工作中留出"创意时间"，用新方法解决老问题' : '建立标准化流程，减少重复决策的认知消耗',
        hi(N) ? '识别焦虑的早期信号，用5分钟正念练习打断"忧虑循环"' : '保持对工作质量的关注，避免因过于放松而忽视细节',
        '设定清晰的每日三大优先事项', '每周五回顾本周成果并规划下周重点'
      ],
      communicationStyle: `${hi(E) ? '您偏好口头沟通和即时互动，表达自信且善于说服。在需要精确性的场合建议配合书面确认。' : lo(E) ? '您偏好书面沟通和有准备的表达，发言质量高但需主动争取发言机会。建议在重要会议前准备核心论点。' : '您能在口头和书面沟通之间灵活切换，根据场景选择合适的方式。'}${hi(A) ? '高宜人性让您的沟通风格温和包容，善于倾听。' : ''}`,
      meetingBehavior: `${hi(E) ? '您在会议中表现活跃，善于引导讨论和推动共识。注意给予安静的同事发言空间。' : lo(E) ? '您在会议中倾向于先观察、充分思考后再发言。建议提前准备要点，主动在会议早期分享见解。' : '您能根据会议类型调整参与方式，在需要时积极引导或安静倾听。'}`,
      stressResponse: `您的神经质水平(${N}%)${hi(N) ? '较高，意味着压力反应较为敏感。建议建立"压力预警系统"——当察觉到焦虑上升时，使用4-7-8呼吸法（吸4秒-屏7秒-呼8秒）来快速调节。规律的有氧运动可以显著降低基础焦虑水平。' : lo(N) ? '较低，您在压力下通常能保持冷静。但要注意不要忽视身体的压力信号——定期检查身体状态和情绪健康。' : '处于中间水平，您有一定的压力耐受力。建议建立规律的减压习惯（运动、正念、社交），在压力升高前主动调节。'}`,
      collaborationStyle: `${hi(A) ? '高宜人性使您成为团队中的天然协作者——善于化解分歧、促进合作。' : lo(A) ? '您在协作中更看重效率和结果，可能在意见不一时较为直接。建议在坚持立场时也关注团队关系。' : ''}${hi(E) ? '高外向性让您在跨部门协作和团队沟通中表现出色。' : lo(E) ? '您更适合小团队深度合作，一对一讨论比大组会议更高效。' : ''}`,
      feedbackPreference: `${hi(O) ? '您对反馈持开放态度，能从批评中学习。' : ''}${hi(N) ? '但高神经质可能让您对负面反馈过度敏感——建议将反馈视为信息而非评判，先记录、后消化。' : ''}${lo(A) ? '您偏好直接、不带修饰的反馈——也建议对他人给予同样的尊重和空间。' : '您能以建设性的方式接受和给出反馈。'}`,
      idealWorkEnvironment: `${hi(O) ? '鼓励创新、容许试验的开放环境。' : '有清晰标准和稳定流程的规范化环境。'}${hi(E) ? '社交互动多、团队氛围活跃的工作场所。' : lo(E) ? '安静、有独立工作空间的环境。' : ''}${hi(C) ? '重视质量和专业性、目标明确的组织。' : ''}${lo(N) ? '允许承担挑战和风险的高压环境。' : ''}`,
      workLifeBalance: `${hi(C) ? '您的高尽责性可能导致工作过度投入，需要刻意设定"下班时间"边界。' : ''}${hi(E) ? '社交既是工作也是生活的一部分，注意区分工作社交和个人社交。' : ''}${hi(N) ? '建立稳定的生活节奏有助于管理情绪波动——规律的作息、运动和社交是重要的稳定器。' : ''}保持工作和生活的健康边界，是长期幸福的关键。`
    },
    testSpecificInsights: {
      title: '大五因素深度交互分析',
      sections: [
        { heading: '维度交互效应', content: `五个维度之间存在重要的交互作用。您的维度组合呈现"${profileLabel}"特征。${hi(O) && hi(C) ? '高开放性+高尽责性 = 您是一位有纪律的创新者，能将创意落地执行。' : ''}${hi(E) && hi(A) ? '高外向性+高宜人性 = 您是天然的团队协调者和人际关系专家。' : ''}${hi(C) && lo(N) ? '高尽责性+低神经质 = 您是稳定高效的执行者，在高压环境中表现出色。' : ''}${hi(O) && lo(C) ? '高开放性+低尽责性 = 您是自由创意型人才，在结构松散的环境中更能发挥创造力。' : ''}这些交互效应比任何单一维度都更能解释您的行为模式。` },
        { heading: '与人群常模对比', content: `将您的得分与中国成年人群常模对比：${t.dimensions.map(d => `${d.label || d.dimension}(${d.percentage}%)${d.percentage >= 70 ? '显著高于平均' : d.percentage <= 30 ? '显著低于平均' : '接近平均水平'}`).join('；')}。显著偏离平均值的维度（>70%或<30%）往往是您最鲜明的人格特征，也是对行为影响最大的因素。` },
        { heading: '人格稳定性与发展', content: `纵向研究表明（Roberts et al., 2006），大五人格在成年后相对稳定，但并非一成不变。平均而言，宜人性和尽责性随年龄增长而缓慢上升（成熟效应），神经质通常缓慢下降，外向性和开放性可能略有降低。这意味着您当前的人格画像会随着人生经验的积累而自然演变。了解这些趋势有助于更从容地规划长期个人发展。` }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: `大五人格是连续谱分布，您的"${profileLabel}"维度组合模式在人群中具有独特性`,
      famousPeople: [hi(O) ? '达芬奇（极高开放性）' : '巴菲特（稳健务实）', hi(C) ? '安吉拉·默克尔（极高尽责性）' : '理查德·布兰森（灵活自由型）', hi(E) ? '奥普拉·温弗瑞（极高外向性）' : '比尔·盖茨（内向但影响力巨大）', hi(A) ? '特蕾莎修女（极高宜人性）' : '乔布斯（低宜人性但驱动创新）', lo(N) ? '纳尔逊·曼德拉（极高情绪稳定性）' : 'J.K.罗琳（高敏感赋予深刻洞察）'],
      typicalCareers: roles.slice(0, 5),
      globalDistribution: '大五人格在55个以上国家的研究中展现出跨文化普遍性，但平均水平因文化而异。东亚文化中尽责性和宜人性平均得分较高，西方文化中外向性和开放性平均得分较高。',
      genderDistribution: '研究显示女性在宜人性和神经质上平均略高，男性在外向性的某些子维度上略高，但个体差异远大于性别差异——人格是个体特征，而非性别标签。'
    }
  }
}

function generateDISCMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const primary = (t.score || 'D').charAt(0).toUpperCase()
  const discMap: Record<string, {
    label: string; overview: string; commStyle: string; conflict: string;
    compatible: string[]; incompatible: string[];
    industries: string[]; roles: string[]; workStyle: string; leadership: string;
    strengths: string[]; blindSpots: string[]; risks: string[]; advantages: string[];
    stress: string; meeting: string; idealEnv: string;
    famousPeople: string[]; typicalCareers: string[]; pct: string;
  }> = {
    D: {
      label: '支配型(D)', overview: `作为D型主导风格，您在人际互动中表现出直接、果断、目标导向的行为模式。您习惯快速做出决策，追求效率和结果，在团队中常常自然地承担领导角色。您对模糊和拖延缺乏耐心，更喜欢开门见山的沟通方式。`,
      commStyle: '您的沟通风格直接明了，注重效率，不喜欢绕弯子。在职场中，您倾向于用最简短的语言传达核心信息，期望对方也能快速回应。建议在需要时放慢节奏，给予他人思考和表达的空间。',
      conflict: '面对冲突时，您倾向于直面问题、快速解决，可能会显得过于强势。建议在坚持立场的同时，主动倾听对方观点，寻找双赢方案而非单方面推进。',
      compatible: ['I 影响型', 'S 稳定型'], incompatible: ['C 谨慎型'],
      industries: ['企业管理', '创业投资', '法律服务', '销售管理', '项目管理'],
      roles: ['CEO/总经理', '项目总监', '业务拓展经理', '律师', '投资经理'],
      workStyle: '您偏好快节奏、高挑战的工作环境，擅长在压力下做出决策。您倾向于独立完成核心任务，将执行细节委派给团队。远程或灵活办公需注意保持团队连接。',
      leadership: '您是天生的决策型领导者，擅长设定清晰目标并推动执行。您的领导风格强调结果导向，但需注意在关注任务的同时也要关心团队成员的感受和发展。',
      strengths: ['强大的决策力和执行力', '高效的目标推进能力', '不畏挑战的勇气', '清晰的战略思维', '快速适应变化的能力'],
      blindSpots: ['可能忽视团队成员的情感需求', '追求速度时可能忽略细节', '在合作中可能过于强势'],
      risks: ['独断决策导致团队抵触', '忽视细节引发质量问题', '过度追求掌控导致微管理'],
      advantages: ['危机处理能力强', '谈判和博弈中的天然优势', '快速决策推动项目进展', '结果导向赢得上级信任'],
      stress: '压力下您会变得更加独断和急躁，可能忽略他人意见。建议在高压时刻有意识地暂停，征求团队意见后再行动。运动和竞技性活动是有效的减压方式。',
      meeting: '您在会议中倾向于快速切入主题、推动决策。可能会打断冗长的讨论。建议给予每位参与者发言机会，利用您的引导力确保会议高效但不压制。',
      idealEnv: '快节奏、高自主权、结果导向的工作环境。需要足够的决策权和资源调配能力，不适合层级繁多、流程缓慢的组织。',
      famousPeople: ['史蒂夫·乔布斯', '马云', '董明珠', '杰夫·贝佐斯', '玛格丽特·撒切尔'],
      typicalCareers: ['企业家', '项目总监', '律师', '投资经理', '销售总监'],
      pct: 'D型主导风格约占人群的10-15%，在管理层和创业者中比例更高'
    },
    I: {
      label: '影响型(I)', overview: `作为I型主导风格，您在人际互动中表现出热情、乐观、善于表达的行为模式。您天生具有感染力，能快速与他人建立联系，在社交场合中如鱼得水。您重视认可和赞赏，善于用积极的态度影响周围的人。`,
      commStyle: '您的沟通风格生动有趣、富有表现力。您擅长用故事和类比传达观点，能让复杂的信息变得通俗易懂。在职场中，您善于营造积极氛围，但需注意控制沟通的深度和精确度。',
      conflict: '面对冲突时，您倾向于用幽默化解或回避对抗。建议在需要时直面问题，不要因为担心关系破裂而回避重要的分歧。真诚的沟通比维持表面和谐更重要。',
      compatible: ['D 支配型', 'S 稳定型'], incompatible: ['C 谨慎型'],
      industries: ['市场营销', '公关传媒', '教育培训', '娱乐行业', '广告创意'],
      roles: ['市场总监', '公关经理', '培训师/讲师', '品牌策划', '客户关系经理'],
      workStyle: '您偏好社交互动多、创意空间大的工作。您在头脑风暴和创意讨论中表现突出，但可能在需要独立完成细节性工作时效率下降。建议用时间块管理法平衡社交和专注时间。',
      leadership: '您是激励型领导者，擅长用愿景和热情感染团队。您的领导风格强调人际关系和团队士气，但需注意在鼓舞团队的同时也要建立清晰的绩效标准和执行纪律。',
      strengths: ['卓越的人际感染力', '创意表达和演讲能力', '快速建立信任的能力', '积极乐观的心态', '灵活应变的社交智慧'],
      blindSpots: ['可能过于关注人际关系而忽视任务', '承诺过多导致难以兑现', '注意力容易分散'],
      risks: ['过度承诺导致信任受损', '忽视数据和细节的分析', '在需要独立深度工作时效率低'],
      advantages: ['天然的人脉拓展能力', '演讲和提案中的感染力', '团队凝聚力的核心', '跨部门沟通的桥梁'],
      stress: '压力下您可能变得更加散漫和情绪化，用社交活动逃避工作。建议在高压时刻设定具体的行动清单，用社交能量来寻求帮助而非逃避问题。',
      meeting: '您在会议中活跃积极，善于活跃气氛和激发讨论。可能会偏离议题或讨论过长。建议在会前准备核心论点，在会中关注议程推进。',
      idealEnv: '开放、协作、允许创意表达的工作环境。需要社交互动的机会和认可反馈，不适合封闭、规则僵化的组织。',
      famousPeople: ['奥普拉·温弗瑞', '威尔·史密斯', '李佳琦', '泰勒·斯威夫特', '蔡康永'],
      typicalCareers: ['市场总监', '公关经理', '培训师', '主持人', '品牌策划'],
      pct: 'I型主导风格约占人群的25-30%，在市场、媒体和教育行业中比例更高'
    },
    S: {
      label: '稳定型(S)', overview: `作为S型主导风格，您在人际互动中表现出耐心、可靠、追求和谐的行为模式。您是团队中的稳定力量，善于倾听、重视关系的长期维护。您忠诚且值得信赖，但面对突变和冲突时可能需要更多适应时间。`,
      commStyle: '您的沟通风格温和稳定，善于倾听和共情。您偏好一对一的深入交流，而非大型群体讨论。在职场中，您是可靠的倾听者和支持者，但需注意适时表达自己的观点和需求。',
      conflict: '面对冲突时，您倾向于回避或妥协以维护和谐。建议认识到适度的冲突是健康关系的一部分，学会在保持尊重的前提下坚定表达自己的立场。',
      compatible: ['I 影响型', 'C 谨慎型'], incompatible: ['D 支配型'],
      industries: ['人力资源', '医疗护理', '教育行业', '社会工作', '客户服务'],
      roles: ['人力资源经理', '护士长', '教师/辅导员', '社工', '客户服务总监'],
      workStyle: '您偏好稳定、可预测的工作节奏。您在团队协作和长期项目中表现出色，但可能在快速变化或高压决策的环境中感到不适。建议提前为变化做心理准备，建立应对不确定性的策略。',
      leadership: '您是服务型领导者，擅长创建安全信任的团队氛围。您的领导风格强调支持和赋能，但需注意在团队需要时也要果断做出艰难决定，避免因追求共识而延误决策。',
      strengths: ['卓越的倾听和共情能力', '持久的忠诚和可靠性', '团队协作的粘合剂', '耐心处理长期项目', '创建信任和安全感的能力'],
      blindSpots: ['可能过度回避冲突和对抗', '面对变化时适应速度较慢', '可能压抑自己的需求迁就他人'],
      risks: ['因回避冲突导致问题积累', '过度稳定导致错过创新机会', '难以拒绝他人导致工作过载'],
      advantages: ['团队信任和忠诚度高', '长期客户关系维护能力', '稳定的执行力和可靠性', '跨部门协调的耐心'],
      stress: '压力下您可能变得更加被动和退缩，内心焦虑但不表达。建议在感到压力时主动向信任的人倾诉，学会在安全环境中表达不适。规律的运动和自然接触有助于缓解焦虑。',
      meeting: '您在会议中更倾向于倾听和观察，发言较为谨慎。建议提前准备发言要点，在会中主动分享您的见解——您的深思熟虑往往能带来高质量的贡献。',
      idealEnv: '稳定、友好、重视团队协作的工作环境。需要明确的流程和期望，不适合频繁变动和高对抗性的组织。',
      famousPeople: ['甘地', '巴菲特', '刘德华', '特蕾莎修女', '马化腾'],
      typicalCareers: ['人力资源经理', '教师', '护理管理', '客户服务总监', '社会工作者'],
      pct: 'S型主导风格约占人群的30-35%，是四种类型中占比最高的'
    },
    C: {
      label: '谨慎型(C)', overview: `作为C型主导风格，您在人际互动中表现出严谨、注重细节、追求精确的行为模式。您依靠数据和逻辑做决策，对质量有极高的标准。您重视规则和流程，在专业技术领域往往有出色表现。`,
      commStyle: '您的沟通风格精确严谨，注重数据支撑。您偏好书面沟通和结构化表达，对模糊和笼统的信息缺乏耐心。在职场中，您的专业分析能力受到尊重，但需注意在沟通中适当简化，避免过度细节化。',
      conflict: '面对冲突时，您倾向于用数据和逻辑来论证立场。建议认识到并非所有分歧都能用数据解决，在坚持专业判断的同时也要考虑对方的情绪和感受。',
      compatible: ['S 稳定型', 'D 支配型'], incompatible: ['I 影响型'],
      industries: ['金融审计', '科技研发', '质量管理', '数据分析', '医药研发'],
      roles: ['数据分析师', '质量总监', '审计师', '研发工程师', '风控经理'],
      workStyle: '您偏好有明确标准和流程的工作。您在需要精确性和深度分析的任务中表现卓越，但可能在模糊和快速决策的环境中感到焦虑。建议接受"足够好"替代"完美"的思维，在追求质量和效率之间找到平衡。',
      leadership: '您是专家型领导者，以专业能力和严谨态度赢得尊重。您的领导风格强调标准和质量，但需注意在关注流程的同时也要给予团队创新和尝试的空间，避免过度控制。',
      strengths: ['卓越的分析和逻辑能力', '对质量和细节的极高标准', '系统化的问题解决能力', '专业领域的深度知识', '基于数据的决策能力'],
      blindSpots: ['可能过度追求完美导致效率降低', '在需要快速决策时可能犹豫不决', '可能对他人的工作标准过于挑剔'],
      risks: ['分析瘫痪——过度分析导致错失时机', '完美主义导致项目延期', '人际关系中显得过于冷淡和苛刻'],
      advantages: ['专业壁垒高不易被替代', '高质量输出赢得客户信任', '风险识别和规避能力', '系统化思维推动流程优化'],
      stress: '压力下您可能变得更加挑剔和退缩，陷入过度分析的循环。建议在高压时刻设定分析截止时间，用"足够好的决策"替代"完美的分析"。散步和音乐有助于跳出思维循环。',
      meeting: '您在会议中偏好听完所有信息后再发言，发言时数据充分、论证严密。建议主动参与讨论的早期阶段，用提问引导思考方向，而非等到最后才提出意见。',
      idealEnv: '有明确标准、重视专业能力、允许深度思考的工作环境。需要独立的工作空间和充分的准备时间，不适合混乱、缺乏规则的组织。',
      famousPeople: ['比尔·盖茨', '任正非', '埃隆·马斯克', '扎克伯格', '居里夫人'],
      typicalCareers: ['数据分析师', '审计师', '研发工程师', '质量总监', '风控经理'],
      pct: 'C型主导风格约占人群的20-25%，在科技和金融行业中比例更高'
    }
  }
  const p = discMap[primary] || discMap['D']
  const dims = Object.fromEntries(t.dimensions.map(d => [d.dimension, d.percentage]))
  return {
    relationshipAnalysis: {
      overview: p.overview,
      communicationInRelationship: p.commStyle,
      conflictResolution: p.conflict,
      advice: ['识别对方的DISC风格并主动调整沟通方式', '在高压情境中觉察自己的风格极端化倾向', '主动寻求互补风格的合作伙伴', '定期向不同风格的同事请教反馈', '用"先理解再回应"替代条件反射式沟通'],
      redFlags: ['总是要求他人适应你的沟通节奏', '在压力下行为模式极端化而不自知', '长期忽视互补风格带来的成长机会'],
      greenFlags: ['能根据对方风格灵活调整表达', '欣赏并主动学习其他风格的优势', '在多元团队中自如协作'],
      compatibleTypes: p.compatible,
      incompatibleTypes: p.incompatible,
    },
    personalGrowth: {
      overview: `${p.label}的成长关键在于保持核心优势的同时，有意识地发展行为灵活性。真正的成熟不是改变风格，而是在不同场景中能调用不同维度的行为策略。您的${primary}维度得分为${dims[primary] || dims['D'] || 50}%，这表明您在该维度的行为倾向相当明显。`,
      coreStrengths: p.strengths,
      blindSpots: p.blindSpots,
      growthPath: ['识别自己在不同场景下的自动行为模式', '每周刻意练习一个非主导维度的行为策略', '在安全环境中练习风格切换并记录效果', '建立覆盖四种风格的行为工具箱'],
      recommendedBooks: ['《DISC行为风格》- 深入理解四种行为维度', '《关键对话》- 提升高压沟通和冲突管理能力', '《影响力》- 理解和扩展人际说服策略'],
      habits: ['每日复盘一次重要的沟通互动并反思风格效果', '每周刻意在一个场景中使用非主导风格', '记录成功的跨风格沟通案例作为经验库', '每月向一位不同风格的同事请教反馈'],
      mindsetShifts: ['每种DISC风格都有不可替代的价值', '行为灵活性比风格偏好本身更能预测职业成功', '理解他人风格是提升领导力和影响力的基础'],
      shortTermGoals: ['能准确识别身边同事的DISC风格', '在一个具体场景中成功使用非主导风格并取得好效果', '获得至少一位同事对你沟通方式改善的正面反馈'],
      longTermGoals: ['成为能在四种风格间自如切换的沟通高手', '基于DISC理论建立一支风格互补的高效团队', '发展具有情境适应力的领导风格']
    },
    careerAnalysis: {
      overview: `DISC 模型是职场行为分析的核心工具。${p.label}在特定职业环境中具有天然优势——您的行为风格与某些行业和岗位高度匹配，在这些领域中您能更自然地发挥优势、获得成就感和职业满意度。`,
      idealIndustries: p.industries,
      idealRoles: p.roles,
      workStyle: p.workStyle,
      leadershipStyle: p.leadership,
      teamDynamics: `在团队中，${p.label}通常承担关键角色。您与I型的合作能产生创意+执行的协同效应，与S型的搭配能确保团队稳定性，与C型的互补能提升决策质量。理解这些动态关系，有助于您主动构建高效的协作网络。`,
      careerRisks: p.risks,
      careerAdvantages: p.advantages,
      fiveYearPath: `第1年：深耕核心专业能力，建立${p.label}风格的职场口碑；第2-3年：在关键项目中展现领导力，开始承担跨团队协调角色；第4-5年：向管理层或资深专家双通道发展，用行为灵活性拓展影响力边界。`,
      salaryPotential: `${p.label}在匹配的行业和岗位中薪资竞争力较强。关键是找到风格-岗位的最佳匹配点，在优势领域深耕可获得显著的薪资溢价。管理路线年薪潜力30-80万，专家路线在细分领域同样可观。`
    },
    workAnalysis: {
      productivityTips: ['将核心工作安排在精力最充沛的时段', '为非舒适区任务预设切换策略', '建立适合自己风格的工作节奏和流程', '主动寻求互补风格同事的协作支持', '每周回顾效率瓶颈并调整行为策略'],
      communicationStyle: p.commStyle,
      meetingBehavior: p.meeting,
      stressResponse: p.stress,
      collaborationStyle: '与D型同事：直接高效，聚焦结果，减少寒暄；与I型同事：给予认可和互动空间，用热情回应激发创意；与S型同事：耐心倾听，建立信任，给予稳定的期望；与C型同事：提供充分的数据和时间，尊重其对质量的追求。',
      feedbackPreference: primary === 'D' ? '偏好直接、简洁、聚焦结果的反馈方式。' : primary === 'I' ? '偏好积极鼓励性的反馈，在认可中穿插改进建议。' : primary === 'S' ? '偏好温和、私下、有支持性的反馈方式。' : '偏好基于数据和事实、有具体改进方向的反馈方式。',
      idealWorkEnvironment: p.idealEnv,
      workLifeBalance: primary === 'D' ? '需要设定明确的工作边界，避免将掌控欲延伸到生活的每个角落。竞技性运动是有效的减压方式。' : primary === 'I' ? '社交活动既是工作也是生活的一部分，注意区分工作社交和个人社交，留出独处时间恢复能量。' : primary === 'S' ? '您天然重视家庭和稳定生活，需注意不要因为工作中的过度迁就而牺牲个人时间。设定合理的工作边界。' : '需要防止工作中的完美主义延伸到生活中。学会在生活中接受"足够好"，享受不追求精确的放松时刻。'
    },
    testSpecificInsights: {
      title: 'DISC 行为深度解读',
      sections: [
        { heading: '行为风格组合分析', content: `您的主导风格是${primary}型（${dims[primary] || 50}%），但行为是四个维度的综合表现。${t.dimensions.length >= 2 ? `您的次要维度为${t.dimensions.sort((a, b) => b.percentage - a.percentage)[1]?.label || t.dimensions[1]?.dimension}（${t.dimensions.sort((a, b) => b.percentage - a.percentage)[1]?.percentage}%），这形成了${primary}${t.dimensions.sort((a, b) => b.percentage - a.percentage)[1]?.dimension?.charAt(0) || ''}复合风格。` : ''}复合风格意味着您在不同情境中会交替使用主导和次要维度的行为策略，这比单一风格更具适应性。` },
        { heading: '压力下的行为转变', content: `在高压环境下，${p.label}通常会向极端方向发展：${primary === 'D' ? 'D型变得更加独断、急躁，可能完全无视团队意见做出单方面决定。' : primary === 'I' ? 'I型变得更加散漫和情绪化，用过度社交来逃避压力源。' : primary === 'S' ? 'S型变得更加被动和退缩，表面顺从但内心焦虑不安。' : 'C型变得更加挑剔和封闭，陷入过度分析的循环中无法行动。'}识别这些早期信号是主动管理压力行为的第一步。建议建立一个"压力预警清单"来监控自己的行为变化。` },
        { heading: '四象限协作指南', content: '与D型协作：直接高效，聚焦结果，用数据支撑你的建议，减少不必要的寒暄。与I型协作：热情互动，给予认可和表达空间，用积极的语言包装建设性意见。与S型协作：耐心建立信任，给予充分的适应时间，避免突然改变已有安排。与C型协作：提供详细的数据和分析，给予独立思考时间，尊重其对精确和质量的追求。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][i % 4] })),
      compatibilityScores: primary === 'D' ? [{ type: 'I 影响型', score: 82 }, { type: 'S 稳定型', score: 75 }, { type: 'C 谨慎型', score: 58 }, { type: 'D 支配型', score: 45 }]
        : primary === 'I' ? [{ type: 'D 支配型', score: 80 }, { type: 'S 稳定型', score: 78 }, { type: 'I 影响型', score: 50 }, { type: 'C 谨慎型', score: 55 }]
        : primary === 'S' ? [{ type: 'I 影响型', score: 82 }, { type: 'C 谨慎型', score: 80 }, { type: 'S 稳定型', score: 55 }, { type: 'D 支配型', score: 52 }]
        : [{ type: 'S 稳定型', score: 82 }, { type: 'D 支配型', score: 75 }, { type: 'C 谨慎型', score: 48 }, { type: 'I 影响型', score: 55 }]
    },
    statistics: {
      populationPercentage: p.pct,
      famousPeople: p.famousPeople,
      typicalCareers: p.typicalCareers,
      globalDistribution: 'DISC风格分布在不同文化和行业中有显著差异。西方企业文化中D型和I型比例偏高，东亚文化中S型和C型比例更为突出。行业特征对风格分布也有重要影响。',
      genderDistribution: '性别对DISC风格的影响较小，更多受职业选择和文化环境影响。研究显示男性在D型上略高，女性在S型上略高，但个体差异远大于性别差异。'
    }
  }
}

function generateEQMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const eqScore = parseInt(t.score) || 50
  const level = eqScore >= 80 ? '优秀' : eqScore >= 60 ? '良好' : eqScore >= 40 ? '中等' : '发展中'
  const dims = Object.fromEntries(t.dimensions.map(d => [d.dimension, d.percentage]))
  const selfAware = dims['自我认知'] || dims['self_awareness'] || 50
  const selfMgmt = dims['自我管理'] || dims['self_management'] || 50
  const motivation = dims['内驱力'] || dims['motivation'] || 50
  const empathy = dims['共情能力'] || dims['empathy'] || 50
  const social = dims['社交技巧'] || dims['social_skills'] || 50
  const hi = (v: number) => v >= 60, lo = (v: number) => v < 45
  const sorted = [...t.dimensions].sort((a, b) => b.percentage - a.percentage)
  const strongest = sorted[0], weakest = sorted[sorted.length - 1]

  return {
    relationshipAnalysis: {
      overview: `您的综合情商水平为${level}(${eqScore}分)。情商是预测人际关系质量最重要的心理因素之一（Goleman, 1995）。您的自我认知(${selfAware}%)影响您识别自身情绪的能力，共情(${empathy}%)决定了您理解他人感受的深度，社交技巧(${social}%)影响您建立和维护关系的效果。三者共同塑造了您的关系质量。`,
      attachmentStyle: `${lo(selfAware) && lo(empathy) ? '回避型倾向：自我认知和共情能力均偏低，您可能在关系中倾向于保持情感距离。建议从每天识别3种情绪开始练习。' : lo(selfAware) ? '不安全型倾向：较低的自我认知可能导致情绪表达不准确，影响伴侣对您的理解。建议用情绪日记来提升觉察力。' : hi(empathy) && hi(selfAware) ? '安全型倾向：较高的自我认知和共情能力支持您建立安全、信任的关系模式——您既能表达自身需求，也能感知对方感受。' : '您具有安全依恋的基础，但在某些维度上仍有提升空间，通过练习可以进一步增强情感连接能力。'}`,
      idealPartnerTraits: [
        hi(selfAware) ? '能与您进行深度情感交流的开放型伴侣' : '愿意耐心引导您表达感受的包容型伴侣',
        hi(empathy) ? '同样具有高共情力、珍视情感深度的人' : '能帮助您理解他人视角的高敏感型伴侣',
        '有自我成长意愿、愿意共同提升情商的人',
        '情绪稳定、能在冲突中保持理性的伴侣',
        '尊重和接纳情绪表达、不回避情感话题的人'
      ],
      communicationInRelationship: `${hi(selfAware) ? '您能较准确地识别和命名自身情绪，这为清晰表达需求奠定了基础。' : '自我认知('+selfAware+'%)偏低意味着您可能难以精确表达内心感受——建议学习情绪词汇表来丰富表达能力。'}${hi(empathy) ? '较高的共情能力让您能敏锐捕捉伴侣的情绪变化。' : '共情维度('+empathy+'%)有提升空间——练习在对话中复述对方的感受（"你是不是感到..."）来增强共情回应。'}`,
      conflictResolution: `${hi(selfMgmt) ? '较高的自我管理能力让您能在冲突中控制情绪反应，保持理性沟通。' : '自我管理('+selfMgmt+'%)偏低时，冲突中容易被情绪淹没。建议使用"10秒暂停法"——感到强烈情绪时先深呼吸10秒再回应。'}${hi(empathy) ? '加上较高的共情力，您能在坚持立场的同时理解对方处境，这是双赢解决方案的基础。' : '建议在冲突中先用"我听到你说..."确认理解了对方的立场，再表达自己的观点。'}`,
      advice: ['练习在日常对话中用精确的情绪词汇描述感受（不只是"好"或"不好"）', '在回应他人之前，先用一句话复述你理解的对方感受', '建立每周一次的关系check-in习惯，轮流分享感受和需求', '学习非暴力沟通四步法：观察→感受→需求→请求', '在冲突中用"我感到...因为...我需要..."句式替代指责'],
      redFlags: ['长期压抑或否认自身情绪（"我没事"）', '在关系中反复出现相同的情绪冲突模式', '习惯性指责对方或选择逃避冲突'],
      greenFlags: ['能准确识别和坦诚表达自己的情绪状态', '对他人的情绪保持敏感并给予恰当回应', '在压力和冲突中仍能保持尊重和理性沟通'],
      longTermRelationship: `研究表明（Brackett et al., 2005），双方情商水平是长期关系满意度的强预测因素。您的情商综合水平为${level}——${eqScore >= 60 ? '这为长期关系质量提供了良好基础。建议与伴侣一起持续提升情商。' : '通过系统训练，您的关系质量有很大的提升空间。情商的每一点进步都会在关系中产生可感知的积极变化。'}`
    },
    personalGrowth: {
      overview: `情商(EQ)是可以通过系统训练显著提升的能力——这是区别于IQ的最重要特征。Goleman的研究表明，情商对个人成功和幸福的贡献度约为IQ的两倍。您当前综合水平为${level}(${eqScore}分)。${strongest ? `最强维度是${strongest.label || strongest.dimension}(${strongest.percentage}%)` : ''}${weakest ? `，最大提升空间在${weakest.label || weakest.dimension}(${weakest.percentage}%)` : ''}。以下是量身定制的提升方案。`,
      coreStrengths: t.dimensions.filter(d => d.percentage >= 55).map(d => {
        const tips: Record<string, string> = { '自我认知': '能准确识别和命名自身情绪，为情绪管理奠定基础', 'self_awareness': '能准确识别和命名自身情绪，为情绪管理奠定基础', '自我管理': '能有效调控情绪反应，在压力下保持冷静和专注', 'self_management': '能有效调控情绪反应，在压力下保持冷静和专注', '内驱力': '拥有强大的内在动机和目标感，面对挫折保持韧性', 'motivation': '拥有强大的内在动机和目标感，面对挫折保持韧性', '共情能力': '能敏锐感知他人的情绪状态并给予恰当回应', 'empathy': '能敏锐感知他人的情绪状态并给予恰当回应', '社交技巧': '擅长建立和维护人际关系，有效影响和激励他人', 'social_skills': '擅长建立和维护人际关系，有效影响和激励他人' }
        return `${d.label || d.dimension}(${d.percentage}%): ${tips[d.dimension] || '情商优势维度'}`
      }),
      blindSpots: t.dimensions.filter(d => d.percentage < 50).map(d => {
        const tips: Record<string, string> = { '自我认知': '可能难以精确识别自身情绪，导致表达不清晰', 'self_awareness': '可能难以精确识别自身情绪，导致表达不清晰', '自我管理': '在压力下可能被情绪控制，做出冲动反应', 'self_management': '在压力下可能被情绪控制，做出冲动反应', '内驱力': '面对挫折时可能缺乏坚持的动力', 'motivation': '面对挫折时可能缺乏坚持的动力', '共情能力': '可能忽视或误读他人的情绪信号', 'empathy': '可能忽视或误读他人的情绪信号', '社交技巧': '在人际互动和关系建设中可能感到困难', 'social_skills': '在人际互动和关系建设中可能感到困难' }
        return `${d.label || d.dimension}(${d.percentage}%): ${tips[d.dimension] || '需要重点提升的领域'}`
      }),
      growthPath: [`优先提升${weakest ? weakest.label || weakest.dimension : '最低分维度'}——这是投入产出比最高的方向`, '每天进行3次情绪觉察练习（早、中、晚各一次）', `利用${strongest ? strongest.label || strongest.dimension : '优势维度'}的优势来带动薄弱维度的发展`, '每月进行一次五维度自评，追踪进步轨迹'],
      recommendedBooks: ['《情商》Daniel Goleman - EQ理论和应用的奠基之作', '《非暴力沟通》Marshall Rosenberg - 用共情和观察改善沟通质量', '《正念的奇迹》一行禅师 - 用正念练习培养情绪觉察'],
      habits: ['每日3次情绪命名练习：停下来问自己"现在感到什么？为什么？"', '每次重要对话后进行2分钟的情绪复盘', '每周记录3个共情互动经历并反思效果', '每月用五维度量表自评一次并记录变化', '每天进行10分钟正念冥想'],
      mindsetShifts: ['所有情绪都有进化价值——愤怒保护边界、悲伤促进连接、恐惧提示危险', '情绪管理≠情绪压抑——目标是识别、接纳、调节，而非消灭', '共情能力可以像肌肉一样通过刻意练习来锻炼和增强'],
      shortTermGoals: ['掌握至少20种情绪词汇来精确描述感受（替代"好"和"不好"）', '在3个实际场景中成功使用情绪调节技巧（如10秒暂停法）', '获得至少一位亲友对你情商变化的自发正面反馈'],
      longTermGoals: ['各维度均达到60%以上的水平', '成为朋友圈中被信赖的倾听者和情绪支持者', '将高情商行为模式内化为自动习惯']
    },
    careerAnalysis: {
      overview: `Goleman的研究表明，在领导力岗位上，情商的重要性是IQ的两倍。TalentSmart对百万名职场人的调查显示，情商能解释58%的职业绩效差异。您的${strongest ? strongest.label || strongest.dimension : '优势维度'}是最突出的职业情商优势，${weakest ? weakest.label || weakest.dimension : '薄弱维度'}是需要优先发展的方向。`,
      idealIndustries: [hi(empathy) ? '心理咨询/治疗' : '数据分析/技术', hi(social) ? '市场营销/公关' : '研发/工程', hi(selfMgmt) ? '金融/投资' : '创意设计', hi(motivation) ? '创业/项目管理' : '稳定型企事业单位', '人力资源/组织发展'],
      idealRoles: [hi(social) && hi(empathy) ? '团队leader/总监' : '高级专家/架构师', hi(empathy) ? '客户成功经理' : '技术经理', hi(motivation) ? '项目负责人' : '资深专员', hi(selfMgmt) ? '危机管理/风控' : '创意/策划', '培训师/教练'],
      workStyle: `${hi(selfMgmt) ? '较高的自我管理能力帮助您保持专注和自律，在高压环境中依然能稳定输出。' : '建议用外部工具（如番茄钟、日程表）来辅助自我管理，弥补该维度的不足。'}${hi(motivation) ? '强大的内驱力让您对工作保持长期热情，不易倦怠。' : '在动力不足时，回顾自己的"为什么"——个人使命和核心价值观——来重新点燃动力。'}`,
      leadershipStyle: `${hi(empathy) && hi(social) ? '您是共情型领导者——能理解团队成员的需求和感受，用关怀和信任来激发团队潜力。这是最受下属欢迎的领导风格之一。' : hi(selfMgmt) && hi(motivation) ? '您是榜样型领导者——以身作则、高标准高要求。建议增加对团队情感需求的关注，避免只关注结果。' : '您的领导风格仍在形成中。建议先从管理自身情绪开始，逐步扩展到影响和激励他人。'}`,
      teamDynamics: `${hi(social) ? '您在团队中是天然的"粘合剂"——善于化解冲突、促进沟通、建立信任。' : ''}${hi(empathy) ? '较高的共情力让您能感知团队氛围的微妙变化并及时干预。' : ''}${eqScore < 50 ? '建议先从小团队合作开始，逐步建立人际互动的信心和技巧。' : ''}`,
      careerRisks: [lo(selfMgmt) ? '自我管理不足可能在高压环境下导致情绪失控或决策冲动' : '注意避免情绪管理的过度消耗', hi(empathy) ? '过度共情可能导致情绪耗竭（共情疲劳）——需要设定情绪边界' : '共情不足可能导致团队关系紧张', '需要在同理心和决断力之间保持动态平衡'],
      careerAdvantages: t.dimensions.filter(d => d.percentage >= 55).map(d => `${d.label || d.dimension}(${d.percentage}%)提升了您的${d.dimension.includes('社交') || d.dimension === 'social_skills' ? '人际影响力和关系建设能力' : d.dimension.includes('共情') || d.dimension === 'empathy' ? '客户洞察和团队凝聚力' : d.dimension.includes('自我管理') || d.dimension === 'self_management' ? '压力应对和情绪稳定性' : d.dimension.includes('内驱') || d.dimension === 'motivation' ? '目标坚持和抗挫折能力' : '自我理解和情绪表达的准确性'}`),
      fiveYearPath: `第1年：重点提升${weakest ? weakest.label || weakest.dimension : '最薄弱维度'}，建立情商基础；第2-3年：发展情商驱动的领导力技能，争取带团队机会；第4-5年：${eqScore >= 60 ? '成为组织内的情商教练或导师，用影响力驱动更大范围的文化变革' : '将情商提升到良好水平，在管理或专家路线上建立核心竞争力'}。`,
      salaryPotential: `TalentSmart对100万+职场人的研究显示，情商每提升1个百分点，年薪平均增加约$1,300。情商是薪资增长的隐形杠杆——它不直接决定薪资，但通过提升领导力、人际效果和职业满意度来间接推动职业发展。您当前${level}的水平${eqScore >= 60 ? '已为薪资增长提供了良好基础' : '仍有显著的提升空间和回报潜力'}。`
    },
    workAnalysis: {
      productivityTips: [hi(selfMgmt) ? '利用情绪管理能力，在情绪最佳时段安排最重要的工作' : '在容易情绪波动的时段安排低认知负荷的任务', '在高情绪时刻使用"STOP法则"：停-呼吸-观察-计划，然后再行动', hi(social) ? '用人际影响力争取更多资源和支持，通过合作提升整体效率' : '在需要社交配合的任务前做好情绪准备', '在重要会议前做3分钟的正念呼吸来调整状态', hi(empathy) ? '利用共情优势建立职场同盟和互助网络' : '主动询问同事的感受和需求来练习共情'],
      communicationStyle: `${hi(empathy) ? '较高的共情力让您成为优秀的倾听者——人们愿意向您倾诉。在此基础上，练习给出建设性的反馈和建议。' : '建议在沟通中增加"反映式倾听"——用自己的话复述对方的观点和感受，确认理解准确。'}${hi(social) ? '较高的社交技巧让您擅长说服和影响他人。注意在说服中融入共情，避免纯粹的策略性沟通。' : '在人际沟通中，真诚和一致性比技巧更重要——做真实的自己同时逐步提升表达能力。'}`,
      meetingBehavior: `${hi(selfAware) ? '您能觉察到会议中的情绪动态变化，利用这个优势在关键时刻引导讨论方向。' : '建议在会议中练习"情绪扫描"——每15分钟快速觉察一下自己和他人的情绪状态。'}${hi(social) ? '您善于在会议中化解紧张气氛和促进共识达成。' : '在会议中遇到分歧时，先总结双方的共同点再讨论差异。'}`,
      stressResponse: `${hi(selfMgmt) ? '您具备较好的压力应对能力，能在情绪波动时迅速调回平衡状态。保持当前的调节习惯，并在高压期增加运动和社交。' : '自我管理('+ selfMgmt +'%)有提升空间。推荐"4-7-8呼吸法"（吸4秒-屏7秒-呼8秒）作为即时压力调节工具。长期建议建立规律的有氧运动习惯（每周至少3次，每次30分钟），它是最有效的情绪调节器。'}`,
      collaborationStyle: `${hi(empathy) && hi(social) ? '您在团队协作中具有显著的天然优势——既能理解同事的立场和需求，又能有效协调和推进合作。' : hi(empathy) ? '您善于理解同事的感受，建议在此基础上更主动地提出解决方案和推动行动。' : hi(social) ? '您善于建立人际关系和协调资源，建议在协作中更多地关注同事的情绪状态。' : '建议从小范围的一对一合作开始，逐步建立协作信心和人际技巧。'}`,
      feedbackPreference: `${hi(selfAware) ? '较高的自我认知帮助您客观看待反馈——您能区分反馈中的事实信息和情绪成分。' : '收到负面反馈时，先用"信息过滤法"——将反馈分为"事实"和"感受"两部分，先处理事实部分。'}${hi(empathy) ? '您也善于给出有温度的反馈——在指出问题时能顾及对方感受。' : '给出反馈时建议使用"三明治法"——正面→改进→鼓励。'}`,
      idealWorkEnvironment: `${hi(empathy) && hi(social) ? '开放、重视人际关系和情感表达的团队文化最能发挥您的情商优势。' : hi(selfMgmt) && hi(motivation) ? '重视绩效、有清晰目标和发展路径的结果导向型组织更适合您。' : '提供培训和成长机会、包容度高、允许试错的学习型组织是当前阶段最佳选择。'}`,
      workLifeBalance: `${hi(selfMgmt) ? '您的情绪管理能力有助于设定清晰的工作-生活边界。' : '建议设定"情绪下班时间"——用一个固定仪式（如散步、听音乐）来切换工作和生活状态。'}${hi(empathy) ? '注意避免共情疲劳——在高强度的人际互动后留出独处恢复时间。' : ''}情绪健康是工作生活平衡的基石。`
    },
    testSpecificInsights: {
      title: '情商五维度深度训练方案',
      sections: [
        { heading: '最需提升的维度分析', content: `${weakest ? `您的${weakest.label || weakest.dimension}(${weakest.percentage}%)是当前最大的提升空间。` : ''}${lo(selfAware) ? '自我认知偏低：建议从"情绪命名练习"开始——建立一个包含至少30种情绪的词汇表（如焦虑、沮丧、感激、满足、忐忑...），每天练习用精确词汇描述3次情绪状态。' : ''}${lo(selfMgmt) ? '自我管理偏低：建议学习"认知重评"技术——当产生强烈情绪时，问自己"还有没有其他角度理解这件事？"来改变情绪反应。' : ''}${lo(empathy) ? '共情能力偏低：建议每天进行一次"视角转换"练习——选一个当天互动的人，花2分钟从他的角度想象他的感受和动机。' : ''}${lo(social) ? '社交技巧偏低：建议从"微社交"开始——每天与一位同事进行30秒的非工作话题对话，逐步延长和深入。' : ''}每个维度的提升都会对其他维度产生正向溢出效应。` },
        { heading: '21天情商训练计划', content: `第1-7天【觉察周】：每天记录5次情绪状态（触发→情绪名称→身体感受→行为反应），建立情绪觉察的基础能力。第8-14天【调节周】：学习并练习3种情绪调节技巧——4-7-8呼吸法、认知重评法、身体扫描放松法。每天在一个实际场景中使用其中一种。第15-21天【共情周】：每天进行1次深度倾听练习——全程不打断、不评判、不建议，只用复述和提问来回应对方。${eqScore >= 60 ? '高级挑战：在工作中主动发起一次困难对话并应用所学技巧。' : ''}` },
        { heading: '情绪觉察日记模板', content: '每次记录包括六个要素：(1)触发事件——发生了什么？(2)情绪名称——用精确词汇命名（不只是"好/不好"）(3)情绪强度——1-10分(4)身体感受——情绪在身体哪个部位？(5)自动想法——脑海中出现了什么念头？(6)实际行为——你做了什么？通过持续记录，您可以发现自己的情绪触发模式和应对习惯，从而有针对性地改善。研究显示仅"情绪命名"这一步就能降低杏仁核的活跃度，减弱情绪反应的强度。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: `综合情商${level}水平（${eqScore}分）${eqScore >= 80 ? '位于人群前15%' : eqScore >= 60 ? '位于人群中上水平（前35%）' : eqScore >= 40 ? '位于人群中间水平' : '位于人群中下水平，但有很大提升空间'}`,
      famousPeople: ['Daniel Goleman — 情商概念的推广者和研究者', 'Oprah Winfrey — 以极高的共情力和社交智慧著称', '马云 — 商业情商的典范，擅长用情感感染力驱动团队', 'Brené Brown — 情感脆弱性研究的先驱', 'Nelson Mandela — 以非凡的共情和自我管理能力领导变革'],
      typicalCareers: ['心理咨询师', '企业培训师/教练', '人力资源总监', '客户成功经理', '社会工作者'],
      globalDistribution: '情商水平受文化、教育和个人经历影响较大。东方文化中"社交和谐"维度的平均得分较高（集体主义导向），西方文化中"自我认知"和"自我表达"维度的平均得分较高（个体主义导向）。',
      genderDistribution: '研究显示女性在共情能力上平均略高，男性在自我管理和抗压维度上平均略高，但个体差异远大于性别差异。情商是可以通过训练提升的能力，与性别无关。'
    }
  }
}

function generateHollandMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const code = (t.score || 'RIA').toUpperCase()
  const primary = code.charAt(0), secondary = code.charAt(1) || 'I'
  const riasecMap: Record<string, { label: string; industries: string[]; roles: string[]; famousPeople: string[]; commStyle: string; workStyle: string; env: string }> = {
    R: { label: '实际型(R)', industries: ['制造工程', '建筑施工', '农业科技', '汽车工业', '电子电气', '环境保护', '机械自动化'], roles: ['机械工程师', '建筑师', '电气工程师', '农艺师', '质检工程师', '环境工程师', '工业设计师'], famousPeople: ['埃隆·马斯克', '爱迪生', '詹姆斯·戴森', '曹德旺', '莱特兄弟'], commStyle: '您偏好用行动和成果说话，沟通风格务实简洁。在职业社交中，用具体的项目案例和技术成果展示自己的价值比口头推销更有效。', workStyle: '您偏好动手操作和具体成果导向的工作，擅长将抽象概念转化为实物。在需要体力活动或技术操作的任务中表现出色，可能对纯粹的文书工作缺乏耐心。', env: '有实际操作机会、重视技术能力、成果导向的工作环境。需要动手实践的空间和工具，不适合纯行政或高度社交化的岗位。' },
    I: { label: '研究型(I)', industries: ['科学研究', '医疗医药', '信息技术', '数据科学', '生物科技', '金融分析', '环境科学'], roles: ['数据科学家', '科研研究员', '临床医生', '软件架构师', '生物信息分析师', '量化分析师', '心理学研究者'], famousPeople: ['爱因斯坦', '居里夫人', '屠呦呦', '霍金', '达尔文'], commStyle: '您偏好用数据和逻辑支撑观点，在专业领域的深度讨论中最为自在。职业社交中，参加学术会议和专业论坛比商业酒会更适合您。', workStyle: '您偏好独立思考和深度分析的工作，需要充足的时间和空间来研究问题。在数据驱动的决策和复杂问题分析中表现卓越，可能对重复性执行工作缺乏热情。', env: '鼓励探索和独立研究的学术或研发环境。需要数据和分析工具的支持，不适合需要快速决策或高度人际互动的岗位。' },
    A: { label: '艺术型(A)', industries: ['设计创意', '影视传媒', '广告营销', '出版编辑', '建筑设计', '游戏开发', '时尚行业'], roles: ['UI/UX设计师', '内容创作者', '导演/编剧', '品牌视觉设计师', '插画师', '游戏设计师', '建筑设计师'], famousPeople: ['梵高', '宫崎骏', '村上春树', '莫扎特', '贝多芬'], commStyle: '您偏好用创意和视觉化的方式表达观点。在职业社交中，展示作品集和参加创意社群比传统社交更能建立有效连接。', workStyle: '您偏好自由灵活、允许创意表达的工作方式。在需要想象力和审美判断的任务中如鱼得水，但可能在高度结构化和重复性的工作中感到压抑。', env: '自由开放、鼓励创意表达、审美导向的工作环境。需要创作自由和灵感空间，不适合层级森严、规则僵化的组织。' },
    S: { label: '社会型(S)', industries: ['教育培训', '医疗护理', '心理咨询', '社会服务', '人力资源', '非营利组织', '公共卫生'], roles: ['教师/讲师', '心理咨询师', '社会工作者', '培训经理', '健康管理师', '职业规划师', '社区管理员'], famousPeople: ['特蕾莎修女', '南丁格尔', '孔子', '马丁·路德·金', '白求恩'], commStyle: '您天生擅长倾听和共情式沟通。在职业社交中，通过帮助他人解决问题和提供支持来建立深厚的职业关系最为自然。', workStyle: '您偏好与人互动、帮助他人成长的工作。在教导、指导和关怀他人的过程中获得满足感。可能对缺乏人际互动的独立技术工作缺乏动力。', env: '重视人际关系、以服务和帮助他人为导向的工作环境。需要与人互动的机会，不适合高度技术化且缺乏人文关怀的组织。' },
    E: { label: '企业型(E)', industries: ['企业管理', '商业咨询', '金融投资', '房地产', '市场营销', '法律服务', '创业投资'], roles: ['企业家/创始人', '销售总监', '商业咨询顾问', '投资经理', '市场副总裁', '律师', '区域总经理'], famousPeople: ['乔布斯', '马云', '马化腾', '扎克伯格', '巴菲特'], commStyle: '您擅长说服和影响他人，在商务社交中表现自信有力。通过行业峰会、商业圈层和项目合作来拓展人脉最为有效。', workStyle: '您偏好具有竞争性、目标导向和领导机会的工作。在需要说服、谈判和策略性决策的场景中表现突出。可能对纯粹的分析研究或重复性执行缺乏耐心。', env: '竞争性强、有清晰晋升路径、重视业绩和影响力的商业环境。需要决策权和资源调配能力，不适合节奏缓慢、缺乏挑战的组织。' },
    C: { label: '常规型(C)', industries: ['金融会计', '行政管理', '信息系统', '供应链管理', '税务合规', '保险精算', '档案图书管理'], roles: ['会计师/审计师', '行政总监', '合规经理', '供应链经理', '精算师', '数据库管理员', '税务顾问'], famousPeople: ['比尔·盖茨(系统化思维)', '蒂姆·库克', '任正非(流程管理)', '张一鸣', '沃伦·巴菲特(分析面)'], commStyle: '您偏好规范、有序、基于数据的沟通方式。在职业社交中，通过专业能力和可靠的工作表现来建立信任比热络的社交活动更有效。', workStyle: '您偏好有明确流程和标准的工作，擅长处理数据、维护系统和确保合规。在需要精确性和可靠性的任务中表现卓越。可能对模糊不确定或频繁变动的工作感到不适。', env: '有清晰流程和标准、重视精确和合规的组织化环境。需要稳定性和可预测性，不适合频繁变动或缺乏规则的创业型组织。' }
  }
  const p1 = riasecMap[primary] || riasecMap['R'], p2 = riasecMap[secondary] || riasecMap['I']
  const allIndustries = [...new Set([...p1.industries.slice(0, 4), ...p2.industries.slice(0, 3)])]
  const allRoles = [...new Set([...p1.roles.slice(0, 4), ...p2.roles.slice(0, 3)])]
  const dims = Object.fromEntries(t.dimensions.map(d => [d.dimension, d.percentage]))
  const eScore = dims['E'] || 0

  return {
    relationshipAnalysis: {
      overview: `作为${code}型，您的核心职业兴趣以${p1.label}和${p2.label}为主导。这两种类型的组合不仅影响您的职业选择，也深刻塑造了您的职业社交方式——您更倾向于与拥有相似兴趣的人建立深入的职业联系，在专业领域中拓展人脉。`,
      communicationInRelationship: p1.commStyle,
      conflictResolution: '在职场人际冲突中，了解对方的RIASEC类型有助于找到共同语言。与相邻类型的人更容易达成共识，与对角类型的人则需要更多的换位思考和沟通耐心。',
      advice: ['参加匹配您核心兴趣类型的行业社交活动和专业会议', '有意识地建立跨类型的职业人脉网络以获取多元视角', '利用您的类型优势为他人提供独特价值', '在职业社交平台展示您的核心领域专长和成果', '定期与行业同行和前辈保持联系交流'],
      redFlags: ['只与相同类型的人交往形成信息茧房', '忽视职业人脉的长期维护导致关系断裂', '在完全不匹配的社交环境中消耗过多精力'],
      greenFlags: ['与互补类型的人建立互惠合作关系', '在职业社交中展现真实的兴趣热情', '能为他人提供基于您类型优势的帮助和价值'],
    },
    personalGrowth: {
      overview: `Holland理论（1997）的核心观点是：职业满意度来自于个人兴趣类型与工作环境的匹配度（人-环境匹配）。您的${code}类型揭示了您的核心职业驱动力——这不是局限，而是方向。成长的关键在于在核心兴趣中深耕，同时适度发展相邻类型的能力。`,
      coreStrengths: ['清晰的职业兴趣方向减少选择焦虑', `${p1.label}领域的天然热情和内驱力`, `${p2.label}作为辅助维度提供的技能多样性`, '兴趣驱动的学习效率远高于被动学习', '在核心领域的快速成长和创新能力'],
      blindSpots: [`可能过度聚焦${p1.label}领域而忽视跨界机会`, '对不匹配环境的适应力可能不足', '需要发展对角类型的补充能力以提升竞争力'],
      growthPath: ['在核心兴趣领域持续深耕专业技能', '适度发展六边形上相邻类型的辅助能力', `探索${p1.label}在AI和数字化时代的新兴应用`, '建立跨RIASEC类型的协作能力和视野'],
      recommendedBooks: ['《你的降落伞是什么颜色》- 职业规划经典方法论', '《深度工作》- 在核心领域建立不可替代的竞争力', '《远见》- 用30年视角规划职业战略'],
      habits: ['每月深度阅读一篇核心领域的行业趋势报告', '每季度与一位业内资深人士进行职业对话', '持续投入核心领域的新技能学习', '记录职业成就和里程碑以追踪成长轨迹'],
      mindsetShifts: ['职业满意度和内在动力比纯粹的薪资更影响长期幸福', '同一种兴趣可以在不同的岗位形态和行业中实现', '跨类型的T型能力结构是最稀缺的竞争优势'],
      shortTermGoals: [`确定${p1.label}领域的3个最有前景的细分方向`, '完成一个能展示核心竞争力的代表性项目', '建立5个以上高质量的行业专业联系'],
      longTermGoals: ['成为核心领域中被认可的专家或意见领袖', '找到兴趣、能力、市场需求三者的最佳交叉点', '建立可持续且具有复利效应的职业发展路径']
    },
    careerAnalysis: {
      overview: `这是本报告最核心的部分。${code}型的职业兴趣组合指向特定的行业和岗位集群。Holland的六边形模型显示，您的三字母代码中${primary}和${secondary}类型在六边形上${['RI','IR','IA','AI','AS','SA','SE','ES','EC','CE','CR','RC'].includes(primary+secondary) ? '相邻，表示您的兴趣高度一致、方向集中，适合在交叉领域深耕' : '有一定距离，表示您的兴趣较为多元，能在不同领域间灵活切换'}。`,
      idealIndustries: allIndustries,
      idealRoles: allRoles,
      workStyle: p1.workStyle,
      leadershipStyle: `${eScore >= 60 ? '您的企业型(E)得分较高（' + eScore + '%），具有天然的领导潜力——善于说服、愿意承担风险、喜欢影响他人。建议抓住带团队和项目的机会来发展领导力。' : eScore >= 40 ? '您的企业型(E)得分中等，可以在专业领域内承担技术领导或项目协调角色，以专业能力赢得影响力。' : '您的企业型(E)得分较低，更适合以专家身份而非管理者身份发挥影响力。您的深度专业能力本身就是一种领导力形式。'}`,
      teamDynamics: '在团队中，不同RIASEC类型扮演互补角色：R型负责实际执行，I型负责分析研究，A型负责创意设计，S型负责团队凝聚，E型负责决策推进，C型负责流程管控。找到最能发挥您核心类型优势的团队位置是关键。',
      careerRisks: ['在兴趣严重不匹配的环境中长期工作会导致职业倦怠', '过度聚焦单一细分方向存在市场波动风险', '忽视软技能和跨界能力可能遇到晋升瓶颈', 'AI和自动化对某些传统岗位的冲击需要提前准备'],
      careerAdvantages: ['清晰的职业方向大幅减少试错成本和选择焦虑', '兴趣驱动的内在动力持续提升工作效率和质量', '同类型专业社群提供丰富的发展资源和机会', '类型匹配带来的高职业满意度是长期成功的基础', '在核心领域的快速学习能力形成竞争壁垒'],
      fiveYearPath: `第1年：${p1.label}领域深耕，建立专业基础和行业认知；第2年：发展${p2.label}辅助能力，拓展技能边界；第3年：在交叉领域建立个人品牌和行业影响力；第4-5年：${eScore >= 50 ? '向管理或创业方向拓展，用复合能力驱动更大影响' : '在专业领域达到专家水平，建立难以替代的核心竞争力'}。`,
      salaryPotential: `不同RIASEC类型的薪资天花板差异较大。E型在管理和创业路线潜力最高，I型在技术专家路线回报丰厚，A型在顶尖创意领域溢价显著。您的${code}组合类型在匹配领域有可观的薪资发展空间——关键是找到兴趣-能力-市场的最佳交叉点。`
    },
    workAnalysis: {
      productivityTips: ['将核心兴趣融入日常工作任务以保持内驱力', '在非兴趣任务中主动寻找与核心类型的连接点', '利用兴趣产生的"心流"状态攻克最困难的任务', '建立符合您类型偏好的个人工作流程和节奏', '每月评估工作内容与兴趣的匹配度并主动调整'],
      communicationStyle: p1.commStyle,
      meetingBehavior: `${primary === 'E' || primary === 'S' ? '您在会议中表现积极主动，善于引导讨论方向和推动决策。' : primary === 'I' || primary === 'C' ? '您在会议中倾向于深思后发言，贡献质量高但需要主动争取表达机会。' : primary === 'A' ? '您在会议中善于提出创造性观点和非常规方案，为讨论带来新视角。' : '您在会议中注重实际可行性，善于将讨论转化为具体的行动方案。'}`,
      stressResponse: '当工作环境与核心兴趣类型严重不匹配时，压力和倦怠感会显著增加。识别这种"类型不匹配压力"是管理职业倦怠的第一步——解决方案可能是调整岗位内容而非简单的休息。',
      collaborationStyle: '在六边形上，与相邻类型的同事合作最为自然顺畅；与对角类型的同事合作虽然需要更多适应，但往往能产生最具突破性的成果。建议刻意建立跨类型的合作关系。',
      feedbackPreference: `${primary === 'R' ? '偏好基于实际成果和具体改进点的直接反馈。' : primary === 'I' ? '偏好基于数据和逻辑分析的系统性反馈。' : primary === 'A' ? '偏好尊重创意过程、注重灵感激发的开放式反馈。' : primary === 'S' ? '偏好温和、支持性、关注个人成长的反馈方式。' : primary === 'E' ? '偏好聚焦结果、简洁有力的绩效导向反馈。' : '偏好有明确标准和改进路径的结构化反馈。'}`,
      idealWorkEnvironment: p1.env,
      workLifeBalance: '将核心兴趣融入业余爱好和副业，可以实现工作和生活的自然衔接。当兴趣=工作时，界限模糊不一定是坏事——但仍需设定"完全离线"的休息时间来维持长期热情。'
    },
    testSpecificInsights: {
      title: 'RIASEC 职业深度规划',
      sections: [
        { heading: '六边形一致性分析', content: `您的三字母代码${code}在六边形上的分布揭示了兴趣结构。${['RI','IR','IA','AI','AS','SA','SE','ES','EC','CE','CR','RC'].includes(primary+secondary) ? `${primary}和${secondary}相邻，表示您的兴趣高度一致——这意味着职业方向非常集中，在交叉领域的竞争力强，但也需要注意不要过度局限。` : `${primary}和${secondary}在六边形上有一定距离，表示您的兴趣较为多元——这意味着您具有跨界整合的潜力，能在不同领域间灵活切换，但需要避免精力过于分散。`}建议根据分化度和一致性来调整职业策略。` },
        { heading: '新兴职业匹配', content: `结合AI革命和数字化转型趋势，${p1.label}领域正在涌现新机会：${primary === 'R' ? 'AI辅助工程设计、智能制造、机器人运维、3D打印工程师等' : primary === 'I' ? 'AI研究科学家、生物信息学家、数据工程师、量子计算研究者等' : primary === 'A' ? 'AI辅助创作、数字艺术家、虚拟空间设计师、UX研究员等' : primary === 'S' ? '在线教育设计师、远程心理咨询师、数字健康管理师等' : primary === 'E' ? '科技创业者、数字化转型顾问、社交电商运营、VC投资经理等' : 'AI审计师、数据合规官、自动化流程设计师、区块链分析师等'}。这些新兴方向将您的核心兴趣与未来市场需求对接。` },
        { heading: '职业转型路径', content: `如果当前工作与核心兴趣不匹配，基于RIASEC六边形可以规划最平滑的转型路径——沿六边形向相邻类型方向转型，成本最低、成功率最高。例如从${primary}型出发，最容易转向相邻的类型领域，然后逐步接近目标方向。避免直接跳转到对角类型，那通常需要完全重新积累技能和经验。` }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][i % 6] })),
    },
    statistics: {
      populationPercentage: `${code}型职业兴趣组合在人群中具有独特性，核心类型${p1.label}约占人群的15-20%`,
      famousPeople: p1.famousPeople,
      typicalCareers: allRoles,
      globalDistribution: 'RIASEC分布受经济发展水平和产业结构影响显著。发达经济体中I型和A型比例较高（知识经济和创意产业发达），发展中经济体R型和C型比例更高（制造业和行政管理需求大）。',
      genderDistribution: '传统上R型男性较多、S型女性较多，但随着教育平等和性别意识进步，这一差异正在快速缩小。职业选择越来越由兴趣而非性别驱动。'
    }
  }
}

function generateEnneagramMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const typeNum = parseInt(t.score) || 1
  const n = Math.min(9, Math.max(1, typeNum))
  const typeData: Record<number, {
    name: string; coreFear: string; coreDesire: string; integrationTo: number; disintegrationTo: number;
    wings: [number, number]; center: string; centerEmotion: string;
    strengths: string[]; blindSpots: string[]; famousPeople: string[];
    industries: string[]; roles: string[]; workStyle: string; leadership: string;
    commStyle: string; stress: string; meeting: string; env: string;
    compatible: string[]; incompatible: string[]; pct: string; attachment: string;
  }> = {
    1: { name: '完美主义者', coreFear: '害怕犯错、害怕成为有缺陷的人', coreDesire: '渴望做正确的事、追求完美和正直', integrationTo: 7, disintegrationTo: 4, wings: [9, 2], center: '身体中心', centerEmotion: '愤怒（常以自我批判形式表达）', strengths: ['极强的原则性和道德感', '追求卓越的品质标准', '自律和自我改善的能力', '可靠和负责任', '对细节的关注'], blindSpots: ['过度自我批判和内在批评', '对他人的标准过于严苛', '难以接受"足够好"的结果'], famousPeople: ['甘地', '孔子', '希拉里·克林顿', '马丁·路德', '王阳明'], industries: ['法律服务', '质量管理', '教育', '审计合规', '医疗'], roles: ['审计师', '质量总监', '教育督导', '合规经理', '编辑'], workStyle: '追求完美和高标准的工作方式。每项任务都力求做到最好，注重流程和规范。需注意区分"必须完美"和"足够好"的任务。', leadership: '高标准的榜样型领导者，以身作则赢得尊重。但需注意避免过度苛刻，给团队犯错和学习的空间。', commStyle: '沟通精确、有条理，注重事实和逻辑。可能因过于直接地指出问题而让人感到被批评。建议在反馈中增加肯定。', stress: '压力下向4号（个人主义者）方向解离——变得情绪化、自我怀疑和忧郁。建议觉察这种转变的早期信号，用运动和规律作息来稳定情绪。', meeting: '在会议中注重议程和效率，倾向于指出方案中的不足。建议同时提出改进建议，平衡批判和建设。', env: '有清晰标准、重视质量和道德的组织环境，需要明确的规则和公平的评价体系。', compatible: ['2号 助人型', '7号 享乐型'], incompatible: ['4号 个人主义者'], pct: '1号完美主义者约占人群的10%', attachment: '由于对完美的追求和内在批判，您可能表现出焦虑型依恋——担心自己不够好、不值得被爱。建议练习自我接纳和不完美的勇气。' },
    2: { name: '助人者', coreFear: '害怕不被需要、害怕不被爱', coreDesire: '渴望被爱和被需要', integrationTo: 4, disintegrationTo: 8, wings: [1, 3], center: '心灵中心', centerEmotion: '羞耻（通过帮助他人来获得价值感）', strengths: ['出色的共情和关怀能力', '建立深厚人际关系的天赋', '慷慨无私的奉献精神', '敏锐的情绪感知力', '温暖和热情的人格魅力'], blindSpots: ['忽视自身需求以满足他人', '可能通过帮助来控制关系', '难以接受他人的帮助'], famousPeople: ['特蕾莎修女', '南丁格尔', '戴安娜王妃', '刘德华', '奥普拉(部分特质)'], industries: ['医疗护理', '教育', '社会工作', '心理咨询', '客户服务'], roles: ['护士长', '社会工作者', '教师', '客户成功经理', 'HR经理'], workStyle: '以关系为导向的工作方式，擅长在工作中建立信任和支持网络。需注意设定帮助的边界，避免过度投入导致倦怠。', leadership: '温暖的服务型领导者，通过关怀和支持来激励团队。但需注意培养团队的独立性，避免让团队过度依赖您。', commStyle: '温暖、亲切、充满共情的沟通风格。善于倾听和回应情感需求。建议在温暖中也加入直接反馈，避免为了维持关系而回避困难话题。', stress: '压力下向8号（挑战者）方向解离——变得强势、控制和具有攻击性。这与平时的温暖形象形成强烈反差。觉察到自己变得强硬和要求时，是需要自我照顾的信号。', meeting: '在会议中关注每个人的感受和参与度，善于化解紧张气氛。建议也关注议题和效率，避免过度社交化。', env: '重视人际关系、允许情感表达、强调团队协作的工作环境。', compatible: ['4号 个人主义者', '8号 挑战者'], incompatible: ['5号 观察者'], pct: '2号助人者约占人群的13%，在服务行业中比例更高', attachment: '您可能表现出焦虑型依恋——通过不断给予来确保被需要和被爱。建议练习在关系中坦诚表达自己的需求，学会接受他人的关怀。' },
    3: { name: '成就者', coreFear: '害怕失败、害怕自己毫无价值', coreDesire: '渴望成功和被认可', integrationTo: 6, disintegrationTo: 9, wings: [2, 4], center: '心灵中心', centerEmotion: '羞耻（通过成就来证明自身价值）', strengths: ['卓越的目标达成能力', '高效的执行力和适应力', '激励和带领团队的魅力', '快速学习和掌握新技能', '强大的自我驱动力'], blindSpots: ['过度认同工作角色和成就', '可能为了形象而忽视真实感受', '在失败面前难以接受和面对'], famousPeople: ['奥普拉·温弗瑞', '泰勒·斯威夫特', '贝克汉姆', '马云(部分特质)', '科比·布莱恩特'], industries: ['市场营销', '企业管理', '咨询行业', '销售', '创业'], roles: ['CEO/总经理', '市场总监', '咨询顾问', '品牌经理', '项目总监'], workStyle: '高效、目标导向、注重结果的工作方式。善于包装和展示成果。需注意不要为了速度和形象而牺牲深度和真实性。', leadership: '魅力型领导者——用愿景和成就激励团队。但需注意在追求目标的同时关怀团队成员的感受和发展。', commStyle: '自信、有感染力、注重效率的沟通风格。善于在不同场合调整表达方式。建议在专业形象中保持一些真实和脆弱，让沟通更有深度。', stress: '压力下向9号（调停者）方向解离——变得懒散、逃避和失去动力。当平时高效的您突然变得拖延和无所事事时，这是需要暂停和重新连接真实自我的信号。', meeting: '在会议中表现积极、善于展示成果和推动决策。建议留出空间给他人发言，避免成为唯一的焦点。', env: '重视绩效、有清晰晋升路径、认可成就的竞争性环境。', compatible: ['6号 忠诚者', '9号 调停者'], incompatible: ['4号 个人主义者'], pct: '3号成就者约占人群的10-12%，在商业和娱乐行业中比例更高', attachment: '您可能将自身价值等同于成就——这可能导致在关系中也表现出"绩效导向"。建议练习在没有成就光环的状态下也接纳自己，在关系中展现真实的一面。' },
    4: { name: '个人主义者', coreFear: '害怕平庸、害怕没有独特的身份', coreDesire: '渴望独特和被理解', integrationTo: 1, disintegrationTo: 2, wings: [3, 5], center: '心灵中心', centerEmotion: '羞耻（通过独特性来定义自身价值）', strengths: ['深刻的情感体验和表达', '独特的审美眼光和创造力', '对真实和深度的执着追求', '在艺术和创意领域的天赋', '共情深度和情感智慧'], blindSpots: ['可能沉溺于忧郁和自怜', '总觉得缺少什么、永远不满足', '嫉妒他人拥有自己没有的'], famousPeople: ['梵高', '弗里达·卡罗', '鲍勃·迪伦', '村上春树', '林黛玉'], industries: ['艺术创作', '设计', '心理咨询', '写作出版', '音乐影视'], roles: ['创意总监', '艺术家/设计师', '心理治疗师', '作家/编剧', '品牌策划'], workStyle: '追求独特性和深度的工作方式。在有创意自由和情感表达空间的任务中表现出色。可能在常规和重复性工作中感到窒息。', leadership: '富有远见和灵感的创意型领导者。但需注意在情绪低落期保持团队的稳定，将创意灵感转化为可执行的方案。', commStyle: '表达深刻、有诗意和情感深度。善于传递复杂的情感和意义。建议在表达独特见解的同时也关注实际和可操作性。', stress: '压力下向2号（助人者）方向解离——变得讨好、依赖和失去自我边界。当发现自己异常地迎合他人时，是需要回归自我的信号。', meeting: '在会议中带来独特视角和创意灵感，善于发现他人忽略的维度。建议将直觉洞察用结构化方式呈现。', env: '允许个人表达、重视创意和深度、审美导向的工作环境。', compatible: ['1号 完美主义者', '5号 观察者'], incompatible: ['3号 成就者'], pct: '4号个人主义者约占人群的5-7%，在艺术和创意行业中比例更高', attachment: '您可能表现出焦虑型依恋——渴望深度连接但又担心被抛弃。在关系中可能"推拉"——既渴望亲密又害怕失去自我。建议在关系中保持独立的身份感。' },
    5: { name: '观察者', coreFear: '害怕被侵入、害怕资源不足', coreDesire: '渴望理解和掌握知识', integrationTo: 8, disintegrationTo: 7, wings: [4, 6], center: '思维中心', centerEmotion: '恐惧（通过知识积累来获得安全感）', strengths: ['深度分析和洞察能力', '独立思考不随波逐流', '在专业领域的深度知识', '冷静客观的判断力', '自给自足的能力'], blindSpots: ['过度退缩到思维世界', '在情感表达上可能显得冷淡', '过度保护个人空间和资源'], famousPeople: ['爱因斯坦', '比尔·盖茨', '霍金', '扎克伯格', '尼采'], industries: ['科学研究', '技术开发', '数据分析', '学术教育', '战略咨询'], roles: ['研究科学家', '软件架构师', '战略分析师', '大学教授', '技术专家'], workStyle: '深度专注、独立研究型的工作方式。在需要深度分析和专业知识的任务中表现卓越。需要充足的独立空间和思考时间。', leadership: '专家型领导者——以深度知识和理性分析赢得尊重。但需注意主动与团队沟通和建立情感连接。', commStyle: '精简、逻辑清晰、注重事实的沟通方式。可能在情感表达和闲聊方面感到不适。建议适当增加人情味的交流。', stress: '压力下向7号（享乐者）方向解离——变得散漫、逃避到各种活动中。当发现自己异常地寻求刺激和分散注意力时，是需要回归中心的信号。', meeting: '在会议中倾向于先观察、后发言，发言时数据充分、论证严密。建议主动参与讨论而非等待被问到。', env: '重视专业能力、允许深度研究、尊重个人空间的学术或研发环境。', compatible: ['8号 挑战者', '1号 完美主义者'], incompatible: ['2号 助人者'], pct: '5号观察者约占人群的5-7%，在科研和技术行业中比例更高', attachment: '您可能表现出回避型依恋——需要大量个人空间，在关系亲密度增加时可能本能地退缩。建议练习在保持独立的同时渐进式地增加情感投入。' },
    6: { name: '忠诚者', coreFear: '害怕不安全、害怕没有支持', coreDesire: '渴望安全感和确定性', integrationTo: 9, disintegrationTo: 3, wings: [5, 7], center: '思维中心', centerEmotion: '恐惧（对不确定性的焦虑和警惕）', strengths: ['极强的忠诚和责任感', '预见问题和风险的能力', '为集体利益行动的勇气', '建立持久关系的能力', '在危机中的稳定和可靠'], blindSpots: ['过度担忧和预设最坏情况', '对权威的矛盾态度（顺从或反叛）', '决策时犹豫不决'], famousPeople: ['马克·扎克伯格(部分特质)', '任正非(部分特质)', '鲁迅', '诸葛亮', '布鲁斯·斯普林斯汀'], industries: ['安全管理', '法律合规', '政府机构', '保险', '人力资源'], roles: ['安全经理', '法务顾问', '风控经理', '项目协调员', '公务员'], workStyle: '谨慎、可靠、注重安全的工作方式。在需要预见风险和保障稳定的角色中表现出色。需注意避免因过度担忧而延误决策。', leadership: '忠诚的守护型领导者——为团队提供安全感和稳定性。但需注意在保护中也给予团队尝试和冒险的空间。', commStyle: '谨慎、考虑周全、注重潜在风险的沟通方式。善于提出"万一"的问题来帮助团队避免盲点。建议在指出风险的同时也肯定积极面。', stress: '压力下向3号（成就者）方向解离——变得急功近利、过度关注形象和结果。当发现自己异常地追求外在认可时，是需要回归内在安全感的信号。', meeting: '在会议中善于提出风险和顾虑，确保方案的可靠性。建议在提出问题后也积极参与解决方案的讨论。', env: '稳定、有明确规则和支持系统的组织环境。需要可信赖的领导和团队。', compatible: ['9号 调停者', '3号 成就者'], incompatible: ['7号 享乐者'], pct: '6号忠诚者约占人群的15%以上，是九种类型中比例最高的之一', attachment: '您可能表现出焦虑型依恋——需要确认和保证来感到安全。在关系中可能反复测试伴侣的忠诚度。建议培养内在的安全感，减少对外部确认的依赖。' },
    7: { name: '享乐者', coreFear: '害怕痛苦和被限制', coreDesire: '渴望快乐、满足和新体验', integrationTo: 5, disintegrationTo: 1, wings: [6, 8], center: '思维中心', centerEmotion: '恐惧（用兴奋和计划来逃避恐惧和痛苦）', strengths: ['无穷的热情和积极能量', '快速的联想和创意能力', '适应变化和恢复力强', '感染力和激励他人的能力', '多才多艺和广泛兴趣'], blindSpots: ['逃避痛苦和负面情绪', '注意力分散难以持续专注', '承诺过多但难以全部兑现'], famousPeople: ['罗宾·威廉姆斯', '理查德·布兰森', '马斯克(部分特质)', '莫扎特', '李白'], industries: ['创业投资', '旅游酒店', '娱乐传媒', '市场营销', '广告创意'], roles: ['创始人/企业家', '创意总监', '品牌经理', '活动策划', '旅行博主/KOL'], workStyle: '充满热情、快速行动、多线程运行的工作方式。在需要创意和适应力的工作中表现出色。需注意培养深度专注和坚持到底的能力。', leadership: '充满活力和远见的激励型领导者。但需注意将愿景落地执行，对团队做出的承诺要负责到底。', commStyle: '生动有趣、充满热情和故事的沟通方式。善于用正面框架来激励他人。建议在积极中也包含对现实和困难的坦诚。', stress: '压力下向1号（完美主义者）方向解离——变得挑剔、死板和自我批判。当平时乐观的您突然变得严厉和苛刻时，是需要处理积压痛苦的信号。', meeting: '在会议中带来能量和创意，善于用头脑风暴式方式激发团队灵感。建议也关注方案的可行性和落地细节。', env: '充满可能性、鼓励创新和自由、节奏快速的动态环境。', compatible: ['5号 观察者', '1号 完美主义者'], incompatible: ['6号 忠诚者'], pct: '7号享乐者约占人群的8-10%', attachment: '您可能通过保持选项开放来避免承诺的焦虑。在关系中可能害怕被束缚。建议练习在自由中主动选择承诺，发现深度连接带来的满足远超浮浅的多样性。' },
    8: { name: '挑战者', coreFear: '害怕被控制、害怕脆弱', coreDesire: '渴望掌控和保护自己', integrationTo: 2, disintegrationTo: 5, wings: [7, 9], center: '身体中心', centerEmotion: '愤怒（直接和外向地表达力量）', strengths: ['强大的意志力和行动力', '保护弱者的正义感', '直接和真诚的表达', '在危机中的决断力', '天然的领导力和影响力'], blindSpots: ['可能过度控制人和事', '难以展现脆弱的一面', '容易在愤怒中失去比例感'], famousPeople: ['丘吉尔', '乔布斯(部分特质)', '董明珠', '马丁·路德·金', '曹操'], industries: ['企业管理', '法律', '政治', '军事/安保', '创业'], roles: ['CEO/创始人', '律师', '总经理', '军队指挥官', '投资人'], workStyle: '大胆果断、高能量、以结果为导向的工作方式。在需要魄力和决断的情境中表现卓越。需注意不要忽视团队的感受和过程的重要性。', leadership: '强势的变革型领导者——能在危机中果断决策、保护团队。但需注意权力的节制和对他人自主性的尊重。', commStyle: '直接、有力、不绕弯子的沟通方式。在表达观点时坚定果断。建议在直接中增添对他人感受的觉察。', stress: '压力下向5号（观察者）方向解离——变得退缩、疏离和过度思考。当平时果断的您突然变得犹豫和封闭时，是需要寻求支持的信号。', meeting: '在会议中主导方向和决策，直接表达立场。建议给予他人充分的发言空间，用引导而非控制来推进讨论。', env: '允许自主决策、重视力量和直接性、有真正挑战的环境。', compatible: ['2号 助人者', '9号 调停者'], incompatible: ['5号 观察者'], pct: '8号挑战者约占人群的6-8%，在企业家和领导者中比例更高', attachment: '您用强势和控制来保护自己不受伤。在关系中可能通过测试对方来确认忠诚度。建议练习在信任的关系中展现脆弱——真正的力量包含接受脆弱的勇气。' },
    9: { name: '调停者', coreFear: '害怕冲突和失去连接', coreDesire: '渴望内在和平与和谐', integrationTo: 3, disintegrationTo: 6, wings: [8, 1], center: '身体中心', centerEmotion: '愤怒（压抑和忽视自身的愤怒）', strengths: ['卓越的包容和调和能力', '能看到所有视角的全局观', '让他人感到安全和被接纳', '耐心和稳定的性格', '促进团队和谐的天赋'], blindSpots: ['可能过度压抑自身需求和愤怒', '决策时容易犹豫和"随大流"', '用消极抵抗替代正面表达'], famousPeople: ['达赖喇嘛', '林肯', '周恩来', '宫崎骏(部分特质)', '甘地(部分特质)'], industries: ['心理咨询', '人力资源', '调解仲裁', '教育', '社区管理'], roles: ['调解员', '心理咨询师', 'HR总监', '社区管理者', '教师'], workStyle: '稳定、包容、注重和谐的工作方式。在需要团队协调和冲突化解的角色中表现出色。需注意主动表达自己的观点和需求，避免总是迎合他人。', leadership: '包容的民主型领导者——善于创建安全信任的团队氛围。但需注意在关键时刻果断决策，不要因追求共识而延误行动。', commStyle: '温和、包容、善于倾听的沟通方式。能让不同意见的人都感到被尊重。建议在温和中增加主动表达自己立场的练习。', stress: '压力下向6号（忠诚者）方向解离——变得焦虑、多疑和寻求外部确认。当平时平和的您突然变得紧张和警惕时，是需要重新连接内在平静的信号。', meeting: '在会议中善于倾听和调和不同意见，创造包容的讨论氛围。建议主动分享自己的观点——您的全局视角往往非常有价值。', env: '和谐、包容、低对抗性的工作环境。需要被尊重和不被忽视。', compatible: ['3号 成就者', '6号 忠诚者'], incompatible: ['8号 挑战者'], pct: '9号调停者约占人群的13-15%', attachment: '您可能通过"融合"来维持关系和谐——过度适应伴侣的需求而忽视自己。建议练习在关系中保持独立的身份感和需求表达，健康的关系需要两个完整的个体。' }
  }
  const tp = typeData[n]
  const intTo = typeData[tp.integrationTo], disTo = typeData[tp.disintegrationTo]

  return {
    relationshipAnalysis: {
      overview: `作为九型人格${n}号（${tp.name}），您的核心动机——"${tp.coreDesire}"——和核心恐惧——"${tp.coreFear}"——深刻影响着您在亲密关系中的行为模式。您属于${tp.center}，核心情绪是${tp.centerEmotion}。理解这些深层动力是改善关系质量的关键。`,
      attachmentStyle: tp.attachment,
      idealPartnerTraits: ['理解并接纳您的核心需求而不试图改变您', '不持续触发您的核心恐惧', '支持您向整合方向（'+tp.integrationTo+'号）的积极品质成长', '在情感安全中给予适当的独立空间', '与您的核心价值观高度一致'],
      communicationInRelationship: tp.commStyle,
      conflictResolution: `压力下您可能会向${tp.disintegrationTo}号（${disTo.name}）方向移动，表现出非典型行为。例如，${tp.stress.split('。')[0]}。识别这种模式是管理冲突的第一步——当您觉察到这种变化时，先暂停，给自己情绪缓冲的时间。`,
      advice: ['觉察核心恐惧在关系中的投射——您的反应可能来自恐惧而非事实', '有意识地向整合方向('+tp.integrationTo+'号)寻找改善关系的力量', '与伴侣分享您的核心需求和恐惧，增进相互理解', '在冲突中觉察自动反应模式，给自己选择不同回应的空间', '练习从伴侣的九型视角理解他们的行为动机'],
      redFlags: ['持续触发您核心恐惧的关系模式', '让您长期处于解离方向('+tp.disintegrationTo+'号)状态的关系', '否定您核心需求和真实感受的伴侣'],
      greenFlags: ['支持您向整合方向('+tp.integrationTo+'号)成长的关系', '理解您的类型特点并完全接纳', '在关系中创造安全感和真诚的空间'],
      compatibleTypes: tp.compatible,
      incompatibleTypes: tp.incompatible,
      longTermRelationship: `长期关系是${n}号类型成长的最佳道场。当您在关系中感到安全时，可以逐步面对核心恐惧并向整合方向发展。${n}号在健康状态下的关系特质——${tp.strengths[0]}和${tp.strengths[1]}——是长期关系中不可替代的宝贵品质。`
    },
    personalGrowth: {
      overview: `九型人格的最大价值在于揭示成长路径。${n}号（${tp.name}）的成长方向是：从"${tp.coreFear}"的束缚中逐步解放，向${tp.integrationTo}号（${intTo.name}）方向移动，获得${intTo.strengths[0]}等积极品质。反之，在压力下要警惕向${tp.disintegrationTo}号（${disTo.name}）方向解离。这是一个终身的旅程，不是目的地而是方向。`,
      coreStrengths: tp.strengths,
      blindSpots: tp.blindSpots,
      growthPath: ['觉察核心恐惧的自动触发模式——不是消灭恐惧，而是不再被它控制', `识别向${tp.disintegrationTo}号解离的早期行为信号`, `有意识地练习${tp.integrationTo}号（${intTo.name}）的积极品质`, '建立日常的自我观察练习（正念冥想是最有效的工具之一）'],
      recommendedBooks: ['《九型人格的智慧》Riso & Hudson - 最权威、最深度的九型指南', '《九型人格与人际关系》- 理解关系中的深层动力', '《当下的力量》Eckhart Tolle - 从自动反应模式中解放'],
      habits: ['每日自我观察：今天核心恐惧被触发了几次？我是如何回应的？', `每周刻意练习一次${tp.integrationTo}号的积极品质`, '记录自动反应模式的觉察日志，发现重复的模式', '每月与信任的人分享九型成长的洞察和进步', '每天10分钟正念冥想，增强对内在状态的觉察'],
      mindsetShifts: ['核心恐惧不等于现实——它是过去经验形成的自动反应', '成长不是改变类型，而是在同一类型中向更健康的层级发展', `每种类型在健康状态下都是光芒万丈的——${n}号的健康状态展现为${tp.strengths[0]}`],
      shortTermGoals: ['清楚识别自己的核心恐惧和动机在日常中的表现', '在至少一个场景中成功觉察自动反应并选择了不同的回应', `学习并实践${tp.integrationTo}号（${intTo.name}）的一个积极品质`],
      longTermGoals: ['从核心恐惧的束缚中获得显著的自由', '在大多数时候维持健康的内在状态', '能帮助身边的人理解九型人格的智慧并用于自我成长']
    },
    careerAnalysis: {
      overview: `${n}号（${tp.name}）的核心动机——"${tp.coreDesire}"——深刻影响职业选择和工作满意度。当工作内容与这个核心动机一致时，您会展现出非凡的投入和创造力。反之，长期在与核心动机不匹配的岗位上工作会导致深层的不满足感。`,
      idealIndustries: tp.industries,
      idealRoles: tp.roles,
      workStyle: tp.workStyle,
      leadershipStyle: tp.leadership,
      teamDynamics: `在团队中，${n}号（${tp.name}）通常扮演${n <= 3 ? '推动和引领' : n <= 6 ? '支持和分析' : '保护和协调'}的角色。您的${tp.strengths[0]}是团队的宝贵资产。与互补类型的同事合作能产生最佳效果——特别是${tp.compatible[0]}的搭配。`,
      careerRisks: [`核心恐惧在职场中的表现：${tp.blindSpots[0]}`, `在高压下向${tp.disintegrationTo}号解离可能导致${disTo.blindSpots[0]}`, '过度认同工作角色而忽视内在真实需求'],
      careerAdvantages: tp.strengths.slice(0, 4).map(s => `${s}为您的职业发展提供独特优势`),
      fiveYearPath: `第1年：在匹配核心动机的领域深耕，发挥${tp.strengths[0]}的天然优势；第2-3年：觉察核心恐惧对职业决策的影响，向整合方向发展领导力；第4-5年：在${tp.industries[0]}或${tp.industries[1]}领域建立个人品牌和影响力。`,
      salaryPotential: `薪资发展与九型类型无直接线性关系，但核心动机深刻影响您选择追求的价值维度。${n}号在匹配的行业和岗位中（如${tp.roles[0]}、${tp.roles[1]}），薪资竞争力良好。关键是找到让核心动机得到满足的职业方向。`
    },
    workAnalysis: {
      productivityTips: ['了解核心动机如何影响工作效率——做与动机一致的工作效率自然高', `在效率低下时觉察核心恐惧("${tp.coreFear}")是否正在干扰`, `利用整合方向(${tp.integrationTo}号)的能量来提升在薄弱领域的表现`, '设计与核心动机一致的工作流程和优先级', `管理向${tp.disintegrationTo}号解离时出现的效率陷阱`],
      communicationStyle: tp.commStyle,
      meetingBehavior: tp.meeting,
      stressResponse: tp.stress,
      collaborationStyle: `与不同九型类型的同事合作需要理解彼此的核心需求。您与${tp.compatible[0]}的合作最为自然互补，与${tp.incompatible[0]}的合作需要更多的相互理解和适应。建议在团队中主动了解同事的核心动机，用同理心替代假设。`,
      feedbackPreference: `核心恐惧("${tp.coreFear}")影响您对反馈的接受方式。当反馈触及核心恐惧时，您可能产生比预期更强的反应。建议在收到反馈时先觉察自己的情绪反应，区分"反馈的内容"和"被触发的恐惧"。`,
      idealWorkEnvironment: tp.env,
      workLifeBalance: `${n}号的核心动机影响您对工作投入的方式——${n === 3 ? '可能用工作成就来定义自我价值' : n === 1 ? '可能用工作完美度来衡量自我' : n === 2 ? '可能因帮助他人而忽略自己的休息' : n === 7 ? '可能同时开展太多项目而精力透支' : n === 8 ? '可能过度投入掌控工作而忽略其他生活领域' : '需要觉察自动投入模式'}。建立觉察这种自动模式的能力，是实现健康平衡的基础。`
    },
    testSpecificInsights: {
      title: '九型人格动态系统解读',
      sections: [
        { heading: '整合与解离方向', content: `${n}号（${tp.name}）在健康成长时向${tp.integrationTo}号（${intTo.name}）方向整合——您会获得${intTo.strengths[0]}和${intTo.strengths[1]}等积极品质。这是您的成长方向。相反，在压力和不健康状态下，您向${tp.disintegrationTo}号（${disTo.name}）方向解离——可能表现出${disTo.blindSpots[0]}等消极面。觉察解离的早期信号是自我管理的关键工具。` },
        { heading: '翼型影响分析', content: `${n}号的两个翼型是${tp.wings[0]}号（${typeData[tp.wings[0]].name}）和${tp.wings[1]}号（${typeData[tp.wings[1]].name}）。如果您的翼型偏向${tp.wings[0]}号（${n}w${tp.wings[0]}），您会增添${typeData[tp.wings[0]].strengths[0]}的特质。如果偏向${tp.wings[1]}号（${n}w${tp.wings[1]}），您会增添${typeData[tp.wings[1]].strengths[0]}的特质。翼型为主类型增添了独特的色彩——大多数人会在两个翼型中有一个更突出。` },
        { heading: '三大智慧中心', content: `您属于${tp.center}。身体中心（8/9/1）的核心情绪是愤怒——关于边界和自主性；心灵中心（2/3/4）的核心情绪是羞耻——关于身份和价值；思维中心（5/6/7）的核心情绪是恐惧——关于安全和确定性。您的核心情绪模式是：${tp.centerEmotion}。了解这个底层情绪有助于理解许多表面行为背后的深层动力，也指向了最有效的自我调节策略。` }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#a855f7', '#14b8a6', '#f97316'][i % 9] })),
      compatibilityScores: [{ type: `${tp.integrationTo}号 ${intTo.name}（整合方向）`, score: 90 }, { type: `${tp.wings[0]}号 ${typeData[tp.wings[0]].name}（翼型）`, score: 82 }, { type: `${tp.wings[1]}号 ${typeData[tp.wings[1]].name}（翼型）`, score: 78 }, { type: `${tp.disintegrationTo}号 ${disTo.name}（解离方向）`, score: 55 }]
    },
    statistics: {
      populationPercentage: tp.pct,
      famousPeople: tp.famousPeople,
      typicalCareers: tp.roles,
      globalDistribution: '九型人格分布在不同文化中有差异。集体主义文化（如东亚）中2号和6号比例较高（重视群体和忠诚），个人主义文化（如北美）中3号和7号比例较高（重视成就和自由）。',
      genderDistribution: '九型人格本身没有性别差异，但社会性别角色期待可能影响类型的表达方式——例如男性8号可能更容易被社会接受，而男性2号可能面临角色冲突。'
    }
  }
}

function generateDepressionMock(t: TestResultData): Omit<PremiumReportData, 'testType' | 'score' | 'generatedAt' | 'dimensionAnalysis'> {
  const totalScore = parseInt(t.score) || 0
  const severity = totalScore < 5 ? '无' : totalScore < 10 ? '轻微' : totalScore < 15 ? '轻度' : totalScore < 20 ? '中度' : '重度'
  const isMinimal = totalScore < 5
  const isMild = totalScore >= 5 && totalScore < 10
  const isModerate = totalScore >= 10 && totalScore < 15
  const isModSevere = totalScore >= 15 && totalScore < 20
  const isSevere = totalScore >= 20
  const needsProfessional = totalScore >= 10
  const sorted = [...t.dimensions].sort((a, b) => b.percentage - a.percentage)
  const worstDim = sorted[0], bestDim = sorted[sorted.length - 1]

  return {
    relationshipAnalysis: {
      overview: `当前您的PHQ-9抑郁筛查总分为${totalScore}/27（${severity}）。${isMinimal ? '您的情绪状态良好，以下内容帮助您了解如何维持心理健康并在关系中保持积极状态。' : isMild ? '您有轻微的情绪波动，这很常见。以下内容帮助您了解情绪对人际关系的影响并提供调节策略。' : '情绪状态会影响各类人际关系的质量。了解这些影响有助于在调整过程中获得更好的社会支持。'}`,
      communicationInRelationship: isMinimal ? '您当前的情绪状态有助于健康的关系沟通。建议继续保持开放、真诚的表达习惯，定期与亲近的人分享感受。' : isMild ? '轻微的情绪波动可能偶尔影响沟通意愿。建议在感到不适时用简单的语言告诉亲近的人"我今天状态不太好"，这比默默承受更有帮助。' : '在当前情绪状态下，向亲近的人表达需求和感受可能比较困难——这是正常的反应，不是您的错。建议从写下感受开始，如果口头表达困难，可以用短信或便条传达。',
      conflictResolution: isMinimal ? '您有足够的情绪资源来处理冲突。建议保持现有的沟通习惯。' : '情绪低落时，冲突处理能力可能暂时下降。建议在情绪激动时使用"暂停机制"——告诉对方"我需要一点时间来整理思路，我们稍后再谈"。这不是逃避，而是负责任的自我管理。',
      advice: [
        isMinimal ? '与亲友保持定期的深度交流' : '尝试向至少一位信任的人分享你目前的感受',
        isMinimal ? '主动关心身边人的心理健康' : '学习接受他人的善意帮助——接受帮助不是软弱',
        '每天至少与一位亲友进行有意义的互动',
        needsProfessional ? '如有伴侣，邀请TA了解抑郁症的相关知识' : '保持社交活动的质量，不必追求数量',
        '练习用"我感到..."句式表达内心状态'
      ],
      redFlags: ['连续多天完全回避所有社交和人际联系', '在关系中持续强烈地自我否定和自责', '长期忽视所有来自亲友的关心和支持信号'],
      greenFlags: ['愿意向至少一个人敞开一点点', '能够接受他人的关心而不感到负担', '即使不想出门也能保持线上的基本社交联系'],
      longTermRelationship: isMinimal ? '良好的情绪状态是高质量关系的基础。继续投入关系维护，享受亲密连接带来的幸福感。' : '亲密关系可以是调整过程中最重要的支持来源之一。如果可能，与伴侣坦诚沟通您当前的状态——研究表明，伴侣的理解和支持是康复的重要保护因素。'
    },
    personalGrowth: {
      overview: `这份报告的核心目的是为您提供基于循证研究的自我关怀指导。您的PHQ-9评估结果为${severity}(${totalScore}/27)。${isMinimal ? '您目前状态良好，以下内容聚焦于维持心理健康和预防。' : isMild ? '轻微的情绪波动很常见，以下自助方案可以有效帮助您改善状态。' : isModerate ? '建议结合自助方法和专业咨询。以下方案基于认知行为疗法(CBT)和接受与承诺疗法(ACT)的研究成果。' : '强烈建议寻求专业心理帮助作为核心康复手段。以下自助方案作为专业治疗的补充。'}`,
      coreStrengths: ['愿意主动了解自己的心理状态（完成了这次评估本身就是积极的一步）', '内心对改善的渴望——这是最宝贵的内在资源', '过往成功应对困难和挑战的经验', '您身上存在的韧性和力量——即使现在感觉不到它们', bestDim ? `${bestDim.label || bestDim.dimension}维度相对较好(${bestDim.percentage}%)，这是您的心理资源` : '对自己的关注和照顾的意愿'],
      blindSpots: isMinimal ? ['可能忽视日常压力的累积效应', '在他人需要帮助时可能未察觉信号'] : ['可能低估了自己身上的积极面——抑郁的"滤镜"会让一切看起来比实际更糟', '可能将一次的负面经验过度泛化（"永远都是这样"）', '身边的社会支持资源可能未被充分利用——朋友和家人通常愿意帮忙但不知道如何开口'],
      growthPath: isMinimal ? ['保持规律的心理健康维护习惯', '学习识别压力积累的早期信号', '定期进行心理健康自我评估'] : ['第一步：接纳当前状态，不自我批判——"我现在感到低落"不等于"我是一个失败的人"', '第二步：从一个微小的积极行为开始——哪怕只是每天出门散步5分钟', '第三步：逐步扩展日常活动范围，重建生活的结构和节奏', '第四步：持续追踪和评估进展，每两周做一次PHQ-9自评'],
      recommendedBooks: ['《伯恩斯新情绪疗法》David Burns - 认知行为疗法(CBT)自助经典', '《活出最乐观的自己》Martin Seligman - 习得性乐观的科学方法', '《自我关怀的力量》Kristin Neff - 用温柔替代自我批判'],
      habits: [
        '每天睡前记录3件今天发生的好事（哪怕很小——"今天天气不错"也算）',
        `每天至少${isSevere ? '10' : '15-30'}分钟轻度运动（散步即可，研究表明有氧运动的抗抑郁效果接近药物）`,
        '保持规律的起床和睡觉时间（昼夜节律紊乱会加重情绪问题）',
        '每天进行5-10分钟正念呼吸练习（推荐使用"潮汐"或"小睡眠"APP引导）',
        isMinimal ? '每周与不同的朋友进行一次有深度的对话' : '每天至少与一位亲友保持联系（哪怕只是发一条消息）'
      ],
      mindsetShifts: ['情绪低落是一种可以改善的状态，不是永久的命运——大脑的神经可塑性意味着改变是可能的', '寻求帮助是勇敢和智慧的表现，而非软弱——专业运动员也需要教练', '康复不是直线上升，而是螺旋式前进——允许有反复，每次低谷的底线都会比上次高一些'],
      shortTermGoals: [
        isMinimal ? '建立一个可持续的心理健康维护计划' : '建立一个稳定的日常作息时间表（固定时间起床是第一步）',
        isMinimal ? '学习两种新的压力管理技巧' : '找到至少一项能给自己带来微小愉悦感的活动并每天做',
        needsProfessional ? '预约一次专业心理咨询' : '联系至少一位可以倾诉的朋友或家人'
      ],
      longTermGoals: [
        isMinimal ? '建立终身的心理健康素养' : '恢复日常社会功能和生活满意度',
        '建立可持续的情绪管理工具箱（至少掌握3种有效的调节方法）',
        isMinimal ? '成为身边人心理健康的支持者' : '建立预防复发的长期策略和早期预警系统'
      ]
    },
    careerAnalysis: {
      overview: `${isMinimal ? '您的情绪状态良好，不太可能对工作产生负面影响。以下建议帮助您在职场中维持心理健康。' : isMild ? '轻微的情绪波动可能偶尔影响工作状态。合理的自我管理和工作节奏调整通常就足够应对。' : '当前情绪状态可能对工作中的注意力集中、决策动力和人际互动产生影响。重要的是在调整过程中合理调整工作期望和节奏——这不是放弃，而是战略性的暂时调整。'}`,
      idealIndustries: isMinimal ? ['当前行业中继续深耕', '根据兴趣和能力选择', '重视心理健康的企业文化'] : ['有弹性工作时间安排的企业', '人际氛围温暖支持的团队', '压力水平适中且可预测的工作', '有员工心理健康支持项目(EAP)的单位', '工作成果可见、能获得正面反馈的岗位'],
      idealRoles: isMinimal ? ['根据您的专业和兴趣选择', '有成长空间和正面反馈的岗位'] : ['工作节奏可自主控制的岗位', '能从完成任务中获得小成就感的工作', '有适度社交但不要求高强度人际互动的角色', '有明确的工作边界和休息保障的岗位'],
      workStyle: isMinimal ? '继续保持您目前的工作方式，注意定期休息和压力管理。' : isMild ? '在感到精力低落的日子适当降低期望值，将"完成"而非"完美"作为目标。' : `建议在当前阶段适当降低工作强度——${needsProfessional ? '以专业治疗和康复为首要目标，工作作为辅助性的日常结构' : '以维持基本工作功能为目标，把多余精力留给自我照顾'}。这是暂时的策略性调整，不代表永久的能力下降。`,
      teamDynamics: isMinimal ? '继续在团队中发挥积极作用。如果注意到同事有情绪困扰的信号，主动给予关心。' : '如果工作环境安全信任，可以向直属上级或HR适度说明情况——大多数管理者愿意提供合理的调整。您不需要详细解释，只需说"最近身体/心理状态需要调整"即可。',
      careerRisks: [
        needsProfessional ? '在情绪低落期避免做重大职业决策（如辞职、跳槽）——先稳定情绪再做判断' : '注意工作压力不要过度积累',
        isSevere || isModSevere ? '如果工作压力显著加重症状，考虑与医生讨论是否需要暂时调整工作' : '关注工作强度对情绪状态的影响',
        '长期的社交退缩可能影响职业发展——保持基本的工作社交'
      ],
      careerAdvantages: ['经历过情绪挑战的人通常发展出更强的共情力和心理韧性', '康复的过程带来深刻的自我理解——这是一生受用的心理资本', '对心理健康的认知和实践经验成为职场中的独特优势', isMinimal ? '良好的心理状态是持续职业发展的基础' : '经历低谷后的重新出发往往伴随着更清晰的价值观和职业方向']
    },
    workAnalysis: {
      productivityTips: [
        '将大任务分解为更小的、可在15-30分钟内完成的步骤',
        '把最重要的工作安排在精力最好的时段（通常是上午）',
        isMinimal ? '使用番茄钟等时间管理工具保持专注' : '允许自己降低标准——"完成"比"完美"重要得多',
        '每工作45-50分钟进行一次5-10分钟的短休息',
        '使用待办清单来减少认知负担——把要做的事写下来而非记在脑子里'
      ],
      communicationStyle: isMinimal ? '保持开放和积极的沟通习惯。如果注意到同事的异常变化，主动关心。' : '如果需要，可以用简短的方式告知直接合作的同事"我最近状态需要调整"。大多数人会给予理解和支持。您不需要解释太多细节，设定自己舒适的分享边界就好。',
      stressResponse: isMinimal ? '您目前有良好的压力应对能力。建议建立定期的减压习惯（运动、正念、社交）作为长期维护。' : `当前状态下压力耐受力暂时下降，这是正常的生理反应。建议：(1)识别自己的压力信号（如睡眠变差、食欲变化）；(2)使用"4-7-8呼吸法"作为即时缓解工具；(3)${needsProfessional ? '与治疗师讨论工作压力管理策略' : '建立规律的运动习惯来提升基础抗压力'}。`,
      collaborationStyle: isMinimal ? '继续在团队协作中发挥积极作用。' : '在团队合作中，承担您当前能够胜任的部分就好，不必勉强。如果某项任务超出当前精力范围，坦诚地与同事协商分工调整。这不是推脱责任，而是对团队负责的表现。',
      idealWorkEnvironment: isMinimal ? '任何健康、积极的工作环境都适合您。关注团队文化对心理健康的支持程度。' : '安静有序、压力可控、同事友善且包容的工作环境最有助于状态恢复。如果可能，争取弹性工作时间或偶尔的远程办公机会。',
      workLifeBalance: isMinimal ? '继续维持工作和生活的健康边界。建议每天至少保留1小时完全属于自己的时间。' : `${needsProfessional ? '当前阶段，康复是第一优先级。工作是生活的一部分，不是全部。' : ''}确保有足够的休息和自我照顾时间——充足的睡眠（7-8小时）、规律的饮食和适量的运动是情绪恢复的基础。设定明确的"下班时间"，工作之外的时间用于照顾自己。`
    },
    testSpecificInsights: {
      title: '专业康复与维护指导',
      sections: [
        { heading: '症状维度优先级分析', content: `基于PHQ-9的评估结果，您的总分为${totalScore}/27（${severity}）。${worstDim ? `其中"${worstDim.label || worstDim.dimension}"维度得分最高(${worstDim.percentage}%)，是目前最需要关注的领域。` : ''}${needsProfessional ? 'PHQ-9得分≥10分提示需要专业评估和干预。建议尽快预约心理咨询或精神科就诊。' : '您的得分在正常范围内，以下自助方案可以帮助维持和改善当前状态。'}优先关注得分最高的维度，将有限的精力用在最需要的地方——不需要同时解决所有问题。` },
        { heading: isMinimal || isMild ? '积极心理维护方案' : '循证自助调节方案', content: isMinimal || isMild ?
          '维持心理健康的三大支柱：(1)身体健康——每周至少150分钟中等强度运动、7-8小时睡眠、均衡饮食；(2)社会连接——维持3-5个亲密关系、每周至少一次有深度的社交互动；(3)意义感——从工作、爱好或助人中获得持续的价值感和目标感。定期使用PHQ-9自评来监测情绪变化趋势。' :
          `【认知行为疗法(CBT)自助技术】三栏法：(1)记录自动化消极想法（如"我什么都做不好"）→ (2)检验证据（这个想法有什么支持和反对的证据？）→ (3)生成更平衡的替代想法（如"我在某些方面确实遇到困难，但我也有做得好的地方"）。每天练习一次。【行为激活技术】列出过去曾给你带来愉悦感或成就感的10项活动，每天从中选择一项来做——即使不想做也先做5分钟，通常5分钟后就会产生继续的动力。【接受与承诺疗法(ACT)】当负面情绪来临时：观察它（"我注意到我在感到焦虑"）→ 不对抗它（"这是一种感觉，它会来也会走"）→ 将注意力转向当下（"此刻我在做什么？"）→ 采取一小步与你的价值观一致的行动。` },
        { heading: needsProfessional ? '专业帮助指南' : '预防与长期维护', content: needsProfessional ?
          `您的PHQ-9得分为${totalScore}分（${severity}），建议寻求专业心理咨询或精神科医生的帮助。【首次就诊准备清单】(1)症状持续时间（大约从什么时候开始？）(2)对日常生活的影响程度(3)已尝试的自助方法及效果(4)是否有睡眠、食欲的明显变化(5)家族中是否有类似情况。【就医渠道】可以通过以下方式找到帮助：三甲医院精神/心理科、正规心理咨询机构、社区心理卫生服务中心、12320卫生热线、北京心理危机研究与干预中心010-82951332。${isSevere ? '【紧急提示】如果您有伤害自己的想法，请立即拨打24小时心理危机热线：400-161-9995 或直接前往最近的医院急诊。您不是一个人。' : ''}` :
          '维持当前健康状态的长期策略：(1)规律运动——每周3-5次、每次30分钟以上的有氧运动（最有效的天然抗抑郁方式）；(2)充足睡眠——固定时间起床，避免睡前刷手机；(3)社交连接——维护核心人际关系，避免长期孤立；(4)正念练习——每天10分钟的冥想或正念呼吸；(5)定期自评——每两周做一次PHQ-9自评，关注情绪变化趋势。如果连续两周得分上升，考虑寻求专业帮助。' }
      ]
    },
    charts: {
      radarData: Object.fromEntries(t.dimensions.map(d => [d.label || d.dimension, d.percentage])),
      dimensionBars: t.dimensions.map((d, i) => ({ label: d.label || d.dimension, value: d.percentage, color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i % 5] })),
    },
    statistics: {
      populationPercentage: `全球约有2.8亿人受抑郁症影响（WHO, 2023），约占全球人口的3.8%。${isMinimal ? '您当前的评估结果处于健康范围。' : isMild ? '轻微的情绪波动在人群中非常普遍。' : '抑郁症是最常见的心理健康问题之一，它不是罕见的、可耻的，而是可以通过科学方法有效治疗的。'}`,
      famousPeople: ['丘吉尔 — 终身与"黑狗"(抑郁)共处，领导英国赢得二战', '林肯 — 一生与抑郁抗争，成为美国最伟大的总统之一', 'Lady Gaga — 公开分享心理健康经历，成为全球倡导者', '崔永元 — 勇敢分享抑郁经历，推动中国社会对心理健康的关注', 'J.K.罗琳 — 在人生最低谷时写出了《哈利·波特》'],
      typicalCareers: [],
      globalDistribution: '抑郁症在全球各地区均有分布。高收入国家的报告率较高（与诊断服务普及有关），低收入国家的实际患病率可能被低估。COVID-19大流行后，全球抑郁症患病率上升约25%（WHO, 2022）。',
      genderDistribution: '女性的诊断率约为男性的1.5-2倍，但研究认为男性的实际患病率可能被低估——男性更倾向于通过愤怒、冒险行为或物质使用来表达情绪困扰，导致求助率更低。所有性别都值得获得同等的心理健康关注和支持。'
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
