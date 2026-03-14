export type Profile = {
  name: string;
  role: string;
  industry: string;
  usage: string;
  challenge: string;
  aiPreferred: string;
  apps: string[];
  aiLevel: string;
  email?: string;
  plan?: "free" | "pro";
  polishesUsed?: number;
  createdAt?: string;
};

export const EMPTY_PROFILE: Profile = {
  name: "", role: "", industry: "",
  usage: "", challenge: "",
  aiPreferred: "", apps: [], aiLevel: "",
};

const PROFILE_KEY = "mikeprompt_profile_v2";

export const loadProfile = (): Profile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch { return null; }
};

export const saveProfile = (p: Profile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
};

export const clearProfile = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
};

export const updatePolishCount = (): number => {
  const p = loadProfile() ?? { ...EMPTY_PROFILE };
  const count = (p.polishesUsed ?? 0) + 1;
  saveProfile({ ...p, polishesUsed: count });
  return count;
};
