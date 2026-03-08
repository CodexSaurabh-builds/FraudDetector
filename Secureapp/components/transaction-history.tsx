'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePayment } from '@/lib/payment-context'
import { ArrowLeft, Inbox } from 'lucide-react'

export function TransactionHistory() {
  const { transactions } = usePayment()

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <CardDescription>View your recent transactions</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/send-money">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Send Money
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No Transactions Yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Once you send a payment, your transaction history will appear here.
            </p>
            <Button asChild>
              <Link href="/send-money">Send Your First Payment</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Recipient Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="even:bg-muted/30">
                  <TableCell className="font-medium">{transaction.date}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                  <TableCell className="font-mono text-sm">{transaction.recipientAccount}</TableCell>
                  <TableCell className="text-right font-medium">
                    Rs. {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.city}, {transaction.state}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
