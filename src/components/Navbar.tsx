"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Brain, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  BarChart3,
  ClipboardList,
  Sparkles
} from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const navItems = [
    { href: '/tests', label: '探索测试', icon: <ClipboardList size={18} /> },
    { href: '/analysis', label: '全面分析', icon: <Sparkles size={18} />, requireAuth: true },
    { href: '/dashboard', label: '个人中心', icon: <BarChart3 size={18} />, requireAuth: true },
  ]

  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || session
  )

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Brain className={styles.logoIcon} />
          <span>AuraTest</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Admin Link */}
          {session && (session.user as any)?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}
            >
              <Settings size={18} />
              <span>管理后台</span>
            </Link>
          )}
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          {/* 主题切换器 */}
          <ThemeSwitcher />
          
          {session ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.userButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.avatar}>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" />
                  ) : (
                    session.user?.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <span className={styles.userName}>{session.user?.name}</span>
              </button>

              {userMenuOpen && (
                <>
                  <div 
                    className={styles.menuOverlay}
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className={styles.dropdown}>
                    <Link 
                      href="/dashboard" 
                      className={styles.dropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      个人中心
                    </Link>
                    <Link 
                      href="/analysis" 
                      className={styles.dropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Sparkles size={16} />
                      全面分析
                    </Link>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} />
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                登录
              </Link>
              <Link href="/register" className="btn-premium">
                注册
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={styles.mobileNav}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {session && (session.user as any)?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`${styles.mobileNavLink} ${isActive('/admin') ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={18} />
              <span>管理后台</span>
            </Link>
          )}

          {!session && (
            <div className={styles.mobileAuthButtons}>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                登录
              </Link>
              <Link href="/register" className="btn-premium" onClick={() => setMobileMenuOpen(false)}>
                注册
              </Link>
            </div>
          )}

          {session && (
            <button 
              className={styles.mobileLogout}
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              退出登录
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
