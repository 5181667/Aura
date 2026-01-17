"use client"

import { useTheme, ThemeType } from '@/providers/ThemeProvider'

const THEMES: { id: ThemeType; color: string; label: string }[] = [
  { id: 'violet', color: '#8b5cf6', label: 'Violet (Dark)' },
  { id: 'green',  color: '#10b981', label: 'Green (Light)' },
  { id: 'blue',   color: '#0ea5e9', label: 'Blue (Dark)' },
  { id: 'yellow', color: '#f59e0b', label: 'Yellow (Light)' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        width: 'fit-content',
      }}
    >
      {THEMES.map((t) => {
        const isActive = theme === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={t.label}
            aria-pressed={isActive}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: t.color,
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: isActive ? `0 0 12px ${t.color}` : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />
        )
      })}
    </div>
  )
}
