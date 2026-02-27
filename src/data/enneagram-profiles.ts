// 九型人格 Profile 数据

export interface EnneagramProfile {
  type: string
  title: string
  tagline: string
  emoji: string
  color: string
  colorSecondary: string
  tags: string[]
  description: string
  coreMotivation: string
  coreFear: string
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  famousPeople: string[]
  growthPath: string
  stressDirection: string   // 压力线方向
  growthDirection: string   // 成长线方向
  wingDescription: Record<string, string>  // 翼型描述
}

export const enneagramProfiles: Record<string, EnneagramProfile> = {
  '1': {
    type: '1',
    title: '完美主义者',
    tagline: '让世界变得更好是使命',
    emoji: '⚖️',
    color: '#6366f1',
    colorSecondary: '#818cf8',
    tags: ['原则坚定', '追求完美', '自律严谨', '正义感强'],
    description: '你是理想主义者，内心有一把精准的尺度来衡量一切。你追求正确和卓越，有着强烈的责任感和道德标准。你相信通过努力和自律，可以让世界变得更美好。',
    coreMotivation: '渴望做正确的事，追求完美和卓越',
    coreFear: '害怕犯错、害怕不道德或有缺陷',
    strengths: ['高度的自律和责任感', '公正公平，坚守原则', '追求卓越的工作品质', '善于发现并改进不完善之处'],
    weaknesses: ['内心批评家过于严厉', '对自己和他人要求过高', '不够灵活，难以接受不完美', '可能压抑愤怒情绪'],
    careers: ['法官/律师', '质量管理', '教师/教授', '编辑/校对', '审计师', '伦理委员会成员'],
    famousPeople: ['甘地', '撒切尔夫人', '孔子', '马丁·路德·金'],
    growthPath: '学习接受"足够好"而非完美，培养对自己的宽容和对他人的理解。当你能放松内心的批评家，你会发现更多的喜悦和自在。',
    stressDirection: '压力下趋向4号（变得情绪化和自怜）',
    growthDirection: '成长时趋向7号（变得更加开放和享受生活）',
    wingDescription: {
      '9': '1w9「理想主义者」：更加沉静、客观、有哲学思考',
      '2': '1w2「倡导者」：更加温暖、关怀他人、乐于助人'
    }
  },
  '2': {
    type: '2',
    title: '助人者',
    tagline: '爱是我给世界最好的礼物',
    emoji: '💝',
    color: '#ec4899',
    colorSecondary: '#f472b6',
    tags: ['关爱他人', '温暖热情', '善解人意', '慷慨奉献'],
    description: '你是温暖的给予者，天生具有感知他人需求的能力。你通过帮助和关爱他人来表达自己的价值，你的慷慨和热情让你成为朋友圈中最受欢迎的人。',
    coreMotivation: '渴望被爱、被需要、被感谢',
    coreFear: '害怕不被爱、不被需要',
    strengths: ['敏锐的共情力和关怀力', '慷慨大方，乐于奉献', '善于建立亲密的人际关系', '能让周围的人感到被重视'],
    weaknesses: ['常忽视自己的需求', '可能通过"帮忙"来控制关系', '需要他人的认可和感谢', '难以设定个人边界'],
    careers: ['心理咨询师', '护理师', '教师', '社工', '人力资源', '慈善组织管理'],
    famousPeople: ['特蕾莎修女', '黛安娜王妃', '德斯蒙德·图图'],
    growthPath: '学习也关爱自己，认识到你的价值不取决于被需要。当你能在照顾他人的同时照顾好自己，你的给予会更加纯粹和持久。',
    stressDirection: '压力下趋向8号（变得攻击性和控制欲强）',
    growthDirection: '成长时趋向4号（更加真实和有创造力）',
    wingDescription: {
      '1': '2w1「仆人」：更加有原则、自律、服务精神强',
      '3': '2w3「主人」：更加有魅力、有目标、善于社交'
    }
  },
  '3': {
    type: '3',
    title: '成就者',
    tagline: '卓越不是偶然，而是选择',
    emoji: '🏆',
    color: '#f59e0b',
    colorSecondary: '#fbbf24',
    tags: ['目标导向', '高效能', '适应力强', '追求卓越'],
    description: '你是天生的赢家，拥有将愿景变为现实的非凡能力。你追求成功和认可，善于设定目标并高效执行。你的自信和魅力让你在任何领域都能脱颖而出。',
    coreMotivation: '渴望成功、被认可和被尊敬',
    coreFear: '害怕失败、害怕毫无价值',
    strengths: ['出色的执行力和目标管理', '强大的适应力和社交技巧', '善于激励和带动他人', '高效能，善于利用时间和资源'],
    weaknesses: ['可能过于注重外在形象', '为了成功可能忽视真实感受', '有工作狂倾向', '可能与真实的自我脱节'],
    careers: ['企业CEO', '市场总监', '演员/公众人物', '销售冠军', '管理咨询师', '运动员'],
    famousPeople: ['奥普拉·温弗瑞', '泰勒·斯威夫特', '贝克汉姆', '董明珠'],
    growthPath: '学习与真实的自我连接，认识到你的价值不等于你的成就。当你能坦然面对脆弱，反而会获得更深层的自信和满足。',
    stressDirection: '压力下趋向9号（变得麻木和逃避）',
    growthDirection: '成长时趋向6号（变得更忠诚和关注团队）',
    wingDescription: {
      '2': '3w2「魅力者」：更加温暖、有人格魅力、善于社交',
      '4': '3w4「专业者」：更加内敛、有深度、注重品质'
    }
  },
  '4': {
    type: '4',
    title: '艺术家',
    tagline: '在平凡中发现不凡的美',
    emoji: '🎭',
    color: '#8b5cf6',
    colorSecondary: '#a78bfa',
    tags: ['独特敏感', '创意丰富', '真实性强', '感情深沉'],
    description: '你是最独特的灵魂，拥有非凡的感受力和创造力。你追求真实和独特，不愿随波逐流。你的情感深度和艺术天赋让你能创造出触动人心的作品和体验。',
    coreMotivation: '渴望独特、真实和有意义的存在',
    coreFear: '害怕平庸、害怕没有独特的身份认同',
    strengths: ['非凡的创造力和想象力', '深刻的情感感受力和表达力', '追求真实，不矫揉造作', '独特的审美眼光和品味'],
    weaknesses: ['情绪波动可能较大', '有时沉溺于忧伤和自怜', '容易与他人比较感到不足', '可能过于关注缺失的事物'],
    careers: ['艺术家/设计师', '作家/诗人', '音乐家', '心理咨询师', '品牌创意', '电影导演'],
    famousPeople: ['梵高', '弗里达·卡罗', '王家卫', '杰夫·巴克利'],
    growthPath: '学习珍惜当下拥有的，而非沉溺于缺失的。当你能在平凡中发现美好，你会发现独特性不需要通过痛苦来证明。',
    stressDirection: '压力下趋向2号（变得过度依赖和讨好）',
    growthDirection: '成长时趋向1号（变得更自律和有行动力）',
    wingDescription: {
      '3': '4w3「贵族」：更加有魅力、有目标、注重形象',
      '5': '4w5「波西米亚人」：更加内省、独立、知性'
    }
  },
  '5': {
    type: '5',
    title: '观察者',
    tagline: '知识是通往自由的钥匙',
    emoji: '🔭',
    color: '#06b6d4',
    colorSecondary: '#22d3ee',
    tags: ['深度思考', '独立自主', '观察敏锐', '知识渊博'],
    description: '你是深度的思考者和观察者，拥有强大的求知欲和分析能力。你珍视自己的时间和精力，善于在丰富的内心世界中构建完整的知识体系。',
    coreMotivation: '渴望理解世界、积累知识和能力',
    coreFear: '害怕无能、害怕被外界消耗和侵入',
    strengths: ['卓越的分析能力和洞察力', '知识面广，学习能力强', '独立思考，不受群体影响', '善于专注和深度研究'],
    weaknesses: ['可能过度疏离人群和情感', '难以表达内心感受', '可能过度积累知识而缺乏行动', '社交互动可能让你感到消耗'],
    careers: ['科学家/研究员', '程序员/架构师', '大学教授', '作家', '分析师', '独立咨询师'],
    famousPeople: ['爱因斯坦', '比尔·盖茨', '斯蒂芬·霍金', '马克·扎克伯格'],
    growthPath: '学习走出思维的象牙塔，参与真实的生活。当你能将知识与情感和行动结合，你的洞见将产生真正的影响力。',
    stressDirection: '压力下趋向7号（变得分散和逃避性寻乐）',
    growthDirection: '成长时趋向8号（变得更自信和有行动力）',
    wingDescription: {
      '4': '5w4「离经叛道者」：更加有创意、情感丰富、独特',
      '6': '5w6「问题解决者」：更加合作、实际、注重安全'
    }
  },
  '6': {
    type: '6',
    title: '忠诚者',
    tagline: '忠诚是最珍贵的品质',
    emoji: '🛡️',
    color: '#3b82f6',
    colorSecondary: '#60a5fa',
    tags: ['忠诚可靠', '深思熟虑', '责任心强', '防患未然'],
    description: '你是最可靠的伙伴和守护者，对信任的人和信念忠诚到底。你善于预见风险和准备应对方案，是团队中不可或缺的安全网。你的忠诚和勇气在关键时刻尤为闪耀。',
    coreMotivation: '渴望安全感、确定性和可靠的支持',
    coreFear: '害怕被抛弃、害怕没有指引和安全感',
    strengths: ['高度的忠诚度和责任感', '善于预见问题和管理风险', '可靠踏实，值得信赖', '在危机中展现非凡勇气'],
    weaknesses: ['容易过度焦虑和担忧', '决策时可能犹豫不决', '可能对权威有矛盾心理', '有时多疑，难以完全信任'],
    careers: ['风险管理师', '法律顾问', '安全管理', '公务员', '项目经理', '质量保证工程师'],
    famousPeople: ['诸葛亮', '马克·吐温', 'J.R.R.托尔金'],
    growthPath: '学习信任自己和世界，培养内在的安全感而非依赖外部支持。当你能相信自己的判断力，你会发现勇气一直都在你心中。',
    stressDirection: '压力下趋向3号（变得过于追求成功和形象）',
    growthDirection: '成长时趋向9号（变得更平静和信任）',
    wingDescription: {
      '5': '6w5「守卫者」：更加内向、分析、独立',
      '7': '6w7「伙伴」：更加外向、活泼、乐观'
    }
  },
  '7': {
    type: '7',
    title: '热情者',
    tagline: '生活是一场精彩的冒险',
    emoji: '🎪',
    color: '#f97316',
    colorSecondary: '#fb923c',
    tags: ['乐观热情', '多才多艺', '冒险精神', '创意无限'],
    description: '你是生活的探险家，拥有用不完的热情和好奇心。你追求快乐、自由和新鲜体验，善于在任何环境中发现乐趣。你的乐观和活力感染着身边的每一个人。',
    coreMotivation: '渴望快乐、自由和丰富的体验',
    coreFear: '害怕痛苦、害怕被限制和错过精彩',
    strengths: ['永不枯竭的乐观和热情', '创意丰富，善于发现可能性', '适应力强，应变能力出色', '善于给团队带来活力和灵感'],
    weaknesses: ['可能逃避深层痛苦和承诺', '注意力分散，难以长期专注', '有时表面化，缺乏深度', '过度追求新鲜可能忽视已有的美好'],
    careers: ['旅行博主/作家', '创意总监', '活动策划', '企业家', '脱口秀演员', '产品经理'],
    famousPeople: ['罗宾·威廉姆斯', '理查德·布兰森', '卓别林', '周星驰'],
    growthPath: '学习在当下的体验中深入，面对并处理内心的痛苦和恐惧。当你能不逃避困难，你会发现真正的快乐来自于内心的丰盛。',
    stressDirection: '压力下趋向1号（变得挑剔和自我批评）',
    growthDirection: '成长时趋向5号（变得更专注和深度思考）',
    wingDescription: {
      '6': '7w6「战友」：更加忠诚、合作、注重安全',
      '8': '7w8「现实主义者」：更加果断、有力量、务实'
    }
  },
  '8': {
    type: '8',
    title: '领导者',
    tagline: '力量用来保护所爱之人',
    emoji: '🦅',
    color: '#dc2626',
    colorSecondary: '#ef4444',
    tags: ['果断刚毅', '保护欲强', '直来直去', '天生领袖'],
    description: '你是天生的保护者和领导者，拥有强大的意志力和行动力。你追求真实和力量，不惧怕冲突和挑战。你用你的力量来保护你关心的人和你相信的事。',
    coreMotivation: '渴望掌控自己的命运，保护和领导他人',
    coreFear: '害怕被控制、害怕脆弱和被伤害',
    strengths: ['强大的意志力和执行力', '勇于面对挑战和承担责任', '直率真诚，言出必行', '天生的保护者，关心弱者'],
    weaknesses: ['有时过于强势和专制', '难以展示脆弱的一面', '愤怒可能过于激烈', '可能无意中威慑或伤害他人'],
    careers: ['企业创始人', '军事领导', '律师', '运动员教练', '危机管理专家', '记者/调查员'],
    famousPeople: ['马丁·路德·金', '丘吉尔', '任正非', '李小龙'],
    growthPath: '学习脆弱的力量——示弱不等于软弱。当你能向信任的人敞开心扉，你会发现真正的力量来自于爱，而非控制。',
    stressDirection: '压力下趋向5号（变得疏离和过度分析）',
    growthDirection: '成长时趋向2号（变得更温暖和关怀）',
    wingDescription: {
      '7': '8w7「独行侠」：更加外向、冒险、精力充沛',
      '9': '8w9「一家之主」：更加沉稳、包容、有耐心'
    }
  },
  '9': {
    type: '9',
    title: '和平者',
    tagline: '和谐是万物的基调',
    emoji: '☮️',
    color: '#10b981',
    colorSecondary: '#34d399',
    tags: ['包容平和', '善于调解', '随和稳定', '全局视野'],
    description: '你是和平与和谐的化身，拥有看见每个观点价值的智慧。你善于化解冲突、连接不同的人，你的包容和平静给周围人带来安宁。你是团队中的润滑剂和定心丸。',
    coreMotivation: '渴望内心和外在的和平与和谐',
    coreFear: '害怕冲突、害怕分离和被忽视',
    strengths: ['出色的包容力和全局视野', '善于调解矛盾和建立共识', '稳定平和，给人安全感', '能看到每个人和每种观点的价值'],
    weaknesses: ['可能回避必要的冲突', '有时忽视自己的需求和意见', '容易随波逐流，缺乏主见', '可能用拖延来逃避决策'],
    careers: ['调解员', '外交官', '心理咨询师', '人力资源', '社区管理', '瑜伽/冥想导师'],
    famousPeople: ['达赖喇嘛', '林肯', '甘地', '宫崎骏'],
    growthPath: '学习表达自己的真实想法和需求，你的声音同样重要。当你能勇敢地站出来说出自己的立场，你会获得比回避更深层的和平。',
    stressDirection: '压力下趋向6号（变得焦虑和多疑）',
    growthDirection: '成长时趋向3号（变得更有目标和行动力）',
    wingDescription: {
      '8': '9w8「裁判」：更加果断、有力量、独立',
      '1': '9w1「梦想家」：更加有理想、有原则、追求完善'
    }
  }
}

// 根据九型人格代码获取 Profile
export function getEnneagramProfile(code: string): EnneagramProfile {
  const mainType = code.charAt(0)
  return enneagramProfiles[mainType] || enneagramProfiles['9']
}

// 获取翼型描述
export function getWingDescription(code: string): string {
  if (code.length < 3) return ''
  const mainType = code.charAt(0)
  const wing = code.charAt(2)
  const profile = enneagramProfiles[mainType]
  if (!profile) return ''
  return profile.wingDescription[wing] || ''
}
