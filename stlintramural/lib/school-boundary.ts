import * as turf from "@turf/turf";

// Matches app/api/verify-school-boundary/route.ts (STL campus bounding box).
const SCHOOL_POLYGON = turf.polygon([
  [
    [43.88415, -79.467145],
    [43.902159, -79.472975],
    [43.907634, -79.445546],
    [43.889556, -79.441436],
    [43.88415, -79.467145],
  ],
]);

export function isInsideSchoolBoundary(lng: number, lat: number): boolean {
  const point = turf.point([lng, lat]);
  return turf.booleanPointInPolygon(point, SCHOOL_POLYGON);
}
