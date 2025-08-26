import { useState } from 'react'

export default function App() {
  const [msg, setMsg] = useState<string>('')

  async function ping() {
    try {
      const r = await fetch('/api/health')
      const j = await r.json()
      setMsg(JSON.stringify(j))
    } catch (e) {
      setMsg(String(e))
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Frontend is live (5173)</h1>
      <button onClick={ping} style={{ padding: 10, border: '1px solid #ccc' }}>
        Call /api/health
      </button>
      <pre>{msg}</pre>
    </div>
  )
}
