// EQ 情商 Profile 数据

export interface EQProfile {
  level: string
  title: string
  tagline: string
  emoji: string
  color: string
  colorSecondary: string
  tags: string[]
  description: string
  strengths: string[]
  improvements: string[]
  tips: string[]
}

export interface EQDimensionProfile {
  dimension: string
  label: string
  emoji: string
  color: string
  highDesc: string
  lowDesc: string
  tips: string[]
}

// EQ 综合等级画像
export const eqLevelProfiles: Record<string, EQProfile> = {
  'excellent': {
    level: 'excellent',
    title: '情商大师',
    tagline: '以情商驾驭人生',
    emoji: '👑',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    tags: ['情绪掌控', '社交达人', '领导魅力', '深度共情'],
    description: '你拥有令人钦佩的情商水平！你能精准识别和管理自己的情绪，同时对他人的感受也有敏锐的洞察力。你在人际交往中游刃有余，善于化解矛盾、激励他人。你的情商是你最强大的软实力。',
    strengths: ['精准的情绪自我认知和管理', '卓越的共情能力和社交技巧', '在压力和冲突中保持优雅', '善于激励和影响他人'],
    improvements: ['注意避免过度共情导致情绪负担', '保持真实，不过度迎合他人', '持续学习新的情绪管理技巧'],
    tips: ['将你的情商优势运用在领导力和团队建设中', '成为他人情绪管理的导师和榜样', '关注自身心理健康，保持能量充沛']
  },
  'good': {
    level: 'good',
    title: '情绪智者',
    tagline: '理性与感性的完美融合',
    emoji: '🌟',
    color: '#22c55e',
    colorSecondary: '#4ade80',
    tags: ['善于沟通', '情绪稳定', '同理心强', '适应力佳'],
    description: '你具有良好的情商基础，在大多数情况下能有效管理自己的情绪并理解他人。你的社交能力让你在工作和生活中建立了不错的人际关系。只需在某些维度再精进，你就能达到更高的境界。',
    strengths: ['大部分情况下能有效管理情绪', '具备良好的沟通和社交技巧', '能在多数冲突中保持理性', '有一定的共情和影响力'],
    improvements: ['在高压情境下可以进一步提升冷静度', '深化对微妙情绪变化的感知力', '学习更高级的谈判和影响技巧'],
    tips: ['通过正念冥想进一步提升自我觉察', '在复杂社交场景中刻意练习', '阅读情商相关书籍持续精进']
  },
  'average': {
    level: 'average',
    title: '成长进行时',
    tagline: '每一天都在变得更好',
    emoji: '🌱',
    color: '#3b82f6',
    colorSecondary: '#60a5fa',
    tags: ['发展潜力', '基础扎实', '有待提升', '成长空间'],
    description: '你的情商处于平均水平，已经具备了一定的情绪管理和社交基础。你在熟悉的环境中表现不错，但在复杂或高压的人际情境中可能还需要更多练习。好消息是——情商完全可以通过学习和练习来提升！',
    strengths: ['在日常情境中能基本管理情绪', '有一定的人际交往能力', '具备提升情商的意愿和基础', '在舒适区内表现良好'],
    improvements: ['提升识别和命名复杂情绪的能力', '加强在压力下的情绪控制', '培养更深层的共情能力', '学习系统的情绪管理方法'],
    tips: ['每天花5分钟进行情绪日记记录', '学习非暴力沟通技巧', '在社交场合中主动练习倾听', '寻找一位情商高的人作为学习榜样']
  },
  'developing': {
    level: 'developing',
    title: '潜力待发掘',
    tagline: '认知是改变的开始',
    emoji: '🌅',
    color: '#f97316',
    colorSecondary: '#fb923c',
    tags: ['成长期', '需要关注', '潜力巨大', '积极学习'],
    description: '你的情商目前还有较大的提升空间，但这绝不意味着局限。认识到自己的发展方向本身就是情商提升的第一步。通过系统学习和日常练习，你完全有能力大幅提升自己的情绪智力。',
    strengths: ['勇于面对自己的不足', '具有改变的意愿和动力', '坦诚和直接的沟通风格', '在逻辑和理性方面可能有优势'],
    improvements: ['系统学习情绪识别和管理', '培养对他人情绪的敏感度', '练习在冲突中控制冲动反应', '建立稳定的情绪调节策略'],
    tips: ['从简单的情绪命名开始练习', '每天进行10分钟正念冥想', '学习观察他人的面部表情和肢体语言', '在交流中学会先暂停、再回应']
  },
  'low': {
    level: 'low',
    title: '蓄势待发',
    tagline: '每段旅程都始于第一步',
    emoji: '🌱',
    color: '#ef4444',
    colorSecondary: '#f87171',
    tags: ['起步阶段', '需要支持', '巨大潜力', '专业指导'],
    description: '你的情商维度目前处于起步阶段，这意味着你在情绪管理和人际交往方面面临一些挑战。但请记住，情商是可以通过训练大幅提升的。建议寻求专业指导，系统性地培养情绪智力。',
    strengths: ['敢于正视自己的发展需求', '通过测试展现了自我提升的意愿', '理性思维可能是独特优势'],
    improvements: ['需要建立基础的情绪认知框架', '学习识别基本情绪类型', '培养最基本的共情能力', '建立人际交往的基本技巧'],
    tips: ['强烈建议阅读《情商》一书', '考虑参加情商培训课程或工作坊', '寻找专业心理咨询师的指导', '从每天记录3种情绪开始练习']
  }
}

