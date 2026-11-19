import { sec } from "../utils/timing";
import { cue } from "./AudioTimeline";

/**
 * Sound-effect placements. Every file is cut from the user-supplied packs in
 * public/assets/audio/sound_effects/_source (no downloaded / generated SFX).
 * `peak` is the measured time of the loudest sample inside the clip, so a
 * hit can be aligned to the exact animation frame: start = hitFrame - peak.
 */
export type SfxPlacement = {
  file: string;
  scene: string;
  animation: string;
  hitFrame: number; // frame (60 FPS, scene-relative) where the sound should land
  peak: number; // seconds into the clip where its peak sits
  gain: number; // linear volume 0..1
};

export const SFX_LIB = {
  riser_01: { file: "assets/audio/sound_effects/riser_01.wav", peak: 0.092, source: "sfx_pack_02 0.00-2.42" },
  impact_cine_strike: { file: "assets/audio/sound_effects/impact_cine_strike.wav", peak: 0.22, source: "sfx_pack_05 2.78-3.94 (Cine strike)" },
  whoosh_03: { file: "assets/audio/sound_effects/whoosh_03.wav", peak: 0.327, source: "sfx_pack_02 4.28-6.08" },
  impact_basscrack: { file: "assets/audio/sound_effects/impact_basscrack.wav", peak: 0.064, source: "sfx_pack_05 6.29-7.41 (Basscrack)" },
} as const;

export const S01_SFX: SfxPlacement[] = [
  { ...SFX_LIB.riser_01, scene: "01", animation: "Black -> emerald reveal, light streak", hitFrame: 6, gain: 0.32 },
  { ...SFX_LIB.impact_basscrack, scene: "01", animation: "'sotmaydi.' blur-zoom punch", hitFrame: cue("01", "sotmaydi"), gain: 0.22 },
  { ...SFX_LIB.impact_cine_strike, scene: "01", animation: "'orzularini' lime highlight impact", hitFrame: cue("01", "orzularini"), gain: 0.5 },
  { ...SFX_LIB.whoosh_03, scene: "01", animation: "Whip-pan exit with motion blur", hitFrame: sec(6.38), gain: 0.42 },
];

export const startFrameFor = (p: SfxPlacement) => Math.max(0, p.hitFrame - sec(p.peak));
