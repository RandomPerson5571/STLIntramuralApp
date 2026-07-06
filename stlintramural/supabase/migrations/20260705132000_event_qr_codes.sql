-- Move check-in QR codes from users to events (one QR per event).

ALTER TABLE public.events
  ADD COLUMN qr_code_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX idx_events_qr_code ON public.events(qr_code_token);

DROP INDEX IF EXISTS public.idx_users_qr_code;
ALTER TABLE public.users DROP COLUMN qr_code_token;

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
      OR NEW.is_admin IS DISTINCT FROM OLD.is_admin
      OR NEW.points_balance IS DISTINCT FROM OLD.points_balance
    THEN
      RAISE EXCEPTION 'Cannot modify protected profile fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
