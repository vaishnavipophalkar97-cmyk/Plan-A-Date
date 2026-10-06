import { PlaceCandidate } from '../src/types/index.js';
import { VERIFIED_CITIES, synthesizeLocalCandidates, calculateDistanceKm } from './placesData.js';

export async function searchPlacesNearLocation(params: {
  locationName: string;
  lat: number;
  lng: number;
  activities: string[];
  radiusKm: number;
}): Promise<{ candidates: PlaceCandidate[]; source: 'serpapi' | 'verified_catalog' | 'dynamic_geo' }> {
  const { locationName, lat, lng, activities, radiusKm } = params;
  const apiKey = process.env.SERPAPI_KEY;

  // 1. Check coordinate proximity first: If user coordinates are within 35km of any verified city, use that city!
  for (const city of Object.values(VERIFIED_CITIES)) {
    if (calculateDistanceKm(lat, lng, city.lat, city.lng) <= 35) {
      if (!apiKey || apiKey === 'MY_SERPAPI_KEY') {
        const localized = city.places
          .map((p) => ({
            ...p,
            distanceKm: calculateDistanceKm(lat, lng, p.lat, p.lng),
          }))
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        return { candidates: localized, source: 'verified_catalog' };
      }
    }
  }

  // 2. Name check: If locationName specifically matches a verified city catalog
  const cleanLoc = locationName.toLowerCase();
  for (const [key, city] of Object.entries(VERIFIED_CITIES)) {
    if (cleanLoc.includes(key) || cleanLoc.includes(city.name.toLowerCase())) {
      // If SerpApi key is NOT set, use the verified city catalog right away with exact coordinates
      if (!apiKey || apiKey === 'MY_SERPAPI_KEY') {
        const filtered = city.places
          .map((p) => {
            const d = calculateDistanceKm(lat, lng, p.lat, p.lng);
            return { ...p, distanceKm: d };
          })
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        return { candidates: filtered, source: 'verified_catalog' };
      }
    }
  }

  // If SerpApi Key IS available, perform live query
  if (apiKey && apiKey !== 'MY_SERPAPI_KEY') {
    try {
      const queryAct = activities.length > 0 ? activities[0] : 'cozy cafes and parks';
      const searchQuery = `${queryAct} near ${locationName}`;
      const url = `https://serpapi.com/search.json?engine=google_local&q=${encodeURIComponent(
        searchQuery
      )}&google_domain=google.com&hl=en&gl=in&api_key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (res.ok) {
        const data = await res.json();
        const results = data.local_results || [];
        if (Array.isArray(results) && results.length > 0) {
          const candidates: PlaceCandidate[] = results.slice(0, 8).map((item: any, i: number) => {
            const itemLat = item.gps_coordinates?.latitude || lat + (i * 0.005);
            const itemLng = item.gps_coordinates?.longitude || lng + (i * 0.005);
            const dist = calculateDistanceKm(lat, lng, itemLat, itemLng);

            return {
              id: `serp-${item.place_id || i}`,
              name: item.title || item.name || 'Local Destination',
              category: item.type || queryAct,
              address: item.address || `Near ${locationName}`,
              rating: item.rating || 4.5,
              reviewsCount: item.reviews || 250,
              priceLevel: item.price || '₹₹',
              estimatedCost: item.price ? `₹${item.price}` : '₹300–₹500/person',
              lat: itemLat,
              lng: itemLng,
              distanceKm: dist,
              description: item.description || item.snippet || `${item.type || 'Great spot'} located in ${locationName}.`,
              openingHours: item.hours || 'Open regular hours',
              website: item.website || item.link,
              thumbnail: item.thumbnail,
              isRealLiveResult: true,
            };
          });

          return { candidates, source: 'serpapi' };
        }
      }
    } catch (err) {
      console.warn('SerpApi live query encountered an issue, falling back to local catalog:', err);
    }
  }

  // Graceful fallback to verified catalog or dynamically geocoded candidate generation
  for (const city of Object.values(VERIFIED_CITIES)) {
    if (calculateDistanceKm(lat, lng, city.lat, city.lng) <= 35) {
      const localized = city.places.map((p) => ({
        ...p,
        distanceKm: calculateDistanceKm(lat, lng, p.lat, p.lng),
      }));
      return { candidates: localized, source: 'verified_catalog' };
    }
  }

  // Generate realistic candidates centered on the requested coordinates
  const synthesized = synthesizeLocalCandidates(locationName, lat, lng, activities);
  return { candidates: synthesized, source: 'dynamic_geo' };
}
