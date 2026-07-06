-- Allow admins to read all transaction/attendance rows for the activity feed.

DROP POLICY IF EXISTS point_transactions_select_admin ON public.point_transactions;
CREATE POLICY point_transactions_select_admin ON public.point_transactions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS shop_transactions_select_admin ON public.shop_transactions;
CREATE POLICY shop_transactions_select_admin ON public.shop_transactions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
