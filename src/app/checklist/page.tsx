"use client"

import { useState } from "react"
import Link from "next/link"
import { JOB_TYPES, getDeductionsForJobType, estimateWfhClaim } from "@/data/deductions"
import { PurchaseProvider, usePurchase } from "@/lib/purchase-context"
import { isUnlocked } from "@/lib/storage"

type Step = "job" | "wfh" | "equipment" | "union" | "education" | "uniforms" | "other" | "results"

interface Answers {
  jobType: string
  wfhHours: number | null
  homeOfficeGear: boolean
  isUnionMember: boolean
  selfEducation: boolean
  uniforms: "none" | "compulsory" | "scrubs"
  otherExpenses: boolean
}

function ChecklistFlow() {
  const { unlocked } = usePurchase()
  const [step, setStep] = useState<Step>("job")
  const [answers, setAnswers] = useState<Answers>({
    jobType: "",
    wfhHours: null,
    homeOfficeGear: false,
    isUnionMember: false,
    selfEducation: false,
    uniforms: "none",
    otherExpenses: false,
  })

  function update(delta: Partial<Answers>) {
    setAnswers((prev) => ({ ...prev, ...delta }))
  }

  function next(s: Step) {
    setStep(s)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const deductions = answers.jobType ? getDeductionsForJobType(answers.jobType) : []
  const wfhClaim = answers.wfhHours ? estimateWfhClaim(answers.wfhHours) : 0

  function jobLabel(id: string) {
    return JOB_TYPES.find((j) => j.id === id)?.label ?? id
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-4 px-6 py-4 max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          &larr; Home
        </Link>
        <span className="text-sm font-bold tracking-tight">Deduction finder</span>
      </nav>

      <main className="px-6 pb-16 max-w-2xl mx-auto">
        {/* Step: Job type */}
        {step === "job" && (
          <div>
            <h2 className="text-2xl font-bold">What do you do?</h2>
            <p className="mt-1 text-neutral-600">Pick your job type to see what you can claim.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {JOB_TYPES.map((job) => (
                <button
                  key={job.id}
                  onClick={() => {
                    update({ jobType: job.id })
                    next("wfh")
                  }}
                  className="rounded-xl border border-neutral-200 bg-white p-5 text-left transition hover:border-neutral-900 hover:shadow-sm"
                >
                  <span className="text-2xl">{job.icon}</span>
                  <p className="mt-1 font-semibold">{job.label}</p>
                  <p className="text-sm text-neutral-500">{job.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: WFH */}
        {step === "wfh" && (
          <div>
            <h2 className="text-2xl font-bold">Do you work from home?</h2>
            <p className="mt-1 text-neutral-600">Estimate your average WFH hours per week (0 if none).</p>
            <input
              type="number"
              min={0}
              max={80}
              placeholder="Hours per week..."
              className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-3 text-lg focus:border-neutral-900 focus:outline-none"
              value={answers.wfhHours ?? ""}
              onChange={(e) => update({ wfhHours: Math.min(80, Math.max(0, Number(e.target.value) || 0)) })}
            />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => next("equipment")}
                className="rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Home office equipment */}
        {step === "equipment" && (
          <div>
            <h2 className="text-2xl font-bold">Home office equipment</h2>
            <p className="mt-1 text-neutral-600">
              Did you buy any home office equipment this year? (desk, chair, monitor, keyboard, etc.)
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  update({ homeOfficeGear: true })
                  next("union")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  answers.homeOfficeGear
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  update({ homeOfficeGear: false })
                  next("union")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  !answers.homeOfficeGear
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Step: Union / professional memberships */}
        {step === "union" && (
          <div>
            <h2 className="text-2xl font-bold">Professional memberships</h2>
            <p className="mt-1 text-neutral-600">
              Are you a member of a union or professional association?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  update({ isUnionMember: true })
                  next("education")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  answers.isUnionMember
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  update({ isUnionMember: false })
                  next("education")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  !answers.isUnionMember
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Step: Self-education */}
        {step === "education" && (
          <div>
            <h2 className="text-2xl font-bold">Self-education</h2>
            <p className="mt-1 text-neutral-600">
              Did you take any courses, attend conferences, or do professional development related to your job?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  update({ selfEducation: true })
                  next("uniforms")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  answers.selfEducation
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  update({ selfEducation: false })
                  next("uniforms")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  !answers.selfEducation
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Step: Uniforms */}
        {step === "uniforms" && (
          <div>
            <h2 className="text-2xl font-bold">Uniforms & work clothes</h2>
            <p className="mt-1 text-neutral-600">Do you wear a compulsory uniform or work-specific clothing?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { value: "none" as const, label: "No uniform" },
                { value: "compulsory" as const, label: "Yes — compulsory uniform" },
                { value: "scrubs" as const, label: "Yes — scrubs / protective" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    update({ uniforms: opt.value })
                    next("other")
                  }}
                  className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                    answers.uniforms === opt.value
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white hover:border-neutral-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Other */}
        {step === "other" && (
          <div>
            <h2 className="text-2xl font-bold">Other expenses</h2>
            <p className="mt-1 text-neutral-600">
              Do you have any other work-related expenses not covered? (travel, tools, equipment, etc.)
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  update({ otherExpenses: true })
                  next("results")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  answers.otherExpenses
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  update({ otherExpenses: false })
                  next("results")
                }}
                className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  !answers.otherExpenses
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-600"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Step: Results */}
        {step === "results" && (
          <div>
            <h2 className="text-2xl font-bold">Your deduction checklist</h2>
            <p className="mt-1 text-neutral-600">
              Based on your answers as a {jobLabel(answers.jobType)}, here&apos;s what you can claim.
            </p>

            <div className="mt-6 space-y-3">
              {deductions.map((d) => {
                const checked =
                  (d.id === "wfh" && (answers.wfhHours ?? 0) > 0) ||
                  (d.id === "home-office-equipment" && answers.homeOfficeGear) ||
                  (d.id === "professional-memberships" && answers.isUnionMember) ||
                  (d.id === "union-fees" && answers.isUnionMember) ||
                  (d.id === "self-education" && answers.selfEducation) ||
                  (d.id === "uniforms" && answers.uniforms !== "none") ||
                  (d.id === "uniforms-scrubs" && answers.uniforms !== "none") ||
                  (d.id === "laundry" && answers.uniforms !== "none") ||
                  (d.id === "classroom-supplies") ||
                  (d.id === "tools-equipment") ||
                  (d.id === "vehicle") ||
                  (d.id === "protective-gear")

                if (!checked) return null

                return (
                  <div key={d.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-green-900">{d.label}</p>
                        <p className="text-sm text-green-700">{d.description}</p>
                      </div>
                      <span className="shrink-0 text-green-600">✔</span>
                    </div>
                    {d.maxClaim && <p className="mt-1 text-xs text-green-600">{d.maxClaim}</p>}
                  </div>
                )
              })}

              {answers.wfhHours && answers.wfhHours > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="font-semibold text-blue-900">WFH estimated claim: ${wfhClaim}</p>
                  <p className="text-sm text-blue-700">
                    Based on {answers.wfhHours} hours/week at $0.67/hr for 48 weeks
                  </p>
                </div>
              )}

              {deductions.filter((d) => {
                const checked =
                  (d.id === "wfh" && (answers.wfhHours ?? 0) > 0) ||
                  (d.id === "home-office-equipment" && answers.homeOfficeGear) ||
                  (d.id === "professional-memberships" && answers.isUnionMember) ||
                  (d.id === "union-fees" && answers.isUnionMember) ||
                  (d.id === "self-education" && answers.selfEducation) ||
                  (d.id === "uniforms" && answers.uniforms !== "none") ||
                  (d.id === "uniforms-scrubs" && answers.uniforms !== "none") ||
                  (d.id === "laundry" && answers.uniforms !== "none") ||
                  (d.id === "classroom-supplies") ||
                  (d.id === "tools-equipment") ||
                  (d.id === "vehicle") ||
                  (d.id === "protective-gear")
                return checked
              }).length === 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="font-semibold text-amber-900">No specific deductions matched</p>
                  <p className="text-sm text-amber-700">
                    You may still be able to claim work-related expenses. Check the MyGov checklist for guidance.
                  </p>
                </div>
              )}
            </div>

            {!unlocked && !isUnlocked() && (
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 text-center">
                <p className="font-semibold">Want the full MyGov checklist and audit guide?</p>
                <Link
                  href="/purchase"
                  className="mt-3 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Unlock everything — $4.99
                </Link>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => next("job")}
                className="rounded-lg border border-neutral-300 bg-white px-6 py-2 text-sm font-medium hover:bg-neutral-100"
              >
                Start over
              </button>
              <Link
                href="/mygov-checklist"
                className={`rounded-lg px-6 py-2 text-sm font-medium text-white ${
                  unlocked || isUnlocked()
                    ? "bg-neutral-900 hover:bg-neutral-800"
                    : "pointer-events-none bg-neutral-300"
                }`}
              >
                View MyGov checklist
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ChecklistPage() {
  return (
    <PurchaseProvider>
      <ChecklistFlow />
    </PurchaseProvider>
  )
}
