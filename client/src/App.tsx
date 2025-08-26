import React, { useEffect, useMemo, useRef, useState } from "react"
import "./index.css"
import Controls from "./components/Controls"
import ResetButton from "./components/ResetButton"
import type { AppState } from "./types"
import { defaults, initialState, writeLocal, writeToUrl } from "./lib/state"

export default function App() {
  const [state, setState] = useState<AppState>(() => initialState())
  const saveTick = useRef<number | null>(null)

  useEffect(() => {
    if (saveTick.current) cancelAnimationFrame(saveTick.current)
    saveTick.current = requestAnimationFrame(() => {
      writeLocal(state)
      writeToUrl(state, true)
    })
  }, [state])

  const gradient = useMemo(() => {
    const hue = Math.round(state.hue * 360)
    const a = `hsl(${hue}, 90%, ${Math.max(20, 60 - state.intensity * 20)}%)`
    const b = `hsl(${(hue + 40) % 360}, 90%, ${Math.min(80, 40 + state.intensity * 20)}%)`
    return `linear-gradient(90deg, ${a}, ${b})`
  }, [state])

  return (
    <>
      <div className="page">
        <div className="stage" style={{ backgroundImage: gradient, animationDuration: `${Math.max(0.2, 3 - state.speed)}s` }} />
        <Controls
          state={state}
          onChange={(next) => setState((s) => ({ ...s, ...next }))}
          onReset={() => {
            setState(defaults)
            history.replaceState(null, "", location.pathname)
            localStorage.removeItem("shadervibe:state:v1")
          }}
        />
      </div>
      <ResetButton />
    </>
  )
}

