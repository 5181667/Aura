import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ message: "未登录" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('avatar') as File

        if (!file) {
            return NextResponse.json({ message: "没有上传文件" }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ message: "不支持的文件格式" }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ message: "文件大小不能超过 5MB" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
        try {
            await mkdir(uploadsDir, { recursive: true })
        } catch (error) {
            // Directory might already exist, ignore error
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const filename = `${(session.user as any).id}-${Date.now()}.${ext}`
        const filepath = path.join(uploadsDir, filename)

        // Write file
        await writeFile(filepath, buffer)

        // Update user image in database
        const imageUrl = `/uploads/avatars/${filename}`
        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { image: imageUrl }
        })

        return NextResponse.json({ 
            message: "头像上传成功", 
            imageUrl 
        }, { status: 200 })
    } catch (error) {
        console.error("UPLOAD_AVATAR_ERROR", error)
        return NextResponse.json({ message: "服务器错误" }, { status: 500 })
    }
}
