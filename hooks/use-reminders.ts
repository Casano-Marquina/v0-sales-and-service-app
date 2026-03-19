import { useCallback, useState } from 'react'

export function useReminders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReminder = useCallback(
    async (transactionId: string, workspaceId: string, reminderDate: string, reminderType?: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/reminders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId,
            workspaceId,
            reminderDate,
            reminderType,
          }),
        })

        if (!response.ok) {
          throw new Error('Error creating reminder')
        }

        const data = await response.json()
        return data.reminder
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error creating reminder'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const checkReminders = useCallback(async (cronSecret: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/reminders/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error checking reminders')
      }

      const data = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error checking reminders'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createReminder,
    checkReminders,
  }
}
