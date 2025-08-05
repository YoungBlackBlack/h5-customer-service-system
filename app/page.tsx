'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>H5 客服系统</h1>
        <p>专业的在线客服解决方案</p>
        
        <div className="entry-buttons">
          <Link href="/admin" className="entry-btn admin-btn">
            🔧 后台管理
            <span className="btn-desc">客服人员管理界面</span>
          </Link>
          
          <Link href="/chat" className="entry-btn chat-btn">
            💬 在线客服
            <span className="btn-desc">用户聊天界面</span>
          </Link>
        </div>
        
        <div className="features">
          <div className="feature-item">
            <h3>📱 移动端优化</h3>
            <p>完美适配手机和平板设备</p>
          </div>
          <div className="feature-item">
            <h3>📁 文件上传</h3>
            <p>支持图片、视频文件传输</p>
          </div>
          <div className="feature-item">
            <h3>💾 数据持久化</h3>
            <p>基于 Vercel PostgreSQL</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .hero-section {
          text-align: center;
          color: white;
          max-width: 600px;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        .hero-section p {
          font-size: 1.2rem;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .entry-buttons {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }

        .entry-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 200px;
        }

        .entry-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .entry-btn {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .btn-desc {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-item {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .feature-item h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .feature-item p {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }
          
          .entry-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .entry-btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}