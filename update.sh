#!/bin/bash

# AuraTest 快速更新脚本
# 在阿里云服务器上运行此脚本来更新应用

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/var/www/auratest"
APP_NAME="auratest"

echo -e "${GREEN}🔄 开始更新 AuraTest...${NC}"

cd $PROJECT_DIR

echo -e "${GREEN}Step 1: 拉取最新代码...${NC}"
git pull origin main

echo -e "${GREEN}Step 2: 安装依赖...${NC}"
npm install

echo -e "${GREEN}Step 3: 运行数据库迁移...${NC}"
npx prisma generate
npx prisma db push

echo -e "${GREEN}Step 4: 重新构建 (低内存模式)...${NC}"
# 清理缓存节省内存
rm -rf .next
npm run build:low || npm run build

echo -e "${GREEN}Step 5: 重启应用...${NC}"
pm2 restart $APP_NAME

echo -e "${GREEN}✅ 更新完成！${NC}"
echo ""
echo -e "查看状态: ${YELLOW}pm2 status${NC}"
echo -e "查看日志: ${YELLOW}pm2 logs $APP_NAME${NC}"
