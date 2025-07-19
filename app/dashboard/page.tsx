'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface TransformedMessage {
  id: string
  originalContent: string
  transformedContent: string
  userName: string
  createdAt: string
  avatar: string
  isRead: boolean
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<TransformedMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role !== 'SUPERVISOR') {
      router.push('/chat')
      return
    }

    fetchMessages()
  }, [session, router])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/dashboard/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/dashboard/messages/${messageId}/read`, {
        method: 'PUT',
      })
      fetchMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const getAvatarEmoji = (avatar: string) => {
    const avatarMap: Record<string, string> = {
      RABBIT: '🐰',
      CAT: '🐱',
      HANDSOME: '🤵',
      GAL: '💅',
    }
    return avatarMap[avatar] || '🐰'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">上司ダッシュボード</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            部下からのフィードバックを確認できます
          </p>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだメッセージがありません
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-3 sm:p-4 ${
                    message.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <span className="text-xl sm:text-2xl">{getAvatarEmoji(message.avatar)}</span>
                      <span className="text-sm sm:text-base font-medium">{message.userName}</span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    {!message.isRead && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                      >
                        既読にする
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="bg-gray-100 p-2 sm:p-3 rounded">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">元のメッセージ:</p>
                      <p className="text-sm sm:text-base text-gray-800">{message.originalContent}</p>
                    </div>

                    <div className="bg-green-50 p-2 sm:p-3 rounded">
                      <p className="text-xs sm:text-sm text-green-600 mb-1">
                        AI先輩による建設的なフィードバック:
                      </p>
                      <p className="text-sm sm:text-base text-gray-800">{message.transformedContent}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}