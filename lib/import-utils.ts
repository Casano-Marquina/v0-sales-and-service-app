import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { Transaction, TransactionType, PaymentStatus } from '@/lib/supabase'

export interface ImportData {
  date: string
  description: string
  amount: number
  type: TransactionType
  clientProvider: string
  paymentStatus?: PaymentStatus
  currency?: string
  notes?: string
  [key: string]: any
}

interface ColumnMapping {
  [key: string]: string
}

// Default column mappings for common formats
const DEFAULT_MAPPINGS: { [key: string]: ColumnMapping } = {
  standard: {
    date: ['fecha', 'date', 'transaction_date', 'fecha_transaccion'],
    description: ['descripción', 'description', 'concepto', 'detalle'],
    amount: ['monto', 'amount', 'valor', 'cantidad'],
    type: ['tipo', 'type', 'tipo_transaccion'],
    clientProvider: ['cliente', 'proveedor', 'client', 'provider', 'cliente_proveedor', 'empresa'],
    paymentStatus: ['estado', 'status', 'estado_pago', 'payment_status'],
    currency: ['moneda', 'currency', 'divisa'],
    notes: ['notas', 'notes', 'observaciones', 'comentarios'],
  },
}

export async function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as any[])
      },
      error: (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`))
      },
    })
  })
}

export async function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheet]
        const rows = XLSX.utils.sheet_to_json(worksheet)
        resolve(rows as any[])
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Excel parsing error'))
      }
    }
    reader.onerror = () => reject(new Error('File reading error'))
    reader.readAsBinaryString(file)
  })
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}
  const mappings = DEFAULT_MAPPINGS.standard

  for (const [field, aliases] of Object.entries(mappings)) {
    const foundHeader = headers.find((h) =>
      aliases.some((alias) => h.toLowerCase().includes(alias.toLowerCase()))
    )
    if (foundHeader) {
      mapping[field] = foundHeader
    }
  }

  return mapping
}

export function mapImportData(row: any, columnMapping: ColumnMapping): Partial<ImportData> {
  const mapped: Partial<ImportData> = {}

  // Map date
  if (columnMapping['date']) {
    const dateVal = row[columnMapping['date']]
    mapped.date = dateVal ? normalizeDate(dateVal) : new Date().toISOString().split('T')[0]
  }

  // Map description
  if (columnMapping['description']) {
    mapped.description = row[columnMapping['description']]?.toString() || 'Sin descripción'
  }

  // Map amount
  if (columnMapping['amount']) {
    const amountVal = row[columnMapping['amount']]
    mapped.amount = parseFloat(String(amountVal).replace(/[^0-9.-]/g, '')) || 0
  }

  // Map type
  if (columnMapping['type']) {
    const typeVal = String(row[columnMapping['type']] || '').toLowerCase()
    mapped.type = normalizeTransactionType(typeVal)
  } else {
    mapped.type = 'venta' // default
  }

  // Map client/provider
  if (columnMapping['clientProvider']) {
    mapped.clientProvider = row[columnMapping['clientProvider']]?.toString() || 'Sin nombre'
  }

  // Map payment status
  if (columnMapping['paymentStatus']) {
    mapped.paymentStatus = normalizePaymentStatus(row[columnMapping['paymentStatus']])
  } else {
    mapped.paymentStatus = 'pendiente'
  }

  // Map currency
  if (columnMapping['currency']) {
    mapped.currency = (row[columnMapping['currency']] || 'USD').toString().toUpperCase()
  } else {
    mapped.currency = 'USD'
  }

  // Map notes
  if (columnMapping['notes']) {
    mapped.notes = row[columnMapping['notes']]?.toString()
  }

  return mapped
}

function normalizeDate(dateString: any): string {
  if (!dateString) return new Date().toISOString().split('T')[0]

  const dateStr = String(dateString).trim()

  // If it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr
  }

  // Try to parse as date
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }

  // Default to today
  return new Date().toISOString().split('T')[0]
}

function normalizeTransactionType(typeString: string): TransactionType {
  const lower = typeString.toLowerCase()

  if (lower.includes('venta') || lower.includes('sale') || lower.includes('ingreso')) {
    return 'venta'
  }
  if (lower.includes('compra') || lower.includes('purchase') || lower.includes('expense')) {
    return 'compra'
  }
  if (lower.includes('servicio') || lower.includes('service')) {
    return 'servicio'
  }

  return 'venta' // default
}

function normalizePaymentStatus(statusString: any): PaymentStatus {
  const lower = String(statusString || '').toLowerCase()

  if (lower.includes('pagado') || lower.includes('paid')) {
    return 'pagado'
  }
  if (lower.includes('vencido') || lower.includes('overdue')) {
    return 'vencido'
  }
  if (lower.includes('parcial') || lower.includes('partial')) {
    return 'parcial'
  }

  return 'pendiente' // default
}

export function validateImportData(data: Partial<ImportData>[]): {
  valid: Partial<ImportData>[]
  errors: { row: number; error: string }[]
} {
  const valid: Partial<ImportData>[] = []
  const errors: { row: number; error: string }[] = []

  data.forEach((row, index) => {
    const rowNum = index + 1

    if (!row.description) {
      errors.push({ row: rowNum, error: 'Descripción requerida' })
      return
    }

    if (!row.amount || row.amount <= 0) {
      errors.push({ row: rowNum, error: 'Monto debe ser mayor a 0' })
      return
    }

    if (!row.date) {
      errors.push({ row: rowNum, error: 'Fecha requerida' })
      return
    }

    if (!row.clientProvider) {
      errors.push({ row: rowNum, error: 'Cliente/Proveedor requerido' })
      return
    }

    valid.push(row)
  })

  return { valid, errors }
}
