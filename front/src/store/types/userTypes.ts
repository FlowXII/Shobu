export interface StartGGData {
  accessToken: string;
  connected: boolean;
  expiresAt: string;
  gamerTag: string;
  player: {
    id: string;
    gamerTag: string;
    prefix: string;
  };
  profile: {
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    bio?: string | null;
    genderPronoun?: string;
    images: Array<any>;
  };
  userId: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
  profile: {
    bio?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    avatar?: string;
  };
  startgg?: StartGGData;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  user: User | null;
  loading: {
    user: boolean;
  };
  error: {
    user: string | null;
  };
  initialized: boolean;
}

