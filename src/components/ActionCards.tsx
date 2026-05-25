import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, FileText, FolderSearch, PenLine } from 'lucide-react'

const actions = [
  {
    title: 'Summarize Documents',
    description: 'Get key insights quickly',
    icon: FileText,
    prompt: 'Summarize the attached document or pasted text into clear key points.',
  },
  {
    title: 'Find Files',
    description: 'Search across your files',
    icon: FolderSearch,
    prompt: 'Help me find the right files and organize what I should upload next.',
  },
  {
    title: 'Analyze Data',
    description: 'Visualize and understand',
    icon: BarChart3,
    prompt: 'Analyze the data I share, highlight patterns, and suggest next steps.',
  },
  {
    title: 'Create Content',
    description: 'Generate reports, notes & more',
    icon: PenLine,
    prompt: 'Create polished content from my notes, files, or rough ideas.',
  },
]

interface ActionCardsProps {
  onSelectAction: (prompt: string) => void
}

export function ActionCards({ onSelectAction }: ActionCardsProps) {
  return (
    <div className="grid w-full max-w-5xl grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
      {actions.map((action, index) => {
        const Icon = action.icon

        return (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className="group relative min-h-40 overflow-hidden rounded-3xl border border-white/12 bg-white/[0.035] p-5 text-left shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:border-[#e9c88f]/42 hover:bg-white/[0.055]"
            initial={{ opacity: 0, y: 18 }}
            key={action.title}
            transition={{ delay: 0.28 + index * 0.08, duration: 0.55, ease: 'easeOut' }}
            onClick={() => onSelectAction(action.prompt)}
            whileHover={{ y: -7, scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#e9c88f]/55 to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-black/24 text-[#efc986] shadow-[0_0_26px_rgba(233,200,143,0.08)]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-6 block text-base font-medium text-white">{action.title}</span>
            <span className="mt-1 block text-sm text-white/54">{action.description}</span>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-[#efc986] opacity-80 transition group-hover:translate-x-1" />
          </motion.button>
        )
      })}
    </div>
  )
}
