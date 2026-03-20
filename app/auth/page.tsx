'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Gestor de Transacciones
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/auth/login')}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ingresar
          </button>
          <button
            onClick={() => router.push('/auth/sign-up')}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}
