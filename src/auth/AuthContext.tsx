import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./auth-context";
import {
  clearToken,
  getMe,
  getToken,
  type CurrentUser,
  type UserStats,
} from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      const user = await getMe();
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (cause) {
      if (!getToken()) {
        setCurrentUser(null);
        setError("Your session expired. Please log in again.");
      } else {
        setError("Unable to verify your session. Check your connection and retry.");
      }
      throw cause;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setCurrentUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback((profile: NonNullable<typeof currentUser>["profile"]) => {
    setCurrentUser((current) => current ? { ...current, profile } : current);
  }, []);

  const updateStats = useCallback(
    (stats: Pick<UserStats, "total_xp" | "current_level">) => {
      setCurrentUser((current) =>
        current
          ? {
              ...current,
              stats: { ...current.stats, ...stats },
            }
          : current
      );
    },
    []
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setError("Your session expired. Please log in again.");
    };
    window.addEventListener("logicquest:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("logicquest:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    refreshMe()
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [refreshMe]);

  const value = useMemo(
    () => ({ currentUser, loading, error, clearError, refreshMe, updateStats, updateProfile, logout }),
    [currentUser, loading, error, clearError, refreshMe, updateStats, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
