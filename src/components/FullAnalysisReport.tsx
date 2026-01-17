"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Briefcase, 
  Users, 
  Heart,
  Zap,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react'
import RadarChart from './RadarChart'
import styles from './FullAnalysisReport.module.css'

interface FullAnalysisResult {
  overallProfile: {
    summary: string
    coreTraits: string[]
    consistencyScore: number
  }
  crossTestInsights: {
    mbtiVsBigFive?: string
    discVsHolland?: string
    eqImpact?: string
    enneagramDepth?: string
  }
  integratedAdvice: {
    careerPath: {
      idealCareers: string[]
      avoidCareers: string[]
      developmentPath: string
    }
    personalGrowth: {
      priorityAreas: string[]
      actionPlan: string[]
      resources: string[]
    }
    relationships: {
      communicationStyle: string
      idealPartnerTypes: string[]
      teamRoleAdvice: string
    }
    lifeBalance: {
      stressManagement: string[]
      energyManagement: string
      workLifeBalance: string
    }
  }
  visualData: {
    radarChartData: Record<string, number>
  }
}

interface Props {
  analysis: FullAnalysisResult
  loading?: boolean
}

export default function FullAnalysisReport({ analysis, loading }: Props) {
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <Sparkles className={styles.sparkle} />
        </div>
        <h3>AI 正在进行全面分析...</h3>
        <p>综合您的所有测试结果，生成个性化报告</p>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const tabs = [
    { id: 'overview', label: '总览', icon: <Brain size={18} /> },
    { id: 'career', label: '职业发展', icon: <Briefcase size={18} /> },
    { id: 'growth', label: '个人成长', icon: <TrendingUp size={18} /> },
    { id: 'relationships', label: '人际关系', icon: <Users size={18} /> },
    { id: 'balance', label: '生活平衡', icon: <Heart size={18} /> }
  ]

  const renderOverview = () => (
    <div className={styles.overviewContent}>
      <div className={styles.profileCard}>
        <h3>性格画像</h3>
        <p>{analysis.overallProfile.summary}</p>
        
        <div className={styles.consistencyBadge}>
          <Shield size={16} />
          <span>测试一致性：{analysis.overallProfile.consistencyScore}%</span>
        </div>
      </div>

      <div className={styles.traitsSection}>
        <h3>核心特质</h3>
        <div className={styles.traitTags}>
          {analysis.overallProfile.coreTraits.map((trait, idx) => (
            <motion.span 
              key={idx} 
              className={styles.traitTag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
      </div>

      {analysis.visualData?.radarChartData && (
        <div className={styles.chartSection}>
          <h3>多维度分析</h3>
          <RadarChart data={analysis.visualData.radarChartData} />
        </div>
      )}

      <div className={styles.insightsSection}>
        <h3>跨测试洞察</h3>
        <div className={styles.insightsGrid}>
          {analysis.crossTestInsights.mbtiVsBigFive && (
            <div className={styles.insightCard}>
              <h4>MBTI vs 大五人格</h4>
              <p>{analysis.crossTestInsights.mbtiVsBigFive}</p>
            </div>
          )}
          {analysis.crossTestInsights.discVsHolland && (
            <div className={styles.insightCard}>
              <h4>DISC vs 霍兰德</h4>
              <p>{analysis.crossTestInsights.discVsHolland}</p>
            </div>
          )}
          {analysis.crossTestInsights.eqImpact && (
            <div className={styles.insightCard}>
              <h4>情商影响</h4>
              <p>{analysis.crossTestInsights.eqImpact}</p>
            </div>
          )}
          {analysis.crossTestInsights.enneagramDepth && (
            <div className={styles.insightCard}>
              <h4>深层动机</h4>
              <p>{analysis.crossTestInsights.enneagramDepth}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCareer = () => (
    <div className={styles.careerContent}>
      <div className={styles.careerSection}>
        <h3><Target size={20} /> 推荐职业方向</h3>
        <div className={styles.careerTags}>
          {analysis.integratedAdvice.careerPath.idealCareers.map((career, idx) => (
            <span key={idx} className={styles.careerTag}>{career}</span>
          ))}
        </div>
      </div>

      <div className={styles.careerSection}>
        <h3><Shield size={20} /> 建议避开的职业</h3>
        <div className={styles.avoidTags}>
          {analysis.integratedAdvice.careerPath.avoidCareers.map((career, idx) => (
            <span key={idx} className={styles.avoidTag}>{career}</span>
          ))}
        </div>
      </div>

      <div className={styles.developmentPath}>
        <h3><TrendingUp size={20} /> 发展路径建议</h3>
        <p>{analysis.integratedAdvice.careerPath.developmentPath}</p>
      </div>
    </div>
  )

  const renderGrowth = () => (
    <div className={styles.growthContent}>
      <div className={styles.prioritySection}>
        <h3><Zap size={20} /> 重点发展领域</h3>
        <div className={styles.priorityList}>
          {analysis.integratedAdvice.personalGrowth.priorityAreas.map((area, idx) => (
            <div key={idx} className={styles.priorityItem}>
              <span className={styles.priorityNumber}>{idx + 1}</span>
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionSection}>
        <h3><Target size={20} /> 行动计划</h3>
        <ul className={styles.actionList}>
          {analysis.integratedAdvice.personalGrowth.actionPlan.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>

      <div className={styles.resourceSection}>
        <h3>推荐资源</h3>
        <div className={styles.resourceTags}>
          {analysis.integratedAdvice.personalGrowth.resources.map((resource, idx) => (
            <span key={idx} className={styles.resourceTag}>{resource}</span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderRelationships = () => (
    <div className={styles.relationshipsContent}>
      <div className={styles.communicationSection}>
        <h3><Users size={20} /> 沟通风格</h3>
        <p>{analysis.integratedAdvice.relationships.communicationStyle}</p>
      </div>

      <div className={styles.partnerSection}>
        <h3><Heart size={20} /> 理想伴侣类型</h3>
        <div className={styles.partnerTags}>
          {analysis.integratedAdvice.relationships.idealPartnerTypes.map((type, idx) => (
            <span key={idx} className={styles.partnerTag}>{type}</span>
          ))}
        </div>
      </div>

      <div className={styles.teamSection}>
        <h3><Briefcase size={20} /> 团队角色建议</h3>
        <p>{analysis.integratedAdvice.relationships.teamRoleAdvice}</p>
      </div>
    </div>
  )

  const renderBalance = () => (
    <div className={styles.balanceContent}>
      <div className={styles.stressSection}>
        <h3><Shield size={20} /> 压力管理</h3>
        <ul className={styles.stressList}>
          {analysis.integratedAdvice.lifeBalance.stressManagement.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className={styles.energySection}>
        <h3><Zap size={20} /> 能量管理</h3>
        <p>{analysis.integratedAdvice.lifeBalance.energyManagement}</p>
      </div>

      <div className={styles.workLifeSection}>
        <h3><Heart size={20} /> 工作生活平衡</h3>
        <p>{analysis.integratedAdvice.lifeBalance.workLifeBalance}</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'career': return renderCareer()
      case 'growth': return renderGrowth()
      case 'relationships': return renderRelationships()
      case 'balance': return renderBalance()
      default: return renderOverview()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Sparkles className={styles.headerIcon} />
        <h2>全面性格分析报告</h2>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.content}
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
