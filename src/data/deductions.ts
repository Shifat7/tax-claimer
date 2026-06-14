export interface DeductionCategory {
  id: string
  label: string
  description: string
  maxClaim?: string
  commonFor: string[] // job type ids
}

export interface JobType {
  id: string
  label: string
  icon: string
  description: string
  deductions: string[] // category ids
}

export interface ChecklistAnswer {
  jobType: string
  wfhDays: number | null
  homeOfficeEquipment: boolean
  unionMember: boolean
  selfEducation: boolean
  uniforms: string | null
  hasOtherExpenses: boolean
}

export const JOB_TYPES: JobType[] = [
  {
    id: "office",
    label: "Office / IT",
    icon: "💻",
    description: "Salaried employee working in an office or remotely",
    deductions: ["wfh", "home-office-equipment", "professional-memberships", "self-education", "laundry"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    description: "Nurse, doctor, allied health professional",
    deductions: ["uniforms-scrubs", "laundry", "professional-memberships", "self-education", "wfh"],
  },
  {
    id: "trades",
    label: "Tradesperson",
    icon: "🔧",
    description: "Electrician, plumber, builder, mechanic",
    deductions: ["tools-equipment", "vehicle", "protective-gear", "union-fees", "self-education"],
  },
  {
    id: "retail",
    label: "Retail / Hospitality",
    icon: "🛒",
    description: "Shop assistant, waiter, bartender, manager",
    deductions: ["uniforms", "laundry", "union-fees", "wfh"],
  },
  {
    id: "teacher",
    label: "Teacher / Educator",
    icon: "📚",
    description: "Primary, secondary, or tertiary educator",
    deductions: ["classroom-supplies", "self-education", "wfh", "professional-memberships", "laundry"],
  },
]

export const DEDUCTION_CATEGORIES: DeductionCategory[] = [
  {
    id: "wfh",
    label: "Work-from-home expenses",
    description: "Electricity, internet, phone, stationery for days worked from home",
    maxClaim: "Fixed rate: $0.67/hr (2025-26) or actual costs",
    commonFor: ["office", "healthcare", "retail", "teacher"],
  },
  {
    id: "home-office-equipment",
    label: "Home office equipment",
    description: "Desk, chair, monitor, keyboard — items under $300 fully deductible",
    maxClaim: "Under $300: full deduction. Over: depreciate over life",
    commonFor: ["office"],
  },
  {
    id: "professional-memberships",
    label: "Professional memberships & subscriptions",
    description: "Industry body fees, professional association memberships",
    commonFor: ["office", "healthcare", "teacher"],
  },
  {
    id: "self-education",
    label: "Self-education & courses",
    description: "Courses, conferences, workshops directly related to current job",
    commonFor: ["office", "healthcare", "trades", "teacher"],
  },
  {
    id: "laundry",
    label: "Laundry of work clothes",
    description: "Washing, drying, ironing of compulsory uniforms or protective clothing",
    maxClaim: "$1 per load if work-related only, $0.50 if mixed",
    commonFor: ["office", "healthcare", "retail", "teacher"],
  },
  {
    id: "uniforms-scrubs",
    label: "Uniforms & scrubs",
    description: "Compulsory uniforms, scrubs, or protective clothing required by employer",
    commonFor: ["healthcare"],
  },
  {
    id: "tools-equipment",
    label: "Tools & equipment",
    description: "Tools specific to trade — power tools, hand tools, tool box, safety gear",
    maxClaim: "Under $300: full. Over $300: depreciate",
    commonFor: ["trades"],
  },
  {
    id: "vehicle",
    label: "Vehicle & travel",
    description: "Travel between worksites, carrying bulky tools (not commute to work)",
    maxClaim: "$0.85/km up to 5,000km then $0.78/km, or logbook method",
    commonFor: ["trades"],
  },
  {
    id: "protective-gear",
    label: "Protective gear",
    description: "Safety boots, hard hat, hi-vis, gloves, goggles",
    commonFor: ["trades"],
  },
  {
    id: "union-fees",
    label: "Union & professional fees",
    description: "Union membership fees",
    commonFor: ["trades", "retail"],
  },
  {
    id: "uniforms",
    label: "Compulsory uniforms",
    description: "Uniform with employer logo, or a strictly enforced dress code",
    commonFor: ["retail"],
  },
  {
    id: "classroom-supplies",
    label: "Classroom supplies",
    description: "Books, stationery, art supplies, educational resources bought for students",
    maxClaim: "Up to $150 without receipts (ATO concession)",
    commonFor: ["teacher"],
  },
]

export function getDeductionsForJobType(jobTypeId: string): DeductionCategory[] {
  const job = JOB_TYPES.find((j) => j.id === jobTypeId)
  if (!job) return []
  return job.deductions.map((id) => DEDUCTION_CATEGORIES.find((d) => d.id === id)).filter(Boolean) as DeductionCategory[]
}

export function estimateWfhClaim(hoursPerWeek: number, weeks: number = 48): number {
  const rate = 0.67
  return Math.round(hoursPerWeek * weeks * rate)
}
