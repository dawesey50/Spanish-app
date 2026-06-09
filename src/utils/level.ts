export interface UserLevel {
  level: number;
  name: string;
  color: string;
  minXP: number;
  nextLevelXP: number | null;
}

const TIERS: UserLevel[] = [
  { level: 1, name: 'Principiante', color: '#6B7280', minXP: 0, nextLevelXP: 250 },
  { level: 2, name: 'Elemental',    color: '#059669', minXP: 250, nextLevelXP: 750 },
  { level: 3, name: 'Intermedio',   color: '#2563EB', minXP: 750, nextLevelXP: 1500 },
  { level: 4, name: 'Avanzado',     color: '#7C3AED', minXP: 1500, nextLevelXP: 3000 },
  { level: 5, name: 'Experto',      color: '#D97706', minXP: 3000, nextLevelXP: null },
];

export function getUserLevel(xp: number): UserLevel {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}
