import React from 'react';
import Svg, { Circle, Ellipse, G, Polygon } from 'react-native-svg';

export interface AvatarCharacter {
  id: string;
  name: string;
  spanish: string;
}

export const AVATAR_CHARACTERS: AvatarCharacter[] = [
  { id: 'fox',      name: 'Fox',      spanish: 'Zorro'    },
  { id: 'owl',      name: 'Owl',      spanish: 'Búho'     },
  { id: 'cat',      name: 'Cat',      spanish: 'Gato'     },
  { id: 'bear',     name: 'Bear',     spanish: 'Oso'      },
  { id: 'wolf',     name: 'Wolf',     spanish: 'Lobo'     },
  { id: 'panda',    name: 'Panda',    spanish: 'Panda'    },
  { id: 'rabbit',   name: 'Rabbit',   spanish: 'Conejo'   },
  { id: 'lion',     name: 'Lion',     spanish: 'León'     },
  { id: 'penguin',  name: 'Penguin',  spanish: 'Pingüino' },
  { id: 'dragon',   name: 'Dragon',   spanish: 'Dragón'   },
  { id: 'monkey',   name: 'Monkey',   spanish: 'Mono'     },
  { id: 'flamingo', name: 'Flamingo', spanish: 'Flamenco' },
];

export const AVATAR_CHARACTER_IDS = AVATAR_CHARACTERS.map(c => c.id);

export function isCustomAvatar(value: string): boolean {
  return AVATAR_CHARACTER_IDS.includes(value);
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Eyes({ lx, ly, rx, ry, iris = 'white', pupil = '#1A1A1A', r = 7 }: {
  lx: number; ly: number; rx: number; ry: number;
  iris?: string; pupil?: string; r?: number;
}) {
  return (
    <G>
      <Circle cx={lx} cy={ly} r={r} fill={iris} />
      <Circle cx={rx} cy={ry} r={r} fill={iris} />
      <Circle cx={lx + 1} cy={ly} r={r * 0.58} fill={pupil} />
      <Circle cx={rx + 1} cy={ry} r={r * 0.58} fill={pupil} />
      <Circle cx={lx - 1.5} cy={ly - 2} r={r * 0.2} fill="white" />
      <Circle cx={rx - 1.5} cy={ry - 2} r={r * 0.2} fill="white" />
    </G>
  );
}

// ── Characters ────────────────────────────────────────────────────────────────

function Fox({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ears behind head */}
      <Polygon points="18,47 29,11 41,44" fill="#D7522F" />
      <Polygon points="59,44 71,11 82,47" fill="#D7522F" />
      <Polygon points="23,44 29,18 37,42" fill="#FFAB91" />
      <Polygon points="63,42 71,18 77,44" fill="#FFAB91" />
      {/* Head */}
      <Circle cx="50" cy="58" r="33" fill="#E8643A" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="16" ry="11" fill="#FFF3E0" />
      {/* Eyes */}
      <Eyes lx={38} ly={51} rx={62} ry={51} />
      {/* Nose */}
      <Ellipse cx="50" cy="64" rx="4" ry="2.8" fill="#1A1A1A" />
    </Svg>
  );
}

function Owl({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ear tufts */}
      <Polygon points="30,35 35,12 42,34" fill="#5C3D1E" />
      <Polygon points="58,34 65,12 70,35" fill="#5C3D1E" />
      {/* Head */}
      <Circle cx="50" cy="58" r="33" fill="#7B4F22" />
      {/* Eye disc rings */}
      <Circle cx="37" cy="51" r="13" fill="#C8933A" />
      <Circle cx="63" cy="51" r="13" fill="#C8933A" />
      {/* Chest feathers */}
      <Ellipse cx="50" cy="76" rx="18" ry="11" fill="#C8933A" />
      {/* Eyes */}
      <Eyes lx={37} ly={51} rx={63} ry={51} iris="#FFD54F" r={7} />
      {/* Beak */}
      <Polygon points="46,62 54,62 50,70" fill="#FF8F00" />
    </Svg>
  );
}

