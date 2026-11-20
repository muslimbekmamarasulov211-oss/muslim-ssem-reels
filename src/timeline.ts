import { SceneId, VO, VO_LEAD } from "./audio/AudioTimeline";
import { sec } from "./utils/timing";

/** Overlap of every scene-to-scene transition (frames @ 60 FPS). */
export const TRANSITION = 18;

/** Extra hold after the last line (final reveal). */
const FINAL_HOLD = sec(1.3);

export const SCENES: SceneId[] = ["01", "02", "03", "04", "05", "06", "07", "08"];

/** Scene length = lead-in + voice-over clip + short tail (+ final hold). */
export const sceneDuration = (id: SceneId) =>
  VO_LEAD + sec(VO[id].duration) + sec(0.1) + (id === "08" ? FINAL_HOLD : 0);

/** Absolute start frame of each scene on the master timeline. */
export const sceneStart = (id: SceneId) => {
  let t = 0;
  for (const s of SCENES) {
    if (s === id) return t;
    t += sceneDuration(s) - TRANSITION;
  }
  throw new Error(`Unknown scene ${id}`);
};

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + sceneDuration(s), 0) - TRANSITION * (SCENES.length - 1);
