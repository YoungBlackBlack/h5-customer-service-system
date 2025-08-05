import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 检查文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB' }, { status: 400 })
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    // 检查 Vercel Blob 配置
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'File storage not configured' }, { status: 500 })
    }

    // 上传到 Vercel Blob
    const filename = `${Date.now()}-${file.name}`
    const blob = await put(filename, file, { access: 'public' })

    const fileType = file.type.startsWith('image/') ? 'IMAGE' : 
                    file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT'

    // 保存文件信息到数据库（如果数据库可用）
    let fileRecord = null
    if (process.env.POSTGRES_PRISMA_URL) {
      try {
        fileRecord = await prisma.fileUpload.create({
          data: {
            fileName: file.name,
            fileUrl: blob.url,
            fileType,
            fileSize: file.size
          }
        })
      } catch (dbError) {
        console.warn('Database not available, file uploaded to blob only:', dbError)
      }
    }

    return NextResponse.json({ 
      id: fileRecord?.id || Date.now().toString(),
      fileUrl: blob.url,
      fileType,
      fileName: file.name,
      fileSize: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// 获取上传的文件列表
export async function GET() {
  try {
    // 检查数据库连接
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json([])
    }

    const files = await prisma.fileUpload.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Get files error:', error)
    // 在构建时返回空数组
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
      return NextResponse.json([])
    }
    return NextResponse.json(
      { error: 'Failed to get files' },
      { status: 500 }
    )
  }
}