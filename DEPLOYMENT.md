# 客服系统部署说明

## 独立入口说明

本系统现已配置为两个完全独立的入口：

1. **前端客服聊天**：主页面 (`/`) - 用户直接访问网站即可使用客服功能
2. **后端管理系统**：管理页面 (`/admin`) - 客服人员管理界面

## 部署选项

### 选项1：单域名部署（推荐）

部署到一个域名，通过路径区分：
- 用户端：`https://yoursite.com/` 
- 管理端：`https://yoursite.com/admin`

### 选项2：双域名部署

如需完全独立的域名，可以部署两次：

#### 用户端域名部署
1. 在 Vercel 部署项目
2. 设置自定义域名：`chat.yoursite.com`
3. 用户访问聊天界面

#### 管理端域名部署  
1. 在 Vercel 创建新项目
2. 设置环境变量中添加：`ADMIN_ONLY=true`
3. 设置自定义域名：`admin.yoursite.com`
4. 客服访问管理界面

## Vercel 部署步骤

1. **连接 GitHub 仓库**
   - 登录 Vercel Dashboard
   - 点击 "Import Project"
   - 选择 GitHub 仓库

2. **配置环境变量**
   ```
   POSTGRES_PRISMA_URL=your_postgres_url
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   BLOB_READ_WRITE_TOKEN=your_blob_token
   ```

3. **数据库设置**
   - 在 Vercel Dashboard 创建 PostgreSQL 数据库
   - 复制连接字符串到环境变量

4. **存储设置**
   - 在 Vercel Dashboard 创建 Blob 存储
   - 复制访问令牌到环境变量

5. **部署**
   - 点击 "Deploy" 开始部署
   - 部署完成后获得访问链接

## 功能特性

### 用户端 (/)
- WeChat 风格聊天界面  
- 移动端优化响应式设计
- 快捷回复按钮
- 实时消息推送
- iPhone 安全区域适配

### 管理端 (/admin)
- 实时消息管理
- 个人资料设置
- 消息模板管理  
- 文件上传功能
- 图片/视频预览

## 访问说明

部署完成后：
- 用户直接访问主域名即可开始聊天
- 客服访问 `/admin` 路径进入管理后台
- 两个入口完全独立，互不干扰

## 环境要求

- Node.js 18+
- Next.js 14
- Vercel PostgreSQL
- Vercel Blob Storage