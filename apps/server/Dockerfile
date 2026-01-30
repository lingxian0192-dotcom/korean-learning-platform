FROM node:18-alpine

WORKDIR /usr/src/app

# 1. 安装 PM2 全局工具 (用于进程管理)
RUN npm install -g pm2

# 2. 复制依赖描述文件
COPY package*.json ./

# 3. 安装依赖
RUN npm install

# 4. 复制所有源代码
COPY . .

# 5. 构建后端应用
RUN npm run build

# 6. 暴露端口
EXPOSE 3001

# 7. 启动命令：使用 pm2-runtime 启动，确保在 Docker 中稳定运行
CMD ["pm2-runtime", "start", "dist/src/main.js", "--name", "api-server"]
