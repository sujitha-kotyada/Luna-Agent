import { Eye } from 'lucide-react'
import { cn } from '../lib/utils'

interface FileCardProps {
  name: string
  meta: string
  type: 'ppt' | 'xls' | 'doc' | 'pdf' | 'fig'
  compact?: boolean
}

const fileStyles = {
  ppt: 'bg-[#d75b3a]',
  xls: 'bg-[#238b5e]',
  doc: 'bg-[#356bd7]',
  pdf: 'bg-[#c94343]',
  fig: 'bg-[#2f3241]',
}

export function FileCard({ name, meta, type, compact = false }: FileCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-[#e9c88f]/35 hover:bg-white/[0.065]',
        compact && 'border-transparent bg-transparent px-0 py-2 hover:border-transparent hover:bg-transparent',
      )}
    >
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-semibold text-white shadow-lg', fileStyles[type])}>
        {type.toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="mt-1 truncate text-xs text-white/48">{meta}</p>
      </div>
      {!compact && <Eye className="h-5 w-5 text-white/66" />}
    </div>
  )
}