function Cat({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ears */}
      <Polygon points="17,46 26,12 39,44" fill="#8A8A8A" />
      <Polygon points="61,44 74,12 83,46" fill="#8A8A8A" />
      <Polygon points="21,43 26,19 36,42" fill="#F8BBD9" />
      <Polygon points="64,42 74,19 79,43" fill="#F8BBD9" />
      {/* Head */}
      <Circle cx="50" cy="58" r="33" fill="#9E9E9E" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="14" ry="9" fill="#F5F5F5" />
      {/* Eyes — green, slightly larger */}
      <Eyes lx={38} ly={51} rx={62} ry={51} iris="#66BB6A" pupil="#1A1A1A" r={7.5} />
      {/* Nose */}
      <Polygon points="47,63 53,63 50,67" fill="#F06292" />
      {/* Whisker dots */}
      <Circle cx="30" cy="67" r="2.2" fill="#BDBDBD" />
      <Circle cx="37" cy="70" r="2.2" fill="#BDBDBD" />
      <Circle cx="63" cy="70" r="2.2" fill="#BDBDBD" />
      <Circle cx="70" cy="67" r="2.2" fill="#BDBDBD" />
    </Svg>
  );
}

function Bear({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ears */}
      <Circle cx="22" cy="27" r="16" fill="#5D4037" />
      <Circle cx="78" cy="27" r="16" fill="#5D4037" />
      <Circle cx="22" cy="27" r="9" fill="#8D6E63" />
      <Circle cx="78" cy="27" r="9" fill="#8D6E63" />
      {/* Head */}
      <Circle cx="50" cy="58" r="33" fill="#6D4C41" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="17" ry="12" fill="#BCAAA4" />
      {/* Eyes */}
      <Eyes lx={38} ly={51} rx={62} ry={51} />
      {/* Nose */}
      <Ellipse cx="50" cy="63" rx="6" ry="4.5" fill="#1A1A1A" />
    </Svg>
  );
}

function Wolf({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ears */}
      <Polygon points="18,46 27,10 40,44" fill="#607D8B" />
      <Polygon points="60,44 73,10 82,46" fill="#607D8B" />
      <Polygon points="23,43 27,17 36,42" fill="#CFD8DC" />
      <Polygon points="64,42 73,17 77,43" fill="#CFD8DC" />
      {/* Head */}
      <Circle cx="50" cy="57" r="33" fill="#78909C" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="18" ry="12" fill="#CFD8DC" />
      {/* Eyes — amber */}
      <Eyes lx={38} ly={50} rx={62} ry={50} iris="#FFA000" />
      {/* Nose */}
      <Ellipse cx="50" cy="64" rx="5" ry="3.5" fill="#1A1A1A" />
    </Svg>
  );
}

function Panda({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Ears */}
      <Circle cx="20" cy="23" r="16" fill="#212121" />
      <Circle cx="80" cy="23" r="16" fill="#212121" />
      {/* Head */}
      <Circle cx="50" cy="57" r="33" fill="#FAFAFA" />
      {/* Eye patches */}
      <Ellipse cx="36" cy="50" rx="13" ry="11" fill="#212121" />
      <Ellipse cx="64" cy="50" rx="13" ry="11" fill="#212121" />
      {/* Eyes */}
      <Eyes lx={36} ly={49} rx={64} ry={49} r={6.5} />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="15" ry="10" fill="#EEEEEE" />
      {/* Nose */}
      <Ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#212121" />
    </Svg>
  );
}

function Rabbit({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Tall ears */}
      <Ellipse cx="34" cy="23" rx="11" ry="24" fill="#FFCCBC" />
      <Ellipse cx="66" cy="23" rx="11" ry="24" fill="#FFCCBC" />
      <Ellipse cx="34" cy="23" rx="5.5" ry="17" fill="#F48FB1" />
      <Ellipse cx="66" cy="23" rx="5.5" ry="17" fill="#F48FB1" />
      {/* Head */}
      <Circle cx="50" cy="62" r="30" fill="#FFCCBC" />
      {/* Eyes */}
      <Eyes lx={39} ly={57} rx={61} ry={57} />
      {/* Nose */}
      <Ellipse cx="50" cy="70" rx="4" ry="3" fill="#F06292" />
    </Svg>
  );
}

function Lion({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Mane ring */}
      <Circle cx="50" cy="57" r="43" fill="#E65100" />
      {/* Head */}
      <Circle cx="50" cy="57" r="32" fill="#FFA000" />
      {/* Ears (inside mane) */}
      <Circle cx="26" cy="30" r="12" fill="#FFA000" />
      <Circle cx="74" cy="30" r="12" fill="#FFA000" />
      <Circle cx="26" cy="30" r="7" fill="#FF8F00" />
      <Circle cx="74" cy="30" r="7" fill="#FF8F00" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="69" rx="16" ry="11" fill="#FFE082" />
      {/* Eyes */}
      <Eyes lx={38} ly={52} rx={62} ry={52} iris="#FFD54F" />
      {/* Nose */}
      <Ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#BF360C" />
    </Svg>
  );
}

