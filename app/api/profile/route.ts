import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json({
        id: '1',
        nickname: '在线客服',
        avatar: '/default-avatar.png',
        linkText: '下载APP防止失联'
      })
    }

    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId') || '1'

    const admin = await prisma.admin.upsert({
      where: { id: adminId },
      update: {},
      create: {
        id: adminId,
        nickname: '在线客服',
        avatar: '/default-avatar.png',
        linkText: '下载APP防止失联'
      }
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Get admin profile error:', error)
    // 在构建时返回默认数据
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
      return NextResponse.json({
        id: '1',
        nickname: '在线客服',
        avatar: '/default-avatar.png',
        linkText: '下载APP防止失联'
      })
    }
    return NextResponse.json(
      { error: 'Failed to get admin profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { adminId = '1', nickname, avatar, linkText } = body

    const admin = await prisma.admin.upsert({
      where: { id: adminId },
      update: {
        ...(nickname && { nickname }),
        ...(avatar && { avatar }),
        ...(linkText && { linkText })
      },
      create: {
        id: adminId,
        nickname: nickname || '在线客服',
        avatar: avatar || '/default-avatar.png',
        linkText: linkText || '下载APP防止失联'
      }
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Update admin profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update admin profile' },
      { status: 500 }
    )
  }
}