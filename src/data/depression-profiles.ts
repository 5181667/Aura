// 抑郁测试 Profile 数据

export interface DepressionProfile {
  level: string
  title: string
  tagline: string
  emoji: string
  color: string
  colorSecondary: string
  description: string
  suggestion: string
  selfCareSteps: string[]
  warningNote: string
}

export const depressionProfiles: Record<string, DepressionProfile> = {
  'none': {
    level: 'none',
    title: '心理状态良好',
    tagline: '继续保持阳光心态',
    emoji: '☀️',
    color: '#22c55e',
    colorSecondary: '#4ade80',
    description: '您目前没有明显的抑郁症状，心理状态良好。请继续保持积极健康的生活方式。',
    suggestion: '虽然目前状态良好，但日常心理保健仍然重要。',
    selfCareSteps: [
      '保持规律的作息和充足睡眠',
      '坚持适量的体育运动',
      '维持良好的社交关系和支持网络',
      '培养有意义的兴趣爱好',
      '学习压力管理和放松技巧'
    ],
    warningNote: ''
  },
  'mild': {
    level: 'mild',
    title: '轻度情绪波动',
    tagline: '及时关注，积极调整',
    emoji: '🌤️',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    description: '您可能正在经历一些情绪上的起伏，这在日常生活中是比较常见的。通过积极的自我调节，大多数人可以有效改善。',
    suggestion: '关注自己的情绪变化，如果持续超过两周且未见好转，建议咨询专业人士。',
    selfCareSteps: [
      '每天进行至少30分钟的有氧运动',
      '保持与亲朋好友的定期沟通',
      '尝试正念冥想或深呼吸练习',
      '减少独处时间，多参加社交活动',
      '保持规律饮食和睡眠',
      '记录情绪日记，觉察情绪变化'
    ],
    warningNote: '如果这些症状持续两周以上且逐渐加重，请考虑寻求专业帮助。'
  },
  'moderate': {
    level: 'moderate',
    title: '需要关注',
    tagline: '寻求帮助是勇敢的选择',
    emoji: '🌥️',
    color: '#f97316',
    colorSecondary: '#fb923c',
    description: '您的评分显示存在中度抑郁症状，这些症状可能已经开始影响您的日常生活质量。及时的专业干预可以带来显著的改善。',
    suggestion: '强烈建议尽快预约心理咨询师或精神科医生进行专业评估和指导。',
    selfCareSteps: [
      '尽快预约专业心理咨询或精神科就诊',
      '告诉一位你信任的人你现在的感受',
      '尽量保持基本的日常作息',
      '即使没有动力也要坚持基本的自我照顾',
      '避免做重大决定，先照顾好自己',
      '减少酒精和咖啡因摄入'
    ],
    warningNote: '中度抑郁需要专业关注。请不要忽视这些信号，寻求帮助不是软弱的表现。'
  },
  'moderately_severe': {
    level: 'moderately_severe',
    title: '请寻求专业帮助',
    tagline: '你值得被帮助和支持',
    emoji: '🌧️',
    color: '#ef4444',
    colorSecondary: '#f87171',
    description: '您正在经历较为严重的抑郁症状。请知道这不是您的错，抑郁症是一种可以治疗的疾病。专业的帮助能够让您恢复健康。',
    suggestion: '请尽快寻求精神科医生或心理治疗师的帮助。药物治疗联合心理治疗通常效果最好。',
    selfCareSteps: [
      '立即预约精神科医生或心理治疗师',
      '让家人或亲密朋友知道你的状况',
      '不要独自面对，接受他人的帮助',
      '遵医嘱进行治疗，不要自行停药',
      '保持最基本的生活节奏',
      '记住：这是暂时的，你会好起来的'
    ],
    warningNote: '中重度抑郁需要专业治疗。请尽快就医，不要独自承受。'
  },
  'severe': {
    level: 'severe',
    title: '请立即寻求帮助',
    tagline: '你不是一个人在战斗',
    emoji: '🆘',
    color: '#dc2626',
    colorSecondary: '#ef4444',
    description: '您目前的症状非常严重，需要立即获得专业医疗帮助。请记住，重度抑郁是一种疾病，通过正确的治疗完全可以康复。',
    suggestion: '请立即联系精神科医生或前往医院急诊。如果有自伤想法，请立即拨打心理援助热线。',
    selfCareSteps: [
      '立即拨打心理援助热线或前往最近医院',
      '不要独处，立刻联系你信任的人',
      '远离可能造成伤害的物品',
      '告诉医生你所有的症状和感受',
      '配合专业治疗方案',
      '相信自己一定能够康复'
    ],
    warningNote: '如果您有自伤或自杀念头，请立即拨打24小时心理援助热线：400-161-9995 或 010-82951332'
  }
}

// 根据分数获取 Profile（30题 × 3分 = 满分90）
export function getDepressionProfile(score: number): DepressionProfile {
  const s = parseInt(String(score)) || 0
  if (s <= 14) return depressionProfiles.none
  if (s <= 29) return depressionProfiles.mild
  if (s <= 44) return depressionProfiles.moderate
  if (s <= 59) return depressionProfiles.moderately_severe
  return depressionProfiles.severe
}
