"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { isUnlocked } from "@/lib/storage"

function AuditGuidePage() {
  const { unlocked } = usePurchase()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const canAccess = mounted && (unlocked || isUnlocked())

  if (mounted && !canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
        <nav className="flex items-center gap-4 px-6 py-5 max-w-3xl mx-auto border-b border-neutral-100">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Home
          </Link>
          <span className="text-sm font-bold tracking-tight">Audit guide</span>
        </nav>
        <main className="px-6 py-20 text-center max-w-md mx-auto">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold">Audit support guide</h2>
          <p className="mt-2 text-neutral-500">What records to keep and how to handle an ATO review.</p>
          <Link
            href="/purchase"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-taxmate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-lg"
          >
            Unlock — $4.99
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-taxmate-50/20 to-white">
      <nav className="flex items-center gap-4 px-6 py-5 max-w-3xl mx-auto border-b border-neutral-100">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
        <span className="text-sm font-bold tracking-tight">Audit guide</span>
      </nav>

      <main className="px-6 pb-16 max-w-3xl mx-auto pt-8">
        <div className="text-center mb-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h2 className="text-3xl font-bold tracking-tight">Audit support guide</h2>
          <p className="mt-2 text-neutral-500 max-w-xl mx-auto">
            What the ATO looks for, what records to keep, and how to handle it if you&apos;re reviewed.
          </p>
        </div>

        {/* Records to keep */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold">What records to keep</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Income records",
                items: ["PAYG payment summaries from all employers", "Bank interest statements", "Dividend statements", "Receipts for any other income"],
                color: "border-blue-200 bg-blue-50/30",
                dot: "bg-blue-400",
              },
              {
                label: "WFH expenses",
                items: ["TaxMate WFH log (exported CSV)", "Electricity and internet bills (if using actual cost)", "Receipts for home office equipment", "Diary record of hours worked from home"],
                color: "border-emerald-200 bg-emerald-50/30",
                dot: "bg-emerald-400",
              },
              {
                label: "Work-related expenses",
                items: ["Receipts for items over $10 (ATO can ask)", "Uniform or protective clothing receipts", "Union or professional association fee receipts", "Course or conference receipts for self-education", "Vehicle logbook (if claiming travel)"],
                color: "border-violet-200 bg-violet-50/30",
                dot: "bg-violet-400",
              },
            ].map((cat) => (
              <div key={cat.label} className={`rounded-xl border ${cat.color} p-5 ${cat.items.length > 4 ? "sm:col-span-2" : ""}`}>
                <p className="font-semibold text-neutral-900 mb-2">{cat.label}</p>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className={`mt-1.5 block h-2 w-2 shrink-0 rounded-full ${cat.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How long to keep records */}
        <section className="mt-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-lg font-bold">How long to keep records</h3>
            </div>
            <p className="text-sm text-neutral-600 ml-11">
              The ATO requires you to keep all tax records for <strong className="text-neutral-900">5 years</strong> from the date
              you lodged your return. For most people, keeping records from the last 5 tax years is
              sufficient. Store them digitally — scans or photos of receipts are accepted.
            </p>
          </div>
        </section>

        {/* What triggers an ATO review */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold">What triggers an ATO review?</h3>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6">
            <ul className="space-y-3 text-sm text-amber-900">
              {[
                "Claims significantly higher than others in the same occupation",
                "Large or unusual deductions (e.g. $5,000+ in work-related expenses)",
                "Rental property losses claimed year after year",
                "Mismatches between pre-filled data and what you entered",
                "Random compliance checks (the ATO does these — they're not personal)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* If you're audited */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold">If you&apos;re audited</h3>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <ol className="space-y-4">
              {[
                { title: "Don't panic", desc: "Most ATO reviews are correspondence-based — they send you a letter asking for specific records." },
                { title: "Respond by the deadline", desc: "You typically get 28 days. Ignoring it makes things worse." },
                { title: "Only provide what's asked for", desc: "If they ask for WFH evidence, send your WFH log and bills. Don't send everything you have." },
                { title: "Get help if needed", desc: "A registered tax agent can represent you. The ATO also has a free taxpayer assistance service." },
                { title: "Dispute if you disagree", desc: "You can object to an ATO decision within 4 years. The process is outlined on ato.gov.au." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-taxmate-100 text-taxmate-700 text-xs font-bold">{i + 1}</span>
                  <div>
                    <strong className="text-neutral-900">{item.title}.</strong>
                    <p className="text-sm text-neutral-600 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Common audit triggers */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 11M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </span>
            <h3 className="text-xl font-bold">Common audit triggers for salaried employees</h3>
          </div>
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-6">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">💡</span>
              <p className="text-sm text-red-800 leading-relaxed">
                The ATO uses industry benchmarks. For a salaried office worker claiming $2,000+ in
                work-related expenses, you&apos;re above the average and more likely to be reviewed. This
                doesn&apos;t mean you shouldn&apos;t claim what you&apos;re entitled to — just make sure you have
                records to back it up. <strong>TaxMate&apos;s WFH log gives you a proper record.</strong>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/mygov-checklist"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
          >
            View MyGov checklist
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/wfh-log"
            className="inline-flex items-center gap-2 rounded-xl bg-taxmate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-sm"
          >
            Go to WFH log
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function AuditGuide() {
  return (
    <PurchaseProvider>
      <AuditGuidePage />
    </PurchaseProvider>
  )
}
