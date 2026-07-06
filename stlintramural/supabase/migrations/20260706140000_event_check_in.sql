-- Teacher QR check-in: atomic attendance + points award via SECURITY DEFINER RPC.

CREATE OR REPLACE FUNCTION public.protect_user_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ponytail: trusted system path for check-in point awards
  IF coalesce(current_setting('app.system_update', true), '') = 'true' THEN
    RETURN NEW;
  END IF;

  IF NOT public.is_admin() THEN
    IF NEW.auth_id IS DISTINCT FROM OLD.auth_id
      OR NEW.role IS DISTINCT FROM OLD.role
      OR NEW.is_admin IS DISTINCT FROM OLD.is_admin
      OR NEW.points_balance IS DISTINCT FROM OLD.points_balance
      OR NEW.qr_code_token IS DISTINCT FROM OLD.qr_code_token
    THEN
      RAISE EXCEPTION 'Cannot modify protected profile fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_event_check_in(
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
  v_attendance public.event_attendances%ROWTYPE;
  v_points int;
  v_name text;
BEGIN
  v_scanner_id := public.get_my_user_id();
  IF v_scanner_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
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

  SELECT * INTO v_attendance
  FROM public.event_attendances
  WHERE user_id = v_student.id
    AND event_id = p_event_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'status', 'not_registered',
      'student_name', v_name
    );
  END IF;

  IF v_attendance.attended_at IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'already_checked_in',
      'student_name', v_name
    );
  END IF;

  v_points := v_event.points_awarded;

  UPDATE public.event_attendances
  SET attended_at = now(),
      scanned_by = v_scanner_id
  WHERE id = v_attendance.id;

  PERFORM set_config('app.system_update', 'true', true);

  UPDATE public.users
  SET points_balance = points_balance + v_points
  WHERE id = v_student.id;

  PERFORM set_config('app.system_update', '', true);

  INSERT INTO public.point_transactions (
    user_id,
    event_id,
    attendance_id,
    points,
    description
  )
  VALUES (
    v_student.id,
    p_event_id,
    v_attendance.id,
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

REVOKE ALL ON FUNCTION public.record_event_check_in(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_event_check_in(uuid, uuid) TO authenticated;
