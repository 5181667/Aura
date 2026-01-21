// MBTI 16种人格完整档案

export interface MBTIProfile {
  type: string
  title: string           // 角色名称
  tagline: string         // 核心标语
  emoji: string           // 代表性 emoji
  color: string           // 主题色
  colorSecondary: string  // 辅助色
  tags: string[]          // 性格标签
  description: string     // 一句话概述
  strengths: string[]     // 优势/亮点
  weaknesses: string[]    // 盲点/发展建议
  careers: string[]       // 适合职业
  famousPeople: string[]  // 代表人物
}

export const mbtiProfiles: Record<string, MBTIProfile> = {
  'INTJ': {
    type: 'INTJ',
    title: '建筑师',
    tagline: '万事皆有改进空间',
    emoji: '🏛️',
    color: '#6366f1',
    colorSecondary: '#818cf8',
    tags: ['战略思维', '独立自主', '高标准', '远见卓识'],
    description: '你是天生的战略家，拥有独特的洞察力和创造力。你追求知识，善于将复杂理论转化为可行的计划，对自己和他人都有极高的标准。',
    strengths: ['卓越的战略规划能力', '独立且意志坚定', '善于发现改进机会'],
    weaknesses: ['可能显得过于自信', '对情感表达较为含蓄', '对低效行为缺乏耐心'],
    careers: ['科学家', '战略分析师', '投资顾问', '软件架构师'],
    famousPeople: ['埃隆·马斯克', '马克·扎克伯格', '尼古拉·特斯拉']
  },
  'INTP': {
    type: 'INTP',
    title: '逻辑学家',
    tagline: '知识的边界在哪里',
    emoji: '🔬',
    color: '#8b5cf6',
    colorSecondary: '#a78bfa',
    tags: ['分析型', '好奇心强', '客观理性', '创新思维'],
    description: '你是哲学家和思想家，对知识有着无尽的渴望。你善于发现模式和逻辑漏洞，喜欢从根本原理出发解决复杂问题。',
    strengths: ['出色的分析和逻辑能力', '开放的思维方式', '善于概念化和抽象思考'],
    weaknesses: ['可能过度分析而延迟行动', '社交场合可能感到疲惫', '可能忽略实际细节'],
    careers: ['程序员', '数学家', '哲学教授', '数据科学家'],
    famousPeople: ['爱因斯坦', '比尔·盖茨', '亚里士多德']
  },
  'ENTJ': {
    type: 'ENTJ',
    title: '指挥官',
    tagline: '我来领导这个',
    emoji: '👔',
    color: '#dc2626',
    colorSecondary: '#f87171',
    tags: ['领导力', '果断决策', '高效执行', '雄心壮志'],
    description: '你是天生的领导者，拥有非凡的自信和意志力。你善于制定战略、组织资源，并能果断地带领团队实现宏大目标。',
    strengths: ['强大的领导力和组织能力', '果断高效的决策力', '擅长长期战略规划'],
    weaknesses: ['可能显得过于强势', '对慢节奏的人缺乏耐心', '可能忽视他人情感需求'],
    careers: ['CEO', '律师', '管理顾问', '政治家'],
    famousPeople: ['史蒂夫·乔布斯', '拿破仑', '玛格丽特·撒切尔']
  },
  'ENTP': {
    type: 'ENTP',
    title: '辩论家',
    tagline: '规则就是用来打破的',
    emoji: '💡',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    tags: ['机智灵活', '爱挑战', '创意无限', '善于辩论'],
    description: '你是永不满足的创新者和挑战者。你享受智力交锋，善于从多角度思考问题，总能发现新的可能性和机会。',
    strengths: ['出色的创新和应变能力', '善于激发他人思考', '知识面广且机智'],
    weaknesses: ['可能过于爱唱反调', '有时缺乏后续执行', '对常规工作易感无聊'],
    careers: ['创业者', '产品经理', '编剧', '市场营销'],
    famousPeople: ['托马斯·爱迪生', '马克·吐温', '本杰明·富兰克林']
  },
  'INFJ': {
    type: 'INFJ',
    title: '提倡者',
    tagline: '世界需要更多善意',
    emoji: '🦋',
    color: '#10b981',
    colorSecondary: '#34d399',
    tags: ['理想主义', '洞察人心', '内敛深沉', '使命感强'],
    description: '你是稀有的理想主义者，拥有深刻的洞察力和强烈的价值观。你追求有意义的人生，希望能对世界产生积极影响。',
    strengths: ['深刻的直觉和洞察力', '强烈的责任感和同理心', '善于激励他人成长'],
    weaknesses: ['可能过于理想化', '对批评较为敏感', '有时过度内省'],
    careers: ['心理咨询师', '作家', '非营利组织领导', '教师'],
    famousPeople: ['马丁·路德·金', '特蕾莎修女', 'J.K.罗琳']
  },
  'INFP': {
    type: 'INFP',
    title: '调停者',
    tagline: '倾听内心的声音',
    emoji: '🌸',
    color: '#ec4899',
    colorSecondary: '#f472b6',
    tags: ['诗意浪漫', '共情能力强', '真诚善良', '追求和谐'],
    description: '你是真正的理想主义者，总是寻找表象之下的美好。你重视真实和诚意，希望让世界变得更美好、更有意义。',
    strengths: ['丰富的想象力和创造力', '深度的共情能力', '对价值观忠诚坚定'],
    weaknesses: ['可能过于敏感内向', '面对冲突易退缩', '有时过于理想化'],
    careers: ['作家', '艺术家', '心理咨询师', '社会工作者'],
    famousPeople: ['威廉·莎士比亚', '约翰·列侬', '奥黛丽·赫本']
  },
  'ENFJ': {
    type: 'ENFJ',
    title: '主人公',
    tagline: '我相信你能做到',
    emoji: '🌟',
    color: '#10b981',
    colorSecondary: '#34d399',
    tags: ['魅力四射', '善于激励', '关心他人', '天生领袖'],
    description: '你是充满魅力的领导者，天生善于理解他人、激发潜能。你热衷于帮助他人成长，并能团结众人为共同目标努力。',
    strengths: ['出色的沟通和影响力', '善于发现他人潜力', '强大的组织协调能力'],
    weaknesses: ['可能过度在意他人看法', '有时忽略自身需求', '对负面反馈敏感'],
    careers: ['教育工作者', '人力资源总监', '公关经理', '培训师'],
    famousPeople: ['奥巴马', '奥普拉', '马丁·路德·金']
  },
  'ENFP': {
    type: 'ENFP',
    title: '竞选者',
    tagline: '生活是一场精彩的冒险',
    emoji: '🎭',
    color: '#f97316',
    colorSecondary: '#fb923c',
    tags: ['热情洋溢', '创意爆棚', '自由灵魂', '感染力强'],
    description: '你是真正自由的精神，热情、有创造力、善于社交。你看到的是无限可能，总能感染周围的人，让生活充满乐趣和意义。',
    strengths: ['极强的创造力和热情', '出色的人际关系能力', '适应性强且思想开放'],
    weaknesses: ['可能难以专注于一件事', '有时过于理想化', '不擅长处理细节'],
    careers: ['记者', '演员', '市场营销', '创意总监'],
    famousPeople: ['罗宾·威廉姆斯', '威尔·史密斯', '安妮·弗兰克']
  },
  'ISTJ': {
    type: 'ISTJ',
    title: '物流师',
    tagline: '言出必行，一诺千金',
    emoji: '📋',
    color: '#0ea5e9',
    colorSecondary: '#38bdf8',
    tags: ['务实可靠', '条理清晰', '责任心强', '传统稳重'],
    description: '你是可靠的守护者，以正直、务实和不懈的努力著称。你重视传统和秩序，对承担的责任始终尽心尽力。',
    strengths: ['高度的责任感和可靠性', '出色的组织和执行力', '注重细节和准确性'],
    weaknesses: ['可能过于固守规则', '对变化适应较慢', '情感表达较为含蓄'],
    careers: ['会计师', '法官', '军官', '项目经理'],
    famousPeople: ['乔治·华盛顿', '沃伦·巴菲特', '安格拉·默克尔']
  },
  'ISFJ': {
    type: 'ISFJ',
    title: '守卫者',
    tagline: '默默守护你所爱的一切',
    emoji: '🛡️',
    color: '#14b8a6',
    colorSecondary: '#2dd4bf',
    tags: ['温暖体贴', '忠诚可靠', '善于照顾', '谦逊低调'],
    description: '你是最温暖的守护者，总是默默付出却不求回报。你重视人际关系，善于记住他人的需求，是最可靠的朋友和家人。',
    strengths: ['极强的责任感和奉献精神', '出色的观察力和记忆力', '善于营造和谐环境'],
    weaknesses: ['可能过度承担他人责任', '不善于表达自己需求', '面对变化可能焦虑'],
    careers: ['护士', '小学教师', '图书管理员', '行政助理'],
    famousPeople: ['特蕾莎修女', '凯特王妃', '碧昂丝']
  },
  'ESTJ': {
    type: 'ESTJ',
    title: '总经理',
    tagline: '秩序与效率至上',
    emoji: '📊',
    color: '#3b82f6',
    colorSecondary: '#60a5fa',
    tags: ['高效执行', '组织能力强', '果断务实', '责任担当'],
    description: '你是天生的组织者和管理者，善于建立秩序、制定规则。你重视传统和纪律，能够果断地带领团队完成既定目标。',
    strengths: ['出色的组织管理能力', '果断高效的执行力', '强烈的责任感'],
    weaknesses: ['可能显得过于刻板', '对他人感受不够敏感', '不善于处理模糊情境'],
    careers: ['企业管理者', '法官', '财务总监', '学校校长'],
    famousPeople: ['亨利·福特', '约翰·D·洛克菲勒', '桑德拉·戴·奥康纳']
  },
  'ESFJ': {
    type: 'ESFJ',
    title: '执政官',
    tagline: '关心每一个人的幸福',
    emoji: '🤝',
    color: '#84cc16',
    colorSecondary: '#a3e635',
    tags: ['社交达人', '热心助人', '和谐使者', '关注细节'],
    description: '你是天生的关怀者和社交家，总是关心他人的需求和感受。你善于营造温馨的氛围，是维系人际关系的重要纽带。',
    strengths: ['强大的社交和组织能力', '敏锐的情感觉察力', '乐于助人且可靠'],
    weaknesses: ['可能过度在意他人评价', '有时难以接受批评', '可能忽略自身需求'],
    careers: ['活动策划', '护士长', '人力资源', '社区工作者'],
    famousPeople: ['泰勒·斯威夫特', '休·杰克曼', '詹妮弗·洛佩兹']
  },
  'ISTP': {
    type: 'ISTP',
    title: '鉴赏家',
    tagline: '动手实践出真知',
    emoji: '🔧',
    color: '#64748b',
    colorSecondary: '#94a3b8',
    tags: ['冷静务实', '动手能力强', '善于分析', '独立自主'],
    description: '你是天生的问题解决者，善于用双手和头脑探索世界的运作方式。你冷静、务实，在危机时刻往往能做出最佳判断。',
    strengths: ['出色的问题解决能力', '冷静理性的判断力', '强大的动手和实践能力'],
    weaknesses: ['可能显得过于冷淡', '对长期承诺较为谨慎', '不善于表达情感'],
    careers: ['工程师', '飞行员', '外科医生', '侦探'],
    famousPeople: ['克林特·伊斯特伍德', '汤姆·克鲁斯', '迈克尔·乔丹']
  },
  'ISFP': {
    type: 'ISFP',
    title: '探险家',
    tagline: '活在当下的艺术家',
    emoji: '🎨',
    color: '#a855f7',
    colorSecondary: '#c084fc',
    tags: ['艺术气质', '温和善良', '灵活自由', '感受力强'],
    description: '你是真正的艺术家，用独特的方式感受和体验世界。你珍视当下的每一刻，用行动而非言语表达自己的价值观。',
    strengths: ['敏锐的审美和创造力', '善于倾听和共情', '适应性强且灵活'],
    weaknesses: ['可能过于退避冲突', '长期规划能力较弱', '对批评较为敏感'],
    careers: ['设计师', '摄影师', '兽医', '厨师'],
    famousPeople: ['迈克尔·杰克逊', '玛丽莲·梦露', 'Frida Kahlo']
  },
  'ESTP': {
    type: 'ESTP',
    title: '企业家',
    tagline: '行动胜过空想',
    emoji: '🚀',
    color: '#ef4444',
    colorSecondary: '#f87171',
    tags: ['行动派', '冒险精神', '临场应变', '精力充沛'],
    description: '你是真正的行动者，喜欢生活在当下，享受刺激和冒险。你善于察言观色，能在瞬息万变的环境中做出最佳决策。',
    strengths: ['出色的危机处理能力', '强大的行动力和执行力', '善于把握机会'],
    weaknesses: ['可能过于冲动', '对长期计划不感兴趣', '可能忽略他人感受'],
    careers: ['销售经理', '运动员', '急诊医生', '消防员'],
    famousPeople: ['唐纳德·特朗普', '麦当娜', '欧内斯特·海明威']
  },
  'ESFP': {
    type: 'ESFP',
    title: '表演者',
    tagline: '人生就是一场盛大的派对',
    emoji: '🎪',
    color: '#d946ef',
    colorSecondary: '#e879f9',
    tags: ['热情洋溢', '活力四射', '善于表演', '乐观开朗'],
    description: '你是天生的表演者和娱乐者，热爱生活中的每一刻。你善于创造欢乐的氛围，用你的热情和活力感染身边的每一个人。',
    strengths: ['出色的社交和表演能力', '乐观积极的生活态度', '善于创造欢乐氛围'],
    weaknesses: ['可能过于追求即时满足', '长期规划能力较弱', '可能回避严肃话题'],
    careers: ['演员', '活动主持人', '旅游导游', '健身教练'],
    famousPeople: ['玛丽莲·梦露', '艾迪·乔治', '威尔·史密斯']
  }
}

