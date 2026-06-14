import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaxMate — File your taxes like a pro, for $4.99",
  description:
    "Deduction checklist, WFH log, MyGov guide, and audit support. Everything a salaried Australian needs for tax time.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  )
}
