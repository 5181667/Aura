// Holland 霍兰德职业兴趣 Profile 数据

export interface HollandProfile {
  type: string
  title: string
  tagline: string
  emoji: string
  color: string
  colorSecondary: string
  tags: string[]
  description: string
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  famousPeople: string[]
  workStyle: string
  idealEnvironment: string
}

export const hollandProfiles: Record<string, HollandProfile> = {
  'R': {
    type: 'R',
    title: '现实型 · 实干家',
    tagline: '用双手创造真实的世界',
    emoji: '🔧',
    color: '#78716c',
    colorSecondary: '#a8a29e',
    tags: ['动手能力', '务实可靠', '技术导向', '独立自主'],
    description: '你是天生的实干家，喜欢通过动手操作来解决实际问题。你偏好具体、有形的工作成果，在使用工具、机器和技术方面有突出天赋。你重视实际结果胜过理论空谈。',
    strengths: ['出色的动手操作和技术能力', '善于解决实际问题', '工作踏实可靠、自律性强', '对机械和工具有天然亲和力'],
    weaknesses: ['可能不擅长抽象理论和概念', '在复杂的人际沟通中可能不自在', '有时过于关注技术细节忽视全局'],
    careers: ['机械工程师', '建筑师', '飞行员', '电气技师', '运动教练', '农业专家', '外科医生'],
    famousPeople: ['莱特兄弟', '埃隆·马斯克', '贝尔·格里尔斯'],
    workStyle: '你偏好独立工作或在小团队中与志同道合的人合作。你需要动手操作的机会和具体可见的工作成果。',
    idealEnvironment: '户外或工作坊、实验室等可以动手操作的环境，有明确的任务目标和实际成果。'
  },
  'I': {
    type: 'I',
    title: '研究型 · 思想家',
    tagline: '探索未知是最大的乐趣',
    emoji: '🔬',
    color: '#6366f1',
    colorSecondary: '#818cf8',
    tags: ['深度思考', '求知欲强', '分析严谨', '独立探索'],
    description: '你是天生的探索者和思考者，对知识有着永不满足的渴望。你喜欢通过研究和分析来理解世界的运行规律，享受解决复杂问题带来的智力满足感。',
    strengths: ['卓越的分析和逻辑推理能力', '对知识的深度追求和专注力', '善于发现规律和解决复杂问题', '独立思考，不盲从权威'],
    weaknesses: ['可能过度沉浸于理论忽视实践', '在领导和说服他人方面不是强项', '有时过于追求完美和精确'],
    careers: ['科学研究员', '大学教授', '数据科学家', '医生', '心理学家', '药剂研发', '人工智能工程师'],
    famousPeople: ['爱因斯坦', '居里夫人', '达尔文', '霍金'],
    workStyle: '你喜欢沉浸在研究和分析中，需要大量不被打扰的深度思考时间。你偏好独立工作或与同领域专家合作。',
    idealEnvironment: '研究机构、高校、实验室等鼓励探索和创新的环境，有充足的资源和自主空间。'
  },
  'A': {
    type: 'A',
    title: '艺术型 · 创造者',
    tagline: '生活本身就是一件艺术品',
    emoji: '🎨',
    color: '#ec4899',
    colorSecondary: '#f472b6',
    tags: ['创意无限', '自我表达', '审美独到', '感性丰富'],
    description: '你拥有丰富的想象力和独特的创造力，渴望通过各种形式表达内心世界。你追求美感、独特性和自我表达的自由，在艺术和创意领域有着非凡的天赋。',
    strengths: ['丰富的想象力和创造力', '独特的审美眼光和感受力', '善于自我表达和创新', '灵活性强，不受传统框架限制'],
    weaknesses: ['可能不擅长有序的组织和管理', '对重复和规范的工作缺乏耐心', '有时情绪波动较大'],
    careers: ['设计师', '音乐家', '作家/编剧', '摄影师', '建筑设计师', '演员/导演', '游戏策划'],
    famousPeople: ['毕加索', '莫扎特', '宫崎骏', '乔纳森·艾维'],
    workStyle: '你需要创作自由和灵感空间，不喜欢过于严格的时间和流程约束。你偏好在灵感来临时全力投入创作。',
    idealEnvironment: '自由开放、鼓励创新和个性表达的环境，有展示作品和获得反馈的机会。'
  },
  'S': {
    type: 'S',
    title: '社会型 · 助人者',
    tagline: '帮助他人就是帮助自己',
    emoji: '💚',
    color: '#22c55e',
    colorSecondary: '#4ade80',
    tags: ['乐于助人', '善于沟通', '关怀体贴', '教育启发'],
    description: '你天生具有服务他人的热忱，在帮助、教导和关心他人的过程中获得巨大的满足感。你善于建立温暖的人际关系，是他人成长路上的引路人和支持者。',
    strengths: ['出色的沟通和共情能力', '善于教导、辅导和支持他人', '创造温暖包容的社交氛围', '在服务他人中获得持续动力'],
    weaknesses: ['可能过度投入他人事务忽视自己', '在需要竞争和果断决策时不够强势', '有时承担过多情感压力'],
    careers: ['教师/培训师', '心理咨询师', '社会工作者', '医护人员', '人力资源管理', '公益组织管理', '职业规划师'],
    famousPeople: ['特蕾莎修女', '弗洛伦斯·南丁格尔', '曼德拉', '孔子'],
    workStyle: '你喜欢与人密切合作，在教导和辅助他人成长中获得满足。你重视工作中的人际关系和团队凝聚力。',
    idealEnvironment: '以人为本、注重合作和服务的环境，能直接看到自己对他人产生积极影响。'
  },
  'E': {
    type: 'E',
    title: '企业型 · 领航者',
    tagline: '征服一个又一个目标',
    emoji: '🚀',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    tags: ['领导魅力', '说服力强', '目标明确', '开拓进取'],
    description: '你是天生的领导者和推动者，渴望通过影响力和组织力来实现宏大目标。你善于说服他人、整合资源，在竞争和挑战中激发出最大潜能。',
    strengths: ['强大的领导力和组织能力', '出色的说服和谈判技巧', '善于把握机会和整合资源', '在竞争中保持冷静和策略性'],
    weaknesses: ['可能对技术细节缺乏耐心', '有时过于注重结果忽视过程', '可能忽视团队中"沉默者"的贡献'],
    careers: ['企业家/CEO', '销售总监', '市场总监', '律师', '政治家', '投资银行家', '管理咨询师'],
    famousPeople: ['杰克·韦尔奇', '任正非', '奥普拉·温弗瑞', '拿破仑'],
    workStyle: '你喜欢快节奏、有挑战性的工作，享受说服和领导他人的过程。你需要清晰的晋升通道和成就认可。',
    idealEnvironment: '竞争性强、有发展机会、能发挥领导力和影响力的环境，有明确的目标和回报机制。'
  },
  'C': {
    type: 'C',
    title: '常规型 · 守序者',
    tagline: '秩序是效率的基石',
    emoji: '📊',
    color: '#0ea5e9',
    colorSecondary: '#38bdf8',
    tags: ['严谨有序', '注重细节', '忠诚可靠', '执行力强'],
    description: '你是秩序和效率的守护者，在有序、规范的环境中表现最出色。你善于处理数据和细节，做事严谨可靠，是组织中不可或缺的中坚力量。',
    strengths: ['出色的组织和数据处理能力', '高度的准确性和细致性', '忠诚可靠，执行力极强', '善于建立和遵循流程规范'],
    weaknesses: ['面对不确定和混乱时可能不适', '缺乏灵活性和创新意愿', '可能过于依赖规则和权威'],
    careers: ['会计师/审计师', '行政管理', '银行职员', '数据库管理', '物流管理', '秘书/行政助理', '质量管理'],
    famousPeople: ['沃伦·巴菲特', '杰夫·贝索斯（运营层面）'],
    workStyle: '你偏好有明确规范和流程的工作方式，善于在既定框架内精益求精。你需要清晰的职责和期望。',
    idealEnvironment: '有序、稳定、流程清晰的环境，有明确的工作规范和专业发展路径。'
  }
}

