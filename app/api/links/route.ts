import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseAvailable } from '@/lib/prisma'

interface Link {
  id: string
  name: string
  url: string
  imageUrl: string
  title: string
  description: string
  buttonText: string
  autoRedirect: boolean
  redirectDelay: number
  isActive: boolean
  createdAt: string
}

// 模拟数据存储
let mockLinks: Link[] = [
  {
    id: '1',
    name: '默认客服',
    url: '/chat/default',
    imageUrl: '/welcome-image.jpg',
    title: '欢迎使用在线客服',
    description: '专业的客服团队为您提供7×24小时服务',
    buttonText: '开始咨询',
    autoRedirect: false,
    redirectDelay: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        links: mockLinks,
        message: '使用模拟数据'
      })
    }

    // TODO: 从数据库获取链接
    // const links = await prisma.chatLink.findMany({
    //   orderBy: { createdAt: 'desc' }
    // })

    return NextResponse.json({
      links: mockLinks,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取链接列表失败:', error)
    return NextResponse.json(
      { error: '获取链接失败', links: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const linkData = await request.json()
    
    const newLink: Link = {
      id: Date.now().toString(),
      ...linkData,
      createdAt: new Date().toISOString()
    }

    if (!isDatabaseAvailable()) {
      mockLinks.unshift(newLink)
      return NextResponse.json({
        success: true,
        link: newLink,
        message: '链接已创建（模拟数据）'
      })
    }

    // TODO: 保存到数据库
    // const savedLink = await prisma.chatLink.create({
    //   data: newLink
    // })

    mockLinks.unshift(newLink)
    return NextResponse.json({
      success: true,
      link: newLink,
      message: '链接已创建'
    })
  } catch (error) {
    console.error('创建链接失败:', error)
    return NextResponse.json(
      { error: '创建链接失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!isDatabaseAvailable()) {
      const linkIndex = mockLinks.findIndex(link => link.id === id)
      if (linkIndex !== -1) {
        mockLinks[linkIndex] = { ...mockLinks[linkIndex], ...updateData }
        return NextResponse.json({
          success: true,
          link: mockLinks[linkIndex],
          message: '链接已更新（模拟数据）'
        })
      }
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      )
    }

    // TODO: 更新数据库
    // const updatedLink = await prisma.chatLink.update({
    //   where: { id },
    //   data: updateData
    // })

    const linkIndex = mockLinks.findIndex(link => link.id === id)
    if (linkIndex !== -1) {
      mockLinks[linkIndex] = { ...mockLinks[linkIndex], ...updateData }
    }

    return NextResponse.json({
      success: true,
      message: '链接已更新'
    })
  } catch (error) {
    console.error('更新链接失败:', error)
    return NextResponse.json(
      { error: '更新链接失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '缺少链接ID' },
        { status: 400 }
      )
    }

    if (!isDatabaseAvailable()) {
      mockLinks = mockLinks.filter(link => link.id !== id)
      return NextResponse.json({
        success: true,
        message: '链接已删除（模拟数据）'
      })
    }

    // TODO: 从数据库删除
    // await prisma.chatLink.delete({
    //   where: { id }
    // })

    mockLinks = mockLinks.filter(link => link.id !== id)
    return NextResponse.json({
      success: true,
      message: '链接已删除'
    })
  } catch (error) {
    console.error('删除链接失败:', error)
    return NextResponse.json(
      { error: '删除链接失败' },
      { status: 500 }
    )
  }
}