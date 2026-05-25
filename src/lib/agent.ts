export interface LunaMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  attachments?: LunaAttachment[]
}

export interface LunaAttachment {
  name: string
  type: string
  size: number
  content?: string
}

export async function askLunaAgent(
  messages: LunaMessage[],
  prompt: string,
  attachments: LunaAttachment[],
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, prompt, attachments }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error ?? 'Luna agent failed.')
  }

  return payload.content as string
}
