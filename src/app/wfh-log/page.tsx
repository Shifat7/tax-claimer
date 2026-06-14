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
      <div className="min-h-screen">
        <nav className="flex items-center gap-4 px-6 py-4 max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
            &larr; Home
          </Link>
          <span className="text-sm font-bold tracking-tight">WFH log</span>
        </nav>
        <main className="px-6 py-16 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold">WFH log</h2>
          <p className="mt-2 text-neutral-600">
            Purchase TaxMate to track your work-from-home days with a proper log and CSV export.
          </p>
          <Link
            href="/purchase"
            className="mt-6 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Unlock — $4.99
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
            &larr; Home
          </Link>
          <span className="text-sm font-bold tracking-tight">WFH log</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="text-neutral-500">
            Rate: $
            <input
              type="number"
              min={0}
              max={2}
              step={0.01}
              className="w-16 rounded border border-neutral-300 px-2 py-1 text-sm"
              value={rate}
              onChange={(e) => {
                const r = parseFloat(e.target.value) || 0.67
                setRate(r)
                setWfhRate(r)
              }}
            />
            /hr
          </label>
        </div>
      </nav>

      <main className="px-6 pb-16 max-w-3xl mx-auto">
        {/* Add entry form */}
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div>
            <label className="text-xs text-neutral-500">Date</label>
            <input
              type="date"
              className="mt-1 block rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500">Hours</label>
            <input
              type="number"
              min={0.5}
              max={24}
              step={0.5}
              className="mt-1 block w-20 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-neutral-500">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Normal WFH day"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Add entry
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg border border-neutral-200 bg-white p-3">
            <p className="text-2xl font-bold">{entries.length}</p>
            <p className="text-neutral-500">Days logged</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-3">
            <p className="text-2xl font-bold">{totalHours}</p>
            <p className="text-neutral-500">Total hours</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-2xl font-bold text-blue-900">${totalClaim.toFixed(0)}</p>
            <p className="text-blue-700">Est. claim</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            disabled={entries.length === 0}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            {showImport ? "Cancel import" : "Import CSV"}
          </button>
        </div>

        {/* Import section */}
        {showImport && (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium">Paste CSV data (date,hours,notes)</p>
            <textarea
              className="mt-2 w-full rounded-lg border border-neutral-300 p-3 text-sm font-mono focus:border-neutral-900 focus:outline-none"
              rows={4}
              placeholder={"2025-01-06,8,Normal day\n2025-01-07,6.5,Half day"}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              Import
            </button>
          </div>
        )}

        {/* Log table */}
        <div className="mt-6">
          {sorted.length === 0 ? (
            <p className="text-center text-neutral-400 py-8">
              No entries yet. Start adding your WFH days above.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-100 text-left text-neutral-600">
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Hours</th>
                    <th className="px-4 py-2 font-medium">Notes</th>
                    <th className="px-4 py-2 font-medium">Claim</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry) => (
                    <tr key={entry.date} className="border-t border-neutral-100">
                      <td className="px-4 py-2">{entry.date}</td>
                      <td className="px-4 py-2">{entry.hours}</td>
                      <td className="px-4 py-2 text-neutral-500">{entry.notes || "—"}</td>
                      <td className="px-4 py-2">${(entry.hours * rate).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemove(entry.date)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          ✕
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
