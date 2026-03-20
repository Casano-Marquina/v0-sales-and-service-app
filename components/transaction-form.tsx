'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Transaction, TransactionType, Category } from '@/lib/types'

interface TransactionFormProps {
  onSubmit: (data: any) => Promise<void>
  categories: Category[]
  loading?: boolean
  initialData?: Partial<Transaction>
  isEditing?: boolean
}

export function TransactionForm({
  onSubmit,
  categories,
  loading = false,
  initialData,
  isEditing = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: (initialData?.type || 'venta') as TransactionType,
    category_id: initialData?.category_id || '',
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    currency: initialData?.currency || 'USD',
    client_provider_name: initialData?.client_provider_name || '',
    contact_info: initialData?.contact_info || '',
    transaction_date: initialData?.transaction_date || new Date().toISOString().split('T')[0],
    payment_status: initialData?.payment_status || 'pendiente',
    due_date: initialData?.due_date || '',
    paid_date: initialData?.paid_date || '',
    notes: initialData?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id || null,
      })
      if (!isEditing) {
        setFormData({
          type: 'venta',
          category_id: '',
          description: '',
          amount: '',
          currency: 'USD',
          client_provider_name: '',
          contact_info: '',
          transaction_date: new Date().toISOString().split('T')[0],
          payment_status: 'pendiente',
          due_date: '',
          paid_date: '',
          notes: '',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const relevantCategories = categories.filter((c) => c.type === formData.type)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar' : 'Nueva'} Transacción</CardTitle>
        <CardDescription>
          {isEditing ? 'Actualiza los detalles de la transacción' : 'Crea una nueva transacción'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel htmlFor="type">Tipo</FieldLabel>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as TransactionType })}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {relevantCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="description">Descripción</FieldLabel>
            <Input
              id="description"
              placeholder="Ej: Venta de productos"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel htmlFor="amount">Monto</FieldLabel>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="currency">Moneda</FieldLabel>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="MXN">MXN</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="client">Cliente / Proveedor</FieldLabel>
            <Input
              id="client"
              placeholder="Nombre de cliente o proveedor"
              value={formData.client_provider_name}
              onChange={(e) => setFormData({ ...formData, client_provider_name: e.target.value })}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="contact">Información de Contacto</FieldLabel>
            <Input
              id="contact"
              placeholder="Email o teléfono"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
            />
          </FieldGroup>

          <div className="grid grid-cols-3 gap-4">
            <FieldGroup>
              <FieldLabel htmlFor="date">Fecha</FieldLabel>
              <Input
                id="date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="due-date">Fecha de Vencimiento</FieldLabel>
              <Input
                id="due-date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="paid-date">Fecha de Pago</FieldLabel>
              <Input
                id="paid-date"
                type="date"
                value={formData.paid_date}
                onChange={(e) => setFormData({ ...formData, paid_date: e.target.value })}
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="status">Estado de Pago</FieldLabel>
            <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value as any })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="notes">Notas</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Notas adicionales"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'} Transacción
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
