// Local storage for guest flow + temporary client state
const KEY = "skillgap:state:v1";

export type SkillGapState = {
  roleId?: string;
  roleSlug?: string;
  roleTitle?: string;
  skills: string[]; // skill names
  experienceYears?: number;
  lastAnalysis?: {
    score: number;
    matched: { name: string; priority: string }[];
    missing: { name: string; priority: string }[];
    totalRequired: number;
    createdAt: string;
  };
};

const empty: SkillGapState = { skills: [] };

export function getState(): SkillGapState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch { return empty; }
}

export function setState(patch: Partial<SkillGapState>) {
  if (typeof window === "undefined") return;
  const next = { ...getState(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("skillgap:state"));
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("skillgap:state"));
}
