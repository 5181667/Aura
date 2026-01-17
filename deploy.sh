#!/bin/bash

# AuraTest 阿里云服务器部署脚本
# 在阿里云服务器上运行此脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署 AuraTest..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo "使用: sudo ./deploy.sh"
    exit 1
fi

# 项目配置
PROJECT_DIR="/var/www/auratest"
REPO_URL="https://github.com/5181667/Aura.git"
APP_NAME="auratest"

echo -e "${GREEN}Step 1: 安装系统依赖...${NC}"

# 检测系统类型
if [ -f /etc/debian_version ]; then
    SYSTEM="debian"
    apt update
    apt install -y curl git nginx postgresql postgresql-contrib
elif [ -f /etc/redhat-release ]; then
    SYSTEM="redhat"
    yum update -y
    yum install -y curl git nginx postgresql-server postgresql-contrib
    postgresql-setup initdb
fi

echo -e "${GREEN}Step 2: 启动服务...${NC}"
systemctl start postgresql
systemctl enable postgresql
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}Step 3: 安装 Node.js...${NC}"

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
    echo "安装 nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "安装 Node.js 20..."
    nvm install 20
    nvm use 20
    nvm alias default 20
else
    echo "Node.js 已安装: $(node -v)"
fi

echo -e "${GREEN}Step 4: 安装 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "PM2 已安装: $(pm2 -v)"
fi

echo -e "${GREEN}Step 5: 配置数据库...${NC}"
echo -e "${YELLOW}请输入数据库密码:${NC}"
read -s DB_PASSWORD

# 创建数据库和用户
sudo -u postgres psql <<EOF
-- 如果数据库已存在，则跳过
SELECT 'CREATE DATABASE auratest' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auratest')\gexec
-- 创建用户
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'auratest_user') THEN
    CREATE USER auratest_user WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
GRANT ALL PRIVILEGES ON DATABASE auratest TO auratest_user;
EOF

echo -e "${GREEN}Step 6: 克隆项目...${NC}"

# 如果目录存在，先备份
if [ -d "$PROJECT_DIR" ]; then
    echo "备份现有项目..."
    mv $PROJECT_DIR ${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)
fi

mkdir -p $PROJECT_DIR
git clone $REPO_URL $PROJECT_DIR

echo -e "${GREEN}Step 7: 配置环境变量...${NC}"

cd $PROJECT_DIR

# 生成 NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 获取服务器 IP
SERVER_IP=$(curl -s ifconfig.me)

cat > .env <<EOF
# 数据库配置
DATABASE_URL="postgresql://auratest_user:$DB_PASSWORD@localhost:5432/auratest"

# NextAuth 配置
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://$SERVER_IP:3000"

# Node 环境
NODE_ENV="production"
EOF

echo -e "${YELLOW}环境变量已配置，请稍后根据需要修改 .env 文件${NC}"

echo -e "${GREEN}Step 8: 安装项目依赖...${NC}"
npm install

echo -e "${GREEN}Step 9: 设置数据库...${NC}"
npx prisma generate
npx prisma db push

echo -e "${YELLOW}是否填充测试数据? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    node prisma/seed-disc.js
fi

echo -e "${GREEN}Step 10: 构建项目...${NC}"
npm run build

echo -e "${GREEN}Step 11: 配置 Nginx...${NC}"

cat > /etc/nginx/sites-available/$APP_NAME <<EOF
server {
    listen 80;
    server_name $SERVER_IP;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# 启用站点
if [ "$SYSTEM" = "debian" ]; then
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
fi

# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx

echo -e "${GREEN}Step 12: 启动应用...${NC}"

# 停止旧实例（如果存在）
pm2 delete $APP_NAME 2>/dev/null || true

# 启动应用
cd $PROJECT_DIR
pm2 start npm --name "$APP_NAME" -- start

# 设置开机自启
pm2 startup
pm2 save

echo -e "${GREEN}Step 13: 配置防火墙...${NC}"

if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --reload
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址: ${YELLOW}http://$SERVER_IP${NC}"
echo ""
echo -e "${YELLOW}重要提示:${NC}"
echo -e "1. 首次访问请注册账号"
echo -e "2. 设置管理员权限:"
echo -e "   sudo -u postgres psql -d auratest"
echo -e "   UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'your-email@example.com';"
echo -e "3. 配置域名请修改 .env 中的 NEXTAUTH_URL"
echo -e "4. 配置 SSL 证书: sudo certbot --nginx -d your-domain.com"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "- 查看状态: pm2 status"
echo -e "- 查看日志: pm2 logs $APP_NAME"
echo -e "- 重启应用: pm2 restart $APP_NAME"
echo -e "- 更新代码: cd $PROJECT_DIR && git pull && npm run build && pm2 restart $APP_NAME"
echo ""
echo -e "${GREEN}详细文档请查看: ALIYUN_DEPLOYMENT.md${NC}"
