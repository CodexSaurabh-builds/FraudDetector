import Link from 'next/link'
import { SignUpForm } from '@/components/signup-form'
import { Shield } from 'lucide-react'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">SecurePay</span>
      </div>
      
      <SignUpForm />
      
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/send-money" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  )
}
