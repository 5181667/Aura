"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string
    loadingText?: string
    icon?: React.ReactNode
    children: React.ReactNode
    isLoading?: boolean
}

export default function LoadingButton({
    href,
    className = "",
    children,
    loadingText = "加载中...",
    onClick,
    icon,
    isLoading: externalLoading,
    ...props
}: LoadingButtonProps) {
    const router = useRouter()
    const [internalLoading, setInternalLoading] = useState(false)
    const isLoading = externalLoading || internalLoading

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // 如果有自定义点击事件，先执行
        if (onClick) {
            await onClick(e)
            if (e.defaultPrevented) return
        }

        // 如果提供了 href，处理导航
        if (href) {
            e.preventDefault()
            setInternalLoading(true)
            router.push(href)
        }
    }

    return (
        <button
            className={`${className} ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            onClick={handleClick}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {loadingText}
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    )
}
