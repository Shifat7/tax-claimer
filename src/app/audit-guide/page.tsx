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
      <div className="min-h-screen">
        <nav className="flex items-center gap-4 px-6 py-4 max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
            &larr; Home
          </Link>
          <span className="text-sm font-bold tracking-tight">Audit guide</span>
        </nav>
        <main className="px-6 py-16 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Audit support guide</h2>
          <p className="mt-2 text-neutral-600">
            What records to keep, what the ATO looks for, and how to handle an audit.
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
        <span className="text-sm font-bold tracking-tight">Audit guide</span>
      </nav>

      <main className="px-6 pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Audit support guide</h2>
        <p className="mt-1 text-neutral-600">
          What the ATO looks for, what records to keep, and how to handle it if you&apos;re reviewed.
        </p>

        <section className="mt-8">
          <h3 className="text-lg font-semibold">What records to keep</h3>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Income records",
                items: [
                  "PAYG payment summaries from all employers",
                  "Bank interest statements",
                  "Dividend statements",
                  "Receipts for any other income",
                ],
              },
              {
                label: "WFH expenses",
                items: [
                  "TaxMate WFH log (exported CSV)",
                  "Electricity and internet bills (if using actual cost method)",
                  "Receipts for home office equipment",
                  "Diary record of hours worked from home (covered by the log)",
                ],
              },
              {
                label: "Work-related expenses",
                items: [
                  "Receipts for items over $10 (ATO can ask)",
                  "Uniform or protective clothing receipts",
                  "Union or professional association fee receipts",
                  "Course or conference receipts for self-education",
                  "Vehicle logbook (if claiming travel)",
                ],
              },
            ].map((cat) => (
              <div key={cat.label} className="rounded-lg border border-neutral-200 bg-white p-4">
                <p className="font-semibold">{cat.label}</p>
                <ul className="mt-2 space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-[5px] block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
            <h3 className="text-lg font-semibold">How long to keep records</h3>
          <p className="mt-2 text-sm text-neutral-600">
            The ATO requires you to keep all tax records for <strong>5 years</strong> from the date
            you lodged your return. For most people, keeping records from the last 5 tax years is
            sufficient. Store them digitally — scans or photos of receipts are accepted.
          </p>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold">What triggers an ATO review?</h3>
          <div className="mt-4 space-y-2 text-sm text-neutral-600">
            {[
              "Claims significantly higher than others in the same occupation",
              "Large or unusual deductions (e.g. $5,000+ in work-related expenses)",
              "Rental property losses claimed year after year",
              "Mismatches between pre-filled data and what you entered",
              "Random compliance checks (the ATO does these — they're not personal)",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold">If you&apos;re audited</h3>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-6">
            <ol className="space-y-3 text-sm text-neutral-600">
              <li>
                <strong className="text-neutral-900">Don&apos;t panic.</strong> Most ATO reviews are
                correspondence-based — they send you a letter asking for specific records.
              </li>
              <li>
                <strong className="text-neutral-900">Respond by the deadline.</strong> You typically
                get 28 days. Ignoring it makes things worse.
              </li>
              <li>
                <strong className="text-neutral-900">Only provide what&apos;s asked for.</strong>
                If they ask for WFH evidence, send your WFH log and bills. Don&apos;t send everything
                you have.
              </li>
              <li>
                <strong className="text-neutral-900">Get help if needed.</strong> A registered tax
                agent can represent you. The ATO also has a free taxpayer assistance service.
              </li>
              <li>
                <strong className="text-neutral-900">Dispute if you disagree.</strong> You can object
                to an ATO decision within 4 years. The process is outlined on ato.gov.au.
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold">Common audit triggers for salaried employees</h3>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm text-amber-800">
              The ATO uses industry benchmarks. For a salaried office worker claiming $2,000+ in
              work-related expenses, you&apos;re above the average and more likely to be reviewed. This
              doesn&apos;t mean you shouldn&apos;t claim what you&apos;re entitled to — just make sure you have
              records to back it up. TaxMate&apos;s WFH log gives you a proper record.
            </p>
          </div>
        </section>

        <div className="mt-8 flex gap-3">
          <Link
            href="/mygov-checklist"
            className="rounded-lg border border-neutral-300 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            View MyGov checklist
          </Link>
          <Link
            href="/wfh-log"
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
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
