'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  content?: string
  type: 'USER' | 'ADMIN'
  fileUrl?: string
  fileType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  fileName?: string
  createdAt: string
}

interface AdminProfile {
  id: string
  nickname: string
  avatar: string
  linkText: string
}

interface Template {
  id: string
  order: number
  title: string
  content: string
  category: string
}

interface Link {
  id: string
  name: string
  url: string
  imageUrl: string
  title: string
  description: string
  buttonText: string
  autoRedirect: boolean
  redirectDelay: number
  isActive: boolean
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [profile, setProfile] = useState<AdminProfile>({
    id: '1',
    nickname: '在线客服',
    avatar: '/default-avatar.png',
    linkText: '下载APP防止失联'
  })
  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', order: 1, title: '小米安装问题', content: '小米安装不了 点击问我', category: 'install' },
    { id: '2', order: 2, title: '苹果安装问题', content: '苹果安装不了 点击问我', category: 'install' },
    { id: '3', order: 3, title: '华为安装问题', content: '华为安装不了 点击问我', category: 'install' },
    { id: '4', order: 4, title: '成功案例1', content: '成功案例1 点击问我', category: 'success' },
    { id: '5', order: 5, title: '成功案例2', content: '成功案例2 点击问我', category: 'success' },
    { id: '6', order: 6, title: '下载问题', content: '软件下载不了怎么办', category: 'download' }
  ])
  const [links, setLinks] = useState<Link[]>([])
  
  const [activeTab, setActiveTab] = useState<'messages' | 'links' | 'settings'>('messages')
  const [messageInput, setMessageInput] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfile, setEditProfile] = useState(profile)
  const [newTemplate, setNewTemplate] = useState({ order: templates.length + 1, title: '', content: '', category: 'general' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageInput,
        type: 'ADMIN',
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMessage])
      setMessageInput('')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      const fileType = file.type.startsWith('image/') ? 'IMAGE' : 
                      file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT'
      
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'ADMIN',
        fileUrl,
        fileType,
        fileName: file.name,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMessage])
    }
  }

  const handleSaveProfile = () => {
    setProfile(editProfile)
    setIsEditingProfile(false)
  }

  const handleSendTemplate = (template: Template) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: template.content,
      type: 'ADMIN',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleAddTemplate = () => {
    if (newTemplate.title && newTemplate.content) {
      const template: Template = {
        id: Date.now().toString(),
        ...newTemplate
      }
      setTemplates(prev => [...prev, template])
      setNewTemplate({ order: templates.length + 2, title: '', content: '', category: 'general' })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-title">🔧 客服管理后台</div>
        <h1>客服管理后台</h1>
        <div className="admin-info">
          <img src={profile.avatar} alt="头像" className="admin-avatar" />
          <span>{profile.nickname}</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              💬 消息管理
            </button>
            <button 
              className={`nav-item ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              🔗 链接管理
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ 系统设置
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {/* 消息管理 */}
          {activeTab === 'messages' && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>💬 实时消息管理</h2>
                <span className="message-count">{messages.length} 条消息</span>
              </div>
              
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message.id} className={`message-item ${message.type.toLowerCase()}`}>
                    <div className="message-content">
                      {message.fileUrl ? (
                        <div className="file-message">
                          {message.fileType === 'IMAGE' && (
                            <img src={message.fileUrl} alt={message.fileName} className="message-image" />
                          )}
                          {message.fileType === 'VIDEO' && (
                            <video src={message.fileUrl} controls className="message-video" />
                          )}
                          <span className="file-name">{message.fileName}</span>
                        </div>
                      ) : (
                        <span>{message.content}</span>
                      )}
                    </div>
                    <div className="message-time">{formatTime(message.createdAt)}</div>
                  </div>
                ))}
              </div>

              <div className="message-compose">
                <div className="compose-input">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="输入消息内容..."
                    rows={3}
                  />
                </div>
                <div className="compose-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    className="action-btn secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎 上传文件
                  </button>
                  <button
                    className="action-btn primary"
                    onClick={handleSendMessage}
                  >
                    发送消息
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 链接管理 */}
          {activeTab === 'links' && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>🔗 客服链接管理</h2>
                <button className="action-btn primary">+ 新建链接</button>
              </div>

              <div className="links-grid">
                {links.map(link => (
                  <div key={link.id} className="link-card">
                    <div className="link-preview">
                      <img src={link.imageUrl} alt={link.title} />
                      <div className="link-overlay">
                        <span className={`status-badge ${link.isActive ? 'active' : 'inactive'}`}>
                          {link.isActive ? '启用' : '禁用'}
                        </span>
                      </div>
                    </div>
                    <div className="link-info">
                      <h3>{link.name}</h3>
                      <p className="link-title">{link.title}</p>
                      <p className="link-desc">{link.description}</p>
                      <div className="link-url">
                        <code>{window.location.origin}{link.url}</code>
                      </div>
                    </div>
                    <div className="link-actions">
                      <button className="action-btn secondary">编辑</button>
                      <button className="action-btn danger">删除</button>
                      <button className="action-btn">复制链接</button>
                    </div>
                  </div>
                ))}
                
                {links.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🔗</div>
                    <h3>暂无客服链接</h3>
                    <p>创建您的第一个客服链接，每个链接可以单独配置</p>
                    <button className="action-btn primary">创建链接</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 系统设置 */}
          {activeTab === 'settings' && (
            <div className="content-panel">
              <div className="panel-header">
                <h2>⚙️ 系统设置</h2>
              </div>

              <div className="settings-sections">
                {/* 个人资料设置 */}
                <div className="settings-section">
                  <h3>👤 个人资料</h3>
                  <div className="settings-content">
                    {isEditingProfile ? (
                      <div className="profile-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>客服昵称</label>
                            <input
                              type="text"
                              value={editProfile.nickname}
                              onChange={(e) => setEditProfile({...editProfile, nickname: e.target.value})}
                              placeholder="客服昵称"
                            />
                          </div>
                          <div className="form-group">
                            <label>头像链接</label>
                            <input
                              type="text"
                              value={editProfile.avatar}
                              onChange={(e) => setEditProfile({...editProfile, avatar: e.target.value})}
                              placeholder="头像链接地址"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>欢迎文字</label>
                          <input
                            type="text"
                            value={editProfile.linkText}
                            onChange={(e) => setEditProfile({...editProfile, linkText: e.target.value})}
                            placeholder="欢迎文字"
                          />
                        </div>
                        <div className="form-actions">
                          <button className="action-btn secondary" onClick={() => setIsEditingProfile(false)}>
                            取消
                          </button>
                          <button className="action-btn primary" onClick={handleSaveProfile}>
                            保存设置
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-display">
                        <div className="profile-card">
                          <img src={profile.avatar} alt="头像" className="profile-avatar" />
                          <div className="profile-details">
                            <h4>{profile.nickname}</h4>
                            <p>{profile.linkText}</p>
                          </div>
                          <button className="action-btn secondary" onClick={() => setIsEditingProfile(true)}>
                            编辑资料
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 消息模板设置 */}
                <div className="settings-section">
                  <h3>📝 消息模板</h3>
                  <div className="settings-content">
                    <div className="template-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>编号</label>
                          <input
                            type="number"
                            placeholder="排序编号"
                            min="1"
                            value={newTemplate.order}
                            onChange={(e) => setNewTemplate({...newTemplate, order: parseInt(e.target.value) || 1})}
                          />
                        </div>
                        <div className="form-group">
                          <label>模板标题</label>
                          <input
                            type="text"
                            placeholder="模板标题"
                            value={newTemplate.title}
                            onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>分类</label>
                          <select
                            value={newTemplate.category}
                            onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                          >
                            <option value="general">通用</option>
                            <option value="install">安装问题</option>
                            <option value="success">成功案例</option>
                            <option value="download">下载问题</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>模板内容</label>
                        <textarea
                          placeholder="模板内容"
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <button className="action-btn primary" onClick={handleAddTemplate}>
                        添加模板
                      </button>
                    </div>

                    <div className="templates-list">
                      {templates.sort((a, b) => a.order - b.order).map(template => (
                        <div key={template.id} className="template-card">
                          <div className="template-order">#{template.order}</div>
                          <div className="template-content">
                            <h4>{template.title}</h4>
                            <p>{template.content}</p>
                            <span className="template-category">{template.category}</span>
                          </div>
                          <div className="template-actions">
                            <button className="action-btn small" onClick={() => handleSendTemplate(template)}>
                              使用
                            </button>
                            <button className="action-btn small secondary">编辑</button>
                            <button className="action-btn small danger">删除</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 文件管理设置 */}
                <div className="settings-section">
                  <h3>📁 文件管理</h3>
                  <div className="settings-content">
                    <div className="upload-area">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        multiple
                      />
                      <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                        <div className="upload-icon">📤</div>
                        <p>点击或拖拽文件到这里上传</p>
                        <span>支持图片、视频格式</span>
                      </div>
                    </div>

                    <div className="files-grid">
                      {messages.filter(m => m.fileUrl).map(message => (
                        <div key={message.id} className="file-card">
                          <div className="file-preview">
                            {message.fileType === 'IMAGE' && (
                              <img src={message.fileUrl} alt={message.fileName} />
                            )}
                            {message.fileType === 'VIDEO' && (
                              <video src={message.fileUrl} />
                            )}
                          </div>
                          <div className="file-info">
                            <span className="file-name">{message.fileName}</span>
                            <span className="file-time">{formatTime(message.createdAt)}</span>
                          </div>
                          <div className="file-actions">
                            <button className="action-btn small">预览</button>
                            <button className="action-btn small danger">删除</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .admin-header {
          background: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn {
          color: #666;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #f0f0f0;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .admin-content {
          display: flex;
          height: calc(100vh - 80px);
        }

        .admin-sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e0e0e0;
          padding: 1rem 0;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .nav-item:hover {
          background: #f5f5f5;
        }

        .nav-item.active {
          background: #e3f2fd;
          color: #1976d2;
          border-right: 3px solid #1976d2;
        }

        .admin-main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .content-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-bottom: 1px solid #dee2e6;
        }

        .panel-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .message-count {
          color: #666;
          font-size: 0.9rem;
        }

        .messages-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem 2rem;
        }

        .message-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .message-item.admin {
          background: #e8f5e8;
        }

        .message-item.user {
          background: #f0f0f0;
        }

        .message-content {
          flex: 1;
        }

        .file-message {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .message-image, .message-video {
          max-width: 200px;
          border-radius: 4px;
        }

        .file-name {
          font-size: 0.9rem;
          color: #666;
        }

        .message-time {
          font-size: 0.8rem;
          color: #999;
          white-space: nowrap;
          margin-left: 1rem;
        }

        .message-compose {
          border-top: 1px solid #e0e0e0;
          padding: 1.5rem 2rem;
          background: #f8f9fa;
        }

        .compose-input textarea {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 0.75rem;
          resize: vertical;
          margin-bottom: 1rem;
        }

        .compose-actions {
          display: flex;
          gap: 1rem;
        }

        /* 新的按钮样式系统 */
        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn.primary {
          background: #4f46e5;
          color: white;
        }

        .action-btn.secondary {
          background: #6b7280;
          color: white;
        }

        .action-btn.danger {
          background: #ef4444;
          color: white;
        }

        .action-btn.small {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }

        .action-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .profile-display {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .profile-avatar img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
        }

        .info-item label {
          font-weight: 500;
          min-width: 80px;
        }

        .add-template {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 6px;
          margin-bottom: 2rem;
        }

        .template-form {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .template-form input, .template-form textarea, .template-form select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .template-form input {
          flex: 1;
          min-width: 200px;
        }

        .template-form textarea {
          flex: 2;
          min-width: 300px;
        }

        .templates-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .template-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .template-info h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .template-info p {
          margin: 0 0 0.5rem 0;
          color: #666;
        }

        .template-category {
          font-size: 0.8rem;
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .template-actions {
          display: flex;
          gap: 0.5rem;
        }

        .use-btn, .delete-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .use-btn {
          background: #4caf50;
          color: white;
        }

        .delete-btn {
          background: #f44336;
          color: white;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .file-item {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }

        .file-item img, .file-item video {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .file-info {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .file-time {
          font-size: 0.8rem;
          color: #666;
        }

        /* 链接管理样式 */
        .links-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .link-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .link-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .link-preview {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .link-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .link-overlay {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #10b981;
          color: white;
        }

        .status-badge.inactive {
          background: #6b7280;
          color: white;
        }

        .link-info {
          padding: 1rem;
        }

        .link-info h3 {
          margin: 0 0 0.5rem 0;
          color: #111827;
          font-size: 1.1rem;
        }

        .link-title {
          margin: 0 0 0.5rem 0;
          color: #4b5563;
          font-size: 0.9rem;
        }

        .link-desc {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .link-url {
          margin-bottom: 1rem;
        }

        .link-url code {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          word-break: break-all;
        }

        .link-actions {
          display: flex;
          gap: 0.5rem;
          padding: 0 1rem 1rem;
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .empty-state p {
          margin: 0 0 2rem 0;
        }

        /* 设置页面样式 */
        .settings-sections {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-section {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .settings-section h3 {
          margin: 0;
          padding: 1rem 1.5rem;
          background: #f9fafb;
          color: #374151;
          font-size: 1rem;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
        }

        .settings-content {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .profile-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-details h4 {
          margin: 0 0 0.25rem 0;
          color: #111827;
        }

        .profile-details p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .template-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .template-order {
          font-weight: 600;
          color: #4f46e5;
          font-size: 0.875rem;
          min-width: 2rem;
        }

        .template-content {
          flex: 1;
        }

        .template-content h4 {
          margin: 0 0 0.25rem 0;
          color: #111827;
          font-size: 0.9rem;
        }

        .template-content p {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .template-category {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .template-actions {
          display: flex;
          gap: 0.5rem;
        }

        .upload-area {
          margin-bottom: 1.5rem;
        }

        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-zone:hover {
          border-color: #4f46e5;
          background: #f8fafc;
        }

        .upload-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .upload-zone p {
          margin: 0 0 0.25rem 0;
          color: #374151;
          font-weight: 500;
        }

        .upload-zone span {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .file-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .file-preview {
          height: 120px;
          overflow: hidden;
        }

        .file-preview img,
        .file-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-info {
          padding: 0.75rem;
        }

        .file-name {
          display: block;
          font-weight: 500;
          color: #111827;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .file-time {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
          padding: 0 0.75rem 0.75rem;
        }

        @media (max-width: 768px) {
          .admin-content {
            flex-direction: column;
          }
          
          .admin-sidebar {
            width: 100%;
            height: auto;
          }
          
          .admin-nav {
            flex-direction: row;
            overflow-x: auto;
          }
          
          .nav-item {
            white-space: nowrap;
            min-width: 120px;
          }
          
          .links-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .settings-sections {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}