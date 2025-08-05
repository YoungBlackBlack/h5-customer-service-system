// 数据库回退处理
export const isDatabaseAvailable = () => {
  return Boolean(process.env.POSTGRES_PRISMA_URL)
}

export const handleDatabaseError = (error: any, fallbackData: any = null) => {
  console.error('Database error:', error)
  
  // 在构建时或数据库不可用时返回回退数据
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
    return fallbackData
  }
  
  throw error
}

// 默认数据
export const defaultAdminProfile = {
  id: '1',
  nickname: '在线客服',
  avatar: '/default-avatar.png',
  linkText: '下载APP防止失联',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const defaultMessages: any[] = []

export const defaultTemplates: any[] = []

export const defaultFiles: any[] = []