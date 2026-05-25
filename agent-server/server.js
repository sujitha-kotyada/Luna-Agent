import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ChatGoogle } from '@langchain/google'
import { createAgent, tool } from 'langchain'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const storageDir = path.join(__dirname, 'storage')
const notesPath = path.join(storageDir, 'notes.json')
const tasksPath = path.join(storageDir, 'tasks.json')
const port = Number(process.env.AGENT_PORT ?? 8787)

await fs.mkdir(storageDir, { recursive: true })

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function safeWorkspacePath(relativePath = '.') {
  const resolved = path.resolve(rootDir, relativePath)

  if (!resolved.startsWith(rootDir)) {
    throw new Error('Path is outside the workspace.')
  }

  return resolved
}

async function walkFiles(dir, query, maxResults, results = []) {
  if (results.length >= maxResults) {
    return results
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (results.length >= maxResults) break
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    const relative = path.relative(rootDir, fullPath)

    if (entry.isDirectory()) {
      await walkFiles(fullPath, query, maxResults, results)
    } else if (relative.toLowerCase().includes(query.toLowerCase())) {
      results.push(relative)
    }
  }

  return results
}

const tools = [
  tool(
    async ({ expression }) => {
      if (!/^[\d\s+\-*/().,%]+$/.test(expression)) {
        return 'Only arithmetic expressions are allowed.'
      }

      const value = Function(`"use strict"; return (${expression.replaceAll('%', '/100')})`)()
      return String(value)
    },
    {
      name: 'calculator',
      description: 'Calculate arithmetic expressions.',
      schema: z.object({
        expression: z.string().describe('Arithmetic expression to calculate.'),
      }),
    },
  ),
  tool(
    async () =>
      new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata',
      }).format(new Date()),
    {
      name: 'current_datetime',
      description: 'Get the current date and time in Asia/Kolkata.',
      schema: z.object({}),
    },
  ),
  tool(
    async ({ query, maxResults = 12 }) => {
      const results = await walkFiles(rootDir, query, Math.min(maxResults, 30))
      return results.length ? results.join('\n') : 'No matching workspace files found.'
    },
    {
      name: 'search_workspace_files',
      description: 'Search file names inside the current app workspace.',
      schema: z.object({
        query: z.string().describe('File name or partial path to search for.'),
        maxResults: z.number().int().min(1).max(30).optional(),
      }),
    },
  ),
  tool(
    async ({ relativePath }) => {
      const filePath = safeWorkspacePath(relativePath)
      const stat = await fs.stat(filePath)

      if (stat.size > 120_000) {
        return `File is too large to read directly (${stat.size} bytes).`
      }

      return await fs.readFile(filePath, 'utf8')
    },
    {
      name: 'read_workspace_file',
      description: 'Read a text file from the current app workspace by relative path.',
      schema: z.object({
        relativePath: z.string().describe('Relative path from the project root.'),
      }),
    },
  ),
  tool(
    async ({ title, body = '' }) => {
      const notes = await readJson(notesPath, [])
      const note = { id: crypto.randomUUID(), title, body, createdAt: new Date().toISOString() }
      notes.push(note)
      await writeJson(notesPath, notes)
      return `Saved note "${title}".`
    },
    {
      name: 'create_note',
      description: 'Create a local Luna note.',
      schema: z.object({
        title: z.string(),
        body: z.string().optional(),
      }),
    },
  ),
  tool(
    async ({ title, due }) => {
      const tasks = await readJson(tasksPath, [])
      const task = { id: crypto.randomUUID(), title, due, done: false, createdAt: new Date().toISOString() }
      tasks.push(task)
      await writeJson(tasksPath, tasks)
      return `Created task "${title}".`
    },
    {
      name: 'create_task',
      description: 'Create a local Luna task.',
      schema: z.object({
        title: z.string(),
        due: z.string().optional().describe('Optional due date or natural language due time.'),
      }),
    },
  ),
]

function createLunaAgent() {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Missing GOOGLE_API_KEY, GEMINI_API_KEY, or VITE_GEMINI_API_KEY in .env')
  }

  const model = new ChatGoogle('gemini-2.5-flash', {
    apiKey,
    temperature: 0.65,
  })

  return createAgent({
    model,
    tools,
    systemPrompt: `You are Luna, a premium local desktop AI agent.
Be concise, calm, and practical. Use tools when they help.
You can search/read this project workspace, create local notes/tasks, calculate, and get current time.
You cannot access the full desktop unless a file is uploaded or a desktop bridge is added.`,
  })
}

const agent = createLunaAgent()
const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '6mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, tools: tools.map((item) => item.name) })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], prompt, attachments = [] } = req.body
    const recentMessages = messages.slice(-8).map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }))

    const attachmentText = attachments.length
      ? `\n\nUser attached files:\n${attachments
          .map((file) => `- ${file.name} (${file.type || 'unknown'}, ${file.size} bytes)\n${file.content ?? ''}`)
          .join('\n\n')}`
      : ''

    const result = await agent.invoke({
      messages: [
        ...recentMessages,
        {
          role: 'user',
          content: `${prompt}${attachmentText}`,
        },
      ],
    })

    const finalMessage = result.messages.at(-1)
    const content = typeof finalMessage?.content === 'string'
      ? finalMessage.content
      : JSON.stringify(finalMessage?.content ?? '')

    res.json({ content })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Agent failed.',
    })
  }
})

app.listen(port, () => {
  console.log(`LUNA LangChain agent server listening on http://127.0.0.1:${port}`)
})
