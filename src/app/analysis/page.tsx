"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, RefreshCw, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FullAnalysisReport from '@/components/FullAnalysisReport'
import styles from './analysis.module.css'

export default function AnalysisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [hasNewTests, setHasNewTests] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchAnalysis()
    }
  }, [session])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/ai/full-analysis')
      const data = await res.json()
      
      if (data.hasAnalysis) {
        setAnalysis(data.analysis)
        setHasNewTests(data.hasNewTests)
      }
    } catch (err) {
      console.error('获取分析失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateAnalysis = async () => {
    try {
      setGenerating(true)
      setError(null)
      
      const res = await fetch('/api/ai/full-analysis', {
        method: 'POST'
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setAnalysis(data.analysis)
        setHasNewTests(false)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('生成分析失败，请稍后重试')
    } finally {
      setGenerating(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>全面性格分析</h1>
          <p>基于您完成的所有测试，AI 为您生成综合性格画像和个性化建议</p>
        </header>

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!analysis && !generating && (
          <div className={`${styles.emptyState} glass`}>
            <Brain size={64} className={styles.emptyIcon} />
            <h2>开始您的全面分析</h2>
            <p>我们将综合您所有的测试结果，运用 AI 技术为您生成深度性格分析报告，包括职业建议、人际关系指导和个人成长路径。</p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <CheckCircle size={20} />
                <span>跨测试交叉验证</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle size={20} />
                <span>个性化职业建议</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle size={20} />
                <span>人际关系指导</span>
              </div>
              <div className={styles.feature}>
                <CheckCircle size={20} />
                <span>成长行动计划</span>
              </div>
            </div>

            <button 
              className="btn-premium"
              onClick={generateAnalysis}
              disabled={generating}
            >
              生成全面分析
              <ArrowRight size={20} />
            </button>

            <p className={styles.hint}>
              提示：完成更多测试类型可以获得更准确的分析结果
            </p>
          </div>
        )}

        {hasNewTests && analysis && (
          <div className={styles.updateBanner}>
            <AlertCircle size={20} />
            <span>您有新的测试结果，建议重新生成分析以获得更准确的结果</span>
            <button 
              onClick={generateAnalysis}
              disabled={generating}
              className={styles.updateBtn}
            >
              <RefreshCw size={16} className={generating ? styles.spinning : ''} />
              重新分析
            </button>
          </div>
        )}

        {generating && (
          <div className={`${styles.generatingState} glass`}>
            <FullAnalysisReport analysis={null as any} loading={true} />
          </div>
        )}

        {analysis && !generating && (
          <div className={`${styles.reportContainer} glass`}>
            <div className={styles.reportHeader}>
              <button 
                onClick={generateAnalysis}
                disabled={generating}
                className={styles.refreshBtn}
              >
                <RefreshCw size={18} />
                重新生成
              </button>
            </div>
            <FullAnalysisReport analysis={analysis} />
          </div>
        )}

        <section className={`${styles.testsSection} glass`}>
          <h2>完成更多测试</h2>
          <p>完成不同类型的测试可以让分析结果更加全面和准确</p>
          <Link href="/tests" className="btn-premium">
            探索更多测试
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  )
}
