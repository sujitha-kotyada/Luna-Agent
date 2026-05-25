import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AnimatedBackground } from './components/AnimatedBackground'
import { ChatLayout } from './components/ChatLayout'
import { Sidebar } from './components/Sidebar'
import { WelcomeScreen } from './components/WelcomeScreen'

type View = 'home' | 'chat'
type SidebarSelection = 'home' | 'new-chat' | 'history' | 'files' | 'search' | 'settings'

function App() {
  const [view, setView] = useState<View>('home')
  const [sidebarSelection, setSidebarSelection] = useState<SidebarSelection>('home')
  const [chatSessionId, setChatSessionId] = useState(0)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [panelPayload, setPanelPayload] = useState<Record<string, string> | null>(null)

  const openChat = () => {
    setOpenPanel(null)
    setPanelPayload(null)
    setSidebarSelection('new-chat')
    setChatSessionId((current) => current + 1)
    setView('chat')
  }

  const openRightPanel = (panel: string | null, payload?: Record<string, string> | null) => {
    setOpenPanel(panel)
    setPanelPayload(payload ?? null)
    if (panel) {
      setSidebarSelection(panel as SidebarSelection)
      if (view !== 'chat') setView('chat')
      return
    }

    if (view === 'home') {
      setSidebarSelection('home')
    }
  }

  return (
    // fixed viewport: internal regions (center and aside) will scroll independently
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      <div className="relative flex h-full w-full overflow-hidden bg-[#030711]">
        <AnimatedBackground />
        <Sidebar
          activeSelection={sidebarSelection}
          onNavigate={(nextView) => {
            if (nextView === 'chat') {
              setOpenPanel(null)
              setPanelPayload(null)
              openChat()
              return
            }

            setOpenPanel(null)
            setPanelPayload(null)
            setView(nextView)
            setSidebarSelection('home')
          }}
          onOpenPanel={openRightPanel}
        />
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <WelcomeScreen key="home" onStartChat={openChat} onOpenPanel={openRightPanel} />
          ) : (
            <ChatLayout
              key={`chat-${chatSessionId}`}
              openPanel={openPanel}
              panelPayload={panelPayload}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
