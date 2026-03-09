'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { usePayment, type Transaction } from '@/lib/payment-context'
import { states, getCitiesForState } from '@/lib/locations'
import { CheckCircle2, Shield, Clock, LogOut } from 'lucide-react'

export function SendMoneyForm() {
  const { addTransaction, generateTransactionId, user, setUser } = usePayment()
  
  const [recipientAccount, setRecipientAccount] = useState('')
  const [transactionType, setTransactionType] = useState<'Debit' | 'Credit' | ''>('')
  const [amount, setAmount] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedTransaction, setSubmittedTransaction] = useState<Transaction | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cities = selectedState ? getCitiesForState(selectedState) : []

  const handleLogout = () => {
    setUser(null)
    window.location.href = '/'
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedCity('')
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!recipientAccount.trim()) {
      newErrors.recipientAccount = 'Recipient account is required'
    }
    
    if (!transactionType) {
      newErrors.transactionType = 'Transaction type is required'
    }
    
    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!selectedState) {
      newErrors.state = 'Please select a state'
    }
    
    if (!selectedCity) {
      newErrors.city = 'Please select a city'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validate()) return

  setIsLoading(true)

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const now = new Date()
  const transaction: Transaction = {
    id: generateTransactionId(),
    timestamp: Math.floor(now.getTime() / 1000),
    date: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    recipientAccount,
    amount: parseFloat(amount),
    type: transactionType as 'Debit' | 'Credit',
    state: selectedState,
    city: selectedCity,
  }

  // Send to Java backend via ngrok
  await fetch("https://YOUR_NGROK_LINK.ngrok-free.app/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  })

  addTransaction(transaction)
  setSubmittedTransaction(transaction)
  setSuccess(true)
  setIsLoading(false)
}

  const handleNewTransaction = () => {
    setRecipientAccount('')
    setTransactionType('')
    setAmount('')
    setSelectedState('')
    setSelectedCity('')
    setSuccess(false)
    setSubmittedTransaction(null)
    setErrors({})
  }

if (success && submittedTransaction) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl">Transaction Submitted</CardTitle>
        <CardDescription>
          Your payment has been processed successfully
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm font-medium">
                {submittedTransaction.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium">
                {submittedTransaction.date} at {submittedTransaction.time}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                Rs. {submittedTransaction.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleNewTransaction} className="w-full">
            Send Another Payment
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/history">View Transaction History</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Send Money</CardTitle>
            <CardDescription>
              {user ? `Logged in as ${user.username}` : 'Transfer funds securely'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="recipientAccount">Recipient Account ID</FieldLabel>
              <Input
                id="recipientAccount"
                type="text"
                placeholder="e.g. acc501"
                value={recipientAccount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientAccount(e.target.value)}
                aria-invalid={!!errors.recipientAccount}
              />
              {errors.recipientAccount && <FieldError>{errors.recipientAccount}</FieldError>}
            </Field>
            
            <Field>
              <FieldLabel htmlFor="transactionType">Transaction Type</FieldLabel>
              <Select value={transactionType} onValueChange={(value: string) => setTransactionType(value as 'Debit' | 'Credit')}>
                <SelectTrigger id="transactionType" className="w-full" aria-invalid={!!errors.transactionType}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Debit">Debit</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              {errors.transactionType && <FieldError>{errors.transactionType}</FieldError>}
            </Field>
            
            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <FieldError>{errors.amount}</FieldError>}
            </Field>
            
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="state">State</FieldLabel>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger id="state" className="w-full" aria-invalid={!!errors.state}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <FieldError>{errors.state}</FieldError>}
              </Field>
              
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
                  <SelectTrigger id="city" className="w-full" aria-invalid={!!errors.city}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <FieldError>{errors.city}</FieldError>}
              </Field>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Processing transaction...
                </>
              ) : (
                'Send Payment'
              )}
            </Button>
          </FieldGroup>
        </form>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Instant</span>
          </div>
        </div>
        
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Transactions are processed securely.
        </p>
      </CardContent>
    </Card>
  )
}
