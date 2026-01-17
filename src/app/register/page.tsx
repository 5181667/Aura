"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./auth.module.css"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleSendCode = async () => {
        if (!email) {
            setError("请先填写邮箱")
            return
        }

        try {
            const res = await fetch("/api/auth/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess("验证码已发送，请查收邮箱")
                setCountdown(60)
                // For demo purposes, since we log it to console but might want to see it here
                if (data.code) {
                    console.log("Demo Code:", data.code)
                }
            } else {
                setError(data.message || "发送失败")
            }
        } catch (err) {
            setError("网络错误，请稍后再试")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, code }),
            })

            const data = await res.json()

            if (res.ok) {
                // Auto-login after successful registration
                const result = await signIn("credentials", {
                    email: data.user.email,
                    password: password,
                    redirect: false,
                })

                if (result?.error) {
                    // If auto-login fails, redirect to login page
                    router.push("/login")
                } else {
                    // Success - redirect to dashboard
                    router.push("/dashboard")
                    router.refresh()
                }
            } else {
                setError(data.message || "注册失败")
            }
        } catch (err) {
            setError("发生错误，请稍后再试")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleSubmit} className={`${styles.authCard} glass`}>
                <h2>加入 AuraTest</h2>
                <p className={styles.subtitle}>开启你的个性化测试之旅</p>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.errorMessage} style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981" }}>{success}</div>}

                <div className={styles.formGroup}>
                    <label>昵称</label>
                    <input
                        type="text"
                        className="input-premium"
                        placeholder="你的称呼"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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
                        placeholder="至少 8 位字符"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>验证码</label>
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            className="input-premium"
                            placeholder="6 位数字"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn-premium"
                            onClick={handleSendCode}
                            disabled={countdown > 0}
                            style={{ padding: "0 1rem", fontSize: "0.8rem", minWidth: "120px" }}
                        >
                            {countdown > 0 ? `${countdown}s` : "获取验证码"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-premium" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
                    {loading ? "正在同步灵魂数据..." : "注册 AuraTest 账户"}
                </button>

                <p className={styles.linkText}>
                    已有账号？ <Link href="/login">返回登录</Link>
                </p>
            </form>
        </div>
    )
}
