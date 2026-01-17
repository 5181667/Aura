import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try {
        const { name, email, password, code } = await req.json()

        if (!name || !email || !password || !code) {
            return NextResponse.json({ message: "请填写完整信息" }, { status: 400 })
        }

        // Verify the code
        const verificationRecord = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                expiresAt: { gt: new Date() }
            }
        })

        if (!verificationRecord) {
            return NextResponse.json({ message: "验证码错误或已过期" }, { status: 400 })
        }

        // Delete the used code
        await prisma.verificationCode.delete({
            where: { id: verificationRecord.id }
        })

        const exists = await prisma.user.findUnique({
            where: { email }
        })

        if (exists) {
            return NextResponse.json({ message: "该邮箱已被注册" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        return NextResponse.json({ 
            message: "注册成功", 
            user: { id: user.id, email: user.email } 
        }, { status: 201 })
    } catch (error) {
        console.error("REGISTER_ERROR", error)
        return NextResponse.json({ message: "服务器内部错误" }, { status: 500 })
    }
}
