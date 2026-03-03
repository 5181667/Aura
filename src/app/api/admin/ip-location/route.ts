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
            `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
            { next: { revalidate: 3600 } }
        )

        if (!response.ok) {
            throw new Error("IP API 请求失败")
        }

        // 太平洋接口返回 GBK 编码，需转换
        const buffer = await response.arrayBuffer()
        const text = new TextDecoder("gbk").decode(buffer)
        const data = JSON.parse(text)

        if (data.err) {
            return NextResponse.json({ message: "IP解析失败：" + data.err }, { status: 400 })
        }

        return NextResponse.json({
            ip: data.ip,
            country: "中国",
            regionName: data.pro,
            city: data.city,
            district: data.region || "",
            isp: data.addr?.replace(data.pro, "").replace(data.city, "").trim() || "",
        })
    } catch {
        return NextResponse.json({ message: "IP地址解析服务暂时不可用" }, { status: 500 })
    }
}
