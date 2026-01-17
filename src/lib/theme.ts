// ===== MBTI 动态主题系统 =====

export type ThemeType = 'violet' | 'green' | 'blue' | 'yellow'

// MBTI 类型到主题的映射
export const mbtiThemeMap: Record<string, ThemeType> = {
  // Analyst - NT (Violet/紫色)
  'INTJ': 'violet',
  'INTP': 'violet',
  'ENTJ': 'violet',
  'ENTP': 'violet',
  
  // Diplomat - NF (Green/绿色)
  'INFJ': 'green',
  'INFP': 'green',
  'ENFJ': 'green',
  'ENFP': 'green',
  
  // Sentinel - SJ (Blue/蓝色)
  'ISTJ': 'blue',
  'ISFJ': 'blue',
  'ESTJ': 'blue',
  'ESFJ': 'blue',
  
  // Explorer - SP (Yellow/黄色)
  'ISTP': 'yellow',
  'ISFP': 'yellow',
  'ESTP': 'yellow',
  'ESFP': 'yellow'
}

// 主题配置信息 - 混合明暗模式
export const themeConfig: Record<ThemeType, {
  name: string
  nameCN: string
  group: string
  groupCN: string
  primary: string
  glow: string
  background: string
  mode: 'dark' | 'light'
  description: string
}> = {
  violet: {
    name: 'Violet',
    nameCN: '智慧紫',
    group: 'Analyst',
    groupCN: '分析家',
    primary: '#8b5cf6',
    glow: '#d8b4fe',
    background: '#0f0720',
    mode: 'dark',
    description: '理性与智慧的紫色，代表深邃的思考与战略眼光'
  },
  green: {
    name: 'Green',
    nameCN: '自然绿',
    group: 'Diplomat',
    groupCN: '外交家',
    primary: '#10b981',
    glow: '#047857',
    background: '#f0fdf4',
    mode: 'light',
    description: '清新薄荷绿，代表和谐、成长与理想主义'
  },
  blue: {
    name: 'Blue',
    nameCN: '深海蓝',
    group: 'Sentinel',
    groupCN: '守卫者',
    primary: '#0ea5e9',
    glow: '#7dd3fc',
    background: '#0B1121',
    mode: 'dark',
    description: '深邃天蓝，代表责任、秩序与可靠'
  },
  yellow: {
    name: 'Yellow',
    nameCN: '阳光金',
    group: 'Explorer',
    groupCN: '探险家',
    primary: '#f59e0b',
    glow: '#b45309',
    background: '#fffbeb',
    mode: 'light',
    description: '温暖阳光金，代表冒险、自由与即兴'
  }
}

/**
 * 根据 MBTI 类型获取对应的主题
 * @param mbtiType - 4 字母的 MBTI 类型代码 (如 "INTJ")
 * @returns 主题类型
 */
export function getThemeByMBTI(mbtiType: string | null | undefined): ThemeType {
  if (!mbtiType) return 'violet'
  
  const normalizedType = mbtiType.toUpperCase().trim()
  return mbtiThemeMap[normalizedType] || 'violet'
}

/**
 * 获取 MBTI 类型的分组
 * @param mbtiType - 4 字母的 MBTI 类型代码
 * @returns 分组信息
 */
export function getMBTIGroup(mbtiType: string): {
  group: 'Analyst' | 'Diplomat' | 'Sentinel' | 'Explorer'
  groupCN: string
  theme: ThemeType
} {
  const theme = getThemeByMBTI(mbtiType)
  const config = themeConfig[theme]
  
  return {
    group: config.group as 'Analyst' | 'Diplomat' | 'Sentinel' | 'Explorer',
    groupCN: config.groupCN,
    theme
  }
}

/**
 * 获取主题的完整配置
 * @param theme - 主题类型
 * @returns 主题配置
 */
export function getThemeConfig(theme: ThemeType) {
  return themeConfig[theme]
}

/**
 * 所有可用主题列表
 */
export const availableThemes: ThemeType[] = ['violet', 'green', 'blue', 'yellow']

/**
 * 验证是否为有效主题
 */
export function isValidTheme(theme: string): theme is ThemeType {
  return availableThemes.includes(theme as ThemeType)
}
