import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decryptWechatNotifyResource } from "@/lib/wechatpay"

/**
 * 微信支付 V3 支付结果通知
 * 文档：https://pay.weixin.qq.com/doc/v3/apis/chapter3_4_5.shtml
 * 需在商户平台配置通知 URL：https://你的域名/api/payment/wechat-notify
 */
export async function POST(req: Request) {
    try {
        const body = await req.text()
        const timestamp = req.headers.get('Wechatpay-Timestamp') || ''
        const nonce = req.headers.get('Wechatpay-Nonce') || ''
        const signature = req.headers.get('Wechatpay-Signature') || ''
        const serial = req.headers.get('Wechatpay-Serial') || ''

        if (!body || !timestamp || !nonce || !signature) {
            console.error('[WechatPay Notify] 缺少必要请求头')
            return NextResponse.json({ code: 'FAIL', message: '缺少参数' }, { status: 400 })
        }

        // TODO: 使用微信支付平台证书公钥验签（Wechatpay-Serial 对应证书）
        // 见 https://pay.weixin.qq.com/doc/v3/apis/chapter3_4_5.shtml
        // 验签通过后再解密与更新订单

        const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY
        if (!apiV3Key) {
            console.error('[WechatPay Notify] 未配置 WECHAT_PAY_API_V3_KEY')
            return NextResponse.json({ code: 'FAIL', message: '配置错误' }, { status: 500 })
        }

        let event: { event_type?: string; resource?: { ciphertext: string; nonce: string; associated_data: string } }
        try {
            event = JSON.parse(body) as any
        } catch {
            return NextResponse.json({ code: 'FAIL', message: '无效 JSON' }, { status: 400 })
        }

        if (event.event_type !== 'TRANSACTION.SUCCESS') {
            return NextResponse.json({ code: 'SUCCESS', message: 'ok' })
        }

        const res = event.resource
        if (!res?.ciphertext || !res.nonce || !res.associated_data) {
            return NextResponse.json({ code: 'FAIL', message: '缺少 resource' }, { status: 400 })
        }

        let decrypted: string
        try {
            decrypted = decryptWechatNotifyResource(
                res.ciphertext,
                res.nonce,
                res.associated_data,
                apiV3Key
            )
        } catch (e) {
            console.error('[WechatPay Notify] 解密失败:', e)
            return NextResponse.json({ code: 'FAIL', message: '解密失败' }, { status: 400 })
        }

        let payload: { out_trade_no?: string; trade_state?: string; amount?: { total?: number } }
        try {
            payload = JSON.parse(decrypted) as any
        } catch {
            return NextResponse.json({ code: 'FAIL', message: '无效密文' }, { status: 400 })
        }

        if (payload.trade_state !== 'SUCCESS') {
            return NextResponse.json({ code: 'SUCCESS', message: 'ok' })
        }

        const outTradeNo = payload.out_trade_no
        if (!outTradeNo) {
            return NextResponse.json({ code: 'FAIL', message: '缺少 out_trade_no' }, { status: 400 })
        }

        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId: outTradeNo },
        })

        if (!premiumReport) {
            console.error('[WechatPay Notify] 订单不存在:', outTradeNo)
            return NextResponse.json({ code: 'SUCCESS', message: 'ok' })
        }

        if (premiumReport.paymentStatus === 'PAID') {
            return NextResponse.json({ code: 'SUCCESS', message: 'ok' })
        }

        // 金额单位：微信为分，数据库为元
        const totalFen = payload.amount?.total ?? 0
        const expectedFen = Math.round(premiumReport.amount * 100)
        if (Math.abs(totalFen - expectedFen) > 1) {
            console.error('[WechatPay Notify] 金额不一致:', totalFen, '期望:', expectedFen)
            return NextResponse.json({ code: 'FAIL', message: '金额不一致' }, { status: 400 })
        }

        await prisma.premiumReport.update({
            where: { id: premiumReport.id },
            data: {
                paymentStatus: 'PAID',
                paidAt: new Date(),
            },
        })

        console.log('[WechatPay Notify] 支付成功:', outTradeNo)

        return NextResponse.json({ code: 'SUCCESS', message: 'ok' })
    } catch (error) {
        console.error('[WechatPay Notify] 异常:', error)
        return NextResponse.json({ code: 'FAIL', message: '系统错误' }, { status: 500 })
    }
}
