'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'
import type { Transaction } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { currentWorkspace, loading: wsLoading } = useWorkspace(user?.id)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalCompras: 0,
    totalServicios: 0,
    totalPendiente: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentWorkspace) return

    const fetchData = async () => {
      try {
        // Fetch recent transactions
        const { data: txns, error: txnError } = await supabase
          .from('transactions')
          .select('*')
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (txnError) throw txnError

        setTransactions(txns || [])

        // Calculate stats
        const ventas = txns?.filter((t) => t.type === 'venta').reduce((a, b) => a + b.amount, 0) || 0
        const compras = txns?.filter((t) => t.type === 'compra').reduce((a, b) => a + b.amount, 0) || 0
        const servicios = txns?.filter((t) => t.type === 'servicio').reduce((a, b) => a + b.amount, 0) || 0
        const pendiente =
          txns?.filter((t) => t.payment_status === 'pendiente').reduce((a, b) => a + b.amount, 0) || 0

        setStats({
          totalVentas: ventas,
          totalCompras: compras,
          totalServicios: servicios,
          totalPendiente: pendiente,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentWorkspace])

  if (authLoading || wsLoading || loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {currentWorkspace ? `Workspace: ${currentWorkspace.name}` : 'Sin workspace activo'}
        </p>
      </div>

      {!currentWorkspace ? (
        <Empty
          title="Sin workspace"
          description="Por favor crea o selecciona un workspace para comenzar"
          icon="📁"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalVentas.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalCompras.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalServicios.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pendiente de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${stats.totalPendiente.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
              <CardDescription>Últimas 10 transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <Empty
                  title="Sin transacciones"
                  description="Comienza importando o creando transacciones"
                  icon="📊"
                />
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div>
                        <p className="font-medium text-foreground">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.client_provider_name} • {tx.transaction_date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${tx.amount.toFixed(2)}</p>
                        <p className={`text-sm ${
                          tx.payment_status === 'pagado' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {tx.payment_status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
