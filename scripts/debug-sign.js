#!/usr/bin/env node
/**
 * 调试脚本：完整模拟 alipay-sdk 的签名流程
 * 对比本地签名字符串与网关验签字符串
 * 运行: node -r dotenv/config scripts/debug-sign.js
 */
const crypto = require('crypto')
const snakecaseKeys = require('snakecase-keys')

// 加载 .env
try { require('dotenv').config() } catch (_) { }

const appId = process.env.ALIPAY_APP_ID
const privateKey = process.env.ALIPAY_PRIVATE_KEY?.trim().replace(/\r/g, '')
const isSandbox = process.env.ALIPAY_SANDBOX === 'true' || process.env.ALIPAY_SANDBOX === '1'

if (!appId || !privateKey) {
    console.error('缺少 ALIPAY_APP_ID 或 ALIPAY_PRIVATE_KEY')
    process.exit(1)
}

function formatKey(key, type) {
    const k = key.trim().replace(/\r/g, '')
    if (k.includes('BEGIN')) return k
    return `-----BEGIN ${type}-----\n${k}\n-----END ${type}-----`
}

// 模拟 utility 包的 YYYYMMDDHHmmss
function YYYYMMDDHHmmss(d = new Date()) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// ============ 完整模拟 SDK 签名流程 ============

console.log('=== 环境 ===')
console.log('APP_ID:', appId)
console.log('沙箱模式:', isSandbox)
console.log('网关:', isSandbox
    ? 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'
    : 'https://openapi.alipay.com/gateway.do')
console.log()

// 模拟 createPagePay 传入的参数
const bizContent = {
    out_trade_no: 'TEST_DEBUG_' + Date.now(),
    total_amount: '9.90',
    subject: '大五人格测试 - 高级分析报告',
    product_code: 'FAST_INSTANT_TRADE_PAY'
}

const timestamp = YYYYMMDDHHmmss()

// 构造签名参数 (模拟 sign() 函数)
const signParams = {
    method: 'alipay.trade.page.pay',
    appId: appId,
    charset: 'utf-8',
    version: '1.0',
    signType: 'RSA2',
    timestamp: timestamp,
    alipaySdk: 'alipay-sdk-nodejs-4.0.0',
    returnUrl: 'http://localhost:3000/results/test123?payment=success',
    // notifyUrl 如果为空则不传
}

// bizContent 先 JSON.stringify
signParams.bizContent = JSON.stringify(bizContent)

// 驼峰转下划线
const decamelizeParams = snakecaseKeys(signParams)

console.log('=== 转换后的参数 (snake_case) ===')
for (const [k, v] of Object.entries(decamelizeParams)) {
    console.log(`  ${k} = ${v}`)
}
console.log()

// 排序并构造签名字符串
const signString = Object.keys(decamelizeParams).sort()
    .map(key => {
        let data = decamelizeParams[key]
        if (Array.prototype.toString.call(data) !== '[object String]') {
            data = JSON.stringify(data)
        }
        return `${key}=${data}`
    })
    .join('&')

console.log('=== 本地签名字符串 ===')
console.log(signString)
console.log()

// 签名
const privPem = formatKey(privateKey, 'RSA PRIVATE KEY')
const signature = crypto.createSign('RSA-SHA256')
    .update(signString, 'utf8')
    .sign(privPem, 'base64')

console.log('=== 签名结果 ===')
console.log('sign:', signature.substring(0, 40) + '...')
console.log()

// 从私钥导出公钥并验签
const pubKey = crypto.createPublicKey(privPem)
const pubKeyDer = pubKey.export({ type: 'spki', format: 'der' })
const pubKeyBase64 = pubKeyDer.toString('base64')
const pubPem = `-----BEGIN PUBLIC KEY-----\n${pubKeyBase64}\n-----END PUBLIC KEY-----`

const ok = crypto.createVerify('RSA-SHA256')
    .update(signString, 'utf8')
    .verify(pubPem, signature, 'base64')

console.log('=== 本地验签 ===')
console.log('用导出的应用公钥验签:', ok ? '✅ 通过' : '❌ 不通过')
console.log()

// ============ 对比网关验签字符串 ============

