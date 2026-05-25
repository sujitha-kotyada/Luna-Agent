import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface LunaMarkProps {
  compact?: boolean
}

export function LunaMark({ compact = false }: LunaMarkProps) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        animate={{ y: [0, -3, 0], boxShadow: ['0 0 22px rgba(232,197,139,0.2)', '0 0 36px rgba(232,197,139,0.36)', '0 0 22px rgba(232,197,139,0.2)'] }}
        className={cn(
          'relative grid place-items-center rounded-full border border-[#e9c88f]/18 bg-black/20',
          compact ? 'h-12 w-12' : 'h-16 w-16',
        )}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className={cn(
            'rounded-full bg-[radial-gradient(circle_at_30%_35%,#fff6d8,#dfad65_46%,#3b2a21_72%,transparent_73%)]',
            compact ? 'h-8 w-8' : 'h-11 w-11',
          )}
        />
        <span
          className={cn(
            'absolute translate-x-2 rounded-full bg-[#070b13]',
            compact ? 'h-8 w-8' : 'h-11 w-11',
          )}
        />
      </motion.div>
      {!compact && (
        <div>
          <p className="font-serif text-4xl tracking-[0.22em] text-[#fff6df]">LUNA</p>
          <p className="mt-1 text-xs uppercase tracking-[0.42em] text-white/62">AI Assistant</p>
        </div>
      )}
    </div>
  )
}
