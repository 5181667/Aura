"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import styles from "./auth.module.css"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get("returnUrl") || "/dashboard"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("登录失败，请检查邮箱或密码")
        } else {
            router.push(returnUrl)
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`${styles.authCard} glass`}>
            <h2>欢迎回来</h2>
            <p className={styles.subtitle}>登录以继续你的心灵探索</p>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
                <label>邮箱</label>
                <input
                    type="email"
                    className="input-premium"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>密码</label>
                <input
                    type="password"
                    className="input-premium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn-premium" style={{ width: "100%", marginTop: "1rem" }}>
                登录 AuraTest
            </button>

            <p className={styles.linkText}>
                还没有账号？ <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}>立即注册</Link>
            </p>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className={styles.authContainer}>
            <Suspense fallback={
                <div className={`${styles.authCard} glass`}>
                    <h2>欢迎回来</h2>
                    <p className={styles.subtitle}>加载中...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
