-- Allow event hosts and admins to delete events.
DROP POLICY IF EXISTS events_delete ON public.events;
CREATE POLICY events_delete ON public.events
  FOR DELETE
  TO authenticated
  USING (
    host_id = public.get_my_user_id()
    OR public.is_admin()
  );
