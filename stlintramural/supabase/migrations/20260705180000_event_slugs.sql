-- Add URL-friendly slugs to events, auto-generated from title on insert.

ALTER TABLE public.events
  ADD COLUMN slug VARCHAR(100);

-- Backfill existing rows before NOT NULL / trigger enforcement.
WITH slugged AS (
  SELECT
    id,
    left(
      COALESCE(
        NULLIF(
          trim(both '-' from lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'))),
          ''
        ),
        'event'
      ),
      80
    ) AS base_slug,
    row_number() OVER (
      PARTITION BY lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'))
      ORDER BY created_at, id
    ) AS duplicate_rank
  FROM public.events
)
UPDATE public.events AS e
SET slug = CASE
  WHEN s.duplicate_rank = 1 THEN s.base_slug
  ELSE left(s.base_slug, 80 - length('-' || s.duplicate_rank::text)) || '-' || s.duplicate_rank
END
FROM slugged AS s
WHERE e.id = s.id;

ALTER TABLE public.events
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX idx_events_slug ON public.events(slug);

CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  candidate text;
  suffix int := 0;
BEGIN
  IF NEW.slug IS NOT NULL AND trim(NEW.slug) <> '' THEN
    RETURN NEW;
  END IF;

  base_slug := lower(regexp_replace(trim(NEW.title), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  base_slug := left(base_slug, 80);

  IF base_slug = '' THEN
    base_slug := 'event';
  END IF;

  candidate := base_slug;

  WHILE EXISTS (
    SELECT 1
    FROM public.events
    WHERE slug = candidate
      AND (TG_OP = 'INSERT' OR id IS DISTINCT FROM NEW.id)
  ) LOOP
    suffix := suffix + 1;
    candidate := left(base_slug, 80 - length('-' || suffix::text)) || '-' || suffix;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

CREATE TRIGGER events_generate_slug
  BEFORE INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_event_slug();
