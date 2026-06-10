import { Audio } from 'expo-av';

export type SoundName = 'correct' | 'wrong' | 'complete' | 'levelup';

const FILES: Record<SoundName, ReturnType<typeof require>> = {
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  complete: require('../../assets/sounds/complete.wav'),
  levelup: require('../../assets/sounds/levelup.wav'),
};

const loaded: Partial<Record<SoundName, Audio.Sound>> = {};
let enabled = true;

/** Preload all effects. Call once at app start with the persisted setting. */
export async function initSounds(soundsEnabled: boolean): Promise<void> {
  enabled = soundsEnabled;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
    await Promise.all(
      (Object.keys(FILES) as SoundName[]).map(async (name) => {
        const { sound } = await Audio.Sound.createAsync(FILES[name], { volume: 0.8 });
        loaded[name] = sound;
      })
    );
  } catch {
    // Sounds are non-critical — fail silently
  }
}

export function setSoundsEnabled(value: boolean): void {
  enabled = value;
}

export function playSound(name: SoundName): void {
  if (!enabled) return;
  loaded[name]?.replayAsync().catch(() => {});
}
