import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ChatBubble } from './ChatBubble'
import { MessageInput } from './MessageInput'
import { TopBar } from './TopBar'
import { askLunaAgent, type LunaAttachment, type LunaMessage } from '../lib/agent'
import { FileExplorer } from './FileExplorer'
import { HistoryPanel } from './HistoryPanel'
import { SettingsPanel } from './SettingsPanel'

interface ChatLayoutProps {
  autoPrompt?: string | null
  autoPromptId?: number
  onAutoPromptConsumed?: () => void
  openPanel?: string | null
  panelPayload?: Record<string, string> | null
}

function createMessage(
  role: LunaMessage['role'],
  content: string,
  attachments?: LunaAttachment[],
): LunaMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    attachments,
    createdAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

function renderMessage(content: string) {
  return content.split('\n').map((line, index) => (
    <p className={line.trim().startsWith('-') || line.trim().startsWith('*') ? 'pl-3' : ''} key={`${line}-${index}`}>
      {line || '\u00a0'}
    </p>
  ))
}

export function ChatLayout({ autoPrompt, autoPromptId, onAutoPromptConsumed, openPanel, panelPayload }: ChatLayoutProps) {
  const [messages, setMessages] = useState<LunaMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentAutoPromptId = useRef<number | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading])

  const handleSend = useCallback(async (prompt: string, attachments: LunaAttachment[]) => {
    const userMessage = createMessage('user', prompt, attachments)
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setError(null)
    setIsLoading(true)

    try {
      const answer = await askLunaAgent(messages, prompt, attachments)
      setMessages((current) => [...current, createMessage('assistant', answer)])
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : 'Luna could not reach the local agent server. Please check your configuration.'

      setError(message)
      setMessages((current) => [
        ...current,
        createMessage(
          'assistant',
          `I could not connect to the LangChain agent yet. ${message}`,
        ),
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  useEffect(() => {
    if (!autoPrompt || autoPromptId == null || sentAutoPromptId.current === autoPromptId) {
      return
    }

    sentAutoPromptId.current = autoPromptId
    void handleSend(autoPrompt, [])
    onAutoPromptConsumed?.()
  }, [autoPrompt, autoPromptId, onAutoPromptConsumed, handleSend])

  // persist sessions when assistant replies
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.role !== 'assistant') return

    const sessionsRaw = localStorage.getItem('luna_sessions')
    const sessions = sessionsRaw ? JSON.parse(sessionsRaw) : []
    const title = messages.find((m) => m.role === 'user')?.content.slice(0, 80) ?? ''
    const entry = { id: crypto.randomUUID(), title, messages, createdAt: new Date().toLocaleString() }
    sessions.unshift(entry)
    localStorage.setItem('luna_sessions', JSON.stringify(sessions.slice(0, 50)))
  }, [messages])

  const showSidePanel = openPanel === 'files' || openPanel === 'history' || openPanel === 'settings' || openPanel === 'search'

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className={showSidePanel
        ? 'relative z-10 grid h-full min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px] gap-5 overflow-hidden px-6 py-5 max-2xl:grid-cols-[minmax(0,1fr)_280px] max-xl:grid-cols-1 max-sm:px-4 max-sm:py-4'
        : 'relative z-10 grid h-full min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden px-6 py-5 max-sm:px-4 max-sm:py-4'
      }
      exit={{ opacity: 0, y: 12 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="grid min-h-0 grid-rows-[auto,minmax(0,1fr),auto,auto] overflow-hidden">
        {messages.length === 0 && <TopBar />}
        <div className="mt-6 min-h-0 space-y-5 overflow-y-auto pr-2 luna-scroll" ref={scrollRef}>
          {messages.length === 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-14 max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.035] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="mx-auto h-8 w-8 text-[#e9c88f]" />
              <h2 className="mt-5 font-serif text-3xl text-[#fff3dc]">Luna is online</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">
                Ask a question, draft notes, plan a task, or drop a file below. Luna now uses
                Gemini 2.5 Flash through a LangChain agent with local tools.
              </p>
            </motion.div>
          )}

          {messages.map((message) => (
            <ChatBubble key={message.id} role={message.role}>
              <div className="space-y-1">{renderMessage(message.content)}</div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {message.attachments.map((file) => (
                    <span
                      className="rounded-full border border-[#e9c88f]/24 bg-[#e9c88f]/8 px-3 py-1 text-xs text-[#f2d396]"
                      key={`${message.id}-${file.name}`}
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-4 text-right text-xs text-white/44">{message.createdAt}</p>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble role="assistant">
              <div className="flex items-center gap-3 text-white/62">
                <span className="flex gap-1">
                  <i className="h-2 w-2 animate-[typing_1.2s_infinite] rounded-full bg-[#e9c88f]" />
                  <i className="h-2 w-2 animate-[typing_1.2s_0.2s_infinite] rounded-full bg-[#e9c88f]" />
                  <i className="h-2 w-2 animate-[typing_1.2s_0.4s_infinite] rounded-full bg-[#e9c88f]" />
                </span>
                Luna is thinking with the LangChain agent
              </div>
            </ChatBubble>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-[#e9c88f]/26 bg-[#e9c88f]/8 px-4 py-3 text-sm text-[#f2d396]">
            {error}
          </div>
        )}

        <div className="mt-4 shrink-0">
          <MessageInput disabled={isLoading} onSend={handleSend} />
        </div>
      </section>

      {showSidePanel && (
        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[28px] border border-white/10 bg-[#050a15]/58 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl max-xl:hidden"
          initial={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          {openPanel === 'files' && <FileExplorer initialPath={panelPayload?.path ?? null} />}
          {openPanel === 'history' && <HistoryPanel onLoadSession={(msgs) => setMessages(msgs)} />}
          {openPanel === 'settings' && <SettingsPanel />}
          {openPanel === 'search' && (
            <div className="w-[320px]">
              <h3 className="text-lg font-medium">Search files</h3>
              <p className="mt-2 text-sm text-white/60">Use the File Explorer to load files, then search filenames here.</p>
              <div className="mt-4">
                <input className="w-full rounded border px-3 py-2 text-black" placeholder="Search filenames..." />
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </motion.main>
  )
}
