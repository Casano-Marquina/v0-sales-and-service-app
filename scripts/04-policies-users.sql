-- Users policies
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Allow system to insert users during signup
CREATE POLICY "System can insert users"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);
