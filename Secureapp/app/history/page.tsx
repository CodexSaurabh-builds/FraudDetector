import Link from 'next/link'
import { TransactionHistory } from '@/components/transaction-history'
import { Shield } from 'lucide-react'

export default function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-12">
      <header className="mb-8 flex w-full max-w-4xl items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">SecurePay</span>
        </Link>
      </header>
      
      <TransactionHistory />
    </main>
  )
}
