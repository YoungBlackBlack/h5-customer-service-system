'use client'

import { useState, useRef } from 'react'

interface AdminProfile {
  nickname: string
  avatar: string
  linkText: string
}

interface AdminPanelProps {
  profile: AdminProfile
  onProfileUpdate: (profile: AdminProfile) => void
  onSendMessage: (content: string, type: 'user' | 'admin', fileUrl?: string, fileType?: 'image' | 'video') => void
}

export default function AdminPanel({ profile, onProfileUpdate, onSendMessage }: AdminPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editProfile, setEditProfile] = useState(profile)
  const [messageInput, setMessageInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileSave = () => {
    onProfileUpdate(editProfile)
    setIsEditing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      onSendMessage('', 'admin', fileUrl, fileType)
    }
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput, 'admin')
      setMessageInput('')
    }
  }

  const quickMessages = [
    '小米安装不了 点击问我',
    '苹果安装不了 点击问我', 
    '华为安装不了 点击问我',
    '成功案例1 点击问我',
    '成功案例2 点击问我',
    '软件下载不了怎么办'
  ]

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>客服管理端</h2>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '保存' : '编辑'}
        </button>
      </div>

      <div className="profile-section">
        {isEditing ? (
          <div className="profile-edit">
            <div className="field">
              <label>头像URL:</label>
              <input
                type="text"
                value={editProfile.avatar}
                onChange={(e) => setEditProfile({...editProfile, avatar: e.target.value})}
                placeholder="头像链接"
              />
            </div>
            <div className="field">
              <label>昵称:</label>
              <input
                type="text"
                value={editProfile.nickname}
                onChange={(e) => setEditProfile({...editProfile, nickname: e.target.value})}
                placeholder="客服昵称"
              />
            </div>
            <div className="field">
              <label>链接文字:</label>
              <input
                type="text"
                value={editProfile.linkText}
                onChange={(e) => setEditProfile({...editProfile, linkText: e.target.value})}
                placeholder="链接显示文字"
              />
            </div>
            <button className="save-btn" onClick={handleProfileSave}>
              保存设置
            </button>
          </div>
        ) : (
          <div className="profile-display">
            <img src={profile.avatar} alt="头像" className="avatar-preview" />
            <div className="profile-info">
              <p><strong>昵称:</strong> {profile.nickname}</p>
              <p><strong>链接:</strong> {profile.linkText}</p>
            </div>
          </div>
        )}
      </div>

      <div className="quick-messages">
        <h3>快捷消息模板</h3>
        <div className="message-templates">
          {quickMessages.map((msg, index) => (
            <button
              key={index}
              className="template-btn"
              onClick={() => onSendMessage(msg, 'admin')}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      <div className="message-compose">
        <h3>发送消息</h3>
        <div className="compose-area">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="输入消息内容..."
            rows={3}
          />
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
              发送
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-panel {
          width: 50%;
          background: var(--admin-bg);
          padding: 20px;
          border-right: 1px solid #ddd;
          height: 100vh;
          overflow-y: auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ddd;
        }

        .edit-btn, .save-btn {
          background: var(--primary-green);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .profile-section {
          margin-bottom: 30px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profile-edit .field {
          margin-bottom: 15px;
        }

        .profile-edit label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .profile-edit input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .profile-display {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .avatar-preview {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .quick-messages {
          margin-bottom: 30px;
        }

        .message-templates {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .template-btn {
          background: white;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .template-btn:hover {
          background: #f0f0f0;
        }

        .compose-area textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 10px;
        }

        .compose-actions {
          display: flex;
          gap: 10px;
        }

        .file-btn, .send-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .file-btn {
          background: #2196F3;
          color: white;
        }

        .send-btn {
          background: var(--primary-green);
          color: white;
        }
      `}</style>
    </div>
  )
}