export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type TransactionType = 'venta' | 'compra' | 'servicio'
export type PaymentStatus = 'pendiente' | 'pagado' | 'vencido' | 'parcial'

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
