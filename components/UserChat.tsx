'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  type: 'user' | 'admin'
  timestamp: Date
  fileUrl?: string
  fileType?: 'image' | 'video'
}

interface AdminProfile {
  nickname: string
  avatar: string
  linkText: string
}

interface UserChatProps {
  messages: Message[]
  adminProfile: AdminProfile
  onSendMessage: (content: string, type: 'user' | 'admin') => void
}

export default function UserChat({ messages, adminProfile, onSendMessage }: UserChatProps) {
  const [userInput, setUserInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (userInput.trim()) {
      onSendMessage(userInput, 'user')
      setUserInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="user-chat">
      <div className="chat-header">
        <div className="online-status">
          <span className="status-indicator"></span>
          {adminProfile.nickname}
        </div>
        <button className="refresh-btn">🔄</button>
      </div>

      <div className="chat-messages">
        <div className="link-banner">
          {adminProfile.linkText}
        </div>

        <div className="quick-actions">
          <button className="quick-btn xiaomi">小米安装不了 点击问我</button>
          <button className="quick-btn apple">苹果安装不了 点击问我</button>
          <button className="quick-btn huawei">华为安装不了 点击问我</button>
          <button className="quick-btn success1">成功案例1 点击问我</button>
          <button className="quick-btn success2">成功案例2 点击问我</button>
          <button className="quick-btn download">软件下载不了怎么办</button>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {message.type === 'admin' && (
              <img 
                src={adminProfile.avatar} 
                alt="客服头像" 
                className="message-avatar"
              />
            )}
            <div className="message-content">
              {message.fileUrl ? (
                message.fileType === 'image' ? (
                  <img src={message.fileUrl} alt="图片" className="message-image" />
                ) : (
                  <video src={message.fileUrl} controls className="message-video" />
                )
              ) : (
                <div className="message-bubble">
                  {message.content}
                </div>
              )}
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
            {message.type === 'user' && (
              <div className="user-avatar">👤</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <button className="add-btn">+</button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="发送消息..."
          className="message-input"
        />
        <button className="emoji-btn">😊</button>
        <button 
          className="send-btn"
          onClick={handleSendMessage}
        >
          发送
        </button>
      </div>

      <style jsx>{`
        .user-chat {
          width: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .chat-header {
          background: white;
          padding: 15px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .online-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #4CAF50;
          border-radius: 50%;
        }

        .refresh-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f5f5f5;
        }

        .link-banner {
          text-align: center;
          background: var(--primary-green);
          color: white;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .quick-btn {
          background: white;
          border: 1px solid #e0e0e0;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .quick-btn:hover {
          background: #f0f0f0;
        }

        .quick-btn.xiaomi { color: #FF6900; }
        .quick-btn.apple { color: #007AFF; }
        .quick-btn.huawei { color: #FF0000; }
        .quick-btn.success1, .quick-btn.success2 { color: #4CAF50; }
        .quick-btn.download { color: #2196F3; }

        .message {
          display: flex;
          margin-bottom: 15px;
          gap: 10px;
        }

        .message.admin {
          justify-content: flex-start;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .message-content {
          max-width: 70%;
        }

        .message-bubble {
          background: var(--message-bg);
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
        }

        .message.user .message-bubble {
          background: var(--primary-green);
          color: white;
        }

        .message-time {
          font-size: 12px;
          color: #999;
          text-align: center;
          margin-top: 5px;
        }

        .message-image, .message-video {
          max-width: 200px;
          border-radius: 8px;
        }

        .chat-input {
          background: white;
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .add-btn, .emoji-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
        }

        .message-input {
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 10px 15px;
          outline: none;
        }

        .send-btn {
          background: var(--primary-green);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
        }

        .send-btn:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  )
}