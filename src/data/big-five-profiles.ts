// 大五人格 Profile 数据

export interface BigFiveProfile {
  level: string           // 'high' | 'low'
  title: string           // 角色名称
  tagline: string         // 核心标语
  emoji: string
  color: string
  colorSecondary: string
  tags: string[]
  description: string
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  tips: string[]          // 改善建议
}

export interface BigFiveOverallProfile {
  code: string            // 如 "O+C+E-A+N-"
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
}

// 各维度高低解读
export const bigFiveDimensionProfiles: Record<string, Record<string, BigFiveProfile>> = {
  'O': {
    high: {
      level: 'high',
      title: '创意探索者',
      tagline: '世界是一本等待被翻开的书',
      emoji: '🎨',
      color: '#a855f7',
      colorSecondary: '#c084fc',
      tags: ['想象力丰富', '好奇心旺盛', '创新思维', '审美敏锐'],
      description: '你对世界充满好奇，热爱艺术与新鲜体验。你善于跳出思维框架，对抽象概念和哲学问题有浓厚兴趣，是天生的创意者和探险家。',
      strengths: ['创造力出众，善于提出新颖想法', '思维开放，乐于接受不同观点', '审美品味独到，对美有敏锐感知'],
      weaknesses: ['可能过于理想化，脱离实际', '注意力容易被新事物分散', '对枯燥重复的工作缺乏耐心'],
      careers: ['设计师', '艺术家', '作家', '创意总监', '科研工作者'],
      tips: ['将创意转化为实际行动计划', '学会在创新与可行性间取得平衡', '培养完成项目的毅力']
    },
    low: {
      level: 'low',
      title: '务实行动派',
      tagline: '脚踏实地，步步为营',
      emoji: '🔧',
      color: '#78716c',
      colorSecondary: '#a8a29e',
      tags: ['务实稳健', '注重实际', '传统可靠', '专注细节'],
      description: '你是务实的行动者，偏好具体明确的事物。你重视经验和传统，善于在已知领域深耕，是团队中最可靠的执行者。',
      strengths: ['脚踏实地，注重实际可操作性', '在熟悉领域表现出色', '对细节敏感，执行力强'],
      weaknesses: ['可能对新观念持保守态度', '在快速变化环境中适应较慢', '可能忽视创新的价值'],
      careers: ['工程师', '会计师', '项目经理', '质量管理', '行政管理'],
      tips: ['定期尝试新事物以拓展视野', '保持对行业新趋势的关注', '学会欣赏不同的思维方式']
    }
  },
  'C': {
    high: {
      level: 'high',
      title: '高效管理者',
      tagline: '有条不紊，使命必达',
      emoji: '📋',
      color: '#0ea5e9',
      colorSecondary: '#38bdf8',
      tags: ['自律严谨', '目标导向', '有序规划', '守信可靠'],
      description: '你是天生的组织者，做事有条不紊，计划周密。你对自己和工作有很高的标准，在时间管理和任务执行方面表现出色。',
      strengths: ['优秀的自律和时间管理能力', '高度的责任心和可靠性', '善于制定和执行长期计划'],
      weaknesses: ['可能过于追求完美而产生焦虑', '对变化和混乱感到不适', '有时对他人的随意态度难以容忍'],
      careers: ['项目经理', '财务分析师', '外科医生', '质量控制专家', '律师'],
      tips: ['学会适当放松对完美的追求', '培养面对不确定性的弹性', '给自己留出自由探索的时间']
    },
    low: {
      level: 'low',
      title: '自由灵魂',
      tagline: '人生不设限',
      emoji: '🌊',
      color: '#14b8a6',
      colorSecondary: '#2dd4bf',
      tags: ['灵活随性', '即兴创作', '轻松自在', '适应力强'],
      description: '你是自由不羁的灵魂，不喜欢被规则和计划束缚。你善于随机应变，在即兴发挥中往往能迸发出意想不到的灵感。',
      strengths: ['高度的灵活性和适应力', '善于即兴发挥和抓住机会', '在压力下仍能保持轻松心态'],
      weaknesses: ['可能缺乏条理导致效率下降', '截止日期管理可能是挑战', '有时难以坚持长期目标'],
      careers: ['自由职业者', '探险家', '即兴表演者', '创业者', '记者'],
      tips: ['建立简单的日程管理习惯', '设定小目标逐步培养自律', '找到兴趣驱动的任务来练习坚持']
    }
  },
  'E': {
    high: {
      level: 'high',
      title: '社交明星',
      tagline: '人群中最闪耀的存在',
      emoji: '🌟',
      color: '#f59e0b',
      colorSecondary: '#fbbf24',
      tags: ['热情外向', '精力充沛', '善于社交', '乐观积极'],
      description: '你是天生的社交达人，在人群中如鱼得水。你的热情和感染力能点亮每一个房间，善于建立广泛的人脉网络。',
      strengths: ['出色的人际交往和沟通能力', '精力旺盛，行动力强', '善于激发团队活力和氛围'],
      weaknesses: ['可能不够重视独处和深度思考', '有时说得多做得少', '可能过于依赖外部社交刺激'],
      careers: ['销售经理', '公关专家', '主持人', '教师', '团队负责人'],
      tips: ['每天安排独处时间进行深度思考', '学会倾听不只是表达', '培养在安静中找到能量的能力']
    },
    low: {
      level: 'low',
      title: '深度思考者',
      tagline: '沉默中蕴含力量',
      emoji: '📚',
      color: '#6366f1',
      colorSecondary: '#818cf8',
      tags: ['内向沉稳', '独立思考', '深度专注', '善于观察'],
      description: '你在安静的环境中才能发挥最佳状态。你善于深度思考和独立工作，在观察和分析方面有独到的见解。',
      strengths: ['出色的独立思考和分析能力', '善于深度专注，产出高质量成果', '丰富的内心世界和洞察力'],
      weaknesses: ['大型社交场合可能感到疲惫', '可能错过需要主动争取的机会', '表达想法时可能不够主动'],
      careers: ['研究员', '作家', '程序员', '心理咨询师', '艺术家'],
      tips: ['每周设定一个小社交目标', '学会在小团体中分享观点', '利用文字表达弥补口头表达的不足']
    }
  },
  'A': {
    high: {
      level: 'high',
      title: '和谐使者',
      tagline: '善意是最强大的力量',
      emoji: '🤝',
      color: '#22c55e',
      colorSecondary: '#4ade80',
      tags: ['友善合作', '善解人意', '乐于助人', '包容大度'],
      description: '你是团队中的黏合剂，善于感知他人的需求和情绪。你重视和谐关系，愿意妥协和牺牲来维护团队的凝聚力。',
      strengths: ['出色的同理心和团队协作能力', '善于化解矛盾、建立信任', '创造温暖包容的人际环境'],
      weaknesses: ['可能过于迁就他人而忽视自己', '在需要竞争时可能过于退让', '难以对他人说"不"'],
      careers: ['护理师', '人力资源', '社工', '教师', '心理咨询师'],
      tips: ['学习设定健康的个人边界', '意识到适当的冲突是健康的', '在满足他人需求前先照顾好自己']
    },
    low: {
      level: 'low',
      title: '独立挑战者',
      tagline: '真实比讨好更重要',
      emoji: '⚡',
      color: '#ef4444',
      colorSecondary: '#f87171',
      tags: ['直接坦率', '独立自主', '竞争意识', '敢于挑战'],
      description: '你是直率的真相追求者，不会为了维持表面和平而隐藏观点。你在竞争中能保持冷静客观，敢于做出不受欢迎但正确的决定。',
      strengths: ['敢于直言不讳，表达真实想法', '在谈判和竞争中表现出色', '不会被情感左右客观判断'],
      weaknesses: ['可能无意中伤害他人感受', '团队合作中可能显得强硬', '可能忽视维护人际关系的重要性'],
      careers: ['律师', '企业家', '投资人', '评论家', '竞技运动员'],
      tips: ['在表达批评前先确认对方的感受', '学习使用更委婉的沟通方式', '投资时间维护重要的人际关系']
    }
  },
  'N': {
    high: {
      level: 'high',
      title: '敏感洞察者',
      tagline: '感受是认知世界的天赋',
      emoji: '🌙',
      color: '#ec4899',
      colorSecondary: '#f472b6',
      tags: ['情绪敏感', '直觉敏锐', '共情能力', '深度感受'],
      description: '你拥有敏锐的情绪感知力，能够深刻体验生活中的喜怒哀乐。这种敏感让你对艺术和人际关系有独特的理解力。',
      strengths: ['对情绪和氛围有敏锐的感知力', '在创意和艺术领域有天赋', '能深刻理解他人的痛苦和喜悦'],
      weaknesses: ['容易受到情绪波动的影响', '面对压力时可能反应过度', '可能过度担忧还未发生的事情'],
      careers: ['艺术家', '心理咨询师', '作家', '音乐人', '社会工作者'],
      tips: ['建立规律的情绪管理练习（冥想、运动）', '学会区分想象的担忧和真实的威胁', '建立稳定的社交支持系统']
    },
    low: {
      level: 'low',
      title: '沉稳磐石',
      tagline: '风暴中最安定的存在',
      emoji: '🪨',
      color: '#059669',
      colorSecondary: '#10b981',
      tags: ['情绪稳定', '冷静沉着', '抗压力强', '乐观淡定'],
      description: '你是情绪稳定的代表，在压力和危机面前能保持冷静。你不容易被负面情绪左右，是团队中可靠的定心丸。',
      strengths: ['出色的抗压能力和情绪管理', '在危机时刻保持冷静判断', '情绪的稳定性让周围人安心'],
      weaknesses: ['可能不够重视自己和他人的情感需求', '对情绪波动较大的人可能缺乏理解', '有时忽视情绪信号'],
      careers: ['急救医生', '危机谈判专家', '高管', '飞行员', '消防员'],
      tips: ['留意那些被忽视的微妙情绪信号', '试着更主动地表达关心和共情', '理解情绪敏感不等于脆弱']
    }
  }
}

