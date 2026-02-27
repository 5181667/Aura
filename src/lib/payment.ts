// 支付宝官方支付集成（RSA2 签名，官方 SDK）
import { AlipaySdk } from 'alipay-sdk'
import QRCode from 'qrcode'

// ============ SDK 单例 ============

let _sdk: InstanceType<typeof AlipaySdk> | null = null

function getAlipaySDK() {
    const appId = process.env.ALIPAY_APP_ID
    const privateKey = process.env.ALIPAY_PRIVATE_KEY
    const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY

    if (!appId || !privateKey || !alipayPublicKey) {
        throw new Error(
            '支付宝配置缺失，请检查环境变量: ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, ALIPAY_PUBLIC_KEY'
        )
    }

    if (!_sdk) {
        const isSandbox = process.env.ALIPAY_SANDBOX === 'true' || process.env.ALIPAY_SANDBOX === '1'
        // 去除首尾空格和 \r，避免 .env 粘贴导致验签失败
        const normalizedPrivateKey = privateKey.trim().replace(/\r/g, '')
        const normalizedAlipayPublicKey = alipayPublicKey.trim().replace(/\r/g, '')
        _sdk = new AlipaySdk({
            appId,
            privateKey: normalizedPrivateKey,
            alipayPublicKey: normalizedAlipayPublicKey,
            signType: 'RSA2',
            keyType: 'PKCS1', // 支付宝密钥工具「非JAVA」生成的是 PKCS1
            gateway: isSandbox
                ? 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'
                : 'https://openapi.alipay.com/gateway.do',
        })
    }
    return _sdk
}

// ============ 公共配置 ============

export const PAYMENT_CONFIG = {
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || '',
    returnUrl: process.env.ALIPAY_RETURN_URL || '',
}

// ============ 工具函数 ============

/** 生成商户订单号 */
export function generateOrderNo(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PR${timestamp}${random}`
}

/** 将支付宝返回的二维码链接转为 base64 data URL（供前端 <img> 直接使用）*/
export async function qrToDataURL(text: string): Promise<string> {
    return QRCode.toDataURL(text, { width: 280, margin: 2 })
}

// ============ 当面付 · 预下单（扫码支付）============

export async function createPrecreateTrade(params: {
    outTradeNo: string
    totalAmount: string
    subject: string
    notifyUrl?: string
}): Promise<{ success: boolean; qrCode?: string; qrCodeDataUrl?: string; error?: string }> {
    try {
        const sdk = getAlipaySDK()
        const result: any = await sdk.exec('alipay.trade.precreate', {
            notify_url: params.notifyUrl || PAYMENT_CONFIG.notifyUrl,
            bizContent: {
                out_trade_no: params.outTradeNo,
                total_amount: params.totalAmount,
                subject: params.subject,
            },
        })

        // SDK 可能返回 camelCase 或 snake_case
        const qrCode = result?.qrCode || result?.qr_code
        if (qrCode) {
            const qrCodeDataUrl = await qrToDataURL(qrCode)
            return { success: true, qrCode, qrCodeDataUrl }
        }
        return {
            success: false,
            error: result?.msg || result?.subMsg || result?.sub_msg || '创建预付单失败',
        }
    } catch (error: any) {
        console.error('[Alipay] precreate error:', error)
        return { success: false, error: error.message || '支付服务暂不可用' }
    }
}

// ============ PC 网站支付（跳转收银台）============

export function createPagePay(params: {
    outTradeNo: string
    totalAmount: string
    subject: string
    returnUrl?: string
    notifyUrl?: string
}): { success: boolean; payUrl?: string; error?: string } {
    try {
        const sdk = getAlipaySDK()
        const payUrl = sdk.pageExecute('alipay.trade.page.pay', 'GET', {
            notify_url: params.notifyUrl || PAYMENT_CONFIG.notifyUrl,
            return_url: params.returnUrl || PAYMENT_CONFIG.returnUrl,
            bizContent: {
                out_trade_no: params.outTradeNo,
                total_amount: params.totalAmount,
                subject: params.subject,
                product_code: 'FAST_INSTANT_TRADE_PAY',
            },
        })
        return { success: true, payUrl: payUrl as string }
    } catch (error: any) {
        console.error('[Alipay] pagePay error:', error)
        return { success: false, error: error.message || '创建支付页面失败' }
    }
}

// ============ H5 手机网站支付 ============

export function createWapPay(params: {
    outTradeNo: string
    totalAmount: string
    subject: string
    returnUrl?: string
    notifyUrl?: string
}): { success: boolean; payUrl?: string; error?: string } {
    try {
        const sdk = getAlipaySDK()
        const payUrl = sdk.pageExecute('alipay.trade.wap.pay', 'GET', {
            notify_url: params.notifyUrl || PAYMENT_CONFIG.notifyUrl,
            return_url: params.returnUrl || PAYMENT_CONFIG.returnUrl,
            bizContent: {
                out_trade_no: params.outTradeNo,
                total_amount: params.totalAmount,
                subject: params.subject,
                product_code: 'QUICK_WAP_WAY',
            },
        })
        return { success: true, payUrl: payUrl as string }
    } catch (error: any) {
        console.error('[Alipay] wapPay error:', error)
        return { success: false, error: error.message || '创建H5支付失败' }
    }
}

// ============ 查询交易状态 ============

export async function queryTradeStatus(outTradeNo: string): Promise<{
    success: boolean
    status?: 'pending' | 'paid' | 'closed' | 'failed'
    tradeNo?: string
    error?: string
}> {
    try {
        const sdk = getAlipaySDK()
        const result: any = await sdk.exec('alipay.trade.query', {
            bizContent: {
                out_trade_no: outTradeNo,
            },
        })

        const statusMap: Record<string, 'pending' | 'paid' | 'closed' | 'failed'> = {
            WAIT_BUYER_PAY: 'pending',
            TRADE_SUCCESS: 'paid',
            TRADE_FINISHED: 'paid',
            TRADE_CLOSED: 'closed',
        }

        const tradeStatus = result?.tradeStatus || result?.trade_status
        return {
            success: true,
            status: statusMap[tradeStatus] || 'failed',
            tradeNo: result?.tradeNo || result?.trade_no,
        }
    } catch (error: any) {
        console.error('[Alipay] query error:', error)
        return { success: false, error: error.message || '查询失败' }
    }
}

// ============ 验证异步通知签名 ============

export function verifyNotifySign(params: Record<string, string>): boolean {
    try {
        const sdk = getAlipaySDK()
        return sdk.checkNotifySign(params)
    } catch (error) {
        console.error('[Alipay] verify notify sign error:', error)
        return false
    }
}

// ============ 类型导出 ============

export type PaymentMethod = 'alipay'
