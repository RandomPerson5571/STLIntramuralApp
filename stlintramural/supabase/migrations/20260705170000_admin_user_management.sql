-- Admin user management: update/delete policies and audited point adjustments.

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

CREATE OR REPLACE FUNCTION public.admin_adjust_user_points(
  p_user_id uuid,
  p_delta int,
  p_description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance int;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  IF p_delta = 0 THEN
    RETURN;
  END IF;

  IF p_description IS NULL OR trim(p_description) = '' THEN
    RAISE EXCEPTION 'Description is required';
  END IF;

  UPDATE public.users
  SET points_balance = points_balance + p_delta
  WHERE id = p_user_id
  RETURNING points_balance INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Points balance cannot be negative';
  END IF;

  INSERT INTO public.point_transactions (user_id, points, description)
  VALUES (p_user_id, p_delta, trim(p_description));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_adjust_user_points(uuid, int, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_adjust_user_points(uuid, int, text) TO authenticated;
