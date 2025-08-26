import type { AppState } from "../types"

const KEY = "shadervibe:state:v1"

export const defaults: AppState = {
  hue: 0.5,
  speed: 1,
  intensity: 1,
}

export function parseFromUrl(search: string): Partial<AppState> {
  const p = new URLSearchParams(search)
  const h = p.get("h")
  const s = p.get("s")
  const i = p.get("i")
  const out: Partial<AppState> = {}
  if (h !== null && !Number.isNaN(Number(h))) out.hue = clamp01(Number(h))
  if (s !== null && !Number.isNaN(Number(s))) out.speed = clamp01(Number(s)) * 3
  if (i !== null && !Number.isNaN(Number(i))) out.intensity = clamp01(Number(i)) * 2
  return out
}

export function writeToUrl(state: AppState, replace = true) {
  const q = new URLSearchParams()
  q.set("h", round(state.hue, 3).toString())
  q.set("s", round(state.speed / 3, 3).toString())
  q.set("i", round(state.intensity / 2, 3).toString())
  const url = `${location.pathname}?${q.toString()}${location.hash}`
  if (replace) history.replaceState(null, "", url)
  else history.pushState(null, "", url)
}

export function readLocal(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    const out: Partial<AppState> = {}
    if (typeof parsed.hue === "number") out.hue = clamp01(parsed.hue)
    if (typeof parsed.speed === "number") out.speed = Math.max(0, parsed.speed)
    if (typeof parsed.intensity === "number") out.intensity = Math.max(0, parsed.intensity)
    return out
  } catch {
    return {}
  }
}

export function writeLocal(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function initialState(): AppState {
  return { ...defaults, ...readLocal(), ...parseFromUrl(location.search) }
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function round(n: number, d: number) {
  const m = Math.pow(10, d)
  return Math.round(n * m) / m
}

