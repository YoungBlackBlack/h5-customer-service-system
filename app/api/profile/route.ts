import { NextRequest, NextResponse } from 'next/server'

interface AdminProfile {
  nickname: string
  avatar: string
  linkText: string
}

let adminProfile: AdminProfile = {
  nickname: '在线客服',
  avatar: '/default-avatar.png',
  linkText: '下载APP防止失联'
}

export async function GET() {
  return NextResponse.json(adminProfile)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, avatar, linkText } = body

    if (nickname) adminProfile.nickname = nickname
    if (avatar) adminProfile.avatar = avatar
    if (linkText) adminProfile.linkText = linkText

    return NextResponse.json(adminProfile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}