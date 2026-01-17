# AuraTest 阿里云服务器部署指南

## 📋 前置准备

### 1. 阿里云服务器要求
- **系统**: Ubuntu 20.04/22.04 或 CentOS 7/8
- **配置**: 最低 2核4G，推荐 4核8G
- **带宽**: 最低 3Mbps
- **端口**: 开放 80, 443, 3000 端口

### 2. 本地准备
- ✅ 代码已推送到 GitHub: https://github.com/5181667/Aura.git
- SSH 密钥（用于连接服务器）

## 🚀 部署步骤

### 第一步：连接到阿里云服务器

```bash
# 使用 SSH 连接（替换为你的服务器 IP）
ssh root@你的服务器IP

# 如果使用密钥文件
ssh -i /path/to/your/key.pem root@你的服务器IP
```

### 第二步：安装必要软件

#### 1. 更新系统
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS
sudo yum update -y
```

#### 2. 安装 Node.js 20
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 验证安装
node -v  # 应显示 v20.x.x
npm -v
```

#### 3. 安装 PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib -y

# CentOS
sudo yum install postgresql-server postgresql-contrib -y
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 4. 配置 PostgreSQL
```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 PostgreSQL 命令行中执行：
CREATE DATABASE auratest;
CREATE USER auratest_user WITH PASSWORD '你的数据库密码';
GRANT ALL PRIVILEGES ON DATABASE auratest TO auratest_user;
\q
```

#### 5. 安装 PM2（进程管理器）
```bash
npm install -g pm2
```

#### 6. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS
sudo yum install nginx -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 第三步：克隆项目

```bash
# 创建项目目录
cd /var/www
sudo mkdir auratest
sudo chown $USER:$USER auratest

# 克隆项目
cd auratest
git clone https://github.com/5181667/Aura.git .

# 如果是私有仓库，需要配置 GitHub 访问
# git clone https://你的用户名:你的token@github.com/5181667/Aura.git .
```

### 第四步：配置环境变量

```bash
# 创建 .env 文件
nano .env
```

填入以下内容（**请替换为实际值**）：

```env
# 数据库配置
DATABASE_URL="postgresql://auratest_user:你的数据库密码@localhost:5432/auratest"

# NextAuth 配置
NEXTAUTH_SECRET="运行以下命令生成: openssl rand -base64 32"
NEXTAUTH_URL="http://你的服务器IP:3000"  # 或你的域名

# 邮件配置（可选）
SMTP_HOST="smtp.aliyun.com"  # 阿里云邮箱
SMTP_PORT="465"
SMTP_USER="your-email@aliyun.com"
SMTP_PASSWORD="your-smtp-password"

# Node 环境
NODE_ENV="production"
```

生成 NEXTAUTH_SECRET：
```bash
openssl rand -base64 32
```

### 第五步：安装依赖和构建

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma db push

# （可选）填充测试数据
node prisma/seed-disc.js

# 构建生产版本
npm run build
```

### 第六步：使用 PM2 启动应用

```bash
# 启动应用
pm2 start npm --name "auratest" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs auratest

# 其他 PM2 命令
pm2 status          # 查看状态
pm2 restart auratest # 重启
pm2 stop auratest    # 停止
pm2 delete auratest  # 删除
```

### 第七步：配置 Nginx 反向代理

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/auratest
```

填入以下内容：

```nginx
server {
    listen 80;
    server_name 你的域名或IP;  # 例如: auratest.com 或 123.456.789.0

    # 限制上传大小
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.io 支持
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用配置：

```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/auratest /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 第八步：配置防火墙

```bash
# 阿里云控制台安全组规则
# 需要开放以下端口：
# - 80 (HTTP)
# - 443 (HTTPS，如果配置 SSL)
# - 22 (SSH，已开放)

# 服务器本地防火墙
# Ubuntu (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

### 第九步：配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS
sudo yum install certbot python3-certbot-nginx -y

# 获取证书（替换为你的域名）
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com

# 自动续期
sudo certbot renew --dry-run
```

## 🔄 更新部署

当你更新代码后：

```bash
# 连接到服务器
ssh root@你的服务器IP

# 进入项目目录
cd /var/www/auratest

# 拉取最新代码
git pull origin main

# 安装新依赖（如果有）
npm install

# 运行数据库迁移（如果有）
npx prisma db push

# 重新构建
npm run build

# 重启应用
pm2 restart auratest
```

## 📊 监控和维护

### 查看应用状态
```bash
pm2 status
pm2 logs auratest --lines 100
```

### 查看系统资源
```bash
htop  # 需要安装: sudo apt install htop
df -h  # 磁盘使用
free -h  # 内存使用
```

### 数据库备份
```bash
# 创建备份脚本
nano ~/backup-db.sh
```

内容：
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/auratest"
mkdir -p $BACKUP_DIR

pg_dump -U auratest_user auratest > $BACKUP_DIR/auratest_$DATE.sql
echo "Backup completed: auratest_$DATE.sql"

# 保留最近 7 天的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

设置定时备份：
```bash
chmod +x ~/backup-db.sh
crontab -e

# 添加（每天凌晨 2 点备份）
0 2 * * * /root/backup-db.sh
```

## 🐛 常见问题

### 1. 应用无法访问
- 检查 PM2 状态: `pm2 status`
- 查看日志: `pm2 logs auratest`
- 检查 Nginx: `sudo nginx -t && sudo systemctl status nginx`
- 检查防火墙: `sudo ufw status` 或 `sudo firewall-cmd --list-all`

### 2. 数据库连接失败
- 检查 PostgreSQL 状态: `sudo systemctl status postgresql`
- 测试连接: `psql -U auratest_user -d auratest -h localhost`
- 检查 DATABASE_URL 配置

### 3. 内存不足
```bash
# 创建 swap 空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4. 上传文件失败
- 检查 uploads 目录权限: `sudo chown -R $USER:$USER public/uploads`
- 检查 Nginx 上传大小限制

## 📞 需要帮助？

- 查看日志: `pm2 logs auratest --lines 200`
- 阿里云技术支持: https://help.aliyun.com
- GitHub Issues: https://github.com/5181667/Aura/issues

## 🎉 部署完成

访问: `http://你的服务器IP` 或 `https://你的域名.com`

**首次访问**:
1. 注册一个账号
2. 通过数据库将该用户设置为管理员：
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

祝部署顺利！🚀
