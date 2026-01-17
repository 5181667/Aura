"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  Briefcase, 
  Users, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'
import styles from './AIAnalysisReport.module.css'

interface SingleTestAnalysis {
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

interface Props {
  analysis: SingleTestAnalysis
  loading?: boolean
}

export default function AIAnalysisReport({ analysis, loading }: Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['summary'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <Sparkles className={styles.sparkle} />
        </div>
        <p>AI 正在分析您的测试结果...</p>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const sections = [
    {
      id: 'summary',
      title: '总体概述',
      icon: <Brain size={20} />,
      content: (
        <div className={styles.summaryContent}>
          <p>{analysis.summary}</p>
          <div className={styles.typeDescription}>
            <h4>类型特征</h4>
            <p>{analysis.typeDescription}</p>
          </div>
        </div>
      )
    },
    {
      id: 'dimensions',
      title: '维度分析',
      icon: <TrendingUp size={20} />,
      content: (
        <div className={styles.dimensionsContent}>
          {analysis.dimensionBreakdown?.map((dim, idx) => (
            <div key={idx} className={styles.dimensionItem}>
              <div className={styles.dimensionHeader}>
                <span className={styles.dimensionName}>{dim.dimension}</span>
                <span className={styles.dimensionScore}>{dim.score}%</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
              <p className={styles.dimensionAnalysis}>{dim.analysis}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'strengths',
      title: '优势与特点',
      icon: <Lightbulb size={20} />,
      content: (
        <div className={styles.listContent}>
          <div className={styles.listSection}>
            <h4>您的优势</h4>
            <ul>
              {analysis.strengths?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.listSection}>
            <h4>可改进之处</h4>
            <ul className={styles.weaknessList}>
              {analysis.weaknesses?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'career',
      title: '职业建议',
      icon: <Briefcase size={20} />,
      content: (
        <div className={styles.careerContent}>
          <p>根据您的性格特点，以下职业方向可能适合您：</p>
          <div className={styles.careerTags}>
            {analysis.careerSuggestions?.map((career, idx) => (
              <span key={idx} className={styles.careerTag}>{career}</span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'relationship',
      title: '人际关系',
      icon: <Users size={20} />,
      content: (
        <div className={styles.relationshipContent}>
          <ul>
            {analysis.relationshipTips?.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'growth',
      title: '成长建议',
      icon: <TrendingUp size={20} />,
      content: (
        <div className={styles.growthContent}>
          <ul>
            {analysis.growthAdvice?.map((advice, idx) => (
              <li key={idx}>{advice}</li>
            ))}
          </ul>
        </div>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Sparkles className={styles.headerIcon} />
        <h2>AI 智能分析报告</h2>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <button 
              className={`${styles.sectionHeader} ${expandedSections.includes(section.id) ? styles.expanded : ''}`}
              onClick={() => toggleSection(section.id)}
            >
              <div className={styles.sectionTitle}>
                {section.icon}
                <span>{section.title}</span>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.sectionContent}
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
