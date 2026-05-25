import { useState } from 'react'

interface FileEntry {
  name: string
  size: number
  type: string
}

interface FileExplorerProps {
  initialPath?: string | null
}

export function FileExplorer({ initialPath }: FileExplorerProps) {
  const [files, setFiles] = useState<FileEntry[]>([])

  return (
    <div className="w-[320px] max-w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">File Explorer</h3>
        <span className="text-sm text-white/50">{initialPath ?? ''}</span>
      </div>
      <p className="mt-3 text-xs text-white/60">Select files or a folder using your browser's file picker (multiple):</p>
      <input
        className="mt-3 w-full text-sm text-white"
        type="file"
        multiple
        onChange={(e) => {
          const list = (e.target as HTMLInputElement).files
          if (!list) return
          const parsed: FileEntry[] = Array.from(list).map((f) => ({ name: f.name, size: f.size, type: f.type }))
          setFiles(parsed)
        }}
      />

      <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
        {files.length === 0 ? (
          <p className="text-sm text-white/50">No files selected.</p>
        ) : (
          files.map((f) => (
            <div key={f.name} className="flex items-center justify-between rounded-md border border-white/6 p-2 text-sm">
              <div className="truncate">{f.name}</div>
              <div className="text-white/50">{(f.size / 1024).toFixed(1)} KB</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
