"use client"

import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { useEffect, useState } from "react"

function Nav() {
  const { unlocked } = usePurchase()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <span className="text-xl font-bold tracking-tight">
        TaxMate <span className="text-sm font-normal text-neutral-500">AUD</span>
      </span>
      <div className="flex items-center gap-4 text-sm">
        {mounted && !unlocked && (
          <Link
            href="/purchase"
            className="rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-800"
          >
            Get started — $4.99
          </Link>
        )}
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="px-6 pt-16 pb-12 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Stop paying $150 to H&R Block for simple tax filing
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        Deduction finder, WFH log, MyGov checklist, and audit guide — everything you need to file
        with confidence. One fee, no subscription.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-500">
        <span className="rounded-full border border-neutral-300 px-3 py-1">Made for Australia</span>
        <span className="rounded-full border border-neutral-300 px-3 py-1">$4.99 once</span>
        <span className="rounded-full border border-neutral-300 px-3 py-1">Client-side only</span>
      </div>
    </section>
  )
}

const features = [
  {
    title: "Deduction finder",
    desc: "Tell us your job type and get a personalised list of everything you can claim, with estimated amounts and ATO rules.",
    href: "/checklist",
    emoji: "🔍",
  },
  {
    title: "WFH log",
    desc: "Track your work-from-home days with a proper log. Export to CSV for your records. No more cramming Excel sheets.",
    href: "/wfh-log",
    emoji: "🏠",
  },
  {
    title: "MyGov checklist",
    desc: "Step-by-step field guide showing exactly what to enter in your MyGov tax return. No more guessing.",
    href: "/mygov-checklist",
    emoji: "📋",
  },
  {
    title: "Audit guide",
    desc: "What records to keep, what the ATO looks for, and how to handle an audit if it happens.",
    href: "/audit-guide",
    emoji: "🛡️",
  },
]

function FeatureCards() {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400 hover:shadow-sm"
          >
            <span className="text-2xl">{f.emoji}</span>
            <h3 className="mt-2 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{f.desc}</p>
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
      <section className="px-6 py-12 text-center">
        <p className="text-lg text-green-700 font-medium bg-green-50 rounded-xl py-4 px-8 inline-block border border-green-200">
          You&apos;re unlocked — all features are available.
        </p>
      </section>
    )
  }

  return (
    <section className="px-6 py-12 text-center">
      <div className="max-w-md mx-auto rounded-xl border border-neutral-200 bg-white p-8">
        <p className="text-3xl font-bold">$4.99</p>
        <p className="text-sm text-neutral-500">One fee. All features. No subscription.</p>
        <Link
          href="/purchase"
          className="mt-4 inline-block rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-800"
        >
          Get TaxMate
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-8 text-center text-sm text-neutral-500">
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
