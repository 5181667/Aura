import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// 生成随机兑换码：8位大写字母+数字
function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 去除易混淆的 I/O/0/1
    let code = ''
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// 批量生成唯一兑换码
async function generateUniqueCodes(count: number): Promise<string[]> {
    const codes = new Set<string>()
    // 获取已有兑换码
    const existing = await prisma.redemptionCode.findMany({
        select: { code: true }
    })
    const existingSet = new Set(existing.map(e => e.code))

    let attempts = 0
    const maxAttempts = count * 10

    while (codes.size < count && attempts < maxAttempts) {
        const code = generateCode()
        if (!existingSet.has(code) && !codes.has(code)) {
            codes.add(code)
        }
        attempts++
    }

    return Array.from(codes)
}

// GET - 分页查询兑换码列表
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '20')
        const batchName = searchParams.get('batchName') || undefined
        const testType = searchParams.get('testType') || undefined
        const status = searchParams.get('status') || 'all' // all / unused / used / expired

        // 构建查询条件
        const where: any = {}

        if (batchName) {
            where.batchName = batchName
        }

        if (testType) {
            where.testType = testType
        }

        if (status === 'unused') {
            where.isUsed = false
            where.OR = [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        } else if (status === 'used') {
            where.isUsed = true
        } else if (status === 'expired') {
            where.isUsed = false
            where.expiresAt = { lt: new Date(), not: null }
        }

        const [codes, total] = await Promise.all([
            prisma.redemptionCode.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.redemptionCode.count({ where })
        ])

        // 获取所有批次名（用于筛选下拉）
        const batches = await prisma.redemptionCode.findMany({
            select: { batchName: true },
            distinct: ['batchName'],
            where: { batchName: { not: null } }
        })

        // 统计概览
        const [totalCodes, usedCodes, expiredCodes] = await Promise.all([
            prisma.redemptionCode.count(),
            prisma.redemptionCode.count({ where: { isUsed: true } }),
            prisma.redemptionCode.count({
                where: {
                    isUsed: false,
                    expiresAt: { lt: new Date(), not: null }
                }
            })
        ])

        return NextResponse.json({
            codes,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            batches: batches.map(b => b.batchName).filter(Boolean),
            stats: {
                total: totalCodes,
                used: usedCodes,
                unused: totalCodes - usedCodes - expiredCodes,
                expired: expiredCodes,
            }
        })

    } catch (error) {
        console.error("GET_REDEMPTION_CODES_ERROR", error)
        return NextResponse.json({ message: "获取兑换码列表失败" }, { status: 500 })
    }
}

// POST - 批量生成兑换码
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: "无权限" }, { status: 403 })
        }

        const { count, batchName, expiresAt, testType } = await req.json()

        if (!count || count < 1 || count > 500) {
            return NextResponse.json({ message: "生成数量需在 1-500 之间" }, { status: 400 })
        }

        const validTypes = ['MBTI', 'BIG_FIVE', 'DISC', 'EQ', 'HOLLAND', 'ENNEAGRAM', 'TALENT', 'MENTAL_AGE', 'ALL']
        if (!testType || !validTypes.includes(testType)) {
            return NextResponse.json({ message: "请选择有效的测试类型" }, { status: 400 })
        }

        // 生成唯一兑换码
        const codes = await generateUniqueCodes(count)

        if (codes.length < count) {
            return NextResponse.json({ message: "生成兑换码失败，请重试" }, { status: 500 })
        }

        // 批量写入数据库
        const data = codes.map(code => ({
            code,
            testType,
            batchName: batchName || null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        }))

        await prisma.redemptionCode.createMany({ data })

        return NextResponse.json({
            success: true,
            count: codes.length,
            codes,
            testType,
            batchName: batchName || null,
        })

    } catch (error) {
        console.error("CREATE_REDEMPTION_CODES_ERROR", error)
        return NextResponse.json({ message: "生成兑换码失败" }, { status: 500 })
    }
}
