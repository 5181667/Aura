import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    try {
        const { message, contact } = await req.json()

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ message: "请填写反馈内容" }, { status: 400 })
        }

        // Setup nodemailer transporter (reusing existing config)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // Send the email to huchi999@qq.com
        try {
            await transporter.sendMail({
                from: `"AuraTest Feedback" <${process.env.EMAIL_USER}>`,
                to: "huchi999@qq.com",
                subject: "【AuraTest】新用户反馈",
                text: `
用户反馈内容：
${message}

-------------------
用户联系方式：${contact || '未提供'}
                `,
                html: `
                    <div style="padding: 20px; background-color: #f4f4f4; font-family: sans-serif;">
                        <h2 style="color: #333;">收到新的用户反馈</h2>
                        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-top: 10px;">
                            <h3 style="color: #666; font-size: 14px; margin-bottom: 10px;">反馈内容：</h3>
                            <p style="font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
                        </div>
                        <div style="margin-top: 20px; color: #666; font-size: 14px;">
                            <p><strong>联系方式：</strong> ${contact || '未提供'}</p>
                            <p><strong>提交时间：</strong> ${new Date().toLocaleString('zh-CN')}</p>
                        </div>
                    </div>
                `,
            })
            console.log(`Feedback sent to huchi999@qq.com`)
        } catch (mailError) {
            console.error("MAIL_ERROR:", mailError)
            return NextResponse.json({ message: "邮件发送失败", error: String(mailError) }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: "反馈发送成功" }, { status: 200 })
    } catch (error) {
        console.error("FEEDBACK_ERROR", error)
        return NextResponse.json({ message: "发送失败", error: String(error) }, { status: 500 })
    }
}
