import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { LunaMessage } from '../lib/agent'

interface HistoryPanelProps {
  onLoadSession: (messages: LunaMessage[]) => void
}

type Session = { id: string; title: string; messages: LunaMessage[]; createdAt: string }

export function HistoryPanel({ onLoadSession }: HistoryPanelProps) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const raw = localStorage.getItem('luna_sessions')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const deleteSession = (sessionId: string) => {
    const shouldDelete = window.confirm('Delete this chat history item? This cannot be undone.')

    if (!shouldDelete) {
      return
    }

    setSessions((current) => {
      const nextSessions = current.filter((session) => session.id !== sessionId)
      localStorage.setItem('luna_sessions', JSON.stringify(nextSessions))
      return nextSessions
    })
  }

  return (
    <div className="w-[320px] max-w-full">
      <h3 className="text-lg font-medium">History</h3>
      <div className="mt-3 max-h-[60vh] overflow-y-auto space-y-2">
        {sessions.length === 0 && <p className="text-sm text-white/50">No saved sessions yet.</p>}
        {sessions.map((s) => (
          <div key={s.id} className="rounded-md border border-white/6 p-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.title || 'Untitled'}</div>
                <div className="text-xs text-white/50">{s.createdAt}</div>
              </div>
              <div className="ml-2 flex items-center gap-1.5">
                <button className="rounded px-3 py-1 text-sm" onClick={() => onLoadSession(s.messages)}>
                  View
                </button>
                <button
                  aria-label={`Delete session ${s.title || 'Untitled'}`}
                  className="rounded p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  onClick={() => deleteSession(s.id)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
