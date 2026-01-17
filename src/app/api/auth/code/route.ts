import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ message: "请提供邮箱" }, { status: 400 })
        }

        // Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry

        console.log(`Attempting to send code to ${email}`)

        // Store the code in the database
        try {
            await prisma.verificationCode.upsert({
                where: { email_code: { email, code } },
                update: { code, expiresAt },
                create: { email, code, expiresAt },
            })
            console.log("Database updated with verification code")
        } catch (dbError) {
            console.error("DATABASE_ERROR during verification code storage:", dbError)
            return NextResponse.json({ message: "数据库操作失败", error: String(dbError) }, { status: 500 })
        }

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // Send the email
        try {
            await transporter.sendMail({
                from: `"AuraTest" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "【AuraTest】注册验证码",
                text: `您的验证码是：${code}。验证码有效期为5分钟。`,
                html: `
                    <div style="padding: 20px; background-color: #f4f4f4; font-family: sans-serif;">
                        <h2 style="color: #333;">验证您的邮箱</h2>
                        <p style="font-size: 16px; color: #666;">您正在注册 AuraTest 账户，验证码如下：</p>
                        <div style="padding: 20px; background-color: #fff; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #4F46E5;">
                            ${code}
                        </div>
                        <p style="font-size: 14px; color: #999; margin-top: 20px;">验证码有效期为 5 分钟。如果不是您本人操作，请忽略此邮件。</p>
                    </div>
                `,
            })
            console.log(`Verification code for ${email} sent via email.`)
        } catch (mailError) {
            console.error("MAIL_ERROR:", mailError)
            return NextResponse.json({ message: "邮件发送失败", error: String(mailError) }, { status: 500 })
        }

        return NextResponse.json({ message: "验证码已发送" }, { status: 200 })
    } catch (error) {
        console.error("GENERAL_SEND_CODE_ERROR", error)
        return NextResponse.json({ message: "发送验证码失败", error: String(error) }, { status: 500 })
    }
}
