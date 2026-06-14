"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { isUnlocked } from "@/lib/storage"

const checklistSteps = [
  {
    step: 1,
    title: "Log in to MyGov",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: "bg-blue-50 text-blue-700 border-blue-200",
    details: [
      "Go to my.gov.au and log in with your username and password",
      "Use the myGovID app if you have it set up (recommended — faster)",
      "Link your ATO account if you haven't already (one-time setup)",
    ],
  },
  {
    step: 2,
    title: "Start your tax return",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: "bg-violet-50 text-violet-700 border-violet-200",
    details: [
      'Click "Tax" then "Lodge your tax return"',
      "The ATO will have your income data pre-filled from employers, banks, and health funds",
      "Check each pre-filled item is correct — edit if needed",
    ],
  },
  {
    step: 3,
    title: "Enter your income",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    details: [
      "Salary/wages: pre-filled from your employer's PAYG summary — verify the amounts",
      "Bank interest: pre-filled from your bank — check each account",
      "Dividends: pre-filled from share registries — add any not listed",
      "Other income: add manually if you had side work, government payments, etc.",
    ],
  },
  {
    step: 4,
    title: "Claim your deductions",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-taxmate-50 text-taxmate-700 border-taxmate-200",
    details: [
      "Use the checklist from TaxMate's Deduction Finder to know what to claim",
      'Work-related expenses: enter under "Deductions" → "Work-related expenses"',
      "WFH expenses: use the fixed-rate method ($0.67/hr) or actual cost method",
      "Enter total amounts for each category — no need to upload receipts unless audited",
      "Laundry: $1 per load if only work clothes, $0.50 if mixed",
      "Self-education: enter total course fees, minus any employer reimbursement",
    ],
  },
  {
    step: 5,
    title: "Review offsets and adjustments",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "bg-amber-50 text-amber-700 border-amber-200",
    details: [
      "Private health insurance: pre-filled — verify your cover level",
      "HELP/HECS repayment: calculated automatically based on your income",
      "Low-income tax offset: applied automatically if eligible",
      "Medicare levy: standard 2% — check if you qualify for an exemption",
    ],
  },
  {
    step: 6,
    title: "Review and lodge",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: "bg-green-50 text-green-700 border-green-200",
    details: [
      "Review every figure on the summary page",
      "Double-check your bank account details for the refund",
      "Click 'Lodge' — you'll get a confirmation with your lodgment reference number",
      "Save the confirmation page as a PDF for your records",
    ],
  },
]

function MyGovChecklistPage() {
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
          <span className="text-sm font-bold tracking-tight">MyGov checklist</span>
        </nav>
        <main className="px-6 py-20 text-center max-w-md mx-auto">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold">MyGov tax return guide</h2>
          <p className="mt-2 text-neutral-500">Step-by-step walkthrough for your MyGov tax return.</p>
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
        <span className="text-sm font-bold tracking-tight">MyGov checklist</span>
      </nav>

      <main className="px-6 pb-16 max-w-3xl mx-auto pt-8">
        <div className="text-center mb-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <h2 className="text-3xl font-bold tracking-tight">How to lodge your tax return on MyGov</h2>
          <p className="mt-2 text-neutral-500 max-w-xl mx-auto">
            Follow these steps to file your return through the ATO via MyGov. Pre-filled data handles
            the easy part — this guide helps you with everything else.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200 hidden sm:block" />
          <div className="space-y-6">
            {checklistSteps.map((s) => (
              <div key={s.step} className="relative sm:pl-16">
                <div className={`hidden sm:flex absolute left-0 top-0 h-16 w-16 items-center justify-center rounded-2xl border-2 ${s.color} shadow-sm`}>
                  {s.icon}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`sm:hidden flex h-8 w-8 items-center justify-center rounded-lg ${s.color} text-xs font-bold`}>{s.step}</span>
                    <h3 className="font-bold text-lg">{s.step}. {s.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                        <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-neutral-300" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            <p className="font-bold text-amber-900">Before you lodge</p>
          </div>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              Have your bank account details ready for the refund
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              Have your receipts and records accessible (you don&apos;t upload them, but you need them if audited)
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              Check your private health insurance details are correct
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              If you&apos;re unsure about anything, the ATO help line is <strong>13 28 61</strong>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/audit-guide"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition"
          >
            Read audit guide
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/checklist"
            className="inline-flex items-center gap-2 rounded-xl bg-taxmate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-taxmate-700 transition shadow-sm"
          >
            Back to deduction finder
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function MyGovChecklist() {
  return (
    <PurchaseProvider>
      <MyGovChecklistPage />
    </PurchaseProvider>
  )
}
