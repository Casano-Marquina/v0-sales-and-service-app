import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto w-full">
        {children}
      </main>
    </div>
  )
}
