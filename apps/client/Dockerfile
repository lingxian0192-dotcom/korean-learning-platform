# 阶段一：构建 (Builder)
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段二：服务 (Production)
FROM nginx:alpine
# 从上一阶段复制编译好的网页文件
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制我们要用的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
