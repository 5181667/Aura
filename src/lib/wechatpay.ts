/**
 * 微信支付 API v3 - Native 支付（PC 扫码）
 * 文档：https://pay.weixin.qq.com/doc/v3/merchant/4012791874
 * Native 下单：https://pay.weixin.qq.com/doc/v3/merchant/4012791877
 */
import crypto from 'crypto'

const WX_PAY_BASE = 'https://api.mch.weixin.qq.com'

export interface WechatPayConfig {
    appId: string
    mchId: string
    /** 商户 API 证书私钥（PEM 内容，可与 .env 一行） */
    privateKey: string
    /** 商户证书序列号（apiclient_cert.pem 的 serial） */
    serialNo: string
    /** APIv3 密钥（32 字节，用于回调解密） */
    apiV3Key: string
}

/** 是否已配置微信支付（含 AppID，未配置时前端不展示微信选项） */
export function isWechatPayConfigured(): boolean {
    return !!(
        process.env.WECHAT_PAY_APP_ID &&
        process.env.WECHAT_PAY_MCH_ID &&
        process.env.WECHAT_PAY_PRIVATE_KEY &&
        process.env.WECHAT_PAY_SERIAL_NO &&
        process.env.WECHAT_PAY_API_V3_KEY
    )
}

function getConfig(): WechatPayConfig {
    const appId = process.env.WECHAT_PAY_APP_ID
    const mchId = process.env.WECHAT_PAY_MCH_ID
    const privateKey = process.env.WECHAT_PAY_PRIVATE_KEY
    const serialNo = process.env.WECHAT_PAY_SERIAL_NO
    const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY

    if (!appId || !mchId || !privateKey || !serialNo || !apiV3Key) {
        throw new Error(
            '微信支付配置缺失: WECHAT_PAY_APP_ID, WECHAT_PAY_MCH_ID, WECHAT_PAY_PRIVATE_KEY, WECHAT_PAY_SERIAL_NO, WECHAT_PAY_API_V3_KEY'
        )
    }

    return {
        appId,
        mchId,
        privateKey: privateKey.trim().replace(/\r/g, ''),
        serialNo: serialNo.trim(),
        apiV3Key,
    }
}

/** 格式化 PEM：若无 BEGIN/END 则自动包裹（微信商户证书私钥多为 PKCS#1） */
function formatPrivateKey(key: string): string {
    const k = key.trim().replace(/\r/g, '')
    if (k.includes('BEGIN')) return k
    return `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`
}

/**
 * 构造 V3 签名串并签名
 * 签名串 = 请求方法\n + URL\n + 时间戳\n + 随机串\n + 报文主体\n
 */
function signRequest(
    method: string,
    urlPath: string,
    timestamp: string,
    nonce: string,
    body: string,
    privateKeyPem: string
): string {
    const signStr = `${method}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`
    const key = formatPrivateKey(privateKeyPem)
    return crypto.createSign('RSA-SHA256').update(signStr, 'utf8').sign(key, 'base64')
}

/** 生成 Authorization 请求头 */
function buildAuthorization(
    mchId: string,
    serialNo: string,
    timestamp: string,
    nonce: string,
    signature: string
): string {
    const params = [
        `mchid="${mchId}"`,
        `nonce_str="${nonce}"`,
        `signature="${signature}"`,
        `timestamp="${timestamp}"`,
        `serial_no="${serialNo}"`,
    ]
    return `WECHATPAY2-SHA256-RSA2048 ${params.join(',')}`
}

/**
 * Native 下单：获取 code_url，用于生成二维码
 * 金额单位：分（整数）
 */
