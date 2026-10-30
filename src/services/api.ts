
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "logicquest_access_token";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  token_type: string;
}

export interface AuthUser {
  id: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface UserStats {
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
}

export interface CurrentUser {
  user: AuthUser;
  profile: UserProfile;
  stats: UserStats;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  session: AuthSession | null;
}

export interface Dashboard {
  profile: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  stats: {
    total_xp: number;
    current_level: number;
    current_streak: number;
    longest_streak: number;
  };
  performance: {
    total_attempts: number;
    correct_attempts: number;
    incorrect_attempts: number;
    accuracy_percentage: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xp_reward: number;
}

export interface Progress {
  module_name: string;
  completed_challenges: number;
  total_challenges: number;
  updated_at: string;
  completion_percentage: number;
}

export interface Profile extends UserProfile {
  created_at?: string;
  account_created_at?: string;
  [key: string]: unknown;
}

export interface ChallengeSubmission {
  is_correct: boolean;
  xp_earned: number;
  already_rewarded: boolean;
  total_xp: number;
  current_level: number;
}

export interface Achievement {
  id: string;
  code?: string;
  name?: string;
  title?: string;
  description?: string;
  xp_reward?: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
}

export type Attempt = Record<string, unknown>;

interface ApiErrorResponse {
  message?: string;
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let result: ApiErrorResponse & { success?: boolean };
  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || result.success === false) {
    if (response.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("logicquest:unauthorized"));
    }
    throw new Error(result.message || `Request failed: ${response.status}`);
  }

  return result as T;
}

// AUTHENTICATION

export async function signup(payload: {
  username: string;
  full_name: string;
  email: string;
  password: string;
}) {
  const result = await request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (result.session?.access_token) {
    saveToken(result.session.access_token);
  }

  return result;
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  const result = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (result.session?.access_token) {
    saveToken(result.session.access_token);
  }

  return result;
}

export function logout() {
  clearToken();
}

export const getMe = () =>
  request<{ success: true } & CurrentUser>("/auth/me");

// DASHBOARD

export async function getDashboard() {
  const result = await request<{ dashboard: Dashboard }>("/dashboard");
  return result.dashboard;
}

// PROFILE

export async function getProfile() {
  const result = await request<{ profile: Profile }>("/profile");
  return result.profile;
}

export async function updateProfile(payload: {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}) {
  const result = await request<{ profile: Profile }>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return result.profile;
}

// CHALLENGES

export async function getChallenges() {
  const result = await request<{
    count: number;
    challenges: Challenge[];
  }>("/challenges");

  return result.challenges;
}

export async function getChallenge(id: string) {
  const result = await request<{ challenge: Challenge }>(
    `/challenges/${id}`
  );

  return result.challenge;
}

export async function submitChallenge(id: string, answer: string) {
  return request<{
    result: {
      is_correct: boolean;
      xp_earned: number;
      already_rewarded: boolean;
      total_xp: number;
      current_level: number;
    };
  }>(`/challenges/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

// PROGRESS

export async function getProgress() {
  const result = await request<{
    count: number;
    progress: Progress[];
  }>("/progress");

  return result.progress;
}

// ACHIEVEMENTS

export async function getAchievements() {
  return request<{ count: number; achievements: Achievement[] }>("/achievements");
}

export async function getAttempts() {
  return request<{ count: number; attempts: Attempt[] }>("/attempts");
}
