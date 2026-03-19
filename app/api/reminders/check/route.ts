import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// This endpoint should be called by a cron job (e.g., daily)
// It checks for transactions with due dates and creates reminders
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all workspaces
    const { data: workspaces, error: wsError } = await supabaseAdmin
      .from('workspaces')
      .select('id')

    if (wsError) throw wsError

    const today = new Date().toISOString().split('T')[0]
    let remindersCreated = 0

    // For each workspace, check transactions with due dates
    for (const workspace of workspaces || []) {
      // Get transactions with due dates in the next 7 days
      const { data: transactions, error: txError } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('workspace_id', workspace.id)
        .eq('payment_status', 'pendiente')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })

      if (txError) throw txError

      for (const tx of transactions || []) {
        if (!tx.due_date) continue

        const daysUntilDue = Math.ceil(
          (new Date(tx.due_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
        )

        // Create reminder if due in 7 days, 3 days, or 1 day
        if (daysUntilDue === 7 || daysUntilDue === 3 || daysUntilDue === 1 || daysUntilDue === 0) {
          const reminderDate = new Date()
          reminderDate.setDate(reminderDate.getDate() + (7 - daysUntilDue))

          const { error: reminderError } = await supabaseAdmin
            .from('reminders')
            .insert([
              {
                workspace_id: workspace.id,
                transaction_id: tx.id,
                reminder_date: reminderDate.toISOString().split('T')[0],
                reminder_type: `payment_due_${daysUntilDue}_days`,
                notified: false,
                email_sent: false,
              },
            ])
            .select()

          if (!reminderError) {
            remindersCreated++
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      remindersCreated,
    })
  } catch (error) {
    console.error('Error checking reminders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
