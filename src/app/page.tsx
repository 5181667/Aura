"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Brain, Users, LineChart, Target, Sparkles, TrendingUp, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import LoadingButton from "@/components/LoadingButton"
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 动态光晕背景 */}
      <div className={styles.orbContainer}>
        <div className={styles.orb} />
        <div className={styles.orbSecondary} />
        <div className={styles.orbAccent} />
      </div>

      <Navbar />

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.hero}
        >
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles size={16} />
            Next Gen Personality Lab
          </motion.span>

          <h1 className={styles.title}>
            发现真实的<span className={styles.gradientText}>自我</span>
          </h1>

          <p className={styles.description}>
            通过科学的测试体系，探索你的性格维度与潜能，<br />
            开启一段认识自我的奇妙旅程。
          </p>

          <div className={styles.actionArea}>
            <LoadingButton href="/tests" className="btn-premium flex items-center justify-center gap-2">
              <Target size={20} />
              免费开始
              <ArrowRight size={18} className={styles.arrowIcon} />
            </LoadingButton>
            <Link href="/register" className={styles.secondaryAction}>
              了解更多
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <Users size={22} />
              </div>
              <div className={styles.statContent}>
                <strong>7000+</strong>
                <span>活跃用户</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <LineChart size={22} />
              </div>
              <div className={styles.statContent}>
                <strong>800000+</strong>
                <span>测试完成</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <TrendingUp size={22} />
              </div>
              <div className={styles.statContent}>
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
            className={styles.fCard}
          >
            <div className={styles.fIconWrapper}>
              <Brain className={styles.fIcon} />
            </div>
            <div className={styles.fContent}>
              <h3>深度人格解码</h3>
              <p>拒绝标签化。融合 MBTI 与大五人格理论，剥离表象，精准还原那个连你自己都未曾察觉的真实自我。</p>
            </div>
            <ArrowRight className={styles.fArrow} size={20} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.fCard}
          >
            <div className={styles.fIconWrapper}>
              <Sparkles className={styles.fIcon} />
            </div>
            <div className={styles.fContent}>
              <h3>AI 专属成长导师</h3>
              <p>不仅仅是结果。深度 AI 算法为你生成独家解析，从职场潜能到情感模式，提供真正可落地的人生建议。</p>
            </div>
            <ArrowRight className={styles.fArrow} size={20} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.fCard}
          >
            <div className={styles.fIconWrapper}>
              <LineChart className={styles.fIcon} />
            </div>
            <div className={styles.fContent}>
              <h3>可视化潜能地图</h3>
              <p>告别枯燥数据。通过多维雷达图，一眼看清你的优势短板，让你的性格特质与成长路径清晰可见。</p>
            </div>
            <ArrowRight className={styles.fArrow} size={20} />
          </motion.div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Brain size={24} />
            <span>AuraTest</span>
          </div>
          <p>© 2026 AuraTest. 探索内心，发现真我</p>
        </div>
      </footer>
    </div>
  )
}
