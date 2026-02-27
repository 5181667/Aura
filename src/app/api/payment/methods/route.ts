import { NextResponse } from "next/server"
import { isWechatPayConfigured } from "@/lib/wechatpay"

/** 返回当前可用的支付方式（用于前端只展示已配置的选项） */
export async function GET() {
    return NextResponse.json({
        alipay: true,
        wechat: isWechatPayConfigured(),
    })
}