export async function createNativeOrder(params: {
    outTradeNo: string
    description: string
    totalFen: number
    notifyUrl: string
}): Promise<{ success: boolean; codeUrl?: string; error?: string }> {
    try {
        const config = getConfig()
        const urlPath = '/v3/pay/transactions/native'
        const method = 'POST'
        const timestamp = Math.floor(Date.now() / 1000).toString()
        const nonce = crypto.randomBytes(16).toString('hex')

        const bodyObj = {
            appid: config.appId,
            mchid: config.mchId,
            description: params.description,
            out_trade_no: params.outTradeNo,
            notify_url: params.notifyUrl,
            amount: {
                total: params.totalFen,
                currency: 'CNY',
            },
        }
        const body = JSON.stringify(bodyObj)

        const signature = signRequest(method, urlPath, timestamp, nonce, body, config.privateKey)
        const authorization = buildAuthorization(
            config.mchId,
            config.serialNo,
            timestamp,
            nonce,
            signature
        )

        const res = await fetch(`${WX_PAY_BASE}${urlPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: authorization,
                'User-Agent': 'usus-premium-report/1.0',
            },
            body,
        })

        const data = await res.json().catch(() => ({})) as {
            code_url?: string
            code?: string
            message?: string
            err_code_des?: string
        }

        if (data.code_url) {
            return { success: true, codeUrl: data.code_url }
        }

        return {
            success: false,
            error: data.message || data.err_code_des || data.code || `HTTP ${res.status}`,
        }
    } catch (error: any) {
        console.error('[WechatPay] Native order error:', error)
        return { success: false, error: error.message || '微信支付暂不可用' }
    }
}

/**
 * 查询订单状态（用于轮询）
 * GET /v3/pay/transactions/out-trade-no/{out_trade_no}?mchid=xxx
 */
export async function queryWechatOrder(outTradeNo: string): Promise<{
    success: boolean
    status?: 'SUCCESS' | 'NOTPAY' | 'CLOSED' | 'REVOKED' | 'USERPAYING' | 'PAYERROR'
    error?: string
}> {
    try {
        const config = getConfig()
        const urlPath = `/v3/pay/transactions/out-trade-no/${outTradeNo}?mchid=${config.mchId}`
        const method = 'GET'
        const timestamp = Math.floor(Date.now() / 1000).toString()
        const nonce = crypto.randomBytes(16).toString('hex')
        const body = ''

        const signature = signRequest(method, urlPath, timestamp, nonce, body, config.privateKey)
        const authorization = buildAuthorization(
            config.mchId,
            config.serialNo,
            timestamp,
            nonce,
            signature
        )

        const res = await fetch(`${WX_PAY_BASE}${urlPath}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: authorization,
                'User-Agent': 'usus-premium-report/1.0',
            },
        })

        const data = await res.json().catch(() => ({})) as {
            trade_state?: string
            code?: string
            message?: string
        }

        if (data.trade_state) {
            return { success: true, status: data.trade_state as any }
        }
        return { success: false, error: data.message || data.code || `HTTP ${res.status}` }
    } catch (error: any) {
        console.error('[WechatPay] Query order error:', error)
        return { success: false, error: error.message || '查询失败' }
    }
}

/**
 * 解密回调中的 resource（AES-256-GCM）
 * 文档：https://pay.weixin.qq.com/doc/v3/apis/chapter3_4_5.shtml
 */
export function decryptWechatNotifyResource(
    ciphertext: string,
    nonce: string,
    associatedData: string,
    apiV3Key: string
): string {
    const key = Buffer.from(apiV3Key, 'utf8')
    const nonceBuf = Buffer.from(nonce, 'utf8')
    const aad = Buffer.from(associatedData, 'utf8')
    const buf = Buffer.from(ciphertext, 'base64')
    const authTag = buf.subarray(-16)
    const data = buf.subarray(0, -16)

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonceBuf)
    decipher.setAuthTag(authTag)
    decipher.setAAD(aad)
    return decipher.update(data, undefined, 'utf8') + decipher.final('utf8')
}

/** 校验回调签名（需使用微信支付平台证书公钥，此处仅做占位；生产建议用平台证书或官方 SDK 验签） */
export function verifyWechatNotifySign(
    _timestamp: string,
    _nonce: string,
    _body: string,
    _signature: string,
    _wechatCertPublicKey: string
): boolean {
    // 完整验签需平台证书公钥，见 https://pay.weixin.qq.com/doc/v3/apis/chapter3_4_5.shtml
    // 此处仅做占位，实际应在 wechat-notify 中实现
    return true
}
