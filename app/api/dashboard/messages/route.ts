import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { team: true },
    })

    if (!user || user.role !== 'SUPERVISOR') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // 同じチームの部下のメッセージを取得
    const messages = await prisma.message.findMany({
      where: {
        user: {
          teamId: user.teamId,
          role: 'SUBORDINATE',
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const transformedMessages = messages.map((message) => ({
      id: message.id,
      originalContent: message.content,
      transformedContent: message.transformedContent || message.content,
      userName: message.user.name || 'Anonymous',
      createdAt: message.createdAt.toISOString(),
      avatar: message.avatar,
      isRead: message.isRead,
    }))

    return NextResponse.json({ messages: transformedMessages })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}