function Penguin({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Head */}
      <Circle cx="50" cy="50" r="35" fill="#1A237E" />
      {/* White face/chest */}
      <Ellipse cx="50" cy="63" rx="22" ry="26" fill="white" />
      {/* Eyes */}
      <Eyes lx={38} ly={43} rx={62} ry={43} r={7} />
      {/* Beak */}
      <Polygon points="43,56 57,56 50,65" fill="#FF8F00" />
    </Svg>
  );
}

function Dragon({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Horns */}
      <Polygon points="32,36 36,11 43,35" fill="#2E7D32" />
      <Polygon points="57,35 64,11 68,36" fill="#2E7D32" />
      {/* Head */}
      <Circle cx="50" cy="58" r="33" fill="#43A047" />
      {/* Scale dots */}
      <Circle cx="50" cy="36" r="4.5" fill="#2E7D32" />
      <Circle cx="40" cy="42" r="3.5" fill="#2E7D32" />
      <Circle cx="60" cy="42" r="3.5" fill="#2E7D32" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="70" rx="14" ry="10" fill="#66BB6A" />
      {/* Eyes — yellow, slit pupil */}
      <Circle cx="38" cy="52" r="7.5" fill="#FFD54F" />
      <Circle cx="62" cy="52" r="7.5" fill="#FFD54F" />
      <Ellipse cx={39} cy={52} rx={2.5} ry={5} fill="#1A1A1A" />
      <Ellipse cx={63} cy={52} rx={2.5} ry={5} fill="#1A1A1A" />
      <Circle cx="37" cy="50" r="1.5" fill="white" />
      <Circle cx="61" cy="50" r="1.5" fill="white" />
      {/* Nostrils */}
      <Ellipse cx="45" cy="66" rx="3" ry="2" fill="#2E7D32" />
      <Ellipse cx="55" cy="66" rx="3" ry="2" fill="#2E7D32" />
    </Svg>
  );
}

function Monkey({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Side ears */}
      <Circle cx="13" cy="56" r="16" fill="#8D6E63" />
      <Circle cx="87" cy="56" r="16" fill="#8D6E63" />
      <Circle cx="13" cy="56" r="9" fill="#FFCCBC" />
      <Circle cx="87" cy="56" r="9" fill="#FFCCBC" />
      {/* Head */}
      <Circle cx="50" cy="55" r="32" fill="#8D6E63" />
      {/* Muzzle */}
      <Ellipse cx="50" cy="68" rx="20" ry="14" fill="#FFCCBC" />
      {/* Eyes */}
      <Eyes lx={38} ly={49} rx={62} ry={49} pupil="#3E2723" />
      {/* Nostrils */}
      <Circle cx="45" cy="64" r="3" fill="#A1887F" />
      <Circle cx="55" cy="64" r="3" fill="#A1887F" />
    </Svg>
  );
}

function Flamingo({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      {/* Feather tufts on top */}
      <Ellipse cx="35" cy="23" rx="8" ry="16" fill="#F48FB1" />
      <Ellipse cx="50" cy="18" rx="8" ry="14" fill="#EC407A" />
      <Ellipse cx="65" cy="23" rx="8" ry="16" fill="#F48FB1" />
      {/* Head */}
      <Circle cx="50" cy="57" r="33" fill="#F48FB1" />
      {/* Chest — lighter */}
      <Ellipse cx="50" cy="72" rx="20" ry="14" fill="#FCE4EC" />
      {/* Eyes — yellow/pink for flamingo */}
      <Eyes lx={38} ly={51} rx={62} ry={51} iris="#FFEE58" pupil="#AD1457" r={7} />
      {/* Beak */}
      <Polygon points="44,62 56,62 54,69 46,69" fill="#EC407A" />
      <Polygon points="46,69 54,69 52,75 48,75" fill="#1A1A1A" />
    </Svg>
  );
}

// ── Registry ──────────────────────────────────────────────────────────────────

const RENDERS: Record<string, (s: number) => React.ReactElement> = {
  fox:      s => <Fox s={s} />,
  owl:      s => <Owl s={s} />,
  cat:      s => <Cat s={s} />,
  bear:     s => <Bear s={s} />,
  wolf:     s => <Wolf s={s} />,
  panda:    s => <Panda s={s} />,
  rabbit:   s => <Rabbit s={s} />,
  lion:     s => <Lion s={s} />,
  penguin:  s => <Penguin s={s} />,
  dragon:   s => <Dragon s={s} />,
  monkey:   s => <Monkey s={s} />,
  flamingo: s => <Flamingo s={s} />,
};

export function AvatarSvg({ id, size }: { id: string; size: number }): React.ReactElement | null {
  return RENDERS[id]?.(size) ?? null;
}
