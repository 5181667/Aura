// 免签支付集成模块
import crypto from 'crypto'

// 支付配置
export const PAYMENT_CONFIG = {
    url: process.env.EPAY_URL || 'https://pay.example.com',
    pid: process.env.EPAY_PID || '',
    key: process.env.EPAY_KEY || '',
    notifyUrl: process.env.EPAY_NOTIFY_URL || '',
    returnUrl: process.env.EPAY_RETURN_URL || '',
}

// 支付方式
export type PaymentMethod = 'alipay' | 'wechat'

// 订单信息
export interface OrderInfo {
    outTradeNo: string      // 商户订单号
    type: PaymentMethod     // 支付方式
    name: string            // 商品名称
    money: string           // 金额
    notifyUrl?: string      // 异步通知地址
    returnUrl?: string      // 同步返回地址
}

// 生成签名
export function generateSign(params: Record<string, string>, key: string): string {
    // 按照参数名ASCII码从小到大排序
    const sortedKeys = Object.keys(params).sort()
    
    // 拼接参数
    const signStr = sortedKeys
        .filter(k => params[k] !== '' && k !== 'sign' && k !== 'sign_type')
        .map(k => `${k}=${params[k]}`)
        .join('&')
    
    // MD5签名
    return crypto.createHash('md5').update(signStr + key).digest('hex')
}

// 验证签名
export function verifySign(params: Record<string, string>, key: string, sign: string): boolean {
    const calculatedSign = generateSign(params, key)
    return calculatedSign.toLowerCase() === sign.toLowerCase()
}

// 生成订单号
export function generateOrderNo(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PR${timestamp}${random}`
}

// 创建支付链接（用于二维码或跳转）
export function createPaymentUrl(order: OrderInfo): string {
    const params: Record<string, string> = {
        pid: PAYMENT_CONFIG.pid,
        type: order.type,
        out_trade_no: order.outTradeNo,
        notify_url: order.notifyUrl || PAYMENT_CONFIG.notifyUrl,
        return_url: order.returnUrl || PAYMENT_CONFIG.returnUrl,
        name: order.name,
        money: order.money,
    }
    
    // 生成签名
    params.sign = generateSign(params, PAYMENT_CONFIG.key)
    params.sign_type = 'MD5'
    
    // 构建URL
    const queryString = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    
    return `${PAYMENT_CONFIG.url}/submit.php?${queryString}`
}

// 创建支付API调用（获取二维码）
export async function createPaymentQRCode(order: OrderInfo): Promise<{
    success: boolean
    qrcode?: string
    payUrl?: string
    error?: string
}> {
    try {
        const params: Record<string, string> = {
            pid: PAYMENT_CONFIG.pid,
            type: order.type,
            out_trade_no: order.outTradeNo,
            notify_url: order.notifyUrl || PAYMENT_CONFIG.notifyUrl,
            name: order.name,
            money: order.money,
        }
        
        // 生成签名
        params.sign = generateSign(params, PAYMENT_CONFIG.key)
        params.sign_type = 'MD5'
        
        // 调用API获取二维码
        const response = await fetch(`${PAYMENT_CONFIG.url}/mapi.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(params).toString(),
        })
        
        const data = await response.json()
        
        if (data.code === 1) {
            return {
                success: true,
                qrcode: data.qrcode,
                payUrl: data.payurl,
            }
        } else {
            return {
                success: false,
                error: data.msg || '创建支付订单失败',
            }
        }
    } catch (error) {
        console.error('Create payment error:', error)
        return {
            success: false,
            error: '支付服务暂时不可用',
        }
    }
}

// 查询订单状态
export async function queryOrderStatus(outTradeNo: string): Promise<{
    success: boolean
    status?: 'pending' | 'paid' | 'failed'
    tradeNo?: string
    error?: string
}> {
    try {
        const params: Record<string, string> = {
            act: 'order',
            pid: PAYMENT_CONFIG.pid,
            out_trade_no: outTradeNo,
        }
        
        params.sign = generateSign(params, PAYMENT_CONFIG.key)
        params.sign_type = 'MD5'
        
        const queryString = new URLSearchParams(params).toString()
        const response = await fetch(`${PAYMENT_CONFIG.url}/api.php?${queryString}`)
        const data = await response.json()
        
        if (data.code === 1) {
            let status: 'pending' | 'paid' | 'failed' = 'pending'
            if (data.status === 1) status = 'paid'
            else if (data.status === -1) status = 'failed'
            
            return {
                success: true,
                status,
                tradeNo: data.trade_no,
            }
        } else {
            return {
                success: false,
                error: data.msg || '查询失败',
            }
        }
    } catch (error) {
        console.error('Query order error:', error)
        return {
            success: false,
            error: '查询服务暂时不可用',
        }
    }
}

// 解析回调参数
export interface PaymentNotifyParams {
    pid: string
    trade_no: string       // 平台订单号
    out_trade_no: string   // 商户订单号
    type: string           // 支付方式
    name: string           // 商品名称
    money: string          // 金额
    trade_status: string   // 交易状态 TRADE_SUCCESS
    sign: string           // 签名
    sign_type: string      // 签名类型
}

// 验证回调
export function verifyNotify(params: PaymentNotifyParams): boolean {
    const { sign, sign_type, ...rest } = params
    return verifySign(rest as Record<string, string>, PAYMENT_CONFIG.key, sign)
}
