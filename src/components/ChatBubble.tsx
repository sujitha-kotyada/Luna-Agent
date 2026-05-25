import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LunaMark } from './LunaMark'
import { cn } from '../lib/utils'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  children: ReactNode
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-4', isUser ? 'justify-end' : 'justify-start')}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {!isUser && (
        <div className="mt-2">
          <LunaMark compact />
        </div>
      )}
      <div
        className={cn(
          'max-w-[680px] rounded-[26px] border p-6 text-left text-[15px] leading-7 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl',
          isUser
            ? 'border-[#b069ff]/38 bg-[linear-gradient(135deg,rgba(94,42,156,0.34),rgba(21,26,53,0.62))] text-white shadow-[0_0_48px_rgba(128,82,255,0.18)]'
            : 'border-[#4d7dff]/35 bg-[linear-gradient(135deg,rgba(13,20,43,0.78),rgba(28,32,70,0.58))] text-white/86 shadow-[0_0_58px_rgba(72,109,255,0.14)]',
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}
