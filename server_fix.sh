#!/bin/bash

# ==========================================
# Korean Learning Platform - 自动修复与重启脚本
# ==========================================

# 设置项目根目录 (根据您的报错信息推断的路径)
PROJECT_ROOT="/var/www/korean-learning-platform"
SERVER_DIR="$PROJECT_ROOT/apps/server"
MAIN_TS="$SERVER_DIR/src/main.ts"

echo ">> [1/4] 进入项目目录..."
cd "$PROJECT_ROOT" || { echo "❌ 错误: 找不到目录 $PROJECT_ROOT"; exit 1; }

echo ">> [2/4] 修正后端端口配置 (3000 -> 3001)..."
# 使用 sed 替换端口，适配 Nginx 配置
if [ -f "$MAIN_TS" ]; then
    # 备份原文件
    cp "$MAIN_TS" "$MAIN_TS.bak"
    # 执行替换
    sed -i 's/process.env.PORT || 3000/process.env.PORT || 3001/g' "$MAIN_TS"
    echo "✅ 端口配置已更新。"
else
    echo "⚠️ 警告: 找不到 $MAIN_TS，跳过端口修改。"
fi

echo ">> [3/4] 重新构建项目..."
# 安装依赖 (可选，防止依赖缺失)
# npm install

# 执行构建
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误日志。"
    exit 1
fi
echo "✅ 构建成功。"

echo ">> [4/4] 重启服务..."

# 检查是否安装了 pm2，如果没有则安装
if ! command -v pm2 &> /dev/null; then
    echo "未检测到 pm2，正在安装..."
    npm install -g pm2
fi

# 检查 pm2 中是否已有该服务
if pm2 list | grep -q "korean-server"; then
    echo "正在重载现有服务..."
    pm2 reload korean-server
else
    echo "启动新服务..."
    # 尝试启动编译后的 main.js
    if [ -f "$SERVER_DIR/dist/src/main.js" ]; then
        pm2 start "$SERVER_DIR/dist/src/main.js" --name "korean-server"
    else
        # 备选路径 (如果是 esbuild 打包)
        pm2 start "$SERVER_DIR/dist/functions/api.js" --name "korean-server"
    fi
fi

# 保存 pm2 列表以确保重启后自动启动
pm2 save

echo "=========================================="
echo "✅ 部署修复完成！"
echo "当前服务状态："
pm2 status
echo "=========================================="
