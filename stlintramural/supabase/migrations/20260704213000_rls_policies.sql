-- RLS policies for all 6 public tables (plan §2.4 security gate).
-- Helper functions resolve auth.uid() → public.users row for policy checks.

CREATE OR REPLACE FUNCTION public.get_my_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.users
  WHERE auth_id = (SELECT auth.uid())::text
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.users
  WHERE auth_id = (SELECT auth.uid())::text
  LIMIT 1;
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
      AND role IN ('teacher', 'admin')
  );
$$;

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
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.get_my_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_teacher_or_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Block non-admin updates to protected user columns (role, points, QR token, auth_id).
CREATE OR REPLACE FUNCTION public.protect_user_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.auth_id IS DISTINCT FROM OLD.auth_id
      OR NEW.role IS DISTINCT FROM OLD.role
      OR NEW.points_balance IS DISTINCT FROM OLD.points_balance
    THEN
      RAISE EXCEPTION 'Cannot modify protected profile fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_columns ON public.users;
CREATE TRIGGER protect_user_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_columns();

-- ── users ────────────────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select ON public.users;
CREATE POLICY users_select ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth_id = (SELECT auth.uid())::text
    OR public.is_teacher_or_admin()
  );

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth_id = (SELECT auth.uid())::text)
  WITH CHECK (auth_id = (SELECT auth.uid())::text);

-- INSERT: handle_new_user trigger only (no client policy).

-- ── events ───────────────────────────────────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

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
    public.is_teacher_or_admin()
    AND host_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS events_update ON public.events;
CREATE POLICY events_update ON public.events
  FOR UPDATE
  TO authenticated
  USING (
    host_id = public.get_my_user_id()
    OR public.is_admin()
  )
  WITH CHECK (
    host_id = public.get_my_user_id()
    OR public.is_admin()
  );

-- ── event_attendances ────────────────────────────────────────────────────────
ALTER TABLE public.event_attendances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_attendances_select ON public.event_attendances;
CREATE POLICY event_attendances_select ON public.event_attendances
  FOR SELECT
  TO authenticated
  USING (
    user_id = public.get_my_user_id()
    OR EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS event_attendances_insert ON public.event_attendances;
CREATE POLICY event_attendances_insert ON public.event_attendances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_my_user_id());

DROP POLICY IF EXISTS event_attendances_update ON public.event_attendances;
CREATE POLICY event_attendances_update ON public.event_attendances
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_attendances.event_id
        AND (e.host_id = public.get_my_user_id() OR public.is_admin())
    )
  );

-- ── point_transactions ───────────────────────────────────────────────────────
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS point_transactions_select_own ON public.point_transactions;
CREATE POLICY point_transactions_select_own ON public.point_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_my_user_id());

-- INSERT / UPDATE: DB functions only (no client policies).

-- ── shop_items ───────────────────────────────────────────────────────────────
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

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
    public.is_teacher_or_admin()
    AND seller_id = public.get_my_user_id()
  );

DROP POLICY IF EXISTS shop_items_update ON public.shop_items;
CREATE POLICY shop_items_update ON public.shop_items
  FOR UPDATE
  TO authenticated
  USING (
    seller_id = public.get_my_user_id()
    OR public.is_admin()
  )
  WITH CHECK (
    seller_id = public.get_my_user_id()
    OR public.is_admin()
  );

-- ── shop_transactions ────────────────────────────────────────────────────────
ALTER TABLE public.shop_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shop_transactions_select_own ON public.shop_transactions;
CREATE POLICY shop_transactions_select_own ON public.shop_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_my_user_id());

-- INSERT / UPDATE: purchase_shop_item RPC only (no client policies).
