"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Brain, Users, LineChart, Target, Sparkles, TrendingUp } from "lucide-react"
import styles from './page.module.css'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <nav className={styles.topNav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Brain className={styles.logoIcon} />
            <span>AuraTest</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/tests">探索测试</Link>
            {session ? (
              <>
                <Link href="/dashboard">个人中心</Link>
                <Link href="/dashboard" className={styles.userBadge}>
                  <div className={styles.avatar}>
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>{session.user?.name}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">登录</Link>
                <Link href="/register" className={styles.loginBtn}>立即注册</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.hero}
        >
          <span className={styles.badge}>
            <Sparkles size={16} />
            Next Gen Personality Lab
          </span>
          <h1 className={styles.title}>
            发现真实的<span className={styles.gradientText}>自我</span>
          </h1>
          <p className={styles.description}>
            通过科学的测试体系，探索你的性格维度与潜能，与志同道合的人建立深度连接。
          </p>

          <div className={styles.actionArea}>
            <Link href="/tests" className="btn-premium">
              <Target size={20} />
              开始测试
            </Link>
            <Link href="/register" className={styles.secondaryAction}>
              了解更多
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <Users size={24} />
              <div>
                <strong>1000+</strong>
                <span>活跃用户</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <LineChart size={24} />
              <div>
                <strong>50000+</strong>
                <span>测试完成</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <TrendingUp size={24} />
              <div>
                <strong>98%</strong>
                <span>满意度</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className={styles.featureGrid}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${styles.fCard} glass`}
          >
            <div className={styles.fIconWrapper}>
              <Brain className={styles.fIcon} />
            </div>
            <h3>科学测评</h3>
            <p>基于大五人格理论与 MBTI 研究，提供专业的性格分析报告。</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${styles.fCard} glass`}
          >
            <div className={styles.fIconWrapper}>
              <Users className={styles.fIcon} />
            </div>
            <h3>社交连接</h3>
            <p>匹配性格契合的伙伴，开启有深度的社交互动体验。</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${styles.fCard} glass`}
          >
            <div className={styles.fIconWrapper}>
              <LineChart className={styles.fIcon} />
            </div>
            <h3>数据可视化</h3>
            <p>通过雷达图与趋势分析，直观展示你的性格特征变化。</p>
          </motion.div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Brain size={24} />
            <span>AuraTest</span>
          </div>
          <p>© 2026 AuraTest. 专业的性格测试与社交平台</p>
        </div>
      </footer>
    </div>
  )
}
