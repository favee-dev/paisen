'use client'

import { useState } from 'react'
import ChatInterface from '@/components/chat-interface'
import AvatarSelector from '@/components/avatar-selector'

export default function ChatPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<'RABBIT' | 'CAT' | 'HANDSOME' | 'GAL'>('RABBIT')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-80 bg-white border-r border-gray-100 flex flex-col
          transform transition-transform duration-300 lg:transform-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI先輩
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">率直な気持ちを伝えよう</p>
          </div>
          
          <div className="p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-sm font-medium text-gray-700 mb-4">アバターを選択</h2>
            <AvatarSelector 
              selected={selectedAvatar} 
              onSelect={(avatar) => {
                setSelectedAvatar(avatar)
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false)
                }
              }} 
            />
          </div>
          
          <div className="mt-auto p-4 sm:p-6 border-t border-gray-100">
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
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
        <div className="flex-1 flex flex-col bg-gray-50 w-full lg:w-auto">
          <ChatInterface avatar={selectedAvatar} />
        </div>
      </div>
    </div>
  )
}