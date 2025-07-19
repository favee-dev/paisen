import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const prisma = new PrismaClient()

const avatarPersonalities = {
  RABBIT: {
    name: 'うさぎ先輩',
    personality: '優しくて思いやりがあり、聞き上手な先輩。相手の気持ちに寄り添いながら、前向きなアドバイスをします。',
  },
  CAT: {
    name: '猫先輩',
    personality: 'クールで冷静、でも実は面倒見が良い先輩。的確なアドバイスをしつつ、さりげなく励まします。',
  },
  HANDSOME: {
    name: 'イケメン先輩',
    personality: '爽やかで頼りがいのある先輩。ポジティブで、相手を勇気づけるような言葉をかけます。',
  },
  GAL: {
    name: 'ギャル先輩',
    personality: '明るくて親しみやすい先輩。フランクな口調で、相手の気持ちを盛り上げます。',
  },
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, avatar } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const personality = avatarPersonalities[avatar as keyof typeof avatarPersonalities]

    const systemPrompt = `あなたは「${personality.name}」です。${personality.personality}
    
    重要な指示：
    - 相談者の気持ちに共感し、寄り添うこと
    - 建設的でポジティブな返答をすること
    - 相談者の味方として、励まし、サポートすること
    - 上司への不満や愚痴も受け止め、気持ちを整理する手助けをすること
    - 具体的で実践的なアドバイスを含めること`

    // メッセージの感情分析と変換のためのプロンプト
    const transformPrompt = `以下のメッセージを、上司が読んでも関係性を損なわず、建設的なフィードバックとして受け取れるように変換してください。
    感情的な表現は和らげつつ、核心的な問題は保持してください。
    
    元のメッセージ: ${message}
    
    変換のガイドライン:
    - ネガティブな感情表現を建設的な提案に変換
    - 批判を改善提案として表現
    - 感情的な言葉を客観的な表現に置き換え
    - 問題の核心は保持しつつ、プロフェッショナルな表現にする`

    // AI先輩からの返答を生成
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'すみません、うまく返答できませんでした。'

    // 上司向けにメッセージを変換
    const transformCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '建設的なフィードバックへの変換を行います。' },
        { role: 'user', content: transformPrompt },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 300,
    })

    const transformedContent = transformCompletion.choices[0]?.message?.content || message

    // メッセージを保存
    await prisma.message.create({
      data: {
        content: message,
        transformedContent: transformedContent,
        userId: user.id,
        avatar: avatar,
        sentiment: null, // 後で感情分析を実装可能
      },
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}