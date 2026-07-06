ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

UPDATE public.users
SET is_admin = true
WHERE role = 'admin'::public.user_role
  AND is_admin = false;

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signup_role public.user_role;
  signup_graduation_year integer;
  signup_is_admin boolean;
BEGIN
  signup_role := CASE NULLIF(trim(new.raw_user_meta_data->>'role'), '')
    WHEN 'student' THEN 'student'::public.user_role
    WHEN 'teacher' THEN 'teacher'::public.user_role
    WHEN 'admin' THEN 'admin'::public.user_role
    ELSE 'student'::public.user_role
  END;

  signup_graduation_year := NULLIF(trim(new.raw_user_meta_data->>'graduation_year'), '')::integer;

  signup_is_admin := CASE
    WHEN NULLIF(trim(new.raw_user_meta_data->>'is_admin'), '') = 'true' THEN true
    WHEN signup_role = 'admin'::public.user_role THEN true
    ELSE false
  END;

  INSERT INTO public.users (
    auth_id,
    first_name,
    last_name,
    role,
    is_admin,
    points_balance,
    graduation_year
  )
  VALUES (
    new.id::text,
    COALESCE(NULLIF(trim(new.raw_user_meta_data->>'first_name'), ''), 'Unknown'),
    COALESCE(NULLIF(trim(new.raw_user_meta_data->>'last_name'), ''), 'Unknown'),
    signup_role,
    signup_is_admin,
    0,
    CASE WHEN signup_role = 'student' THEN signup_graduation_year ELSE NULL END
  );

  RETURN new;
END;
$$;
