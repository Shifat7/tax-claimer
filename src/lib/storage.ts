export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded — silently fail
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(key)
}

export interface WfhEntry {
  date: string // YYYY-MM-DD
  hours: number
  notes: string
}

export interface PurchaseState {
  unlocked: boolean
  email?: string
}

const KEYS = {
  wfhLog: "taxmate-wfh-log",
  purchase: "taxmate-purchase",
  checklistAnswers: "taxmate-checklist-answers",
  wfhRate: "taxmate-wfh-rate",
} as const

export function getWfhLog(): WfhEntry[] {
  return getStorageItem<WfhEntry[]>(KEYS.wfhLog, [])
}

export function setWfhLog(entries: WfhEntry[]): void {
  setStorageItem(KEYS.wfhLog, entries)
}

export function addWfhEntry(entry: WfhEntry): WfhEntry[] {
  const log = getWfhLog()
  log.push(entry)
  setWfhLog(log)
  return log
}

export function removeWfhEntry(date: string): WfhEntry[] {
  const log = getWfhLog().filter((e) => e.date !== date)
  setWfhLog(log)
  return log
}

export function importWfhCsv(csv: string): WfhEntry[] {
  const lines = csv.trim().split("\n")
  const entries: WfhEntry[] = []
  for (const line of lines) {
    const parts = line.split(",")
    if (parts.length >= 2) {
      const date = parts[0].trim()
      const hours = parseFloat(parts[1].trim())
      const notes = parts.slice(2).join(",").trim()
      if (date && !isNaN(hours)) {
        entries.push({ date, hours, notes })
      }
    }
  }
  const existing = getWfhLog()
  const merged = [...existing]
  for (const e of entries) {
    const idx = merged.findIndex((m) => m.date === e.date)
    if (idx >= 0) merged[idx] = e
    else merged.push(e)
  }
  setWfhLog(merged)
  return merged
}

export function exportWfhCsv(): string {
  const log = getWfhLog()
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date))
  const header = "date,hours,notes"
  const rows = sorted.map((e) => `${e.date},${e.hours},"${e.notes}"`)
  return [header, ...rows].join("\n")
}

export function isUnlocked(): boolean {
  return getStorageItem<PurchaseState>(KEYS.purchase, { unlocked: false }).unlocked
}

export function setUnlocked(email: string): void {
  setStorageItem(KEYS.purchase, { unlocked: true, email })
}

export function getWfhRate(): number {
  return getStorageItem<number>(KEYS.wfhRate, 0.67)
}

export function setWfhRate(rate: number): void {
  setStorageItem(KEYS.wfhRate, rate)
}
