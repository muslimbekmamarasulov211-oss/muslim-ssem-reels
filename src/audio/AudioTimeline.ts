import timings from "./vo_timings.json";
import { sec } from "../utils/timing";

/**
 * Voice-over cue sheet (final takes: NeuronAI "Kamronbek", speed 1.12).
 * Word times come from scripts/vo_timings.py (silence detection + phrase
 * snapping + syllable weighting) and are seconds from the start of each
 * scene's clip.
 */
export type SceneId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";

type Word = { w: string; start: number; end: number };
type SceneVO = { file: string; duration: number; speech: number[][]; words: Word[] };

export const VO = timings as Record<SceneId, SceneVO>;

/** Start (seconds, clip-relative) of the `nth` occurrence of a word. */
export const wordAt = (scene: SceneId, word: string, nth = 1): number => {
  const hits = VO[scene].words.filter((x) => x.w.toLowerCase() === word.toLowerCase());
  const hit = hits[nth - 1];
  if (!hit) throw new Error(`Word "${word}" (#${nth}) not found in VO scene ${scene}`);
  return hit.start;
};

/** Voice-over starts this long after its scene begins. */
export const VO_LEAD = sec(0.4);

/** Absolute scene-relative frame (60 FPS) where a word is spoken. */
export const cue = (scene: SceneId, word: string, nth = 1) => VO_LEAD + sec(wordAt(scene, word, nth));

/** Frame where the scene's voice-over ends. */
export const voEnd = (scene: SceneId) => VO_LEAD + sec(VO[scene].speech[VO[scene].speech.length - 1][1]);
