"use client"

import Link from 'next/link'
import { 
  FileQuestion, 
  ClipboardList, 
  Users, 
  BarChart3,
  Inbox,
  Search,
  AlertCircle
} from 'lucide-react'
import styles from './EmptyState.module.css'

type EmptyStateType = 
  | 'no-data' 
  | 'no-tests' 
  | 'no-results' 
  | 'no-users' 
  | 'no-search-results'
  | 'error'
  | 'custom'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: React.ReactNode
}

const defaultContent: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
  'no-data': {
    icon: <Inbox size={48} />,
    title: '暂无数据',
    description: '这里还没有任何内容'
  },
  'no-tests': {
    icon: <ClipboardList size={48} />,
    title: '暂无测试',
    description: '还没有创建任何测试，立即创建第一个吧'
  },
  'no-results': {
    icon: <BarChart3 size={48} />,
    title: '暂无测试记录',
    description: '您还没有完成任何测试，开始探索并了解自己吧'
  },
  'no-users': {
    icon: <Users size={48} />,
    title: '暂无用户',
    description: '还没有任何注册用户'
  },
  'no-search-results': {
    icon: <Search size={48} />,
    title: '未找到结果',
    description: '没有找到匹配的内容，试试其他关键词'
  },
  'error': {
    icon: <AlertCircle size={48} />,
    title: '出错了',
    description: '加载数据时出现问题，请稍后重试'
  },
  'custom': {
    icon: <FileQuestion size={48} />,
    title: '暂无内容',
    description: ''
  }
}

export default function EmptyState({
  type = 'no-data',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon
}: EmptyStateProps) {
  const defaultProps = defaultContent[type]

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {icon || defaultProps.icon}
      </div>
      
      <h3 className={styles.title}>
        {title || defaultProps.title}
      </h3>
      
      {(description || defaultProps.description) && (
        <p className={styles.description}>
          {description || defaultProps.description}
        </p>
      )}

      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link href={actionHref} className="btn-premium">
            {actionLabel}
          </Link>
        ) : (
          <button className="btn-premium" onClick={onAction}>
            {actionLabel}
          </button>
        )
      )}
    </div>
  )
}
