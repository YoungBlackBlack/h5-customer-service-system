'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WelcomeConfig {
  imageUrl: string
  title: string
  description: string
  buttonText: string
  autoRedirect: boolean
  redirectDelay: number
}

export default function WelcomePage() {
  const router = useRouter()
  const [config, setConfig] = useState<WelcomeConfig>({
    imageUrl: '/welcome-image.jpg',
    title: '欢迎使用在线客服',
    description: '专业的客服团队为您提供7×24小时服务',
    buttonText: '开始咨询',
    autoRedirect: false,
    redirectDelay: 3
  })
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // 从后台获取配置（这里用模拟数据）
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/welcome-config')
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.log('使用默认配置')
      }
    }
    
    fetchConfig()
  }, [])

  useEffect(() => {
    if (config.autoRedirect && config.redirectDelay > 0) {
      setCountdown(config.redirectDelay)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/chat')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [config.autoRedirect, config.redirectDelay, router])

  const handleEnterChat = () => {
    router.push('/chat')
  }

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="image-container">
          <img 
            src={config.imageUrl} 
            alt={config.title}
            className="welcome-image"
            onError={(e) => {
              // 图片加载失败时显示默认背景
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="image-fallback">
            <div className="fallback-icon">💬</div>
            <div className="fallback-text">在线客服</div>
          </div>
        </div>
        
        <div className="welcome-info">
          <h1 className="welcome-title">{config.title}</h1>
          <p className="welcome-description">{config.description}</p>
          
          <button 
            className="enter-button"
            onClick={handleEnterChat}
          >
            {config.buttonText}
            {countdown > 0 && (
              <span className="countdown">({countdown}s)</span>
            )}
          </button>
          
          {config.autoRedirect && (
            <p className="auto-redirect-notice">
              {countdown > 0 ? `${countdown}秒后自动进入客服` : '正在进入客服...'}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .welcome-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .welcome-content {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          width: 100%;
          position: relative;
          z-index: 2;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 300px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .welcome-image:hover {
          transform: scale(1.05);
        }

        .image-fallback {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #666;
        }

        .fallback-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .fallback-text {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .welcome-info {
          padding: 2rem;
          text-align: center;
        }

        .welcome-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-description {
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
        }

        .enter-button {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
          position: relative;
          overflow: hidden;
          min-width: 160px;
        }

        .enter-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .enter-button:hover::before {
          left: 100%;
        }

        .enter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
        }

        .enter-button:active {
          transform: translateY(0);
        }

        .countdown {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-left: 0.5rem;
        }

        .auto-redirect-notice {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #999;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @media (max-width: 600px) {
          .welcome-container {
            padding: 10px;
          }
          
          .image-container {
            height: 250px;
          }
          
          .welcome-info {
            padding: 1.5rem;
          }
          
          .welcome-title {
            font-size: 1.5rem;
          }
          
          .welcome-description {
            font-size: 0.9rem;
          }
          
          .enter-button {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 400px) {
          .image-container {
            height: 200px;
          }
          
          .fallback-icon {
            font-size: 3rem;
          }
          
          .welcome-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  )
}