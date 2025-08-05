import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseAvailable } from '@/lib/prisma'

export async function GET() {
  try {
    // 如果数据库不可用，返回默认配置
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        imageUrl: '/welcome-image.jpg',
        title: '欢迎使用在线客服',
        description: '专业的客服团队为您提供7×24小时服务',
        buttonText: '开始咨询',
        autoRedirect: false,
        redirectDelay: 3
      })
    }

    // TODO: 从数据库获取配置
    // const config = await prisma.welcomeConfig.findFirst()
    
    return NextResponse.json({
      imageUrl: '/welcome-image.jpg',
      title: '欢迎使用在线客服',
      description: '专业的客服团队为您提供7×24小时服务',
      buttonText: '开始咨询',
      autoRedirect: false,
      redirectDelay: 3
    })
  } catch (error) {
    console.error('获取欢迎页配置失败:', error)
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: '数据库未配置，无法保存配置', success: false },
        { status: 200 }
      )
    }

    const config = await request.json()
    
    // TODO: 保存到数据库
    // await prisma.welcomeConfig.upsert({
    //   where: { id: 1 },
    //   update: config,
    //   create: { ...config, id: 1 }
    // })

    return NextResponse.json({ success: true, message: '配置已保存' })
  } catch (error) {
    console.error('保存欢迎页配置失败:', error)
    return NextResponse.json(
      { error: '保存配置失败' },
      { status: 500 }
    )
  }
}