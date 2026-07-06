-- Align RLS with the is_admin boolean column so flagged admins can perform all actions.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE auth_id = (SELECT auth.uid())::text
      AND is_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE auth_id = (SELECT auth.uid())::text
      AND (
        role IN ('teacher', 'admin')
        OR is_admin = true
      )
  );
$$;

-- ── users ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS users_select ON public.users;
CREATE POLICY users_select ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth_id = (SELECT auth.uid())::text
    OR public.is_teacher_or_admin()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth_id = (SELECT auth.uid())::text)
  WITH CHECK (auth_id = (SELECT auth.uid())::text);

DROP POLICY IF EXISTS users_update_admin ON public.users;
CREATE POLICY users_update_admin ON public.users
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS users_delete_admin ON public.users;
CREATE POLICY users_delete_admin ON public.users
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    AND id <> public.get_my_user_id()
  );

-- ── events ───────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS events_select ON public.events;
CREATE POLICY events_select ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS events_insert ON public.events;
CREATE POLICY events_insert ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_teacher_or_admin()
      AND host_id = public.get_my_user_id()
    )
  );

DROP POLICY IF EXISTS events_update ON public.events;
CREATE POLICY events_update ON public.events
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR host_id = public.get_my_user_id()
  )
  WITH CHECK (
    public.is_admin()
    OR host_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS events_delete ON public.events;
CREATE POLICY events_delete ON public.events
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR host_id = public.get_my_user_id()
  );

-- ── event_attendances ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS event_attendances_select ON public.event_attendances;
CREATE POLICY event_attendances_select ON public.event_attendances
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR user_id = public.get_my_user_id()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND e.host_id = public.get_my_user_id()
    )
  );

DROP POLICY IF EXISTS event_attendances_insert ON public.event_attendances;
CREATE POLICY event_attendances_insert ON public.event_attendances
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR user_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS event_attendances_update ON public.event_attendances;
CREATE POLICY event_attendances_update ON public.event_attendances
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND e.host_id = public.get_my_user_id()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND e.host_id = public.get_my_user_id()
    )
  );

DROP POLICY IF EXISTS event_attendances_delete ON public.event_attendances;
CREATE POLICY event_attendances_delete ON public.event_attendances
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ── point_transactions ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS point_transactions_select_own ON public.point_transactions;
CREATE POLICY point_transactions_select_own ON public.point_transactions
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR user_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS point_transactions_select_admin ON public.point_transactions;
CREATE POLICY point_transactions_select_admin ON public.point_transactions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── shop_items ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS shop_items_select ON public.shop_items;
CREATE POLICY shop_items_select ON public.shop_items
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS shop_items_insert ON public.shop_items;
CREATE POLICY shop_items_insert ON public.shop_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_teacher_or_admin()
      AND seller_id = public.get_my_user_id()
    )
  );

DROP POLICY IF EXISTS shop_items_update ON public.shop_items;
CREATE POLICY shop_items_update ON public.shop_items
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR seller_id = public.get_my_user_id()
  )
  WITH CHECK (
    public.is_admin()
    OR seller_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS shop_items_delete ON public.shop_items;
CREATE POLICY shop_items_delete ON public.shop_items
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ── shop_transactions ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS shop_transactions_select_own ON public.shop_transactions;
CREATE POLICY shop_transactions_select_own ON public.shop_transactions
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR user_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS shop_transactions_select_admin ON public.shop_transactions;
CREATE POLICY shop_transactions_select_admin ON public.shop_transactions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ── tags ─────────────────────────────────────────────────────────────────────

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
    public.is_admin()
    OR (
      public.is_teacher_or_admin()
      AND EXISTS (
        SELECT 1
        FROM public.events e
        WHERE e.id = tags.event_id
          AND e.host_id = public.get_my_user_id()
      )
    )
  );

DROP POLICY IF EXISTS tags_update ON public.tags;
CREATE POLICY tags_update ON public.tags
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND e.host_id = public.get_my_user_id()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND e.host_id = public.get_my_user_id()
    )
  );

DROP POLICY IF EXISTS tags_delete ON public.tags;
CREATE POLICY tags_delete ON public.tags
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = tags.event_id
        AND e.host_id = public.get_my_user_id()
    )
  );
