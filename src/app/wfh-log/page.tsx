"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import {
  getWfhLog,
  addWfhEntry,
  removeWfhEntry,
  importWfhCsv,
  exportWfhCsv,
  isUnlocked,
  getWfhRate,
  setWfhRate,
  WfhEntry,
} from "@/lib/storage"

function WfhLogApp() {
  const { unlocked } = usePurchase()
  const [mounted, setMounted] = useState(false)
  const [entries, setEntries] = useState<WfhEntry[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  const [hours, setHours] = useState("8")
  const [notes, setNotes] = useState("")
  const [rate, setRate] = useState(0.67)
  const [importText, setImportText] = useState("")
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEntries(getWfhLog())
    setRate(getWfhRate())
  }, [])

  const refresh = useCallback(() => {
    setEntries(getWfhLog())
  }, [])

  function handleAdd() {
    const h = parseFloat(hours)
    if (!date || isNaN(h) || h <= 0) return
    addWfhEntry({ date, hours: h, notes })
    refresh()
    setDate(new Date().toISOString().split("T")[0])
    setHours("8")
    setNotes("")
  }

  function handleRemove(d: string) {
    removeWfhEntry(d)
    refresh()
  }

  function handleExport() {
    const csv = exportWfhCsv()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taxmate-wfh-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const merged = importWfhCsv(importText)
    setEntries(merged)
    setImportText("")
    setShowImport(false)
  }

  const totalHours = entries.reduce((s, e) => s + e.hours, 0)
  const totalClaim = totalHours * rate
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))

  const canAccess = mounted && (unlocked || isUnlocked())

  if (mounted && !canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
        <nav className="flex items-center gap-4 px-6 py-5 max-w-3xl mx-auto border-b border-neutral-100">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Home
          </Link>
          <span className="text-sm font-bold tracking-tight">WFH log</span>
        </nav>
        <main className="px-6 py-20 text-center max-w-md mx-auto">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold">WFH log</h2>
          <p className="mt-2 text-neutral-500">Purchase TaxMate to track your work-from-home days.</p>
          <Link
            href="/purchase"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-taxmate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-lg"
          >
            Unlock — $4.99
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Home
          </Link>
          <span className="text-sm font-bold tracking-tight">WFH log</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-500 bg-white border border-neutral-200 rounded-lg px-3 py-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rate:
          <input
            type="number"
            min={0}
            max={2}
            step={0.01}
            className="w-16 border-0 p-0 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-0"
            value={rate}
            onChange={(e) => {
              const r = parseFloat(e.target.value) || 0.67
              setRate(r)
              setWfhRate(r)
            }}
          />
          /hr
        </label>
      </nav>

      <main className="px-6 pb-16 max-w-4xl mx-auto pt-8">
        {/* Add entry form */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-taxmate-100 text-taxmate-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h3 className="font-semibold">Add WFH day</h3>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Date</label>
              <input
                type="date"
                className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Hours</label>
              <input
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="flex-[2] min-w-[180px]">
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Notes</label>
              <input
                type="text"
                placeholder="e.g. Normal WFH day"
                className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="rounded-xl bg-taxmate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-sm"
            >
              Add entry
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-neutral-900">{entries.length}</p>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <p className="text-sm text-neutral-500">Days logged</p>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-neutral-900">{totalHours}</p>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-neutral-500">Total hours</p>
            </div>
          </div>
          <div className="rounded-xl border border-taxmate-200 bg-gradient-to-br from-taxmate-50 to-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-taxmate-700">${totalClaim.toFixed(0)}</p>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-taxmate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-taxmate-600 font-medium">Est. claim</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            disabled={entries.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {showImport ? "Cancel" : "Import CSV"}
          </button>
        </div>

        {/* Import section */}
        {showImport && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-6">
            <p className="text-sm font-medium text-neutral-700 mb-2">Paste CSV data <span className="text-neutral-400 font-normal">(date,hours,notes)</span></p>
            <textarea
              className="w-full rounded-xl border-2 border-neutral-200 p-4 text-sm font-mono focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
              rows={4}
              placeholder={"2025-01-06,8,Normal day\n2025-01-07,6.5,Half day"}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-3 rounded-xl bg-taxmate-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-taxmate-700 transition disabled:opacity-40"
            >
              Import
            </button>
          </div>
        )}

        {/* Log table */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Log history</h3>
          {sorted.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center">
              <svg className="w-10 h-10 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-neutral-500 font-medium">No entries yet</p>
              <p className="text-sm text-neutral-400 mt-1">Start adding your WFH days above.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Hours</th>
                    <th className="px-5 py-3">Notes</th>
                    <th className="px-5 py-3">Claim</th>
                    <th className="w-14 px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry) => (
                    <tr key={entry.date} className="border-t border-neutral-100 hover:bg-neutral-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-neutral-900">{entry.date}</td>
                      <td className="px-5 py-3.5 text-neutral-700">{entry.hours}</td>
                      <td className="px-5 py-3.5 text-neutral-500">{entry.notes || <span className="italic text-neutral-300">—</span>}</td>
                      <td className="px-5 py-3.5 font-semibold text-taxmate-700">${(entry.hours * rate).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-center">
                        <button
                          onClick={() => handleRemove(entry.date)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function WfhLogPage() {
  return (
    <PurchaseProvider>
      <WfhLogApp />
    </PurchaseProvider>
  )
}
