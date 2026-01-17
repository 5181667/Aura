const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('--- 创建/更新 管理员用户 ---');

    try {
        const email = await question('请输入管理员邮箱: ');
        if (!email) {
            console.error('错误: 邮箱不能为空');
            process.exit(1);
        }

        const password = await question('请输入密码: ');
        if (!password) {
            console.error('错误: 密码不能为空');
            process.exit(1);
        }

        const name = await question('请输入用户名 (可选, 按回车跳过): ');

        console.log('正在处理...');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                ...(name ? { name } : {}),
            },
            create: {
                email: email,
                password: hashedPassword,
                name: name || 'Admin',
                role: 'ADMIN',
            },
        });

        console.log('\n✅ 操作成功!');
        console.log(`用户: ${user.email}`);
        console.log(`角色: ${user.role}`);
        console.log(`ID: ${user.id}`);

    } catch (error) {
        console.error('\n❌ 发生错误:', error);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

main();
