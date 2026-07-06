import { mapEventToDetail } from "@/lib/mappers/event";
import {
  fetchEventDetailBySlug,
  fetchMyEventAttendances,
  fetchRelatedEvents,
} from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";
import type { EventDetail } from "@/types/event-detail";

export async function getEventDetailBySlug(
  slug: string,
): Promise<EventDetail | null> {
  const supabase = await createClient();
  const row = await fetchEventDetailBySlug(supabase, slug);

  if (!row) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isRegistered = false;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (profile) {
      const registeredIds = await fetchMyEventAttendances(supabase, profile.id);
      isRegistered = registeredIds.has(row.id);
    }
  }

  return mapEventToDetail(row, { index: 0, isRegistered });
}

export async function getRelatedEvents(
  slug: string,
  limit = 2,
): Promise<EventDetail[]> {
  const supabase = await createClient();
  return fetchRelatedEvents(supabase, slug, limit);
}
