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
  title: string
  content: string
  category: string
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
    { id: '1', title: '小米安装问题', content: '小米安装不了 点击问我', category: 'install' },
    { id: '2', title: '苹果安装问题', content: '苹果安装不了 点击问我', category: 'install' },
    { id: '3', title: '华为安装问题', content: '华为安装不了 点击问我', category: 'install' },
    { id: '4', title: '成功案例1', content: '成功案例1 点击问我', category: 'success' },
    { id: '5', title: '成功案例2', content: '成功案例2 点击问我', category: 'success' },
    { id: '6', title: '下载问题', content: '软件下载不了怎么办', category: 'download' }
  ])
  
  const [activeTab, setActiveTab] = useState<'messages' | 'profile' | 'templates' | 'files'>('messages')
  const [messageInput, setMessageInput] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfile, setEditProfile] = useState(profile)
  const [newTemplate, setNewTemplate] = useState({ title: '', content: '', category: 'general' })
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
      setNewTemplate({ title: '', content: '', category: 'general' })
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
        <Link href="/" className="back-btn">← 返回首页</Link>
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
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 个人资料
            </button>
            <button 
              className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              📝 消息模板
            </button>
            <button 
              className={`nav-item ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              📁 文件管理
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {/* 消息管理 */}
          {activeTab === 'messages' && (
            <div className="messages-panel">
              <div className="messages-header">
                <h2>实时消息</h2>
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
                    className="file-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎 上传文件
                  </button>
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                  >
                    发送消息
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 个人资料 */}
          {activeTab === 'profile' && (
            <div className="profile-panel">
              <div className="profile-header">
                <h2>个人资料设置</h2>
                <button
                  className="edit-btn"
                  onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                >
                  {isEditingProfile ? '保存' : '编辑'}
                </button>
              </div>

              {isEditingProfile ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>头像 URL:</label>
                    <input
                      type="text"
                      value={editProfile.avatar}
                      onChange={(e) => setEditProfile({...editProfile, avatar: e.target.value})}
                      placeholder="头像链接地址"
                    />
                  </div>
                  <div className="form-group">
                    <label>昵称:</label>
                    <input
                      type="text"
                      value={editProfile.nickname}
                      onChange={(e) => setEditProfile({...editProfile, nickname: e.target.value})}
                      placeholder="客服昵称"
                    />
                  </div>
                  <div className="form-group">
                    <label>链接文字:</label>
                    <input
                      type="text"
                      value={editProfile.linkText}
                      onChange={(e) => setEditProfile({...editProfile, linkText: e.target.value})}
                      placeholder="链接显示文字"
                    />
                  </div>
                </div>
              ) : (
                <div className="profile-display">
                  <div className="profile-avatar">
                    <img src={profile.avatar} alt="头像" />
                  </div>
                  <div className="profile-info">
                    <div className="info-item">
                      <label>昵称:</label>
                      <span>{profile.nickname}</span>
                    </div>
                    <div className="info-item">
                      <label>链接文字:</label>
                      <span>{profile.linkText}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 消息模板 */}
          {activeTab === 'templates' && (
            <div className="templates-panel">
              <div className="templates-header">
                <h2>消息模板管理</h2>
              </div>

              <div className="add-template">
                <h3>添加新模板</h3>
                <div className="template-form">
                  <input
                    type="text"
                    placeholder="模板标题"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  />
                  <textarea
                    placeholder="模板内容"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    rows={3}
                  />
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  >
                    <option value="general">通用</option>
                    <option value="install">安装问题</option>
                    <option value="success">成功案例</option>
                    <option value="download">下载问题</option>
                  </select>
                  <button onClick={handleAddTemplate}>添加模板</button>
                </div>
              </div>

              <div className="templates-list">
                {templates.map(template => (
                  <div key={template.id} className="template-item">
                    <div className="template-info">
                      <h4>{template.title}</h4>
                      <p>{template.content}</p>
                      <span className="template-category">{template.category}</span>
                    </div>
                    <div className="template-actions">
                      <button
                        className="use-btn"
                        onClick={() => handleSendTemplate(template)}
                      >
                        使用
                      </button>
                      <button className="delete-btn">删除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 文件管理 */}
          {activeTab === 'files' && (
            <div className="files-panel">
              <div className="files-header">
                <h2>文件管理</h2>
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📤 上传文件
                </button>
              </div>
              
              <div className="files-grid">
                {messages.filter(m => m.fileUrl).map(message => (
                  <div key={message.id} className="file-item">
                    {message.fileType === 'IMAGE' && (
                      <img src={message.fileUrl} alt={message.fileName} />
                    )}
                    {message.fileType === 'VIDEO' && (
                      <video src={message.fileUrl} controls />
                    )}
                    <div className="file-info">
                      <span className="file-name">{message.fileName}</span>
                      <span className="file-time">{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                ))}
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

        .messages-panel, .profile-panel, .templates-panel, .files-panel {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .messages-header, .profile-header, .templates-header, .files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .message-count {
          color: #666;
          font-size: 0.9rem;
        }

        .messages-list {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 1.5rem;
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
          padding-top: 1rem;
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

        .file-btn, .send-btn, .edit-btn, .upload-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .file-btn {
          background: #2196f3;
          color: white;
        }

        .send-btn, .edit-btn, .upload-btn {
          background: #4caf50;
          color: white;
        }

        .file-btn:hover, .send-btn:hover, .edit-btn:hover, .upload-btn:hover {
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
          
          .template-form {
            flex-direction: column;
            align-items: stretch;
          }
          
          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}