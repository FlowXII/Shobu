// Types based on the data structure from dashboardDataProcessing.js
export interface UserState {
  user: {
    name: string;
    location: {
      city: string;
      state: string;
      country: string;
      countryId: number;
    };
    images: Array<{id: string; type: string; url: string}>;
    slug: string;
    player: {
      id: string;
      gamerTag: string;
      prefix: string;
    };
    bio: string;
    genderPronoun: string;
  } | null;
  tournaments: Array<{
    id: string;
    name: string;
    startAt: number;
    // ... rest of tournament type structure
  }>;
  loading: boolean;
  error: string | null;
}

