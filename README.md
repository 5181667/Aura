# AuraTest - 心理测试与社交平台

一个现代化的心理测试与社交平台，提供多维度性格测试、深度分析报告和社交功能。

## 🚀 功能特性

### 核心功能
- ✅ **用户认证系统**
  - 邮箱验证码注册
  - 注册后自动登录
  - Session 持久化（30天）
  - 路由权限保护

- ✅ **测试系统**
  - 多种测试类型（MBTI、性格测试等）
  - 大五人格维度分析
  - 实时测试引擎

- ✅ **结果深度分析**
  - 五维雷达图可视化
  - 详细性格解析报告
  - 历史测试轨迹展示
  - 分享功能（链接、图片、PDF）

- ✅ **社交功能**
  - 好友搜索与添加
  - 好友申请管理
  - 在线状态显示
  - 实时聊天（Socket.io）

- ✅ **个人中心**
  - 头像上传
  - 测试历史时间线
  - 好友管理

- ✅ **管理后台**
  - 用户管理（角色切换）
  - 测试类型管理
  - 数据统计仪表盘
  - 可视化题目编辑器
    - 拖拽排序
    - 实时预览
    - 题目模板

## 🛠️ 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 动画**: Framer Motion
- **样式**: CSS Modules + 全局样式
- **认证**: NextAuth.js
- **数据库**: PostgreSQL + Prisma ORM
- **实时通信**: Socket.io
- **图表**: Recharts
- **拖拽**: @dnd-kit
- **文件处理**: html2canvas, jsPDF

## 📦 安装依赖

首先安装项目依赖：

\`\`\`bash
npm install
\`\`\`

安装新增的依赖：

\`\`\`bash
npm install recharts html2canvas jspdf @dnd-kit/core @dnd-kit/sortable
\`\`\`

## 🗄️ 数据库设置

1. 确保 PostgreSQL 已安装并运行

2. 配置环境变量（创建 `.env` 文件）：

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/auratest"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

3. 运行数据库迁移：

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

4. （可选）填充测试数据：

\`\`\`bash
node prisma/seed-disc.js
\`\`\`

## 🚀 运行项目

开发模式：

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

\`\`\`
usus/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # 认证相关
│   │   │   ├── friends/       # 好友功能
│   │   │   ├── tests/         # 测试提交
│   │   │   ├── share/         # 分享功能
│   │   │   ├── user/          # 用户设置
│   │   │   └── admin/         # 管理员 API
│   │   ├── admin/             # 管理后台
│   │   │   ├── users/         # 用户管理
│   │   │   └── tests/         # 测试管理
│   │   ├── dashboard/         # 个人中心
│   │   │   └── friends/       # 好友管理
│   │   ├── tests/             # 测试页面
│   │   ├── results/           # 结果展示
│   │   └── share/             # 分享页面
│   ├── components/            # 可复用组件
│   │   ├── RadarChart.tsx
│   │   ├── PersonalityReport.tsx
│   │   ├── ShareDialog.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── TestTimeline.tsx
│   │   ├── Loading.tsx
│   │   └── Toast.tsx
│   └── lib/                   # 工具函数
│       ├── prisma.ts
│       └── formatLastActive.ts
├── prisma/
│   └── schema.prisma          # 数据库模型
└── public/
    └── uploads/               # 用户上传文件
\`\`\`

## 🔑 关键功能说明

### 权限系统
- 普通用户：可进行测试、社交
- 管理员：可访问后台，管理用户和测试

### 测试结果分析
- 基于 MBTI 四维度计算
- 转换为大五人格维度（开放性、尽责性、外向性、亲和性、神经质）
- 生成雷达图和详细报告

### 在线状态
- 基于 `lastActiveAt` 字段
- 5分钟内活跃显示"在线"
- 自动格式化时间显示

### 文件上传
- 支持 JPG、PNG、GIF、WebP
- 最大 5MB
- 存储在 `public/uploads/avatars/`

## 🎨 UI 设计特点

- 深色主题，渐变色彩
- 毛玻璃效果（Glassmorphism）
- 流畅动画过渡
- 响应式设计（移动端适配）
- Toast 通知反馈
- Loading 状态指示

## 📝 待完善功能

- [ ] 邮件发送功能（目前在控制台输出）
- [ ] 云存储集成（头像上传）
- [ ] 更多测试类型
- [ ] 数据统计图表
- [ ] 测试结果对比
- [ ] 好友推荐算法

## 📄 License

MIT

## 👨‍💻 开发者

AuraTest Team

---

**提示**: 首次运行请确保创建管理员账户，可在数据库中手动修改用户 `role` 字段为 `ADMIN`。
