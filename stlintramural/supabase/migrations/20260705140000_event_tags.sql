CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE INDEX idx_tags_event_id ON tags(event_id);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tags_select ON public.tags;
CREATE POLICY tags_select ON public.tags
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS tags_insert ON public.tags;
CREATE POLICY tags_insert ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_teacher_or_admin()
    AND EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS tags_update ON public.tags;
CREATE POLICY tags_update ON public.tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS tags_delete ON public.tags;
CREATE POLICY tags_delete ON public.tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  );
