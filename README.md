# H5 Customer Service System

一个现代化的在线客服系统，采用前后端分离架构，支持管理后台和移动端用户聊天界面。

## ✨ 功能特性

### 🏠 主页功能
- **双入口设计**：后台管理和用户聊天独立入口
- **响应式设计**：完美适配桌面和移动设备
- **现代化UI**：渐变背景和毛玻璃效果

### 🔧 后台管理系统 (`/admin`)
- **消息管理**：实时查看和发送消息
- **个人资料**：修改客服昵称、头像、链接文字
- **消息模板**：创建和管理快捷回复模板
- **文件管理**：上传和管理图片、视频文件
- **数据持久化**：基于 PostgreSQL 数据库

### 📱 用户聊天界面 (`/chat`)
- **移动端优化**：专为手机设计的聊天界面
- **仿微信风格**：熟悉的用户体验
- **快捷回复**：一键发送常用问题
- **文件预览**：支持图片和视频展示
- **实时通信**：流畅的消息收发体验
- **安全区域适配**：支持 iPhone 刘海屏

## 🛠️ 技术栈

- **前端框架**：Next.js 14 + TypeScript
- **数据库**：PostgreSQL (Vercel Postgres)
- **文件存储**：Vercel Blob
- **ORM**：Prisma
- **样式方案**：CSS-in-JS + 工具类
- **部署平台**：Vercel

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- Vercel 账号（用于 Blob 存储）

### 本地开发

1. **克隆项目**
```bash
git clone git@github.com:YoungBlackBlack/h5-customer-service-system.git
cd h5-customer-service-system
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
# 需要配置：数据库连接、Vercel Blob Token
```

4. **数据库设置**
```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### Vercel 部署

1. **Fork 项目到你的 GitHub 账号**

2. **在 Vercel 创建新项目**
   - 连接 GitHub 仓库
   - 自动检测 Next.js 项目

3. **配置环境变量**
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `BLOB_READ_WRITE_TOKEN`

4. **添加 Vercel Postgres 数据库**
   ```bash
   # 在 Vercel 项目中添加 Postgres 存储
   # 自动生成数据库连接字符串
   ```

5. **部署完成** 🎉

## 📁 项目结构

```
├── app/
│   ├── admin/                # 后台管理页面
│   ├── chat/                 # 用户聊天页面
│   ├── api/
│   │   ├── messages/         # 消息管理 API
│   │   ├── profile/          # 客服资料 API
│   │   ├── templates/        # 消息模板 API
│   │   └── upload/           # 文件上传 API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── lib/
│   └── prisma.ts             # Prisma 客户端
├── prisma/
│   └── schema.prisma         # 数据库模型
├── public/
│   └── default-avatar.png    # 默认头像
└── README.md
```

## 🎯 API 接口

### 消息管理
- `GET /api/messages` - 获取消息列表
- `POST /api/messages` - 发送新消息
- `DELETE /api/messages` - 清空所有消息

### 客服资料
- `GET /api/profile?adminId=1` - 获取客服资料
- `PUT /api/profile` - 更新客服资料

### 消息模板
- `GET /api/templates?adminId=1` - 获取模板列表
- `POST /api/templates` - 创建新模板
- `DELETE /api/templates?id=xxx` - 删除模板

### 文件上传
- `POST /api/upload` - 上传文件到 Vercel Blob
- `GET /api/upload` - 获取文件列表

## 🎨 界面预览

### 🏠 主页 (`/`)
- **双入口设计**：清晰的后台管理和用户聊天入口
- **现代化设计**：渐变背景 + 毛玻璃效果
- **功能介绍**：直观展示系统特性

### 🔧 后台管理 (`/admin`)
- **侧边导航**：消息管理、个人资料、消息模板、文件管理
- **实时消息**：查看和回复用户消息
- **模板管理**：创建和编辑快捷回复
- **文件中心**：统一管理上传的图片和视频

### 📱 用户聊天 (`/chat`)
- **移动端优化**：专为手机设计的聊天界面
- **微信风格**：熟悉的气泡式消息设计
- **快捷操作**：快速发送常见问题
- **文件支持**：图片和视频预览

## 🔧 自定义配置

### 修改主题颜色
在 `app/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary-green: #4CAF50;    /* 主绿色 */
  --primary-blue: #2196F3;     /* 主蓝色 */
  --message-bg: #e8f5e8;       /* 消息背景 */
  --admin-bg: #f8f9fa;         /* 后台背景 */
}
```

### 数据库模型扩展
修改 `prisma/schema.prisma` 后运行：
```bash
npx prisma db push
npx prisma generate
```

### 添加新的 API 端点
在 `app/api/` 目录下创建新的 `route.ts` 文件。

## 📊 数据库设计

### 核心模型
- **Admin** - 管理员信息
- **User** - 用户会话
- **Message** - 消息记录
- **MessageTemplate** - 消息模板
- **FileUpload** - 文件上传记录

### 关系设计
- 一个管理员可以有多个消息和模板
- 消息与管理员和用户关联
- 支持文件类型：IMAGE、VIDEO、DOCUMENT

## 📝 开发计划

### ✅ 已完成
- [x] 前后端分离架构
- [x] PostgreSQL 数据持久化
- [x] Vercel Blob 文件存储
- [x] 移动端响应式设计
- [x] 完整的 CRUD API
- [x] 文件上传功能

### 🚧 开发中
- [ ] WebSocket 实时通信
- [ ] 用户认证系统
- [ ] 消息搜索功能
- [ ] 多客服支持
- [ ] 消息状态（已读/未读）
- [ ] 推送通知

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

此项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 界面设计灵感来源于微信
- 使用 Next.js 官方文档作为开发指南
- 感谢所有贡献者的支持