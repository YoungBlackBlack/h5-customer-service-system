import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId') || '1'

    const templates = await prisma.messageTemplate.findMany({
      where: { adminId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Get templates error:', error)
    // 在构建时返回空数组
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
      return NextResponse.json([])
    }
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { title, content, category, adminId = '1' } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // 确保管理员存在
    await prisma.admin.upsert({
      where: { id: adminId },
      update: {},
      create: {
        id: adminId,
        nickname: '在线客服',
        avatar: '/default-avatar.png',
        linkText: '下载APP防止失联'
      }
    })

    const template = await prisma.messageTemplate.create({
      data: {
        title,
        content,
        category: category || 'general',
        adminId
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    await prisma.messageTemplate.delete({
      where: { id: templateId }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}