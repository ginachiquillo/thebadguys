-- Prevent direct inserts to app_users table
-- Profiles should only be created by the handle_new_user() trigger
-- The trigger uses SECURITY DEFINER which bypasses RLS, so signup flow will still work
CREATE POLICY "Prevent direct profile inserts"
ON public.app_users
FOR INSERT
TO authenticated
WITH CHECK (false);