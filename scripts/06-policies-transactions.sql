-- Categories policies
CREATE POLICY "Users can view workspace categories"
ON public.categories FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Editors can create categories"
ON public.categories FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Editors can update categories"
ON public.categories FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Transactions policies
CREATE POLICY "Users can view workspace transactions"
ON public.transactions FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Editors can create transactions"
ON public.transactions FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Editors can update transactions"
ON public.transactions FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Admins can delete transactions"
ON public.transactions FOR DELETE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Reminders policies
CREATE POLICY "Users can view workspace reminders"
ON public.reminders FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Editors can create reminders"
ON public.reminders FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "Editors can update reminders"
ON public.reminders FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin', 'editor')
  )
);

-- Reports policies
CREATE POLICY "Users can view workspace reports"
ON public.reports FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);
