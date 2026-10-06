export type CompanionType =
  | 'Someone special'
  | 'Best friend'
  | 'Friend'
  | 'Family'
  | 'Sibling'
  | 'Friend group'
  | "Someone I'm getting to know"
  | 'Surprise me';

export type DurationOption =
  | '45 minutes'
  | '1–2 hours'
  | '2–4 hours'
  | '4–6 hours'
  | 'Half a day'
  | 'Full day'
  | 'Custom duration';

export type MoodOption =
  | 'Peaceful'
  | 'Cozy'
  | 'Creative'
  | 'Adventurous'
  | 'Fun & playful'
  | 'Foodie'
  | 'Scenic'
  | 'Memorable'
  | 'Slow & relaxing'
  | 'Surprise me';

export type ActivityOption =
  | 'Nature'
  | 'Cafés'
  | 'Food'
  | 'Art & crafts'
  | 'Pottery'
  | 'Cycling'
  | 'Walking'
  | 'Movies'
  | 'Events'
  | 'Games'
  | 'Shopping'
  | 'Photography'
  | 'Sunset / scenic spots'
  | 'Parks'
  | 'Offbeat places'
  | 'Surprise me';

export type BudgetOption =
  | 'Free'
  | 'Under ₹300/person'
  | '₹300–₹500/person'
  | '₹500–₹1,000/person'
  | '₹1,000–₹2,000/person'
  | '₹2,000+/person'
  | 'No preference';

export type DistanceOption =
  | 'Within 2 km'
  | 'Within 5 km'
  | 'Within 10 km'
  | 'Anywhere nearby';

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
}

export interface QuestionnaireState {
  companion: CompanionType | '';
  duration: DurationOption | '';
  customDurationHours?: number;
  moods: MoodOption[];
  activities: ActivityOption[];
  budget: BudgetOption | '';
  peopleCount: number;
  distance: DistanceOption | '';
  dateChoice: 'Today' | 'Tomorrow' | 'Choose a date';
  customDate?: string;
  startTime: string;
  location: LocationData;
}

export interface PlaceCandidate {
  id: string;
  name: string;
  category: string;
  address: string;
  rating?: number;
  reviewsCount?: number;
  priceLevel?: string;
  estimatedCost?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  description: string;
  openingHours?: string;
  website?: string;
  thumbnail?: string;
  isRealLiveResult?: boolean;
}

export interface ItineraryStop {
  order: number;
  time: string;
  duration: string;
  type: string;
  name: string;
  reason: string;
  address: string;
  distance: string;
  estimated_cost: string;
  tips: string;
  lat: number;
  lng: number;
  rating?: number;
  mapUrl?: string;
}

export interface CherryOnTop {
  gesture: string;
  why: string;
  optional_gift?: string;
}

export interface ItineraryPlan {
  title: string;
  subtitle: string;
  summary: string;
  estimated_total_cost: string;
  total_duration: string;
  stops: ItineraryStop[];
  travel_notes: string;
  why_this_plan: string;
  cherry_on_top: CherryOnTop;
  companion: string;
  date: string;
  startTime: string;
  locationName: string;
  isDemoMode?: boolean;
  modelUsed?: string;
}

export interface OutingMemory {
  id: string;
  title: string;
  date: string;
  companion: string;
  ratingEmoji: string;
  ratingLabel: string;
  note: string;
  stopsSummary: string;
  createdAt: string;
}
