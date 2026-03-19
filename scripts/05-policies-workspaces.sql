-- Workspaces policies
CREATE POLICY "Members can view workspace"
ON public.workspaces FOR SELECT
USING (
  id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
  OR owner_id = auth.uid()
);

CREATE POLICY "Only owner can insert workspace"
ON public.workspaces FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Only owner can update workspace"
ON public.workspaces FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Only owner can delete workspace"
ON public.workspaces FOR DELETE
USING (owner_id = auth.uid());

-- Workspace members policies
CREATE POLICY "Members can view workspace members"
ON public.workspace_members FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces 
    WHERE owner_id = auth.uid()
    OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Only owner can insert members"
ON public.workspace_members FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Only owner can update members"
ON public.workspace_members FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Only owner can delete members"
ON public.workspace_members FOR DELETE
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);
