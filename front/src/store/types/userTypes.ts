// Types based on the data structure from dashboardDataProcessing.js
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
  startgg?: {
    accessToken: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoadingState {
  user: boolean;
  dashboard: boolean;
  disconnect: boolean;
}

export interface ErrorState {
  user: string | null;
  dashboard: string | null;
  disconnect: string | null;
}

export interface UserState {
  user: User | null;
  loading: LoadingState;
  error: ErrorState;
  initialized: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

