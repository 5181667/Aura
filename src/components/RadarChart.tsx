"use client"

import { useEffect, useRef, useState } from 'react'
import styles from './RadarChart.module.css'

interface RadarChartProps {
  data: Record<string, number>
  size?: number
  color?: string
}

export default function RadarChart({ data, size = 300, color }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [themeColors, setThemeColors] = useState({
    primary: '#8b5cf6',
    textMain: '#f8fafc',
    gridLine: 'rgba(255, 255, 255, 0.08)',
    isDark: true
  })
  
  // 从 CSS 变量读取主题色
  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement
      const styles = getComputedStyle(root)
      
      const primary = color || styles.getPropertyValue('--primary').trim() || '#8b5cf6'
      const textMain = styles.getPropertyValue('--text-main').trim() || '#f8fafc'
      const colorScheme = styles.getPropertyValue('--color-scheme').trim()
      const isDark = colorScheme !== 'light'
      
      // 网格线颜色：暗色模式用白色半透明，亮色模式用黑色半透明
      const gridLine = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
      
      setThemeColors({ primary, textMain, gridLine, isDark })
    }
    
    updateColors()
    
    // 监听主题变化
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    })
    
    return () => observer.disconnect()
  }, [color])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { primary, textMain, gridLine, isDark } = themeColors
    
    // 设置高清显示
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)
    
    const centerX = size / 2
    const centerY = size / 2
    // 缩小雷达图半径，给标签留出更多空间
    const radius = size * 0.28
    
    const labels = Object.keys(data)
    const values = Object.values(data)
    const count = labels.length
    
    if (count === 0) return
    
    const angleStep = (Math.PI * 2) / count
    
    // 清空画布
    ctx.clearRect(0, 0, size, size)
    
    // 绘制背景网格
    ctx.strokeStyle = gridLine
    ctx.lineWidth = 0.5
    
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i
      ctx.beginPath()
      for (let j = 0; j <= count; j++) {
        const angle = j * angleStep - Math.PI / 2
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }
    
    // 绘制轴线
    ctx.strokeStyle = gridLine
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      )
      ctx.stroke()
    }
    
    // 绘制外发光效果
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2)
    glowGradient.addColorStop(0, `${primary}20`)
    glowGradient.addColorStop(0.5, `${primary}10`)
    glowGradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 0, size, size)
    
    // 绘制数据区域（渐变填充 + 发光）
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, `${primary}60`)
    gradient.addColorStop(0.5, `${primary}40`)
    gradient.addColorStop(1, `${primary}20`)
    
    // 数据路径
    const dataPath = new Path2D()
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = (values[i] / 100) * radius
      const x = centerX + value * Math.cos(angle)
      const y = centerY + value * Math.sin(angle)
      if (i === 0) {
        dataPath.moveTo(x, y)
      } else {
        dataPath.lineTo(x, y)
      }
    }
    dataPath.closePath()
    
    // 外发光层
    ctx.shadowColor = primary
    ctx.shadowBlur = 20
    ctx.fillStyle = gradient
    ctx.fill(dataPath)
    
    // 重置阴影
    ctx.shadowBlur = 0
    
    // 绘制数据边框（发光线条）
    ctx.strokeStyle = primary
    ctx.lineWidth = 2.5
    ctx.shadowColor = primary
    ctx.shadowBlur = 15
    ctx.stroke(dataPath)
    ctx.shadowBlur = 0
    
    // 绘制数据点（带发光）
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = (values[i] / 100) * radius
      const x = centerX + value * Math.cos(angle)
      const y = centerY + value * Math.sin(angle)
      
      // 外发光圈
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      const pointGlow = ctx.createRadialGradient(x, y, 0, x, y, 8)
      pointGlow.addColorStop(0, `${primary}80`)
      pointGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = pointGlow
      ctx.fill()
      
      // 实心点
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = primary
      ctx.fill()
      
      // 白色高光
      ctx.beginPath()
      ctx.arc(x - 1, y - 1, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)'
      ctx.fill()
    }
    
    // 绘制标签（适应明暗模式）
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2
      // 增加标签距离，避免遮挡
      const labelRadius = radius + 50
      const x = centerX + labelRadius * Math.cos(angle)
      const y = centerY + labelRadius * Math.sin(angle)
      
      // 只取中文部分（去掉英文）
      const fullLabel = labels[i]
      const labelText = fullLabel.split(' ')[0]

      // 绘制维度名称（使用主题文字色）
      ctx.fillStyle = textMain
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(labelText, x, y - 10)

      // 绘制百分比（主题色高亮）
      ctx.fillStyle = primary
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(`${Math.round(values[i])}%`, x, y + 8)
    }
    
  }, [data, size, themeColors])
  
  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
