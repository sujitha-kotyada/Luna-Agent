import { useState } from 'react'

export function SettingsPanel() {
  const [name, setName] = useState(() => {
    try {
      const stored = localStorage.getItem('luna_settings')
      if (!stored) return 'Luna'
      const parsed = JSON.parse(stored)
      return parsed?.name ?? 'Luna'
    } catch {
      return 'Luna'
    }
  })

  const save = () => {
    localStorage.setItem('luna_settings', JSON.stringify({ name }))
    alert('Settings saved')
  }

  return (
    <div className="w-[320px] max-w-full">
      <h3 className="text-lg font-medium">Settings</h3>
      <div className="mt-4 space-y-3">
        <label className="block text-sm text-white/70">Assistant name</label>
        <input className="w-full rounded border px-3 py-2 text-black" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="pt-2">
          <button className="rounded bg-[#e9c88f] px-4 py-2" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
