"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { setUnlocked, isUnlocked } from "@/lib/storage"

const STRIPE_PRICE_ID = "price_taxmate_v1" // replace with real Stripe price ID

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

  // Stripe-free purchase flow for MVP
  // In production: replace with Stripe Elements + PaymentElement
  async function handlePurchase() {
    if (!email.trim()) {
      setError("Enter your email to continue")
      return
    }
    setLoading(true)
    setError("")

    try {
      // MVP: direct unlock (no real payment in prototype)
      // In production, this would redirect to Stripe Checkout
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
      // await stripe.redirectToCheckout({ lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }] })

      // For now: simulate successful purchase with a 1-second delay
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="text-4xl">🎉</span>
          <h2 className="mt-4 text-2xl font-bold">You&apos;re all set!</h2>
          <p className="mt-2 text-neutral-600">
            TaxMate is unlocked. All features are available.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checklist"
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Start deduction finder
            </Link>
            <Link
              href="/wfh-log"
              className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium hover:bg-neutral-100"
            >
              Go to WFH log
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-4 px-6 py-4 max-w-md mx-auto">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          &larr; Home
        </Link>
        <span className="text-sm font-bold tracking-tight">Purchase</span>
      </nav>

      <main className="px-6 py-12 max-w-md mx-auto">
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <p className="text-center text-4xl font-bold">$4.99</p>
          <p className="mt-1 text-center text-sm text-neutral-500">One fee. All features. No subscription.</p>

          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Deduction finder for your job type",
              "WFH log with CSV export & import",
              "MyGov step-by-step filing guide",
              "Audit support & record-keeping guide",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-green-600">✔</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <label className="text-sm font-medium">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy TaxMate — $4.99"}
          </button>

          <p className="mt-4 text-center text-xs text-neutral-400">
            This is a prototype. No real payment is taken in this version.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          <p>
            TaxMate provides educational guidance only. Not a substitute for professional tax advice.
          </p>
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
