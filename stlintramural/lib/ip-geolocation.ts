export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export async function geolocateIp(ip: string): Promise<GeoCoordinates | null> {
  const response = await fetch(
    `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,lat,lon`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    status?: string;
    lat?: number;
    lon?: number;
  };

  if (
    payload.status !== "success" ||
    typeof payload.lat !== "number" ||
    typeof payload.lon !== "number"
  ) {
    return null;
  }

  return { lat: payload.lat, lng: payload.lon };
}
