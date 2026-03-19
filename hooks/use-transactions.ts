import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction, TransactionType, PaymentStatus, Category } from '@/lib/supabase'

export function useTransactions(workspaceId?: string, userId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch transactions and categories
  useEffect(() => {
    if (!workspaceId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: txns, error: txnError } = await supabase
          .from('transactions')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('transaction_date', { ascending: false })

        if (txnError) throw txnError

        const { data: cats, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('workspace_id', workspaceId)

        if (catError) throw catError

        setTransactions(txns || [])
        setCategories(cats || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [workspaceId])

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      if (!workspaceId || !userId) throw new Error('Missing workspace or user')

      try {
        const { data, error: err } = await supabase
          .from('transactions')
          .insert([{ ...transaction, workspace_id: workspaceId, created_by: userId }])
          .select()
          .single()

        if (err) throw err

        setTransactions((prev) => [data, ...prev])
        return data
      } catch (err) {
        throw err instanceof Error ? err : new Error('Error adding transaction')
      }
    },
    [workspaceId, userId]
  )

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      try {
        const { data, error: err } = await supabase
          .from('transactions')
          .update({ ...updates, updated_by: userId })
          .eq('id', id)
          .select()
          .single()

        if (err) throw err

        setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)))
        return data
      } catch (err) {
        throw err instanceof Error ? err : new Error('Error updating transaction')
      }
    },
    [userId]
  )

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase.from('transactions').delete().eq('id', id)

      if (err) throw err

      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error deleting transaction')
    }
  }, [])

  const addCategory = useCallback(
    async (name: string, type: TransactionType, color?: string) => {
      if (!workspaceId) throw new Error('Missing workspace')

      try {
        const { data, error: err } = await supabase
          .from('categories')
          .insert([
            {
              workspace_id: workspaceId,
              name,
              type,
              color: color || '#3B82F6',
            },
          ])
          .select()
          .single()

        if (err) throw err

        setCategories((prev) => [...prev, data])
        return data
      } catch (err) {
        throw err instanceof Error ? err : new Error('Error adding category')
      }
    },
    [workspaceId]
  )

  return {
    transactions,
    categories,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
  }
}
