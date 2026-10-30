import { createContext } from "react";
import type { CurrentUser, UserProfile, UserStats } from "../services/api";

export interface AuthContextValue {
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  refreshMe: () => Promise<CurrentUser>;
  updateStats: (stats: Pick<UserStats, "total_xp" | "current_level">) => void;
  updateProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
