import { NextRequest, NextResponse } from 'next/server'

interface Message {
  id: string
  content: string
  type: 'user' | 'admin'
  timestamp: string
  fileUrl?: string
  fileType?: 'image' | 'video'
}

let messages: Message[] = []

export async function GET() {
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type, fileUrl, fileType } = body

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content || '',
      type,
      timestamp: new Date().toISOString(),
      fileUrl,
      fileType
    }

    messages.push(newMessage)

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  messages = []
  return NextResponse.json({ message: 'All messages cleared' })
}