export interface UserLevel {
  level: number;
  name: string;
  color: string;
  minXP: number;
  nextLevelXP: number | null;
}

const TIERS: UserLevel[] = [
  // ── Early game ─────────────────────────────────────────────────────────────
  { level: 1,  name: 'Principiante', color: '#6B7280', minXP: 0,      nextLevelXP: 150   },
  { level: 2,  name: 'Curioso',      color: '#0D9488', minXP: 150,    nextLevelXP: 400   },
  { level: 3,  name: 'Aprendiz',     color: '#059669', minXP: 400,    nextLevelXP: 800   },
  { level: 4,  name: 'Estudiante',   color: '#2563EB', minXP: 800,    nextLevelXP: 1500  },

  // ── Mid game ───────────────────────────────────────────────────────────────
  { level: 5,  name: 'Intermedio',   color: '#4F46E5', minXP: 1500,   nextLevelXP: 2500  },
  { level: 6,  name: 'Aventurero',   color: '#7C3AED', minXP: 2500,   nextLevelXP: 4000  },
  { level: 7,  name: 'Avanzado',     color: '#9333EA', minXP: 4000,   nextLevelXP: 6500  },
  { level: 8,  name: 'Experto',      color: '#D97706', minXP: 6500,   nextLevelXP: 10000 },

  // ── Late game ──────────────────────────────────────────────────────────────
  { level: 9,  name: 'Bilingüe',     color: '#EA580C', minXP: 10000,  nextLevelXP: 15000 },
  { level: 10, name: 'Maestro',      color: '#DC2626', minXP: 15000,  nextLevelXP: 22000 },
  { level: 11, name: 'Leyenda',      color: '#E11D48', minXP: 22000,  nextLevelXP: 32000 },
  { level: 12, name: 'Gran Maestro', color: '#B45309', minXP: 32000,  nextLevelXP: null  },
];

export function getUserLevel(xp: number): UserLevel {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}
