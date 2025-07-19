'use client'

type Avatar = 'RABBIT' | 'CAT' | 'HANDSOME' | 'GAL'

interface AvatarSelectorProps {
  selected: Avatar
  onSelect: (avatar: Avatar) => void
}

const avatarOptions = [
  { value: 'RABBIT' as Avatar, label: 'うさぎ先輩', emoji: '🐰', description: '優しく寄り添います' },
  { value: 'CAT' as Avatar, label: '猫先輩', emoji: '🐱', description: 'クールに助言します' },
  { value: 'HANDSOME' as Avatar, label: 'イケメン先輩', emoji: '🤵', description: '前向きに励まします' },
  { value: 'GAL' as Avatar, label: 'ギャル先輩', emoji: '💅', description: '明るく盛り上げます' },
]

export default function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="space-y-2">
      {avatarOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`avatar-option w-full ${
            selected === option.value ? 'selected' : ''
          }`}
        >
          <span className="text-2xl">{option.emoji}</span>
          <div className="flex-1 text-left">
            <div className="text-sm sm:text-base font-medium text-gray-900">{option.label}</div>
            <div className="text-xs text-gray-500">{option.description}</div>
          </div>
          {selected === option.value && (
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          )}
        </button>
      ))}
    </div>
  )
}