// 根据类型获取 Profile
export function getMBTIProfile(type: string): MBTIProfile | null {
  return mbtiProfiles[type.toUpperCase()] || null
}

// 获取维度对比数据
export interface DimensionComparison {
  dimension: string
  leftLabel: string
  leftLetter: string
  rightLabel: string
  rightLetter: string
  leftPercentage: number
  rightPercentage: number
  activeLeft: boolean
}

export function getDimensionComparisons(dimensions: any[]): DimensionComparison[] {
  const comparisons: DimensionComparison[] = []

  const dimensionMap: Record<string, { left: string; leftL: string; right: string; rightL: string }> = {
    'EI': { left: '外向', leftL: 'E', right: '内向', rightL: 'I' },
    'SN': { left: '实感', leftL: 'S', right: '直觉', rightL: 'N' },
    'TF': { left: '理性', leftL: 'T', right: '情感', rightL: 'F' },
    'JP': { left: '计划', leftL: 'J', right: '随性', rightL: 'P' }
  }

  dimensions.forEach(dim => {
    const config = dimensionMap[dim.dimension]
    if (!config) return

    // rawScore > 0 表示偏向左侧，< 0 偏向右侧
    const rawScore = dim.rawScore || 0
    const percentage = dim.percentage || 50

    // 计算两侧百分比
    const isLeftDominant = rawScore >= 0
    const leftPct = isLeftDominant ? percentage : 100 - percentage
    const rightPct = 100 - leftPct

    comparisons.push({
      dimension: dim.dimension,
      leftLabel: config.left,
      leftLetter: config.leftL,
      rightLabel: config.right,
      rightLetter: config.rightL,
      leftPercentage: Math.round(leftPct),
      rightPercentage: Math.round(rightPct),
      activeLeft: isLeftDominant
    })
  })

  return comparisons
}