// 网关给的验签字符串 (从错误信息中复制，已替换 &amp; → & 和 &quot; → ")
const gatewayStr = 'alipay_sdk=alipay-sdk-nodejs-4.0.0&app_id=9021000161667368&biz_content={"out_trade_no":"PR1771092940114TS5ZY6","total_amount":"9.90","subject":"大五人格测试 - 高级分析报告","product_code":"FAST_INSTANT_TRADE_PAY"}&charset=utf-8&method=alipay.trade.page.pay&return_url=http://localhost:3000/results/cmlml23kp0001sdi2jih21nor?payment=success&sign_type=RSA2&timestamp=2026-02-15 02:15:40&version=1.0'

console.log('=== 网关验签字符串 ===')
console.log(gatewayStr)
console.log()

// 逐个参数对比
console.log('=== 参数对比 ===')
const localParams = signString.split('&').map(s => { const i = s.indexOf('='); return [s.substring(0, i), s.substring(i + 1)] })
const gatewayParams = gatewayStr.split('&').map(s => { const i = s.indexOf('='); return [s.substring(0, i), s.substring(i + 1)] })

// 注意：网关字符串中 return_url 的值包含了 ? 和后面的 payment=success
// 但 & 会被错误地分割。让我们重新解析
console.log('网关参数拆分（注意 return_url 中的 ? 可能导致错误拆分）:')
for (let i = 0; i < gatewayParams.length; i++) {
    console.log(`  [${i}] ${gatewayParams[i][0]} = ${gatewayParams[i][1]}`)
}
console.log()

console.log('本地参数拆分:')
for (let i = 0; i < localParams.length; i++) {
    console.log(`  [${i}] ${localParams[i][0]} = ${localParams[i][1]}`)
}
console.log()

// ============ 关键检查：私钥格式 ============
console.log('=== 私钥格式检查 ===')
// 检查 PKCS#1 vs PKCS#8
const keyBuf = Buffer.from(privateKey.replace(/-----.*-----/g, '').replace(/\s/g, ''), 'base64')
console.log('Key DER 前6字节(hex):', keyBuf.slice(0, 6).toString('hex'))
console.log('Key DER 第5-8字节(hex):', keyBuf.slice(4, 8).toString('hex'))

// PKCS#1: 30 82 xx xx 02 01 00 02 ...  (version INTEGER, then modulus INTEGER)
// PKCS#8: 30 82 xx xx 02 01 00 30 ...  (version INTEGER, then algorithm SEQUENCE)
const afterVersion = keyBuf[7]
if (afterVersion === 0x02) {
    console.log('✅ 密钥格式: PKCS#1 (RSA PRIVATE KEY) - 与 SDK 默认设置匹配')
} else if (afterVersion === 0x30) {
    console.log('⚠️  密钥格式: PKCS#8 (PRIVATE KEY) - 需要设置 keyType: "PKCS8"!')
    console.log('  这可能是导致 invalid-signature 的原因！')
} else {
    console.log('❓ 无法确定密钥格式, 第8字节:', '0x' + afterVersion.toString(16))
}

// 测试两种格式是否都能正确签名
console.log()
console.log('=== 两种格式签名测试 ===')
const testStr = 'test'
try {
    const pem1 = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`
    const sig1 = crypto.createSign('RSA-SHA256').update(testStr).sign(pem1, 'base64')
    console.log('PKCS#1 (RSA PRIVATE KEY) 签名: ✅ 成功')

    const pem8 = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
    try {
        const sig8 = crypto.createSign('RSA-SHA256').update(testStr).sign(pem8, 'base64')
        console.log('PKCS#8 (PRIVATE KEY) 签名: ✅ 成功')
        console.log('两种格式签名结果相同:', sig1 === sig8)
    } catch (e) {
        console.log('PKCS#8 (PRIVATE KEY) 签名: ❌ 失败 -', e.message)
    }
} catch (e) {
    console.log('PKCS#1 (RSA PRIVATE KEY) 签名: ❌ 失败 -', e.message)
    try {
        const pem8 = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
        const sig8 = crypto.createSign('RSA-SHA256').update(testStr).sign(pem8, 'base64')
        console.log('PKCS#8 (PRIVATE KEY) 签名: ✅ 成功')
        console.log('  ⚠️ 密钥实际上是 PKCS#8 格式！需要修改 SDK 配置！')
    } catch (e2) {
        console.log('PKCS#8 (PRIVATE KEY) 签名: ❌ 也失败 -', e2.message)
    }
}

console.log()
console.log('=== 结论 ===')
console.log('如果以上所有检查都通过但仍然报错 invalid-signature，')
console.log('请确认支付宝沙箱控制台中填入的「应用公钥」前20字符为:', pubKeyBase64.substring(0, 20))
