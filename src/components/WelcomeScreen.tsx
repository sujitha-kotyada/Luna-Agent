import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { LunaMark } from './LunaMark'

interface WelcomeScreenProps {
  onStartChat: () => void
  onOpenPanel?: (panel: string, payload?: Record<string, string> | null) => void
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  return (
    <motion.main
      animate={{ opacity: 1 }}
      // allow the welcome/home view to scroll independently inside the fixed viewport
      className="relative z-10 flex min-h-0 flex-1 flex-col px-6 py-6 overflow-auto luna-scroll"
      exit={{ opacity: 0, y: -12 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-4 pt-3 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 scale-85"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <LunaMark compact />
        </motion.div>
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl leading-tight text-[#fff3dc] drop-shadow-[0_0_32px_rgba(233,200,143,0.12)] max-lg:text-3xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.08, duration: 0.65, ease: 'easeOut' }}
        >
          Welcome, Sujitha
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-base text-white/62"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.16, duration: 0.65, ease: 'easeOut' }}
        >
          I&apos;m Luna, your AI assistant.
        </motion.p>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.24, duration: 0.65, ease: 'easeOut' }}
        >
          <Button className="min-w-64" onClick={onStartChat} size="lg">
            <Sparkles className="h-5 w-5 text-[#f2d396]" />
            Start a New Chat
          </Button>
        </motion.div>
      </section>
    </motion.main>
  )
}
