import { sec } from "../utils/timing";

/**
 * Voice-over cue sheet. Times are seconds relative to the start of each
 * scene's voice-over clip. TEST VALUES: estimated from the NeuronAI
 * "Kamronbek" sample (silence detection + syllable distribution). They are
 * replaced with measured word timestamps once the final voice-over exists.
 */
export const VO_OFFSET_S01 = sec(0.5);

export const S01_WORDS = {
  eng: 0.2,
  muvaffaqiyatli: 0.37,
  bizneslar: 1.42,
  aslida: 1.94,
  mahsulot: 2.46,
  sotmaydi: 2.98,
  ular: 3.97,
  insonlarning: 4.26,
  orzularini: 4.84,
  sotadi: 5.56,
  end: 6.0,
} as const;

/** Absolute scene frame (60 FPS) where a scene-01 word starts. */
export const s01Cue = (w: keyof typeof S01_WORDS) => VO_OFFSET_S01 + sec(S01_WORDS[w]);
