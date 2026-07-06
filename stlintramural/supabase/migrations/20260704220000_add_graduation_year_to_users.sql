ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS graduation_year integer;

UPDATE public.users u
SET graduation_year = (au.raw_user_meta_data->>'graduation_year')::integer
FROM auth.users au
WHERE u.auth_id = au.id::text
  AND u.graduation_year IS NULL
  AND au.raw_user_meta_data->>'graduation_year' IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signup_role public.user_role;
  signup_graduation_year integer;
BEGIN
  signup_role := CASE NULLIF(trim(new.raw_user_meta_data->>'role'), '')
    WHEN 'student' THEN 'student'::public.user_role
    WHEN 'teacher' THEN 'teacher'::public.user_role
    WHEN 'admin' THEN 'admin'::public.user_role
    ELSE 'student'::public.user_role
  END;

  signup_graduation_year := NULLIF(trim(new.raw_user_meta_data->>'graduation_year'), '')::integer;

  INSERT INTO public.users (
    auth_id,
    first_name,
    last_name,
    role,
    points_balance,
    graduation_year
  )
  VALUES (
    new.id::text,
    COALESCE(NULLIF(trim(new.raw_user_meta_data->>'first_name'), ''), 'Unknown'),
    COALESCE(NULLIF(trim(new.raw_user_meta_data->>'last_name'), ''), 'Unknown'),
    signup_role,
    0,
    CASE WHEN signup_role = 'student' THEN signup_graduation_year ELSE NULL END
  );

  RETURN new;
END;
$$;
