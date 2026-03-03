import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
        return NextResponse.json({ message: "无权限" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const ip = searchParams.get("ip")

    if (!ip) {
        return NextResponse.json({ message: "缺少IP参数" }, { status: 400 })
    }

    // 过滤本地IP
    if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
        return NextResponse.json({
            ip,
            country: "本地网络",
            regionName: "内网",
            city: "localhost",
            isp: "本地",
            lat: 0,
            lon: 0,
            timezone: "Asia/Shanghai",
        })
    }

    try {
        const response = await fetch(
            `http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,message,country,regionName,city,district,isp,lat,lon,timezone,query`,
            { next: { revalidate: 3600 } }
        )

        if (!response.ok) {
            throw new Error("IP API 请求失败")
        }

        const data = await response.json()

        if (data.status === "fail") {
            return NextResponse.json({ message: data.message || "IP解析失败" }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: "IP地址解析服务暂时不可用" }, { status: 500 })
    }
}
