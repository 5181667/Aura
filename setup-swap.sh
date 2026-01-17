#!/bin/bash

# 检查是否已有 swap
if [ $(free | awk '/^Swap:/ {exit !$2}') ]; then
    echo "✅ Swap 已经存在，无需创建。"
else
    echo "📦 正在创建 2GB Swap 文件..."
    # 创建 2GB 的 swapfile
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    
    # 永久生效
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    echo "✅ Swap 创建成功！"
fi

# 显示内存情况
free -h
