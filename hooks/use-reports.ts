import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction } from '@/lib/supabase'

export interface MonthlyStats {
  year: number
  month: number
  totalSales: number
  totalPurchases: number
  totalServices: number
  totalRevenue: number
  pendingPayments: number
  paidPayments: number
  transactions: Transaction[]
  byCategory: { [key: string]: number }
}

export function useReports(workspaceId?: string) {
  const [stats, setStats] = useState<MonthlyStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchMonthlyReport = useCallback(
    async (year: number, month: number) => {
      if (!workspaceId) return

      try {
        setLoading(true)

        // Get all transactions for the month
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]

        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('workspace_id', workspaceId)
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate)
          .order('transaction_date', { ascending: false })

        if (error) throw error

        // Calculate stats
        const stats: MonthlyStats = {
          year,
          month,
          totalSales: 0,
          totalPurchases: 0,
          totalServices: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          paidPayments: 0,
          transactions: transactions || [],
          byCategory: {},
        }

        transactions?.forEach((tx) => {
          if (tx.type === 'venta') {
            stats.totalSales += tx.amount
            stats.totalRevenue += tx.amount
          } else if (tx.type === 'compra') {
            stats.totalPurchases += tx.amount
          } else if (tx.type === 'servicio') {
            stats.totalServices += tx.amount
            stats.totalRevenue += tx.amount
          }

          if (tx.payment_status === 'pendiente') {
            stats.pendingPayments += tx.amount
          } else if (tx.payment_status === 'pagado') {
            stats.paidPayments += tx.amount
          }
        })

        setStats(stats)
        return stats
      } catch (error) {
        console.error('Error fetching monthly report:', error)
      } finally {
        setLoading(false)
      }
    },
    [workspaceId]
  )

  return {
    stats,
    loading,
    fetchMonthlyReport,
  }
}

// Export utilities
export function exportToCSV(transactions: Transaction[], filename: string) {
  const headers = [
    'Fecha',
    'Descripción',
    'Tipo',
    'Monto',
    'Moneda',
    'Cliente/Proveedor',
    'Estado Pago',
    'Contacto',
  ]
  const rows = transactions.map((tx) => [
    tx.transaction_date,
    tx.description,
    tx.type,
    tx.amount,
    tx.currency,
    tx.client_provider_name,
    tx.payment_status,
    tx.contact_info || '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()
  window.URL.revokeObjectURL(url)
}
