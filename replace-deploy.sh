#!/bin/bash

# AuraTest 替换部署脚本
# 用于替换服务器上已有的项目

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  AuraTest 替换部署向导${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo "使用: sudo ./replace-deploy.sh"
    exit 1
fi

# 配置
REPO_URL="https://github.com/5181667/Aura.git"
APP_NAME="auratest"
BACKUP_DIR="/var/backups/auratest"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}Step 1: 检测现有项目...${NC}"

# 让用户输入现有项目路径
echo -e "${YELLOW}请输入现有项目的路径 (例如: /var/www/old-project):${NC}"
read -r OLD_PROJECT_DIR

# 验证路径是否存在
if [ ! -d "$OLD_PROJECT_DIR" ]; then
    echo -e "${RED}错误: 目录 $OLD_PROJECT_DIR 不存在${NC}"
    exit 1
fi

echo -e "${GREEN}找到现有项目: $OLD_PROJECT_DIR${NC}"

# 检测是否有 PM2 进程在运行
echo ""
echo -e "${YELLOW}检测运行中的 PM2 进程...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 list
    echo ""
    echo -e "${YELLOW}请输入要停止的 PM2 应用名称 (如果有多个用空格分隔，回车跳过):${NC}"
    read -r OLD_APP_NAMES
fi

# 询问新项目路径
echo ""
echo -e "${YELLOW}Step 2: 配置新项目路径${NC}"
echo -e "${YELLOW}请输入新项目的安装路径 (默认: /var/www/auratest):${NC}"
read -r NEW_PROJECT_DIR
NEW_PROJECT_DIR=${NEW_PROJECT_DIR:-/var/www/auratest}

# 检查新路径是否存在
if [ -d "$NEW_PROJECT_DIR" ]; then
    echo -e "${YELLOW}警告: 目录 $NEW_PROJECT_DIR 已存在，将被备份并替换${NC}"