// 根据维度百分比获取综合画像
export function getBigFiveProfile(dimensions: { dimension: string; percentage: number; label?: string }[]): BigFiveOverallProfile {
  const dimMap: Record<string, number> = {}
  dimensions.forEach(d => { dimMap[d.dimension] = d.percentage })

  // 找到最突出的维度
  const sorted = [...dimensions].sort((a, b) => Math.abs(b.percentage - 50) - Math.abs(a.percentage - 50))
  const dominant = sorted[0]
  const dominantProfile = bigFiveDimensionProfiles[dominant.dimension]?.[dominant.percentage >= 50 ? 'high' : 'low']

  // 生成代码
  const code = ['O', 'C', 'E', 'A', 'N'].map(d => `${d}${(dimMap[d] || 50) >= 50 ? '+' : '-'}`).join('')

  // 综合标签
  const allTags: string[] = []
  const allStrengths: string[] = []
  const allWeaknesses: string[] = []
  const allCareers: string[] = []

  for (const dim of ['O', 'C', 'E', 'A', 'N']) {
    const pct = dimMap[dim] || 50
    const profile = bigFiveDimensionProfiles[dim]?.[pct >= 50 ? 'high' : 'low']
    if (profile) {
      allTags.push(profile.tags[0])
      allStrengths.push(profile.strengths[0])
      allWeaknesses.push(profile.weaknesses[0])
      allCareers.push(profile.careers[0])
    }
  }

  // 综合画像颜色用最突出维度
  const profileMap: Record<string, { title: string; tagline: string; emoji: string; description: string; famousPeople: string[] }> = {
    'O_high': { title: '创意探索型人格', tagline: '用想象力重塑世界', emoji: '🎨', description: '你的大五人格画像以高开放性为核心特征，展现出丰富的想象力和创造潜能。你渴望新体验、新知识，善于跳出常规思维。', famousPeople: ['达·芬奇', '乔布斯', '宫崎骏'] },
    'O_low': { title: '稳健务实型人格', tagline: '以经验构建可靠世界', emoji: '🏗️', description: '你的大五人格画像以务实性为核心特征，偏好成熟稳定的方案。你在执行层面表现出色，是团队中最可靠的基石。', famousPeople: ['沃伦·巴菲特', '安格拉·默克尔', '伊丽莎白二世'] },
    'C_high': { title: '卓越自律型人格', tagline: '以计划成就非凡', emoji: '🎯', description: '你的大五人格画像以高尽责性为核心特征，展现出卓越的自我管理和执行力。你设定清晰目标并坚定执行，是他人信赖的榜样。', famousPeople: ['蒂姆·库克', '科比·布莱恩特', '撒切尔夫人'] },
    'C_low': { title: '灵活自由型人格', tagline: '随风而行，随遇而安', emoji: '🦅', description: '你的大五人格画像以灵活性为核心特征，不被条框束缚。你善于在变化中发现机会，即兴发挥常带来意想不到的成果。', famousPeople: ['杰克·凯鲁亚克', '理查德·布兰森', '切·格瓦拉'] },
    'E_high': { title: '活力社交型人格', tagline: '人群是我的能量源泉', emoji: '🌟', description: '你的大五人格画像以高外向性为核心特征，在社交互动中获得巨大能量。你天生具备感染力，能迅速与他人建立联系。', famousPeople: ['奥普拉·温弗瑞', '比尔·克林顿', '成龙'] },
    'E_low': { title: '内省深思型人格', tagline: '在宁静中找到智慧', emoji: '🌌', description: '你的大五人格画像以内向性为核心特征，在独处中获得力量和灵感。你有丰富的内心世界，善于产出深度而精炼的洞见。', famousPeople: ['爱因斯坦', 'J.K.罗琳', '甘地'] },
    'A_high': { title: '温暖利他型人格', tagline: '善意让世界更美好', emoji: '💚', description: '你的大五人格画像以高宜人性为核心特征，天生具备共情和关怀的力量。你是团队的粘合剂，善于创造和谐氛围。', famousPeople: ['特蕾莎修女', '曼德拉', '黛安娜王妃'] },
    'A_low': { title: '理性独立型人格', tagline: '清醒比温暖更有力量', emoji: '🗡️', description: '你的大五人格画像以独立性为核心特征，不轻易被群体压力左右。你在竞争和决策中保持冷静客观，敢于坚持自己的判断。', famousPeople: ['史蒂夫·乔布斯', '西蒙·考威尔', '安·兰德'] },
    'N_high': { title: '敏感直觉型人格', tagline: '感受力是隐藏的超能力', emoji: '🦋', description: '你的大五人格画像以高情绪敏感度为核心特征，拥有超越常人的感知力。这种敏感让你在创意和人际理解方面有独特天赋。', famousPeople: ['文森特·梵高', '弗吉尼亚·伍尔夫', '肖邦'] },
    'N_low': { title: '坚韧沉稳型人格', tagline: '内心平静，外在从容', emoji: '⛰️', description: '你的大五人格画像以高情绪稳定性为核心特征，在风浪中始终保持镇定。你是危机中的定海神针，给周围人带来安全感。', famousPeople: ['丘吉尔', '马云', '沃伦·巴菲特'] }
  }

  const key = `${dominant.dimension}_${dominant.percentage >= 50 ? 'high' : 'low'}`
  const overall = profileMap[key] || profileMap['O_high']

  return {
    code,
    title: overall.title,
    tagline: overall.tagline,
    emoji: overall.emoji,
    color: dominantProfile?.color || '#8b5cf6',
    colorSecondary: dominantProfile?.colorSecondary || '#a78bfa',
    tags: allTags,
    description: overall.description,
    strengths: allStrengths,
    weaknesses: allWeaknesses,
    careers: allCareers,
    famousPeople: overall.famousPeople
  }
}

// 获取单维度解读
export function getBigFiveDimensionProfile(dimension: string, percentage: number): BigFiveProfile | null {
  const profiles = bigFiveDimensionProfiles[dimension]
  if (!profiles) return null
  return percentage >= 50 ? profiles.high : profiles.low
}
