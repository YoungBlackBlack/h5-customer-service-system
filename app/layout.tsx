import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线客服系统',
  description: '智能客服对话系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}