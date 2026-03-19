import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Workspace, WorkspaceMember } from '@/lib/supabase'

export function useWorkspace(userId?: string) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's workspaces
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchWorkspaces = async () => {
      try {
        setLoading(true)
        // First, get workspaces owned by user
        const { data: ownedWorkspaces, error: ownedError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', userId)

        if (ownedError) throw ownedError

        // Then, get workspaces where user is a member
        const { data: memberWorkspaces, error: memberError } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', userId)

        if (memberError) throw memberError

        const memberIds = memberWorkspaces?.map((m) => m.workspace_id) || []

        // Get full workspace details for member workspaces
        const { data: sharedWorkspaces, error: sharedError } = await supabase
          .from('workspaces')
          .select('*')
          .in('id', memberIds)

        if (sharedError) throw sharedError

        const allWorkspaces = [...(ownedWorkspaces || []), ...(sharedWorkspaces || [])]
        setWorkspaces(allWorkspaces)

        // Set first workspace as current
        if (allWorkspaces.length > 0) {
          setCurrentWorkspace(allWorkspaces[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching workspaces')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [userId])

  const createWorkspace = useCallback(
    async (name: string) => {
      if (!userId) throw new Error('User not authenticated')

      try {
        const { data, error: err } = await supabase
          .from('workspaces')
          .insert([{ name, owner_id: userId }])
          .select()
          .single()

        if (err) throw err

        setWorkspaces((prev) => [...prev, data])
        setCurrentWorkspace(data)
        return data
      } catch (err) {
        throw err instanceof Error ? err : new Error('Error creating workspace')
      }
    },
    [userId]
  )

  const updateWorkspace = useCallback(async (id: string, updates: Partial<Workspace>) => {
    try {
      const { data, error: err } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err

      setWorkspaces((prev) => prev.map((w) => (w.id === id ? data : w)))
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(data)
      }
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error updating workspace')
    }
  }, [currentWorkspace?.id])

  const addMember = useCallback(
    async (workspaceId: string, userId: string, role: 'admin' | 'editor' | 'viewer') => {
      try {
        const { data, error: err } = await supabase
          .from('workspace_members')
          .insert([{ workspace_id: workspaceId, user_id: userId, role }])
          .select()
          .single()

        if (err) throw err
        return data
      } catch (err) {
        throw err instanceof Error ? err : new Error('Error adding member')
      }
    },
    []
  )

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    error,
    createWorkspace,
    updateWorkspace,
    addMember,
  }
}
