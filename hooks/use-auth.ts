import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error: err,
        } = await supabase.auth.getSession()
        if (err) throw err
        setUser(session?.user || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading session')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, companyName?: string) => {
      setError(null)
      try {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName || '',
            },
          },
        })

        if (err) throw err
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error signing up'
        setError(message)
        throw err
      }
    },
    []
  )

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (err) throw err
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error signing in'
      setError(message)
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error signing out'
      setError(message)
      throw err
    }
  }, [])

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }
}
