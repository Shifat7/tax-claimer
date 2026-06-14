"use client"

import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { useEffect, useState } from "react"

function Nav() {
  const { unlocked } = usePurchase()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-taxmate-600 text-white text-sm font-bold">T</span>
        <span className="text-lg font-bold tracking-tight">TaxMate</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {mounted && !unlocked && (
          <Link
            href="/purchase"
            className="rounded-lg bg-taxmate-600 px-5 py-2.5 font-medium text-white hover:bg-taxmate-700 transition shadow-sm"
          >
            Get started — $4.99
          </Link>
        )}
        {mounted && unlocked && (
          <Link href="/checklist" className="text-taxmate-600 hover:text-taxmate-800 font-medium">
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-taxmate-50/60 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-taxmate-200 bg-taxmate-50 px-4 py-1.5 text-xs font-medium text-taxmate-700 mb-6">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Made for Australian tax season 2025-26
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-tight">
          Stop paying $150 to H&R Block
          <br />
          <span className="text-taxmate-600">for simple tax filing</span>
        </h1>
        <p className="mt-5 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Deduction finder, WFH log, MyGov checklist, and audit guide — everything you need to file
          with confidence. One fee, no subscription.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/purchase"
            className="rounded-xl bg-taxmate-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-taxmate-700 transition shadow-lg hover:shadow-xl"
          >
            Buy TaxMate — $4.99
          </Link>
          <Link
            href="/checklist"
            className="rounded-xl border-2 border-neutral-200 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
          >
            Try deduction finder
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400">
          <span className="rounded-full border border-neutral-200 px-3 py-1">One-time payment</span>
          <span className="text-neutral-300">·</span>
          <span className="rounded-full border border-neutral-200 px-3 py-1">No subscription</span>
          <span className="text-neutral-300">·</span>
          <span className="rounded-full border border-neutral-200 px-3 py-1">Your data stays on your device</span>
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    title: "Deduction finder",
    desc: "Tell us your job type and get a personalised list of everything you can claim, with estimated amounts and ATO rules.",
    href: "/checklist",
    icon: (
      <svg className="w-6 h-6 text-taxmate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-taxmate-50 to-white",
    border: "border-taxmate-200/50",
    hover: "hover:border-taxmate-300 group-hover:shadow-taxmate-200/40",
  },
  {
    title: "WFH log",
    desc: "Track your work-from-home days with a proper log. Export to CSV for your records. No more cramming Excel sheets.",
    href: "/wfh-log",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    color: "from-emerald-50 to-white",
    border: "border-emerald-200/50",
    hover: "hover:border-emerald-300 group-hover:shadow-emerald-200/40",
  },
  {
    title: "MyGov checklist",
    desc: "Step-by-step field guide showing exactly what to enter in your MyGov tax return. No more guessing.",
    href: "/mygov-checklist",
    icon: (
      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "from-violet-50 to-white",
    border: "border-violet-200/50",
    hover: "hover:border-violet-300 group-hover:shadow-violet-200/40",
  },
  {
    title: "Audit guide",
    desc: "What records to keep, what the ATO looks for, and how to handle an audit if it happens.",
    href: "/audit-guide",
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-amber-50 to-white",
    border: "border-amber-200/50",
    hover: "hover:border-amber-300 group-hover:shadow-amber-200/40",
  },
]

function FeatureCards() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Everything you need to file</h2>
        <p className="mt-2 text-neutral-500">Four tools in one. No fluff, just what works.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b ${f.color} ${f.border} ${f.hover} p-6 transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200/80 shadow-sm mb-4">
              {f.icon}
            </div>
            <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-taxmate-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Cta() {
  const { unlocked } = usePurchase()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (mounted && unlocked) {
    return (
      <section className="px-6 py-16 text-center">
        <div className="max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-200 p-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl mb-4">✅</span>
          <p className="text-xl font-bold text-green-900">You&apos;re unlocked</p>
          <p className="mt-1 text-green-700">All features are available.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/checklist" className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition">
              Start deduction finder
            </Link>
            <Link href="/wfh-log" className="rounded-xl border border-green-300 bg-white px-6 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition">
              Go to WFH log
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-taxmate-50/40 to-transparent pointer-events-none" />
      <div className="relative max-w-lg mx-auto">
        <div className="rounded-2xl bg-white border border-neutral-200 p-10 shadow-xl">
          <p className="text-5xl font-extrabold tracking-tight">$4.99</p>
          <p className="mt-1 text-neutral-500">One fee. All features. No subscription.</p>
          <div className="mt-6 space-y-3 text-sm text-left">
            {["Deduction finder with ATO rules", "WFH log with CSV export", "MyGov step-by-step guide", "Audit support and record-keeping"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-taxmate-100 text-taxmate-700 text-xs font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/purchase"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-taxmate-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-taxmate-700 transition shadow-lg"
          >
            Get TaxMate
          </Link>
          <p className="mt-3 text-xs text-neutral-400">Instant access. No account needed. Your data stays on your device.</p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-10 text-center text-sm text-neutral-400">
      <p>TaxMate provides educational guidance only. Always verify with the ATO or a registered tax agent.</p>
    </footer>
  )
}

export default function Home() {
  return (
    <PurchaseProvider>
      <Nav />
      <Hero />
      <FeatureCards />
      <Cta />
      <Footer />
    </PurchaseProvider>
  )
}
