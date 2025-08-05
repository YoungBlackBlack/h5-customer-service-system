import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        admin: true,
        user: true
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type, fileUrl, fileType, fileName, adminId, userId } = body

    // 如果是用户消息，需要处理用户 session
    let user = null
    if (type === 'USER') {
      const sessionId = userId || `user_${Date.now()}`
      user = await prisma.user.upsert({
        where: { sessionId },
        update: {},
        create: {
          sessionId,
          nickname: '用户'
        }
      })
    }

    // 如果是管理员消息，确保管理员存在
    let admin = null
    if (type === 'ADMIN') {
      admin = await prisma.admin.upsert({
        where: { id: adminId || '1' },
        update: {},
        create: {
          id: adminId || '1',
          nickname: '在线客服',
          avatar: '/default-avatar.png',
          linkText: '下载APP防止失联'
        }
      })
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content || '',
        type,
        fileUrl,
        fileType,
        fileName,
        adminId: admin?.id,
        userId: user?.id
      },
      include: {
        admin: true,
        user: true
      }
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await prisma.message.deleteMany()
    return NextResponse.json({ message: 'All messages cleared' })
  } catch (error) {
    console.error('Delete messages error:', error)
    return NextResponse.json(
      { error: 'Failed to clear messages' },
      { status: 500 }
    )
  }
}