fi

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}部署计划总结:${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "现有项目路径: ${YELLOW}$OLD_PROJECT_DIR${NC}"
echo -e "新项目路径: ${YELLOW}$NEW_PROJECT_DIR${NC}"
echo -e "备份路径: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "GitHub 仓库: ${YELLOW}$REPO_URL${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

echo -e "${YELLOW}是否继续? (y/n)${NC}"
read -r CONFIRM
if [[ ! "$CONFIRM" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Step 3: 创建备份目录...${NC}"
mkdir -p $BACKUP_DIR

echo -e "${GREEN}Step 4: 停止现有应用...${NC}"
if [ -n "$OLD_APP_NAMES" ]; then
    for app_name in $OLD_APP_NAMES; do
        echo "停止 PM2 应用: $app_name"
        pm2 stop $app_name 2>/dev/null || echo "应用 $app_name 未在运行"
    done
fi

echo -e "${GREEN}Step 5: 备份现有项目...${NC}"
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"
echo "备份到: $BACKUP_PATH"
cp -r $OLD_PROJECT_DIR $BACKUP_PATH
echo -e "${GREEN}备份完成！${NC}"

# 如果现有项目有 .env 文件，保存它
if [ -f "$OLD_PROJECT_DIR/.env" ]; then
    echo "保存现有的 .env 配置..."
    cp $OLD_PROJECT_DIR/.env $BACKUP_DIR/env_backup_$TIMESTAMP
fi

# 如果现有项目有上传的文件，保存它们
if [ -d "$OLD_PROJECT_DIR/public/uploads" ]; then
    echo "保存现有的上传文件..."
    cp -r $OLD_PROJECT_DIR/public/uploads $BACKUP_DIR/uploads_backup_$TIMESTAMP
fi

echo ""
echo -e "${GREEN}Step 6: 克隆新项目...${NC}"

# 如果新路径已存在且不同于旧路径，先备份
if [ -d "$NEW_PROJECT_DIR" ] && [ "$NEW_PROJECT_DIR" != "$OLD_PROJECT_DIR" ]; then
    mv $NEW_PROJECT_DIR ${NEW_PROJECT_DIR}_old_$TIMESTAMP
fi

mkdir -p $NEW_PROJECT_DIR
git clone $REPO_URL $NEW_PROJECT_DIR

echo ""
echo -e "${GREEN}Step 7: 配置环境变量...${NC}"
cd $NEW_PROJECT_DIR

# 检查是否有旧的 .env 可以参考
if [ -f "$BACKUP_DIR/env_backup_$TIMESTAMP" ]; then
    echo -e "${YELLOW}发现旧的 .env 配置文件${NC}"
    echo -e "${YELLOW}是否复制旧的 .env 配置? (y/n)${NC}"
    read -r USE_OLD_ENV
    
    if [[ "$USE_OLD_ENV" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cp $BACKUP_DIR/env_backup_$TIMESTAMP .env
        echo -e "${GREEN}.env 配置已复制${NC}"
        echo -e "${YELLOW}请检查并更新 .env 文件中的配置（特别是 NEXTAUTH_URL）${NC}"
    else
        # 创建新的 .env
        echo -e "${YELLOW}创建新的 .env 配置...${NC}"
        echo -e "${YELLOW}请输入数据库密码:${NC}"
        read -s DB_PASSWORD
        
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
        SERVER_IP=$(curl -s ifconfig.me || echo "localhost")
        
        cat > .env <<EOF
# 数据库配置
DATABASE_URL="postgresql://auratest_user:$DB_PASSWORD@localhost:5432/auratest"

# NextAuth 配置
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://$SERVER_IP:3000"

# Node 环境
NODE_ENV="production"
EOF
    fi
else
    # 创建新的 .env
    echo -e "${YELLOW}创建新的 .env 配置...${NC}"
    echo -e "${YELLOW}请输入数据库密码:${NC}"
    read -s DB_PASSWORD
    
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    SERVER_IP=$(curl -s ifconfig.me || echo "localhost")
    
    cat > .env <<EOF
# 数据库配置
DATABASE_URL="postgresql://auratest_user:$DB_PASSWORD@localhost:5432/auratest"

# NextAuth 配置
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://$SERVER_IP:3000"

# Node 环境
NODE_ENV="production"
EOF
fi

echo ""
echo -e "${GREEN}Step 8: 恢复上传文件...${NC}"
if [ -d "$BACKUP_DIR/uploads_backup_$TIMESTAMP" ]; then
    echo "恢复之前上传的文件..."
    mkdir -p public/uploads
    cp -r $BACKUP_DIR/uploads_backup_$TIMESTAMP/* public/uploads/ 2>/dev/null || true
    echo -e "${GREEN}文件恢复完成${NC}"
fi

echo ""
echo -e "${GREEN}Step 9: 安装依赖...${NC}"
npm install

echo -e "${GREEN}Step 10: 设置数据库...${NC}"
npx prisma generate

echo -e "${YELLOW}是否需要创建新数据库? (如果使用现有数据库请选择 n) (y/n)${NC}"
read -r CREATE_NEW_DB

if [[ "$CREATE_NEW_DB" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    npx prisma db push
    
    echo -e "${YELLOW}是否填充测试数据? (y/n)${NC}"
    read -r SEED_DATA
    if [[ "$SEED_DATA" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        node prisma/seed-disc.js
    fi
else
    echo -e "${YELLOW}跳过数据库创建，使用现有数据库${NC}"
    npx prisma generate
fi

echo ""
echo -e "${GREEN}Step 11: 构建项目...${NC}"
npm run build

echo ""
echo -e "${GREEN}Step 12: 配置 Nginx...${NC}"

# 检测现有 Nginx 配置
echo -e "${YELLOW}是否更新 Nginx 配置? (y/n)${NC}"
read -r UPDATE_NGINX

if [[ "$UPDATE_NGINX" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    # 备份现有 Nginx 配置
    if [ -f "/etc/nginx/sites-available/$APP_NAME" ]; then
        cp /etc/nginx/sites-available/$APP_NAME $BACKUP_DIR/nginx_backup_$TIMESTAMP
    fi
    
    echo -e "${YELLOW}请输入域名或服务器IP (默认: $(curl -s ifconfig.me)):${NC}"
    read -r SERVER_NAME
    SERVER_NAME=${SERVER_NAME:-$(curl -s ifconfig.me)}
    
    cat > /etc/nginx/sites-available/$APP_NAME <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

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
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/ 2>/dev/null || true
    
    # 测试并重启 Nginx
    nginx -t && systemctl restart nginx
    echo -e "${GREEN}Nginx 配置已更新${NC}"
fi

echo ""
echo -e "${GREEN}Step 13: 启动新应用...${NC}"

# 删除旧的 PM2 进程（如果存在）
if [ -n "$OLD_APP_NAMES" ]; then
    for app_name in $OLD_APP_NAMES; do
        pm2 delete $app_name 2>/dev/null || true
    done
fi

# 删除同名的 PM2 进程（如果存在）
pm2 delete $APP_NAME 2>/dev/null || true

# 启动新应用
pm2 start npm --name "$APP_NAME" -- start

# 保存 PM2 配置
pm2 save

echo ""
echo -e "${GREEN}Step 14: 设置开机自启...${NC}"
pm2 startup
pm2 save

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 替换部署完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "新项目路径: ${YELLOW}$NEW_PROJECT_DIR${NC}"
echo -e "备份路径: ${YELLOW}$BACKUP_PATH${NC}"
echo -e "访问地址: ${YELLOW}http://$SERVER_NAME${NC}"
echo ""
echo -e "${BLUE}备份信息:${NC}"
echo -e "- 项目备份: ${YELLOW}$BACKUP_PATH${NC}"
echo -e "- 配置备份: ${YELLOW}$BACKUP_DIR/env_backup_$TIMESTAMP${NC}"
if [ -f "$BACKUP_DIR/nginx_backup_$TIMESTAMP" ]; then
    echo -e "- Nginx备份: ${YELLOW}$BACKUP_DIR/nginx_backup_$TIMESTAMP${NC}"
fi
echo ""
echo -e "${BLUE}如需回滚到旧项目:${NC}"
echo -e "1. pm2 stop $APP_NAME"
echo -e "2. rm -rf $NEW_PROJECT_DIR"
echo -e "3. cp -r $BACKUP_PATH $NEW_PROJECT_DIR"
echo -e "4. cd $NEW_PROJECT_DIR && pm2 restart $APP_NAME"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "- 查看状态: ${GREEN}pm2 status${NC}"
echo -e "- 查看日志: ${GREEN}pm2 logs $APP_NAME${NC}"
echo -e "- 重启应用: ${GREEN}pm2 restart $APP_NAME${NC}"
echo ""
echo -e "${GREEN}部署成功！请访问应用并测试功能。${NC}"
