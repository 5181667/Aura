"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { ThemeType, getThemeByMBTI, isValidTheme } from '@/lib/theme'

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  setThemeByMBTI: (mbtiType: string | null | undefined) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'aura-theme'

const applyThemeToDocument = (newTheme: ThemeType) => {
  if (newTheme === 'violet') {
    document.documentElement.removeAttribute('data-theme')
    return
  }

  document.documentElement.setAttribute('data-theme', newTheme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('violet')
  const [mounted, setMounted] = useState(false)

  // 初始化：从 localStorage 读取主题
  useEffect(() => {
    setMounted(true)
    
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isValidTheme(stored)) {
      setThemeState(stored)
      applyThemeToDocument(stored)
    }
  }, [])

  // 设置主题
  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme)
    applyThemeToDocument(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }, [])

  // 根据 MBTI 类型设置主题
  const setThemeByMBTI = useCallback((mbtiType: string | null | undefined) => {
    const newTheme = getThemeByMBTI(mbtiType)
    setTheme(newTheme)
  }, [setTheme])

  // 同步 theme 变化到 DOM
  useEffect(() => {
    if (mounted) {
      applyThemeToDocument(theme)
    }
  }, [theme, mounted])

  // 防止服务端渲染闪烁
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'violet', setTheme: () => {}, setThemeByMBTI: () => {} }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setThemeByMBTI }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook 用于访问主题上下文
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 导出供服务端组件使用的主题工具
export { getThemeByMBTI, type ThemeType }
