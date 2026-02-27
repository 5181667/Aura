#!/usr/bin/env node
/**
 * 校验：当前 .env 中的「应用私钥」与「应用公钥」是否成对
 * 应用公钥 = 你在沙箱里填的那串（和私钥一起生成的那把公钥）
 * 运行: node scripts/verify-alipay-keys.js
 * 需要先加载 .env，建议: node -r dotenv/config scripts/verify-alipay-keys.js
 */
const crypto = require('crypto')

function loadEnv() {
    try {
        require('dotenv').config()
    } catch (_) {}
    const privateKey = process.env.ALIPAY_PRIVATE_KEY
    const appPublicKey = process.env.ALIPAY_PUBLIC_KEY
    return { privateKey, appPublicKey }
}

// 你填在沙箱「应用公钥」里的那串（和 ALIPAY_PRIVATE_KEY 成对）
const SANDBOX_APP_PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjV8cu2MysKIAk78ABT3gz9W1wnwxkYbpvJ2tHAKeaE1uCJgLqpjLBfm+XFsspnutSuc9vDdB2/XKrD4ci2VrmCdXWheQPoi8L5hQmvZI84HkX3SvCFxhKPeLjtMW1a41hn2zWUciQkJYhhrrnUMPk3wQPAaPRqCogYV69gaKv0N+SLgZKZU/6vyV+8jsX1raR1Lt/rKTOMp6ZfaW/1Rb79zPsCmKJzG/50lrXhur0jL0vuVJ4wgOwn5XVrx0VzFONyGXIpm++tJvNQEs9kojEJvRwOEkGPwqPbyqmfrImhmSv8QhKFVjrX5npASdZA1R7oFc3LMSVREXuLbCI5Tu7QIDAQAB`

function formatKey(key, type) {
    if (!key) return ''
    const k = key.trim().replace(/\r/g, '')
    if (k.includes('BEGIN')) return k
    return `-----BEGIN ${type}-----\n${k}\n-----END ${type}-----`
}

function main() {
    const { privateKey, appPublicKey } = loadEnv()
    if (!privateKey) {
        console.error('未找到 ALIPAY_PRIVATE_KEY，请确保 .env 已配置')
        process.exit(1)
    }

    const privPem = formatKey(privateKey, 'RSA PRIVATE KEY')
    const testStr = 'alipay_sdk=alipay-sdk-nodejs-4.0.0&app_id=9021000161667368&charset=utf-8&method=alipay.trade.page.pay&sign_type=RSA2&timestamp=2026-02-15 01:32:58&version=1.0'

    let signBase64
    try {
        signBase64 = crypto.createSign('RSA-SHA256').update(testStr, 'utf8').sign(privPem, 'base64')
    } catch (e) {
        console.error('应用私钥格式有误，无法签名:', e.message)
        process.exit(1)
    }

    // 用「沙箱里填的应用公钥」验签
    const appPubPem = formatKey(SANDBOX_APP_PUBLIC_KEY, 'PUBLIC KEY')
    const okByApp = crypto.createVerify('RSA-SHA256').update(testStr, 'utf8').verify(appPubPem, signBase64, 'base64')

    console.log('使用你沙箱里填的「应用公钥」验签:', okByApp ? '通过' : '不通过')
    if (!okByApp) {
        console.log('\n说明：.env 里的应用私钥 与 沙箱「应用公钥」不是同一对。')
        console.log('请到沙箱 接口加签方式 中，把与当前应用私钥一起生成的那串「应用公钥」粘贴进去并保存。')
        process.exit(1)
    }

    console.log('\n密钥对一致。若支付宝仍报 invalid-signature，请确认沙箱里保存的「应用公钥」与上面脚本中的 SANDBOX_APP_PUBLIC_KEY 一致（可对比前 50 字符）。')
}

main()
