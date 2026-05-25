import { motion } from 'framer-motion'
import { Download, Folder, Home, Image, MessageSquare, Monitor, Search, Settings, Sparkles } from 'lucide-react'
import { LunaMark } from './LunaMark'
import { cn } from '../lib/utils'

interface SidebarProps {
  activeSelection: 'home' | 'new-chat' | 'history' | 'files' | 'search' | 'settings'
  onNavigate: (view: 'home' | 'chat') => void
  onOpenPanel: (panel: string | null, payload?: Record<string, string> | null) => void
}

const navItems = [
  { label: 'Home', icon: Home, view: 'home' as const },
  { label: 'New Chat', icon: MessageSquare, view: 'chat' as const },
  { label: 'History', icon: MessageSquare },
  { label: 'Files', icon: Folder },
  { label: 'Search', icon: Search },
  { label: 'Settings', icon: Settings },
]

const quickAccess = [
  { label: 'Desktop', icon: Monitor },
  { label: 'Documents', icon: Folder },
  { label: 'Downloads', icon: Download },
  { label: 'Pictures', icon: Image },
]

export function Sidebar({ activeSelection, onNavigate, onOpenPanel }: SidebarProps) {
  return (
    <motion.aside
      animate={{ x: 0, opacity: 1 }}
      // allow the sidebar to scroll independently inside the fixed viewport
      className="relative z-10 flex min-h-0 h-full w-[228px] shrink-0 flex-col border-r border-white/10 bg-[#020711]/58 px-4 py-5 backdrop-blur-2xl max-xl:w-[208px] max-sm:hidden overflow-auto luna-scroll"
      initial={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="scale-[0.92] origin-top-left">
        <LunaMark />
      </div>
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            (item.label === 'Home' && activeSelection === 'home') ||
            (item.label === 'New Chat' && activeSelection === 'new-chat') ||
            (item.label === 'History' && activeSelection === 'history') ||
            (item.label === 'Files' && activeSelection === 'files') ||
            (item.label === 'Search' && activeSelection === 'search') ||
            (item.label === 'Settings' && activeSelection === 'settings')

          return (
            <motion.button
              className={cn(
                'group flex h-10 w-full items-center gap-3 rounded-2xl border px-3.5 text-left text-sm text-white/70 transition duration-300',
                isActive
                  ? 'border-[#e9c88f]/48 bg-[#f0c980]/9 text-[#fff5df] shadow-[0_0_34px_rgba(233,200,143,0.13)]'
                  : 'border-transparent hover:border-white/12 hover:bg-white/[0.045] hover:text-white',
              )}
              key={item.label}
              onClick={() => {
                if (item.view) {
                  onOpenPanel(null)
                  onNavigate(item.view)
                  return
                }

                // map label to panels
                if (item.label === 'History') {
                  onOpenPanel('history')
                  return
                }

                if (item.label === 'Files') {
                  onOpenPanel('files')
                  return
                }

                if (item.label === 'Search') {
                  onOpenPanel('search')
                  return
                }

                if (item.label === 'Settings') {
                  onOpenPanel('settings')
                  return
                }
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-[#f0cc8a]' : 'text-white/68 group-hover:text-[#f0cc8a]')} />
              {item.label}
            </motion.button>
          )
        })}
      </nav>
      <div className="my-5 h-px bg-white/10" />
      <p className="px-3 text-xs font-medium text-[#e9c88f]">Quick Access</p>
      <div className="mt-2 space-y-2">
        {quickAccess.map((item) => {
          const Icon = item.icon

          return (
            <motion.button
              className="flex h-9 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm text-white/62 transition hover:bg-white/[0.045] hover:text-white"
              key={item.label}
              onClick={() => onOpenPanel('files', { path: item.label })}
              whileHover={{ x: 3 }}
            >
              <Icon className="h-5 w-5 text-white/64" />
              {item.label}
            </motion.button>
          )
        })}
      </div>
      <div className="mt-auto">
        <div className="mb-4 h-px bg-white/10" />
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/9 bg-white/[0.035] p-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#121323] text-sm text-white">S</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white">Sujitha</p>
            <p className="text-xs text-white/45">Local companion</p>
          </div>
          <span className="rounded-full border border-[#e9c88f]/45 px-2.5 py-1 text-xs text-[#f0cc8a]">Pro</span>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-2.5 text-xs text-white/58">
          <Sparkles className="h-4 w-4 text-[#e9c88f]" />
          LUNA PRIME active
        </div>
      </div>
    </motion.aside>
  )
}
