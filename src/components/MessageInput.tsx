import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mic, Paperclip, Search, Send, Sparkles, Wand2 } from 'lucide-react'
import { Button } from './ui/button'
import type { LunaAttachment } from '../lib/agent'

const quickActions = [
  { label: 'Summarize', prompt: 'Summarize the attached file or text.', icon: Search },
  { label: 'Analyze', prompt: 'Analyze this and call out patterns, risks, and next steps.', icon: Wand2 },
  { label: 'Create', prompt: 'Create a polished draft from this context.', icon: Sparkles },
]

interface MessageInputProps {
  disabled?: boolean
  onSend: (prompt: string, attachments: LunaAttachment[]) => void
}

async function readAttachment(file: File): Promise<LunaAttachment> {
  const canReadAsText =
    file.type.startsWith('text/') ||
    file.type.includes('json') ||
    file.name.endsWith('.md') ||
    file.name.endsWith('.csv')

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    content: canReadAsText ? await file.text() : undefined,
  }
}

export function MessageInput({ disabled = false, onSend }: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [prompt, setPrompt] = useState('')
  const [attachments, setAttachments] = useState<LunaAttachment[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = async (files: FileList | File[]) => {
    const parsed = await Promise.all(Array.from(files).map(readAttachment))
    setAttachments((current) => [...current, ...parsed])
  }

  const submit = (overridePrompt?: string) => {
    const nextPrompt = (overridePrompt ?? prompt).trim()

    if (!nextPrompt || disabled) {
      return
    }

    onSend(nextPrompt, attachments)
    setPrompt('')
    setAttachments([])
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[22px] border border-[#6f83ff]/28 bg-[#080c18]/72 p-2.5 shadow-[0_0_60px_rgba(86,112,255,0.18)] backdrop-blur-2xl"
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        void addFiles(event.dataTransfer.files)
      }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      <textarea
        className="min-h-12 w-full resize-none rounded-xl border border-dashed border-white/12 bg-white/[0.025] px-3 py-2 text-left text-xs text-white outline-none transition placeholder:text-white/42 focus:border-[#e9c88f]/38 disabled:opacity-60"
        disabled={disabled}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        placeholder={
          isDragging
            ? 'Drop files for Luna to analyze...'
            : 'Ask Luna anything, or drop files here for analysis...'
        }
        value={prompt}
      />
      {attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((file) => (
            <span
              className="rounded-full border border-[#e9c88f]/26 bg-[#e9c88f]/8 px-3 py-1 text-xs text-[#f4dca8]"
              key={`${file.name}-${file.size}`}
            >
              {file.name}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2.5 flex items-center gap-2">
        <input
          className="hidden"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              void addFiles(event.target.files)
            }
          }}
          ref={fileInputRef}
          type="file"
        />
        <Button aria-label="Attach file" onClick={() => fileInputRef.current?.click()} size="icon" type="button" variant="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button aria-label="Use microphone" disabled={disabled} size="icon" type="button" variant="icon">
          <Mic className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 justify-center gap-1.5">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                className="h-8 rounded-full px-3 text-[10px]"
                disabled={disabled}
                key={action.label}
                onClick={() => submit(action.prompt)}
                type="button"
                variant="ghost"
              >
                <Icon className="h-3.5 w-3.5 text-[#e9c88f]" />
                {action.label}
              </Button>
            )
          })}
        </div>
        <Button
          aria-label="Send message"
          className="shadow-[0_0_34px_rgba(115,124,255,0.44)]"
          disabled={disabled || !prompt.trim()}
          onClick={() => submit()}
          size="icon"
          type="button"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}
