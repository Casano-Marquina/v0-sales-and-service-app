'use client'

import { useAuth } from '@/hooks/use-auth'
import { useWorkspace } from '@/hooks/use-workspace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Empty } from '@/components/ui/empty'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { currentWorkspace, createWorkspace } = useWorkspace(user?.id)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return

    try {
      setLoading(true)
      await createWorkspace(newWorkspaceName)
      setNewWorkspaceName('')
      alert('Workspace creado exitosamente')
    } catch (error) {
      alert('Error al crear workspace')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-2">Gestiona tu cuenta y workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de Cuenta</CardTitle>
          <CardDescription>Tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>ID de Usuario</FieldLabel>
            <Input
              type="text"
              value={user?.id || ''}
              disabled
              className="bg-muted text-xs"
            />
          </FieldGroup>

          <p className="text-sm text-muted-foreground">
            Para cambiar tu contraseña, usa la función de recuperación de contraseña en la página
            de login.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Actual</CardTitle>
          <CardDescription>
            {currentWorkspace
              ? `Workspace: ${currentWorkspace.name}`
              : 'Sin workspace seleccionado'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentWorkspace && (
            <>
              <FieldGroup>
                <FieldLabel>Nombre</FieldLabel>
                <Input type="text" value={currentWorkspace.name} disabled className="bg-muted" />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>ID</FieldLabel>
                <Input
                  type="text"
                  value={currentWorkspace.id}
                  disabled
                  className="bg-muted text-xs"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Creado</FieldLabel>
                <Input
                  type="text"
                  value={new Date(currentWorkspace.created_at).toLocaleDateString()}
                  disabled
                  className="bg-muted"
                />
              </FieldGroup>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Workspace</CardTitle>
          <CardDescription>
            Crea un nuevo workspace para organizar tus transacciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="workspace-name">Nombre del Workspace</FieldLabel>
            <Input
              id="workspace-name"
              placeholder="Mi Nuevo Workspace"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
            />
          </FieldGroup>

          <Button
            onClick={handleCreateWorkspace}
            disabled={loading || !newWorkspaceName.trim()}
            className="w-full"
          >
            {loading ? 'Creando...' : 'Crear Workspace'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integraciones</CardTitle>
          <CardDescription>Conecta servicios externos (próximamente)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground">Google Drive</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Guarda y carga reportes automáticamente desde Google Drive
            </p>
            <Button variant="outline" className="mt-4" disabled>
              Conectar Google Drive (próximamente)
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Recibe recordatorios y reportes por correo electrónico
            </p>
            <Button variant="outline" className="mt-4" disabled>
              Configurar Email (próximamente)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acerca de</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gestor de Transacciones - v1.0.0
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Una aplicación integral para gestionar ventas, compras y servicios con reportes,
            recordatorios e integraciones.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
