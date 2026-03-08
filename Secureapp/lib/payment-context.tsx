'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface User {
  username: string
  accountNumber: string
}

export interface Transaction {
  id: string
  timestamp: number // Epoch format for backend
  date: string
  time: string
  recipientAccount: string
  amount: number
  type: 'Debit' | 'Credit'
  state: string
  city: string
}

interface PaymentContextType {
  user: User | null
  transactions: Transaction[]
  setUser: (user: User | null) => void
  addTransaction: (transaction: Transaction) => void
  generateAccountNumber: () => string
  generateTransactionId: () => string
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionCounter, setTransactionCounter] = useState(1001)

  const generateAccountNumber = useCallback(() => {
    const prefix = 'acc'
    const randomDigits = Math.floor(Math.random() * 900 + 100).toString()
    return prefix + randomDigits
  }, [])

  const generateTransactionId = useCallback(() => {
    const id = `TXN${transactionCounter}`
    setTransactionCounter(prev => prev + 1)
    return id
  }, [transactionCounter])

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }, [])

  return (
    <PaymentContext.Provider
      value={{
        user,
        transactions,
        setUser,
        addTransaction,
        generateAccountNumber,
        generateTransactionId,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}
