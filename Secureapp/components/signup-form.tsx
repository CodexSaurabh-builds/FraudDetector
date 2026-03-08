'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { usePayment } from '@/lib/payment-context'
import { CheckCircle2 } from 'lucide-react'

export function SignUpForm() {
  const router = useRouter()
  const { setUser, generateAccountNumber } = usePayment()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdAccount, setCreatedAccount] = useState<{ username: string; accountNumber: string } | null>(null)
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirmPassword?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    // Simulate account creation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const accountNumber = generateAccountNumber()
    const newUser = { username, accountNumber }
    
    setCreatedAccount(newUser)
    setUser(newUser)
    setSuccess(true)
    setIsLoading(false)
  }

  const handleContinue = () => {
    router.push('/send-money')
  }

  if (success && createdAccount) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Account Created Successfully</CardTitle>
          <CardDescription>Your account is ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium">{createdAccount.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-medium">{createdAccount.accountNumber}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleContinue} className="w-full">
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={!!errors.username}
              />
              {errors.username && <FieldError>{errors.username}</FieldError>}
            </Field>
            
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>
            
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
            </Field>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
