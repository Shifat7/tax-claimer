"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { isUnlocked } from "@/lib/storage"

const checklistSteps = [
  {
    step: 1,
    title: "Log in to MyGov",
    details: [
      "Go to my.gov.au and log in with your username and password",
      "Use the myGovID app if you have it set up (recommended — faster)",
      "Link your ATO account if you haven't already (one-time setup)",
    ],
  },
  {
    step: 2,
    title: "Start your tax return",
    details: [
      'Click "Tax" then "Lodge your tax return"',
      "The ATO will have your income data pre-filled from employers, banks, and health funds",
      "Check each pre-filled item is correct — edit if needed",
    ],
  },
  {
    step: 3,
    title: "Enter your income",
    details: [
      "Salary/wages: pre-filled from your employer's PAYG summary — verify the amounts",
      "Bank interest: pre-filled from your bank — check each account",
      "Dividends: pre-filled from share registries — add any not listed",
      "Other income: add manually if you had side work, government payments, etc.",
    ],
  },
  {
    step: 4,
    title: "Claim your deductions (this is where TaxMate helps)",
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
      <div className="min-h-screen">
        <nav className="flex items-center gap-4 px-6 py-4 max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
            &larr; Home
          </Link>
          <span className="text-sm font-bold tracking-tight">MyGov checklist</span>
        </nav>
        <main className="px-6 py-16 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold">MyGov tax return guide</h2>
          <p className="mt-2 text-neutral-600">
            Step-by-step walkthrough showing exactly what to enter in each MyGov field.
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
      <nav className="flex items-center gap-4 px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          &larr; Home
        </Link>
        <span className="text-sm font-bold tracking-tight">MyGov checklist</span>
      </nav>

      <main className="px-6 pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">How to lodge your tax return on MyGov</h2>
        <p className="mt-1 text-neutral-600">
          Follow these steps to file your return through the ATO via MyGov. Pre-filled data handles
          the easy part — this guide helps you with everything else.
        </p>

        <div className="mt-8 space-y-6">
          {checklistSteps.map((s) => (
            <div key={s.step} className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                  {s.step}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold">{s.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {s.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">Before you lodge</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            <li>• Have your bank account details ready for the refund</li>
            <li>• Have your receipts and records accessible (you don&apos;t upload them, but you need them if audited)</li>
            <li>• Check your private health insurance details are correct</li>
            <li>• If you&apos;re unsure about anything, the ATO help line is 13 28 61</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/audit-guide"
            className="rounded-lg border border-neutral-300 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            Read audit guide
          </Link>
          <Link
            href="/checklist"
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
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
