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
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-xl sm:text-2xl">
            {getAvatarEmoji()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">{getAvatarName()}</h2>
            <p className="text-xs text-gray-500">オンライン</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-3xl sm:text-4xl mb-4">
              {getAvatarEmoji()}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {getAvatarName()}です！
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-sm">
              どんなことでも率直に話してください。
              あなたの気持ちに寄り添います。
            </p>
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-sm sm:text-lg mr-2 sm:mr-3 flex-shrink-0">
                  {getAvatarEmoji()}
                </div>
              )}
              <div className={`chat-bubble text-sm sm:text-base ${
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
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-sm sm:text-lg mr-2 sm:mr-3 flex-shrink-0">
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
      <div className="border-t border-gray-100 bg-white p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="input-modern flex-1 text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-gradient px-4 sm:px-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">送信</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}