// 根据 Holland 三位代码获取主导 Profile
export function getHollandProfile(code: string): HollandProfile {
  const primaryType = code.charAt(0)
  return hollandProfiles[primaryType] || hollandProfiles['R']
}

// 获取组合职业建议
export function getHollandComboDescription(code: string): string {
  const comboDescriptions: Record<string, string> = {
    'RIA': '你兼具实践能力、研究精神和创意天赋，适合将技术与设计结合的创新领域。',
    'RIS': '你是实干型的助人者，在技术与服务交汇处能找到最大价值。',
    'RIE': '你将实践能力与分析思维和领导力结合，适合技术管理和创业。',
    'RIC': '你在技术实践与精确分析间游刃有余，适合高精度的技术工作。',
    'IAS': '你将学术研究、创意表达和人文关怀完美结合，适合教育和心理领域。',
    'IAE': '你的研究能力、创造力和商业头脑让你适合创新型企业和咨询行业。',
    'ISE': '你将分析能力与人际技巧和领导力结合，适合管理咨询和教育行业。',
    'ASE': '你将创造力、社交魅力和企业精神结合，适合创意产业和市场营销。',
    'SEC': '你兼具服务热忱、商业头脑和组织能力，适合管理和人力资源行业。',
    'ECS': '你将领导力、组织能力和团队协作精神结合，适合企业管理。',
  }
  return comboDescriptions[code] || `你的 ${code} 组合代码反映了多元化的职业兴趣，建议在核心兴趣的交汇领域寻找职业方向。`
}
