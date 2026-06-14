"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { setUnlocked, isUnlocked } from "@/lib/storage"

function PurchasePage() {
  const { unlocked, setUnlocked: setPurchased } = usePurchase()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isUnlocked()) {
      setSuccess(true)
    }
  }, [])

  async function handlePurchase() {
    if (!email.trim()) {
      setError("Enter your email to continue")
      return
    }
    setLoading(true)
    setError("")

    try {
      await new Promise((r) => setTimeout(r, 1000))
      setUnlocked(email.trim())
      setPurchased(true)
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (mounted && success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl mb-6">🎉</span>
          <h2 className="text-3xl font-bold tracking-tight">You&apos;re all set!</h2>
          <p className="mt-2 text-neutral-500 text-lg">TaxMate is unlocked. All features are available.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checklist"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-taxmate-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-taxmate-700 transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start deduction finder
            </Link>
            <Link
              href="/wfh-log"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Go to WFH log
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
      <nav className="flex items-center gap-4 px-6 py-5 max-w-md mx-auto border-b border-neutral-100">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
        <span className="text-sm font-bold tracking-tight">Purchase</span>
      </nav>

      <main className="px-6 py-12 max-w-md mx-auto">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
          <div className="text-center pb-6 border-b border-neutral-100">
            <p className="text-5xl font-extrabold tracking-tight text-taxmate-700">$4.99</p>
            <p className="mt-1 text-neutral-500">One fee. All features. No subscription.</p>
          </div>

          <ul className="mt-6 space-y-3">
            {[
              { icon: "✓", text: "Deduction finder for your job type", color: "bg-taxmate-100 text-taxmate-700" },
              { icon: "✓", text: "WFH log with CSV export & import", color: "bg-emerald-100 text-emerald-700" },
              { icon: "✓", text: "MyGov step-by-step filing guide", color: "bg-violet-100 text-violet-700" },
              { icon: "✓", text: "Audit support & record-keeping guide", color: "bg-amber-100 text-amber-700" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.color} text-xs font-bold`}>
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-neutral-100">
            <label className="text-sm font-semibold text-neutral-700">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1.5 block w-full rounded-xl border-2 border-neutral-200 px-4 py-3.5 text-sm focus:border-taxmate-400 focus:outline-none focus:ring-2 focus:ring-taxmate-100 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-taxmate-600 to-taxmate-700 px-6 py-3.5 text-base font-bold text-white hover:from-taxmate-700 hover:to-taxmate-800 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : "Buy TaxMate — $4.99"}
          </button>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </span>
            <span className="text-neutral-300">·</span>
            <span>No account needed</span>
            <span className="text-neutral-300">·</span>
            <span>Instant access</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3.5 text-xs text-amber-700">
          <span className="font-semibold">Prototype notice:</span> No real payment is taken in this version. Enter any email to unlock.
        </div>

        <div className="mt-4 text-center text-xs text-neutral-400">
          <p>TaxMate provides educational guidance only. Not a substitute for professional tax advice.</p>
        </div>
      </main>
    </div>
  )
}

export default function Purchase() {
  return (
    <PurchaseProvider>
      <PurchasePage />
    </PurchaseProvider>
  )
}
