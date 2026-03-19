import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for use in the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client with service role (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Types
export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type TransactionType = 'venta' | 'compra' | 'servicio'
export type PaymentStatus = 'pendiente' | 'pagado' | 'vencido' | 'parcial'

export interface User {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  workspace_id: string
  name: string
  color: string
  type: TransactionType
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  workspace_id: string
  type: TransactionType
  category_id: string | null
  description: string
  amount: number
  currency: string
  client_provider_name: string
  contact_info: string | null
  transaction_date: string
  payment_status: PaymentStatus
  due_date: string | null
  paid_date: string | null
  notes: string | null
  created_by: string
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  workspace_id: string
  transaction_id: string
  reminder_date: string
  reminder_type: string
  notified: boolean
  email_sent: boolean
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  workspace_id: string
  year: number
  month: number
  total_sales: number
  total_purchases: number
  total_services: number
  total_revenue: number
  pending_payments: number
  report_data: Record<string, any>
  generated_at: string
}
