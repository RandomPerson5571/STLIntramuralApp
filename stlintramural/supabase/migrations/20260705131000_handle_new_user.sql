-- Creates a public.users row when Supabase Auth registers a new user.
-- SECURITY DEFINER + search_path lets the insert bypass RLS (no client INSERT policy).
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
