import Link from 'next/link'
import { SendMoneyForm } from '@/components/send-money-form'
import { Shield, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SendMoneyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <header className="mb-8 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">SecurePay</span>
        </div>
        
        <Button variant="ghost" asChild>
          <Link href="/history">
            <History className="mr-2 h-4 w-4" />
            History
          </Link>
        </Button>
      </header>
      
      <SendMoneyForm />
    </main>
  )
}
