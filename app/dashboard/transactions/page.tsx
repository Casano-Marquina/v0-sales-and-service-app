'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { useTransactions } from '@/hooks/use-transactions'
import { TransactionForm } from '@/components/transaction-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty } from '@/components/ui/empty'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Edit2, Plus } from 'lucide-react'

export default function TransactionsPage() {
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace(user?.id)
  const { transactions, categories, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(currentWorkspace?.id, user?.id)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('todos')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client_provider_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'todos' || t.type === filterType
    const matchesStatus = filterStatus === 'todos' || t.payment_status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddTransaction = async (data: any) => {
    try {
      await addTransaction(data)
      setShowForm(false)
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const handleUpdateTransaction = async (data: any) => {
    if (!editingId) return
    try {
      await updateTransaction(editingId, data)
      setEditingId(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const editingTransaction = editingId ? transactions.find((t) => t.id === editingId) : null

  if (!currentWorkspace) {
    return (
      <Empty
        title="Sin workspace"
        description="Por favor crea o selecciona un workspace para ver transacciones"
        icon="📁"
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transacciones</h1>
          <p className="text-muted-foreground mt-2">Gestiona todas tus transacciones</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancelar' : 'Nueva Transacción'}
        </Button>
      </div>

      {showForm && !editingId && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          categories={categories}
          loading={loading}
        />
      )}

      {editingId && editingTransaction && (
        <TransactionForm
          onSubmit={handleUpdateTransaction}
          categories={categories}
          loading={loading}
          initialData={editingTransaction}
          isEditing
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input
              placeholder="Buscar por descripción o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded border bg-background text-foreground"
            >
              <option value="todos">Todos los tipos</option>
              <option value="venta">Ventas</option>
              <option value="compra">Compras</option>
              <option value="servicio">Servicios</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded border bg-background text-foreground"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="parcial">Parcial</option>
              <option value="pagado">Pagado</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <Empty
              title="Sin transacciones"
              description="No hay transacciones que coincidan con los filtros"
              icon="📊"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4">Fecha</th>
                    <th className="text-left py-2 px-4">Descripción</th>
                    <th className="text-left py-2 px-4">Tipo</th>
                    <th className="text-left py-2 px-4">Cliente/Proveedor</th>
                    <th className="text-right py-2 px-4">Monto</th>
                    <th className="text-left py-2 px-4">Estado</th>
                    <th className="text-right py-2 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{transaction.transaction_date}</td>
                      <td className="py-3 px-4 font-medium">{transaction.description}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          transaction.type === 'venta'
                            ? 'default'
                            : transaction.type === 'compra'
                            ? 'secondary'
                            : 'outline'
                        }>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{transaction.client_provider_name}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          transaction.payment_status === 'pagado'
                            ? 'default'
                            : transaction.payment_status === 'vencido'
                            ? 'destructive'
                            : 'secondary'
                        }>
                          {transaction.payment_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(transaction.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Eliminar transacción</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que quieres eliminar esta transacción? Esta
                                acción no puede deshacerse.
                              </AlertDialogDescription>
                              <div className="flex gap-4">
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
