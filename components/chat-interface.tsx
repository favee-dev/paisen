'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  avatar: 'RABBIT' | 'CAT' | 'HANDSOME' | 'GAL'
}

export default function ChatInterface({ avatar }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          avatar,
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAvatarEmoji = () => {
    const avatarMap = {
      RABBIT: '🐰',
      CAT: '🐱',
      HANDSOME: '🤵',
      GAL: '💅',
    }
    return avatarMap[avatar]
  }

  const getAvatarName = () => {
    const nameMap = {
      RABBIT: 'うさぎ先輩',
      CAT: '猫先輩',
      HANDSOME: 'イケメン先輩',
      GAL: 'ギャル先輩',
    }
    return nameMap[avatar]
  }

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-2xl">
            {getAvatarEmoji()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{getAvatarName()}</h2>
            <p className="text-xs text-gray-500">オンライン</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-4xl mb-4">
              {getAvatarEmoji()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getAvatarName()}です！
            </h3>
            <p className="text-gray-600 max-w-sm">
              どんなことでも率直に話してください。
              あなたの気持ちに寄り添います。
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                  {getAvatarEmoji()}
                </div>
              )}
              <div className={`chat-bubble ${
                message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
              }`}>
                <span className="whitespace-pre-wrap">{message.content}</span>
                <div className={`text-xs mt-1 ${
                  message.isUser ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                {getAvatarEmoji()}
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="input-modern flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-gradient px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            送信
          </button>
        </form>
      </div>
    </>
  )
}