'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { useReports, exportToCSV, exportToJSON } from '@/hooks/use-reports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, FileJson } from 'lucide-react'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']

export default function ReportsPage() {
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace(user?.id)
  const { stats, loading, fetchMonthlyReport } = useReports(currentWorkspace?.id)

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    if (currentWorkspace) {
      fetchMonthlyReport(selectedYear, selectedMonth)
    }
  }, [currentWorkspace, selectedYear, selectedMonth, fetchMonthlyReport])

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  if (!currentWorkspace) {
    return (
      <Empty
        title="Sin workspace"
        description="Por favor crea o selecciona un workspace para ver reportes"
        icon="📁"
      />
    )
  }

  const chartData = stats
    ? [
        { name: 'Ventas', value: stats.totalSales },
        { name: 'Compras', value: stats.totalPurchases },
        { name: 'Servicios', value: stats.totalServices },
      ]
    : []

  const paymentData = stats
    ? [
        { name: 'Pagado', value: stats.paidPayments },
        { name: 'Pendiente', value: stats.pendingPayments },
      ]
    : []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-2">Análisis de transacciones por mes y año</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Período</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-2">Año</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 rounded border bg-background text-foreground"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mes</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 rounded border bg-background text-foreground"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center">Cargando reportes...</div>
      ) : stats && stats.transactions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalPurchases.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalServices.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ingresos Netos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pagado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.paidPayments.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pendiente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ${stats.pendingPayments.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.transactions.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Descargas</CardTitle>
              <CardDescription>Exporta los datos del reporte en diferentes formatos</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button
                onClick={() =>
                  exportToCSV(
                    stats.transactions,
                    `reporte-${selectedYear}-${String(selectedMonth).padStart(2, '0')}`
                  )
                }
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSV
              </Button>
              <Button
                onClick={() =>
                  exportToJSON(
                    {
                      periodo: `${months[selectedMonth - 1]} ${selectedYear}`,
                      stats: {
                        totalVentas: stats.totalSales,
                        totalCompras: stats.totalPurchases,
                        totalServicios: stats.totalServices,
                        ingresosNetos: stats.totalRevenue,
                        pagado: stats.paidPayments,
                        pendiente: stats.pendingPayments,
                      },
                      transacciones: stats.transactions,
                    },
                    `reporte-${selectedYear}-${String(selectedMonth).padStart(2, '0')}`
                  )
                }
                variant="outline"
              >
                <FileJson className="w-4 h-4 mr-2" />
                Descargar JSON
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transacciones del Período</CardTitle>
              <CardDescription>{stats.transactions.length} transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4">Fecha</th>
                      <th className="text-left py-2 px-4">Descripción</th>
                      <th className="text-left py-2 px-4">Tipo</th>
                      <th className="text-left py-2 px-4">Cliente</th>
                      <th className="text-right py-2 px-4">Monto</th>
                      <th className="text-left py-2 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.transactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{tx.transaction_date}</td>
                        <td className="py-3 px-4">{tx.description}</td>
                        <td className="py-3 px-4">
                          <Badge>{tx.type}</Badge>
                        </td>
                        <td className="py-3 px-4">{tx.client_provider_name}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              tx.payment_status === 'pagado'
                                ? 'default'
                                : tx.payment_status === 'vencido'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {tx.payment_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Empty
          title="Sin transacciones"
          description="No hay transacciones para este período"
          icon="📊"
        />
      )}
    </div>
  )
}
