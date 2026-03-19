'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarMenu, SidebarMenuButton, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator } from '@/components/ui/sidebar'
import { BarChart3, Settings, LogOut, FileText, UploadCloud, Bell } from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace(user?.id)

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-64 border-r">
        <SidebarHeader className="border-b p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold text-foreground">Gestor</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col gap-4 p-4">
          {workspaces.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Workspace
              </p>
              <select
                value={currentWorkspace?.id || ''}
                onChange={(e) => {
                  const workspace = workspaces.find((w) => w.id === e.target.value)
                  if (workspace) setCurrentWorkspace(workspace)
                }}
                className="w-full px-2 py-1 rounded border bg-background text-foreground text-sm"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <SidebarMenu>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/transactions">
                  <FileText className="w-4 h-4" />
                  <span>Transacciones</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/import">
                  <UploadCloud className="w-4 h-4" />
                  <span>Importar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/reports">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reportes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/reminders">
                  <Bell className="w-4 h-4" />
                  <span>Recordatorios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
          </SidebarMenu>

          <SidebarSeparator />

          <SidebarMenu>
            <SidebarItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarItem>
            <SidebarItem>
              <SidebarMenuButton onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