// EQ 各维度画像
export const eqDimensionProfiles: Record<string, EQDimensionProfile> = {
  'SA': {
    dimension: 'SA',
    label: '自我认知',
    emoji: '🪞',
    color: '#8b5cf6',
    highDesc: '你对自己的情绪有清晰的认知，能准确识别当下的情感状态和产生原因。这种自我觉察力是情商的基石。',
    lowDesc: '你可能在识别和理解自己情绪方面还有成长空间。有时候你可能不太确定自己为什么会有某种情绪反应。',
    tips: ['每天进行"情绪检查"——停下来问自己"我现在感受如何？"', '写情绪日记记录引发情绪的事件和反应', '学习情绪词汇表，精确命名你的感受']
  },
  'SM': {
    dimension: 'SM',
    label: '自我管理',
    emoji: '🎮',
    color: '#06b6d4',
    highDesc: '你善于调节自己的情绪，在压力和挑战面前能保持冷静和专注。你不会让冲动的情绪主导你的行为和决策。',
    lowDesc: '你在情绪调节方面还可以加强。面对压力或冲突时，情绪可能会影响你的判断和行为。',
    tips: ['学习"暂停-呼吸-回应"技巧替代冲动反应', '建立个人情绪冷静方案（散步、深呼吸等）', '练习重新评估情境来转换情绪视角']
  },
  'MO': {
    dimension: 'MO',
    label: '自我激励',
    emoji: '🔥',
    color: '#f59e0b',
    highDesc: '你具有强大的内驱力，能在挫折面前保持积极和乐观。你善于自我激励，为目标持续努力。',
    lowDesc: '你在保持长期动力和面对挫折时可能需要更多支持。找到你的内在驱动力会帮助你走得更远。',
    tips: ['设定清晰且有意义的个人目标', '将大目标拆解为每日可完成的小任务', '培养"成长型思维"——将失败视为学习机会']
  },
  'EM': {
    dimension: 'EM',
    label: '同理心',
    emoji: '💗',
    color: '#ec4899',
    highDesc: '你具有出色的共情能力，能敏锐地感知他人的情绪和需求。你的理解和包容让周围的人感到被看见和重视。',
    lowDesc: '你在理解他人情绪和立场方面还可以提升。有时你可能难以察觉到他人微妙的情绪变化。',
    tips: ['练习"积极倾听"——不急于回应，先充分理解对方', '尝试从对方角度重新思考问题', '观察他人的面部表情和肢体语言']
  },
  'SS': {
    dimension: 'SS',
    label: '社交技能',
    emoji: '🤝',
    color: '#10b981',
    highDesc: '你在人际交往中如鱼得水，善于建立和维护良好关系。你能有效地沟通、合作和处理社交情境中的各种挑战。',
    lowDesc: '你在社交互动方面还有提升空间。复杂的人际情境可能让你感到不适或不知如何应对。',
    tips: ['在安全的环境中练习主动发起对话', '学习并练习"反馈三明治"等沟通技巧', '关注他人的积极面并真诚地表达赞赏']
  }
}

// 根据 EQ 分数获取等级 Profile
export function getEQProfile(score: number): EQProfile {
  if (score >= 80) return eqLevelProfiles.excellent
  if (score >= 60) return eqLevelProfiles.good
  if (score >= 40) return eqLevelProfiles.average
  if (score >= 20) return eqLevelProfiles.developing
  return eqLevelProfiles.low
}
