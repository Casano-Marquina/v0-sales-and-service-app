import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, workspaceId, reminderDate, reminderType } = await request.json()

    if (!transactionId || !workspaceId || !reminderDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user has access to this workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Create reminder
    const { data: reminder, error: createError } = await supabase
      .from('reminders')
      .insert([
        {
          workspace_id: workspaceId,
          transaction_id: transactionId,
          reminder_date: reminderDate,
          reminder_type: reminderType || 'manual',
          notified: false,
          email_sent: false,
        },
      ])
      .select()
      .single()

    if (createError) throw createError

    return NextResponse.json({ success: true, reminder })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
