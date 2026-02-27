import { prisma } from "@/lib/prisma"
import { verifyNotifySign } from "@/lib/payment"

// 支付宝异步通知回调（POST）
export async function POST(req: Request) {
    try {
        // 解析支付宝 POST 的 form 表单数据
        const formData = await req.formData()
        const params: Record<string, string> = {}
        formData.forEach((value, key) => {
            params[key] = value as string
        })

        console.log('[Alipay Notify] 收到回调:', JSON.stringify(params))

        // 1. 验证 RSA2 签名
        if (!verifyNotifySign(params)) {
            console.error('[Alipay Notify] 签名验证失败')
            return new Response('failure', { status: 200 })
        }

        // 2. 检查交易状态
        const tradeStatus = params.trade_status
        if (tradeStatus !== 'TRADE_SUCCESS' && tradeStatus !== 'TRADE_FINISHED') {
            console.log('[Alipay Notify] 交易状态非成功:', tradeStatus)
            return new Response('success')  // 返回 success 避免支付宝重复推送
        }

        // 3. 查找订单
        const outTradeNo = params.out_trade_no
        const premiumReport = await prisma.premiumReport.findUnique({
            where: { orderId: outTradeNo },
        })

        if (!premiumReport) {
            console.error('[Alipay Notify] 订单不存在:', outTradeNo)
            return new Response('success')  // 返回 success，避免无限重试
        }

        // 4. 防止重复处理
        if (premiumReport.paymentStatus === 'PAID') {
            console.log('[Alipay Notify] 订单已处理:', outTradeNo)
            return new Response('success')
        }

        // 5. 验证金额一致性
        const notifyAmount = parseFloat(params.total_amount || params.receipt_amount || '0')
        const expectedAmount = premiumReport.amount
        if (Math.abs(notifyAmount - expectedAmount) > 0.01) {
            console.error('[Alipay Notify] 金额不一致:', notifyAmount, '期望:', expectedAmount)
            return new Response('failure')
        }

        // 6. 验证 app_id 一致性
        const appId = params.app_id
        if (appId && appId !== process.env.ALIPAY_APP_ID) {
            console.error('[Alipay Notify] app_id 不匹配:', appId)
            return new Response('failure')
        }

        // 7. 更新订单状态为已支付
        await prisma.premiumReport.update({
            where: { id: premiumReport.id },
            data: {
                paymentStatus: 'PAID',
                paidAt: new Date(),
            },
        })

        console.log('[Alipay Notify] 支付成功:', outTradeNo, '支付宝交易号:', params.trade_no)

        // 返回 success 告知支付宝已收到通知
        return new Response('success')

    } catch (error) {
        console.error('[Alipay Notify] 处理异常:', error)
        return new Response('failure', { status: 200 })
    }
}
