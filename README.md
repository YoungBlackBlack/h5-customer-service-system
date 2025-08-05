# H5 Customer Service System

一个仿微信风格的在线客服对话系统，支持双端管理（客服端+用户端），文件上传，实时聊天等功能。

## ✨ 功能特性

### 🔧 客服端功能
- **资料管理**：修改客服昵称、头像、链接文字
- **快捷回复**：预设常用消息模板
- **文件上传**：支持图片和视频文件上传
- **实时发送**：向用户端发送消息

### 💬 用户端功能
- **仿微信界面**：熟悉的聊天界面体验
- **消息气泡**：美观的消息展示样式
- **文件预览**：支持图片和视频文件显示
- **实时接收**：接收客服端消息

## 🛠️ 技术栈

- **框架**：Next.js 14 + TypeScript
- **样式**：CSS-in-JS (styled-jsx)
- **部署**：Vercel
- **文件上传**：Next.js API Routes
- **状态管理**：React Hooks

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone git@github.com:YoungBlackBlack/h5-customer-service-system.git

# 进入项目目录
cd h5-customer-service-system

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### Vercel 部署

1. 在 [Vercel](https://vercel.com) 创建新项目
2. 连接此 GitHub 仓库
3. 自动部署完成

或使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📁 项目结构

```
├── app/
│   ├── api/
│   │   ├── messages/         # 消息管理 API
│   │   ├── profile/          # 客服资料 API
│   │   └── upload/           # 文件上传 API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/
│   ├── AdminPanel.tsx        # 客服端组件
│   └── UserChat.tsx          # 用户端组件
├── public/
│   ├── uploads/              # 上传文件目录
│   └── default-avatar.png    # 默认头像
└── README.md
```

## 🎯 API 接口

### 消息管理
- `GET /api/messages` - 获取所有消息
- `POST /api/messages` - 发送新消息
- `DELETE /api/messages` - 清空所有消息

### 客服资料
- `GET /api/profile` - 获取客服资料
- `PUT /api/profile` - 更新客服资料

### 文件上传
- `POST /api/upload` - 上传文件

## 🎨 界面预览

### 双端布局
- **左侧**：客服管理端，包含资料编辑和消息发送功能
- **右侧**：用户聊天端，仿微信聊天界面

### 响应式设计
- 桌面端：左右分屏显示
- 移动端：上下堆叠布局

## 🔧 自定义配置

### 修改样式主题
在 `app/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary-green: #4CAF50;    /* 主题绿色 */
  --message-bg: #e8f5e8;       /* 消息背景色 */
  --admin-bg: #f0f0f0;         /* 客服端背景色 */
}
```

### 添加快捷消息模板
在 `components/AdminPanel.tsx` 中修改 `quickMessages` 数组。

## 📝 开发计划

- [ ] 添加消息持久化存储
- [ ] 集成 WebSocket 实现真正的实时通信
- [ ] 添加用户认证系统
- [ ] 支持更多文件类型上传
- [ ] 添加消息搜索功能
- [ ] 支持多客服管理

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