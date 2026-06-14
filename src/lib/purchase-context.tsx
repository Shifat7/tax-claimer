"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { isUnlocked } from "./storage"

interface PurchaseContextType {
  unlocked: boolean
  setUnlocked: (v: boolean) => void
}

const PurchaseContext = createContext<PurchaseContextType>({
  unlocked: false,
  setUnlocked: () => {},
})

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlockedState] = useState(false)

  useEffect(() => {
    setUnlockedState(isUnlocked())
  }, [])

  return (
    <PurchaseContext.Provider value={{ unlocked, setUnlocked: setUnlockedState }}>
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchase() {
  return useContext(PurchaseContext)
}
