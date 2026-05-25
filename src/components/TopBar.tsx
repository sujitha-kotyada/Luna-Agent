import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function TopBar() {
  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between"
      initial={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <h1 className="font-serif text-3xl text-[#fff3dc]">Hello, Sujitha <Sparkles className="ml-2 inline h-4 w-4 text-[#e9c88f]" /></h1>
        <p className="mt-3 text-base text-white/58">How can I help you today?</p>
      </div>
      <div />
    </motion.header>
  )
}
