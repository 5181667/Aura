// 评分算法统一入口

export interface Answer {
  questionId: string
  dimension: string
  value: number
}

export interface DimensionScore {
  dimension: string
  rawScore: number
  percentage: number
  label?: string
}

export interface TestResult {
  type: string
  score: string
  dimensions: DimensionScore[]
  confidence?: number
}

// 通用 Sigmoid 函数，用于概率转换
export function sigmoid(x: number, k: number = 0.1): number {
  return 1 / (1 + Math.exp(-k * x))
}

// 归一化到 0-100
export function normalize(value: number, min: number, max: number): number {
  return Math.round(((value - min) / (max - min)) * 100)
}

// 导入各评分算法
import { calculateMBTI, mbtiTypeDescriptions, getMBTIDescription } from './mbti-scoring'
import { calculateBigFive, bigFiveInterpretations, getBigFiveInterpretation } from './big-five-scoring'
import { calculateDISC, discTypeDescriptions, getDISCDescription } from './disc-scoring'
import { calculateEQ, eqLevelDescriptions, getEQLevel } from './eq-scoring'
import { calculateHolland, hollandCareerSuggestions, getHollandCareerSuggestions, getHollandCodeCareers } from './holland-scoring'
import { calculateEnneagram, enneagramTypeDescriptions, getEnneagramDescription, getEnneagramTypeName } from './enneagram-scoring'

// 导出所有评分函数和工具函数
export {
  calculateMBTI,
  mbtiTypeDescriptions,
  getMBTIDescription,
  calculateBigFive,
  bigFiveInterpretations,
  getBigFiveInterpretation,
  calculateDISC,
  discTypeDescriptions,
  getDISCDescription,
  calculateEQ,
  eqLevelDescriptions,
  getEQLevel,
  calculateHolland,
  hollandCareerSuggestions,
  getHollandCareerSuggestions,
  getHollandCodeCareers,
  calculateEnneagram,
  enneagramTypeDescriptions,
  getEnneagramDescription,
  getEnneagramTypeName
}

// 根据测试类型选择评分算法
export function calculateScore(testType: string, answers: Answer[]): TestResult {
  switch (testType) {
    case 'MBTI':
      return calculateMBTI(answers)
    case 'BIG_FIVE':
      return calculateBigFive(answers)
    case 'DISC':
      return calculateDISC(answers)
    case 'EQ':
      return calculateEQ(answers)
    case 'HOLLAND':
      return calculateHolland(answers)
    case 'ENNEAGRAM':
      return calculateEnneagram(answers)
    default:
      throw new Error(`Unknown test type: ${testType}`)
  }
}
