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
  nickname: string
  avatar: string
  linkText: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [adminProfile] = useState<AdminProfile>({
    nickname: '在线客服',
    avatar: '/default-avatar.png',
    linkText: '下载APP防止失联'
  })
  const [isOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: userInput,
        type: 'USER',
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMessage])
      setUserInput('')
      
      // 模拟客服自动回复
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          content: '收到您的消息，客服正在为您处理...',
          type: 'ADMIN',
          createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, autoReply])
      }, 1000)
    }
  }

  const handleQuickReply = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'USER',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickReplies = [
    '小米安装不了 点击问我',
    '苹果安装不了 点击问我',
    '华为安装不了 点击问我',
    '成功案例1 点击问我',
    '成功案例2 点击问我',
    '软件下载不了怎么办'
  ]

  return (
    <div className="chat-container">
      {/* 头部状态栏 */}
      <div className="chat-header">
        <Link href="/" className="back-btn">←</Link>
        <div className="header-info">
          <div className="online-status">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            <span className="status-text">{isOnline ? '在线客服' : '离线'}</span>
          </div>
        </div>
        <button className="refresh-btn">⟳</button>
      </div>

      {/* 消息区域 */}
      <div className="messages-container">
        {/* 欢迎横幅 */}
        <div className="welcome-banner">
          <div className="banner-content">
            {adminProfile.linkText}
          </div>
        </div>

        {/* 快捷回复按钮 */}
        {messages.length === 0 && (
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* 消息列表 */}
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type.toLowerCase()}`}>
              {message.type === 'ADMIN' && (
                <div className="message-avatar">
                  <img src={adminProfile.avatar} alt="客服头像" />
                </div>
              )}
              
              <div className="message-bubble">
                {message.fileUrl ? (
                  <div className="file-content">
                    {message.fileType === 'IMAGE' && (
                      <img src={message.fileUrl} alt={message.fileName} />
                    )}
                    {message.fileType === 'VIDEO' && (
                      <video src={message.fileUrl} controls />
                    )}
                    {message.fileName && (
                      <span className="file-name">{message.fileName}</span>
                    )}
                  </div>
                ) : (
                  <span className="message-text">{message.content}</span>
                )}
                <div className="message-time">{formatTime(message.createdAt)}</div>
              </div>

              {message.type === 'USER' && (
                <div className="message-avatar user-avatar">
                  <span>我</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="input-container">
        <div className="input-wrapper">
          <button className="action-btn">+</button>
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
            disabled={!userInput.trim()}
          >
            发送
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f7f8fc;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .chat-header {
          background: #fff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-btn {
          font-size: 20px;
          color: #666;
          text-decoration: none;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #f0f0f0;
        }

        .header-info {
          flex: 1;
          text-align: center;
        }

        .online-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ccc;
        }

        .status-dot.online {
          background: #4caf50;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .status-text {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .refresh-btn {
          background: none;
          border: none;
          font-size: 18px;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: #f0f0f0;
          transform: rotate(180deg);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 100px;
        }

        .welcome-banner {
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        .banner-content {
          font-weight: 500;
          font-size: 16px;
        }

        .quick-replies {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .quick-reply-btn {
          background: white;
          border: 1px solid #e0e0e0;
          padding: 12px 16px;
          border-radius: 20px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .quick-reply-btn:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .quick-reply-btn:active {
          transform: translateY(0);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          gap: 8px;
          max-width: 85%;
        }

        .message.admin {
          align-self: flex-start;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-avatar {
          background: #2196f3;
          color: white;
          font-size: 12px;
          font-weight: 500;
        }

        .message-bubble {
          background: white;
          padding: 12px 16px;
          border-radius: 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: relative;
          word-wrap: break-word;
        }

        .message.user .message-bubble {
          background: #4caf50;
          color: white;
        }

        .message-text {
          font-size: 15px;
          line-height: 1.4;
        }

        .message-time {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
          text-align: right;
        }

        .message.user .message-time {
          color: rgba(255,255,255,0.7);
        }

        .file-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-content img, .file-content video {
          max-width: 200px;
          border-radius: 8px;
        }

        .file-name {
          font-size: 12px;
          color: #666;
        }

        .input-container {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 12px 16px 16px;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8f9fa;
          border-radius: 24px;
          padding: 8px;
          border: 1px solid #e0e0e0;
        }

        .action-btn, .emoji-btn {
          background: none;
          border: none;
          font-size: 18px;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .action-btn:hover, .emoji-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .message-input {
          flex: 1;
          border: none;
          background: none;
          padding: 8px 12px;
          font-size: 15px;
          outline: none;
        }

        .message-input::placeholder {
          color: #999;
        }

        .send-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .send-btn:not(:disabled):hover {
          background: #45a049;
          transform: scale(1.05);
        }

        .send-btn:not(:disabled):active {
          transform: scale(0.98);
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
          .chat-container {
            max-width: 100%;
            height: 100vh;
          }

          .messages-container {
            padding: 12px;
          }

          .message {
            max-width: 90%;
          }

          .quick-reply-btn {
            font-size: 14px;
            padding: 10px 14px;
          }

          .message-bubble {
            padding: 10px 14px;
          }

          .message-text {
            font-size: 14px;
          }

          .input-container {
            padding: 8px 12px 12px;
          }
        }

        /* iPhone 安全区域适配 */
        @media (max-width: 430px) {
          .input-container {
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
          }

          .chat-header {
            padding-top: calc(12px + env(safe-area-inset-top));
          }
        }

        /* 横屏适配 */
        @media (orientation: landscape) and (max-height: 500px) {
          .messages-container {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  )
}