'use client'

import { useState } from 'react'
import ChatInterface from '@/components/chat-interface'
import AvatarSelector from '@/components/avatar-selector'

export default function ChatPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<'RABBIT' | 'CAT' | 'HANDSOME' | 'GAL'>('RABBIT')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI先輩
            </h1>
            <p className="text-sm text-gray-600 mt-1">率直な気持ちを伝えよう</p>
          </div>
          
          <div className="p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-4">アバターを選択</h2>
            <AvatarSelector 
              selected={selectedAvatar} 
              onSelect={setSelectedAvatar} 
            />
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-100">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-purple-600">✨</span>
                <span>AI先輩が親身になって聞きます</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600">🔒</span>
                <span>プライバシー保護</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600">💡</span>
                <span>建設的なアドバイス</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <ChatInterface avatar={selectedAvatar} />
        </div>
      </div>
    </div>
  )
}