# AuraTest 部署指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 数据库配置

确保已安装 PostgreSQL，然后配置环境变量：

创建 `.env` 文件：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/auratest"

# NextAuth 配置
NEXTAUTH_SECRET="生成一个随机密钥"
NEXTAUTH_URL="http://localhost:3000"

# 邮件配置（可选）
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

生成 NextAuth Secret：

```bash
openssl rand -base64 32
```

### 3. 数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 查看数据库
npx prisma studio
```

### 4. 创建测试数据（可选）

```bash
node prisma/seed-disc.js
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

### 6. 创建管理员账户

1. 注册一个普通账户
2. 在数据库中修改该用户的 `role` 字段为 `ADMIN`：

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

或使用 Prisma Studio 可视化修改。

## 📦 生产部署

### Vercel 部署

1. 在 Vercel 创建项目并连接 GitHub 仓库

2. 配置环境变量（在 Vercel Dashboard）：
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`（设置为你的域名）

3. 部署数据库：
   - 推荐使用 Vercel Postgres 或 Supabase
   - 运行迁移：`npx prisma migrate deploy`

4. 推送代码，Vercel 会自动构建和部署

### Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: auratest
      POSTGRES_PASSWORD: password
      POSTGRES_DB: auratest
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://auratest:password@db:5432/auratest"
      NEXTAUTH_SECRET: "your-secret-here"
      NEXTAUTH_URL: "http://localhost:3000"
    depends_on:
      - db

volumes:
  postgres_data:
```

运行：

```bash
docker-compose up -d
```

## 🔧 生产优化

### 1. 环境变量检查

确保所有生产环境变量已正确设置：

```bash
# .env.production
NODE_ENV=production
DATABASE_URL="your-production-db-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### 2. 数据库优化

```bash
# 生产环境迁移
npx prisma migrate deploy

# 生成优化的 Prisma Client
npx prisma generate --no-engine
```

### 3. 构建优化

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 4. 文件上传配置

如果使用云存储（如 AWS S3、Cloudinary）：

1. 安装相应 SDK
2. 修改 `/src/app/api/user/upload-avatar/route.ts`
3. 配置云存储环境变量

### 5. 邮件服务配置

修改 `/src/app/api/auth/code/route.ts` 以使用真实的 SMTP 服务：

```typescript
// 使用 nodemailer 发送真实邮件
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: 'AuraTest 验证码',
  html: `你的验证码是：<strong>${code}</strong>`
});
```

## 🛡️ 安全建议

1. **强密钥**: 使用强随机密钥作为 `NEXTAUTH_SECRET`
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **环境变量**: 不要将 `.env` 文件提交到版本控制
4. **数据库备份**: 定期备份生产数据库
5. **日志监控**: 配置日志监控和错误追踪（如 Sentry）
6. **限流**: 添加 API 限流防止滥用

## 📊 监控与维护

### 日志查看

```bash
# Vercel
vercel logs

# Docker
docker-compose logs -f app
```

### 数据库维护

```bash
# 查看数据库状态
npx prisma db pull

# 重置数据库（危险！仅开发环境）
npx prisma migrate reset
```

### 性能优化

1. 启用 Next.js 图片优化
2. 配置 CDN
3. 使用 Redis 缓存
4. 数据库索引优化

## 🐛 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 格式
   - 确认数据库服务运行中
   - 检查防火墙规则

2. **NextAuth 错误**
   - 确认 `NEXTAUTH_SECRET` 已设置
   - 检查 `NEXTAUTH_URL` 是否正确
   - 清除浏览器 cookies

3. **文件上传失败**
   - 检查 `public/uploads` 目录权限
   - 确认文件大小限制
   - 查看服务器磁盘空间

4. **Socket.io 连接失败**
   - 确保 WebSocket 连接被允许
   - 检查代理/负载均衡器配置

## 📞 支持

如有问题，请查看：
- GitHub Issues
- 项目文档
- 开发者社区

---

祝您部署顺利！🎉
