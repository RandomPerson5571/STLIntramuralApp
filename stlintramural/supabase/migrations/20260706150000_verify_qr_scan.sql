-- QR scan verification: award points without attendance gate; dedupe via point_transactions.

CREATE OR REPLACE FUNCTION public.verify_qr_scan(
  p_event_id uuid,
  p_qr_token uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_scanner_id uuid;
  v_student public.users%ROWTYPE;
  v_event public.events%ROWTYPE;
  v_points int;
  v_name text;
BEGIN
  v_scanner_id := public.get_my_user_id();
  IF v_scanner_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT public.is_teacher_or_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO v_event FROM public.events WHERE id = p_event_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'event_not_found';
  END IF;

  IF v_event.host_id <> v_scanner_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO v_student FROM public.users WHERE qr_code_token = p_qr_token;
  IF NOT FOUND OR v_student.role <> 'student' THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  v_name := trim(v_student.first_name || ' ' || v_student.last_name);

  IF EXISTS (
    SELECT 1
    FROM public.point_transactions
    WHERE user_id = v_student.id
      AND event_id = p_event_id
  ) THEN
    RETURN jsonb_build_object(
      'status', 'already_checked_in',
      'student_name', v_name
    );
  END IF;

  v_points := v_event.points_awarded;

  PERFORM set_config('app.system_update', 'true', true);

  UPDATE public.users
  SET points_balance = points_balance + v_points
  WHERE id = v_student.id;

  PERFORM set_config('app.system_update', '', true);

  INSERT INTO public.point_transactions (
    user_id,
    event_id,
    points,
    description
  )
  VALUES (
    v_student.id,
    p_event_id,
    v_points,
    'Attended ' || v_event.title
  );

  RETURN jsonb_build_object(
    'status', 'success',
    'student_name', v_name,
    'points', v_points
  );
END;
$$;

REVOKE ALL ON FUNCTION public.verify_qr_scan(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_qr_scan(uuid, uuid) TO authenticated;
