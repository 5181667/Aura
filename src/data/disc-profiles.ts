// DISC 行为风格 Profile 数据

export interface DISCProfile {
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
  communicationStyle: string
  leadershipStyle: string
  stressResponse: string
  idealEnvironment: string
}

export const discProfiles: Record<string, DISCProfile> = {
  'D': {
    type: 'D',
    title: '支配型 · 开拓者',
    tagline: '行动说明一切',
    emoji: '🦁',
    color: '#ef4444',
    colorSecondary: '#f87171',
    tags: ['果断决策', '结果导向', '敢于冒险', '竞争意识'],
    description: '你是天生的领导者和行动派，追求效率和结果。你敢于接受挑战，在压力下反而能迸发出惊人的能量。你直接果断的风格让你成为解决问题的关键人物。',
    strengths: ['快速决策，行动力超强', '在困难面前敢于担当', '善于抓住核心问题，直奔结果', '天生的开拓精神和冒险魄力'],
    weaknesses: ['可能忽视他人感受和细节', '急于求成，缺乏耐心', '沟通风格过于直接可能造成冲突', '有时独断专行，忽视团队意见'],
    careers: ['CEO / 创始人', '业务总监', '军事指挥官', '外科医生', '运动队教练'],
    famousPeople: ['史蒂夫·乔布斯', '杰夫·贝索斯', '玛格丽特·撒切尔', '迈克尔·乔丹'],
    communicationStyle: '简洁直接，只讲重点。你不喜欢拐弯抹角，习惯用最短的时间传递最核心的信息。',
    leadershipStyle: '命令式领导，以身作则。你会设定高目标，用行动带动团队，要求效率和成果。',
    stressResponse: '压力反而激发你的斗志。你会更加聚焦目标、加快行动节奏，但也可能变得急躁和专制。',
    idealEnvironment: '快节奏、挑战性强、有明确目标和充分自主权的工作环境。'
  },
  'I': {
    type: 'I',
    title: '影响型 · 社交家',
    tagline: '让每一天都充满欢笑',
    emoji: '🎭',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    tags: ['热情感染', '乐观积极', '善于表达', '人脉广泛'],
    description: '你是天生的社交达人，拥有感染他人的魅力。你的热情和乐观能点亮任何场合，善于用你的影响力激励和带动周围的人。你重视人际关系，享受被认可和关注的感觉。',
    strengths: ['超强的感染力和表达能力', '善于激励和鼓舞他人', '创意丰富，思维活跃', '人脉资源广泛，社交能力出色'],
    weaknesses: ['有时过于乐观忽视风险', '可能不够关注细节和执行', '容易受情绪驱动做决策', '有时承诺过多难以全部兑现'],
    careers: ['销售总监', '公关经理', '主持人 / 演讲者', '培训师', '市场营销总监'],
    famousPeople: ['奥普拉·温弗瑞', '威尔·史密斯', '理查德·布兰森', '马云'],
    communicationStyle: '热情洋溢，善用故事和幽默。你在沟通中注重情感连接，喜欢营造轻松愉快的氛围。',
    leadershipStyle: '激励式领导，以魅力带人。你善于用愿景和热情感染团队，让每个人都充满干劲。',
    stressResponse: '压力下你可能变得更加情绪化和话多。你需要通过社交互动来释放压力，独处时反而更焦虑。',
    idealEnvironment: '开放协作、社交互动丰富、能获得认可和展示机会的工作环境。'
  },
  'S': {
    type: 'S',
    title: '稳健型 · 守护者',
    tagline: '稳如磐石，温暖如光',
    emoji: '🐢',
    color: '#22c55e',
    colorSecondary: '#4ade80',
    tags: ['可靠稳定', '耐心温和', '团队至上', '善于倾听'],
    description: '你是团队中最可靠的存在，以稳定和忠诚著称。你善于倾听，重视和谐关系，总是默默支持身边的人。你的耐心和毅力让你成为长期项目中不可或缺的核心力量。',
    strengths: ['出色的耐心和持久力', '善于倾听和理解他人', '高度的忠诚和可靠性', '创造稳定和谐的团队氛围'],
    weaknesses: ['面对突变时适应较慢', '难以拒绝他人的要求', '可能回避必要的冲突', '有时过于安于现状，缺乏进取心'],
    careers: ['护士 / 医疗工作者', '客服经理', '人力资源专家', '行政主管', '教师'],
    famousPeople: ['甘地', '特蕾莎修女', '黛安娜王妃', '罗杰斯先生'],
    communicationStyle: '温和耐心，善于倾听。你在沟通中给对方充分的表达空间，让人感到被尊重和理解。',
    leadershipStyle: '服务式领导，以支持带人。你会确保每个成员都被照顾到，营造安全信任的团队文化。',
    stressResponse: '压力下你可能变得更加沉默和退缩。你需要时间独自消化情绪，之后才能恢复稳定状态。',
    idealEnvironment: '稳定和谐、节奏适中、有清晰流程和支持性团队的工作环境。'
  },
  'C': {
    type: 'C',
    title: '谨慎型 · 分析师',
    tagline: '细节决定一切',
    emoji: '🔍',
    color: '#3b82f6',
    colorSecondary: '#60a5fa',
    tags: ['精确严谨', '逻辑分析', '追求卓越', '注重品质'],
    description: '你是数据和逻辑的守护者，对质量和精确性有近乎偏执的追求。你善于发现规律、分析问题，在需要深度思考和精确执行的领域无人能及。',
    strengths: ['卓越的分析能力和逻辑思维', '对细节和质量的极致追求', '系统化的工作方法', '客观理性，不被情绪左右'],
    weaknesses: ['可能因追求完美而拖延决策', '过于注重细节可能忽视全局', '对他人的工作标准要求过高', '在快速变化中可能适应较慢'],
    careers: ['数据科学家', '审计师', '软件工程师', '科研人员', '质量管理专家'],
    famousPeople: ['比尔·盖茨', '艾萨克·牛顿', '玛丽·居里', '阿兰·图灵'],
    communicationStyle: '精准克制，数据驱动。你在沟通中注重事实依据，表达严谨有条理。',
    leadershipStyle: '专家型领导，以标准带人。你会建立清晰的流程和标准，用专业能力赢得尊重。',
    stressResponse: '压力下你可能变得更加挑剔和封闭。你会深入数据寻找确定性，有时陷入过度分析的困境。',
    idealEnvironment: '有序规范、重视质量和专业性、有充足时间进行深度分析的工作环境。'
  }
}

// 根据主导维度获取 Profile
export function getDISCProfile(score: string): DISCProfile {
  const primaryType = score.charAt(0)
  return discProfiles[primaryType] || discProfiles['D']
}

// 获取组合类型名
export function getDISCComboName(score: string): string {
  const comboNames: Record<string, string> = {
    'DI': '开拓影响型', 'DS': '驱动稳健型', 'DC': '精准执行型',
    'ID': '魅力行动型', 'IS': '温暖感召型', 'IC': '创意分析型',
    'SD': '坚韧稳定型', 'SI': '和善支持型', 'SC': '严谨可靠型',
    'CD': '战略分析型', 'CI': '灵活精确型', 'CS': '稳定品质型'
  }
  return comboNames[score] || discProfiles[score.charAt(0)]?.title || '综合型'
}
