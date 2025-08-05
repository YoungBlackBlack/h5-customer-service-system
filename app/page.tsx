'use client'

import { useState } from 'react'
import AdminPanel from '@/components/AdminPanel'
import UserChat from '@/components/UserChat'

export default function Home() {
  const [messages, setMessages] = useState<Array<{
    id: string
    content: string
    type: 'user' | 'admin'
    timestamp: Date
    fileUrl?: string
    fileType?: 'image' | 'video'
  }>>([])

  const [adminProfile, setAdminProfile] = useState({
    nickname: '在线客服',
    avatar: '/default-avatar.png',
    linkText: '下载APP防止失联'
  })

  const addMessage = (content: string, type: 'user' | 'admin', fileUrl?: string, fileType?: 'image' | 'video') => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      fileUrl,
      fileType
    }
    setMessages(prev => [...prev, newMessage])
  }

  return (
    <div className="container">
      <div className="chat-system">
        <AdminPanel 
          profile={adminProfile}
          onProfileUpdate={setAdminProfile}
          onSendMessage={addMessage}
        />
        <UserChat 
          messages={messages}
          adminProfile={adminProfile}
          onSendMessage={addMessage}
        />
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
          background: #f5f5f5;
        }

        .chat-system {
          display: flex;
          height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .chat-system {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}