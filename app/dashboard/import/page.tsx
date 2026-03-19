'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { useTransactions } from '@/hooks/use-transactions'
import {
  parseCSVFile,
  parseExcelFile,
  detectColumnMapping,
  mapImportData,
  validateImportData,
} from '@/lib/import-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Empty } from '@/components/ui/empty'
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ImportData } from '@/lib/import-utils'

export default function ImportPage() {
  const { user } = useAuth()
  const { currentWorkspace } = useWorkspace(user?.id)
  const { addTransaction } = useTransactions(currentWorkspace?.id, user?.id)

  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [mappedData, setMappedData] = useState<Partial<ImportData>[]>([])
  const [validationResult, setValidationResult] = useState<{
    valid: Partial<ImportData>[]
    errors: { row: number; error: string }[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importSuccess, setImportSuccess] = useState(0)
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({})
  const [step, setStep] = useState<'upload' | 'mapping' | 'validation' | 'importing'>('upload')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    try {
      setLoading(true)
      setFile(selectedFile)

      let data: any[] = []
      if (selectedFile.name.endsWith('.csv')) {
        data = await parseCSVFile(selectedFile)
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        data = await parseExcelFile(selectedFile)
      } else {
        alert('Formato de archivo no soportado. Use CSV o Excel.')
        return
      }

      setRawData(data)

      // Auto-detect column mapping
      const headers = Object.keys(data[0] || {})
      const mapping = detectColumnMapping(headers)
      setColumnMapping(mapping)

      // Map the data
      const mapped = data.map((row) => mapImportData(row, mapping))
      setMappedData(mapped)

      setStep('mapping')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al procesar archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = () => {
    const result = validateImportData(mappedData)
    setValidationResult(result)
    setStep('validation')
  }

  const handleImport = async () => {
    if (!validationResult?.valid || !currentWorkspace || !user) {
      alert('Datos inválidos o workspace no encontrado')
      return
    }

    try {
      setLoading(true)
      setStep('importing')
      setImportSuccess(0)

      for (let i = 0; i < validationResult.valid.length; i++) {
        const data = validationResult.valid[i]
        try {
          await addTransaction({
            type: data.type!,
            category_id: null,
            description: data.description!,
            amount: data.amount!,
            currency: data.currency || 'USD',
            client_provider_name: data.clientProvider!,
            contact_info: null,
            transaction_date: data.date!,
            payment_status: data.paymentStatus || 'pendiente',
            due_date: null,
            paid_date: null,
            notes: data.notes || null,
          })
          setImportSuccess((prev) => prev + 1)
          setImportProgress(((i + 1) / validationResult.valid.length) * 100)
        } catch (error) {
          console.error('Error importing row:', error)
        }
      }

      alert(`Importación completada: ${importSuccess} transacciones importadas`)
      setFile(null)
      setRawData([])
      setMappedData([])
      setValidationResult(null)
      setStep('upload')
    } catch (error) {
      alert('Error durante la importación')
    } finally {
      setLoading(false)
    }
  }

  if (!currentWorkspace) {
    return (
      <Empty
        title="Sin workspace"
        description="Por favor crea o selecciona un workspace para importar transacciones"
        icon="📁"
      />
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Importar Transacciones</h1>
        <p className="text-muted-foreground mt-2">
          Importa transacciones desde archivos CSV o Excel
        </p>
      </div>

      <Tabs value={step} onValueChange={(v: any) => setStep(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" disabled={step !== 'upload'}>
            1. Cargar
          </TabsTrigger>
          <TabsTrigger value="mapping" disabled={step === 'upload'}>
            2. Mapeo
          </TabsTrigger>
          <TabsTrigger value="validation" disabled={step !== 'validation'}>
            3. Validar
          </TabsTrigger>
          <TabsTrigger value="importing" disabled={step !== 'importing'}>
            4. Importar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Archivo</CardTitle>
              <CardDescription>
                Carga un archivo CSV o Excel con tus transacciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Haz clic o arrastra un archivo aquí</p>
                  <p className="text-sm text-muted-foreground">CSV o Excel (.xlsx, .xls)</p>
                </label>
              </div>

              {file && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Archivo cargado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapeo de Columnas</CardTitle>
              <CardDescription>
                Se detectaron automáticamente las siguientes columnas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(columnMapping).length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No se pudieron detectar las columnas. Asegúrate de que los encabezados sean
                    estándar (fecha, descripción, monto, etc.)
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {Object.entries(columnMapping).map(([field, column]) => (
                    <div key={field} className="flex items-center justify-between p-3 bg-muted rounded">
                      <span className="font-medium capitalize">{field}</span>
                      <span className="text-sm text-muted-foreground">{column}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Se encontraron {rawData.length} filas para importar
              </div>

              <Button onClick={handleValidate} className="w-full" disabled={loading}>
                Continuar a Validación
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4">Fecha</th>
                      <th className="text-left py-2 px-4">Descripción</th>
                      <th className="text-left py-2 px-4">Tipo</th>
                      <th className="text-left py-2 px-4">Monto</th>
                      <th className="text-left py-2 px-4">Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappedData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{row.date}</td>
                        <td className="py-2 px-4">{row.description}</td>
                        <td className="py-2 px-4">{row.type}</td>
                        <td className="py-2 px-4">${row.amount?.toFixed(2)}</td>
                        <td className="py-2 px-4">{row.clientProvider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {mappedData.length > 5 && (
                <p className="text-sm text-muted-foreground mt-2">
                  +{mappedData.length - 5} filas más...
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultado de Validación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationResult?.errors.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    ✓ Todas las {validationResult.valid.length} transacciones son válidas
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Se encontraron {validationResult?.errors.length} errores
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {validationResult?.errors.map((err, idx) => (
                      <div key={idx} className="text-sm p-2 bg-red-50 rounded border border-red-200">
                        Fila {err.row}: {err.error}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="text-sm text-muted-foreground">
                Transacciones válidas: {validationResult?.valid.length || 0}
              </div>

              <Button
                onClick={handleImport}
                className="w-full"
                disabled={loading || (validationResult?.valid.length || 0) === 0}
              >
                {loading ? `Importando... ${importProgress.toFixed(0)}%` : 'Iniciar Importación'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Importación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {importSuccess} de {validationResult?.valid.length || 0} transacciones importadas
              </p>
              {importProgress === 100 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    ✓ Importación completada exitosamente
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
