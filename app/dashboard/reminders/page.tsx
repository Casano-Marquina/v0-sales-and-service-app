'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Reminder, Transaction } from '@/lib/supabase'

interface ReminderWithTransaction extends Reminder {
  transactions?: Transaction
}

export default function RemindersPage() {
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace(user?.id)
  const [reminders, setReminders] = useState<ReminderWithTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentWorkspace) return

    const fetchReminders = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('reminders')
          .select(
            `
            *,
            transactions (
              id,
              description,
              amount,
              client_provider_name,
              due_date,
              payment_status
            )
          `
          )
          .eq('workspace_id', currentWorkspace.id)
          .order('reminder_date', { ascending: true })

        if (error) throw error
        setReminders(data || [])
      } catch (error) {
        console.error('Error fetching reminders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReminders()
  }, [currentWorkspace])

  const upcomingReminders = reminders.filter((r) => {
    const reminderDate = new Date(r.reminder_date)
    return reminderDate >= new Date()
  })

  const pastReminders = reminders.filter((r) => {
    const reminderDate = new Date(r.reminder_date)
    return reminderDate < new Date()
  })

  if (!currentWorkspace) {
    return (
      <Empty
        title="Sin workspace"
        description="Por favor crea o selecciona un workspace para ver recordatorios"
        icon="📁"
      />
    )
  }

  if (loading) {
    return <div>Cargando recordatorios...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recordatorios</h1>
          <p className="text-muted-foreground mt-2">
            Recordatorios de pagos y plazos de vencimiento
          </p>
        </div>
      </div>

      {upcomingReminders.length === 0 && pastReminders.length === 0 ? (
        <Empty
          title="Sin recordatorios"
          description="No hay recordatorios configurados. Crea transacciones con fechas de vencimiento"
          icon="📅"
        />
      ) : (
        <>
          {upcomingReminders.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-900">Próximos Recordatorios</CardTitle>
                <CardDescription className="text-orange-700">
                  {upcomingReminders.length} recordatorios pendientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {(reminder as any).transactions?.description || 'Sin descripción'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {(reminder as any).transactions?.client_provider_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Monto: ${(reminder as any).transactions?.amount?.toFixed(2) || '0.00'}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">
                            Vencimiento:{' '}
                            {(reminder as any).transactions?.due_date ||
                              reminder.reminder_date}
                          </Badge>
                          <Badge
                            variant={
                              (reminder as any).transactions?.payment_status === 'pagado'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {(reminder as any).transactions?.payment_status || 'pendiente'}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          Marcar como Notificado
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {pastReminders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recordatorios Pasados</CardTitle>
                <CardDescription>
                  {pastReminders.length} recordatorios vencidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pastReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg opacity-60"
                    >
                      <div>
                        <p className="font-medium text-muted-foreground">
                          {(reminder as any).transactions?.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reminder.reminder_date}
                        </p>
                      </div>
                      <Badge variant="secondary">Vencido</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
