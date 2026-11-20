import { sec } from "../utils/timing";
import { cue, SceneId } from "./AudioTimeline";
import { sceneDuration, TRANSITION } from "../timeline";

/**
 * Sound-effect placements (scene-relative frames @ 60 FPS). Every file is cut
 * from the user-supplied packs in public/assets/audio/sound_effects/_source;
 * nothing is downloaded or generated. `peak` is the measured time of the
 * loudest sample in the clip, so start = hitFrame - peak puts the transient
 * exactly on the animation frame.
 */
export type SfxPlacement = {
  file: string;
  scene: SceneId;
  animation: string;
  hitFrame: number;
  peak: number;
  gain: number;
};

const LIB = {
  riser_01: 0.092,
  riser_10: 0.908,
  whoosh_03: 0.327,
  whoosh_07: 0.809,
  whoosh_08: 0.543,
  whoosh_digital: 0.274,
  whoosh_cyber_shift: 0.717,
  impact_cine_strike: 0.22,
  impact_basscrack: 0.064,
  impact_boom: 0.012,
  impact_sub_boom: 0.497,
  drop_bass: 1.232,
  texture_ripple: 0.313,
  texture_warps: 0.848,
  shimmer: 0.216,
  ping: 0.178,
  bell_chime: 0.081,
  ui_chime: 0.264,
  ui_click: 0.051,
  ui_confirm: 0.083,
  ui_crispy_click: 0.108,
  ui_glass: 1.711,
  ui_number_count: 1.02,
  ui_pop: 0.007,
  ui_wrong: 0.172,
  ui_zoom: 0.104,
  tick_01: 0.111,
  tick_02: 0.134,
  tick_03: 0.161,
} as const;

type SfxName = keyof typeof LIB;

const fx = (scene: SceneId, name: SfxName, hitFrame: number, gain: number, animation: string): SfxPlacement => ({
  file: `assets/audio/sound_effects/${name}.wav`,
  scene,
  animation,
  hitFrame,
  peak: LIB[name],
  gain,
});

/** Mid-point of the outgoing transition at the end of a scene. */
const exitHit = (s: SceneId) => sceneDuration(s) - TRANSITION / 2;

export const SFX: Record<SceneId, SfxPlacement[]> = {
  "01": [
    fx("01", "riser_01", 6, 0.3, "Black -> emerald reveal, light streak"),
    fx("01", "impact_basscrack", cue("01", "sotmaydi"), 0.22, "'sotmaydi.' blur-zoom punch"),
    fx("01", "impact_cine_strike", cue("01", "orzularini"), 0.48, "'orzularini' lime highlight impact"),
    fx("01", "whoosh_03", exitHit("01"), 0.4, "Whip-pan into scene 02"),
  ],
  "02": [
    fx("02", "ui_pop", 22, 0.3, "여행 pill pops in"),
    fx("02", "tick_01", cue("02", "sayohat"), 0.3, "'sayohat' highlight"),
    fx("02", "whoosh_07", cue("02", "kimdir", 2) - 4, 0.34, "Zoom-through to university"),
    fx("02", "ui_pop", cue("02", "kimdir", 2) + 14, 0.28, "대학교 pill pops in"),
    fx("02", "tick_02", cue("02", "universitetlarda"), 0.3, "'universitetlar' highlight"),
    fx("02", "whoosh_08", cue("02", "yana") - 4, 0.34, "Zoom-through to career"),
    fx("02", "ui_pop", cue("02", "yana") + 14, 0.28, "직장 pill pops in"),
    fx("02", "tick_03", cue("02", "kompaniyalarda"), 0.3, "'kompaniyalar' highlight"),
    fx("02", "whoosh_digital", exitHit("02"), 0.4, "Zoom-through into scene 03"),
  ],
  "03": [
    fx("03", "impact_boom", cue("03", "til"), 0.42, "'til' punch"),
    fx("03", "texture_warps", cue("03", "koreys") + 30, 0.34, "한국어 syllables fly in"),
    fx("03", "impact_sub_boom", cue("03", "koreys") + 44, 0.4, "한국어 locks in place"),
    fx("03", "shimmer", cue("03", "eshiklarni") - 8, 0.3, "Glass doors start to open"),
    fx("03", "ui_glass", cue("03", "eshiklarni") + 30, 0.34, "Doors fully open, Korea revealed"),
    fx("03", "shimmer", exitHit("03"), 0.32, "Light flash into scene 04"),
  ],
  "04": [
    fx("04", "shimmer", 24, 0.26, "Light sweep across portrait"),
    fx("04", "ui_confirm", cue("04", "ustoziman"), 0.26, "'Koreys tili ustozi' highlight"),
    fx("04", "tick_01", cue("04", "noldan"), 0.3, "Step 1 rises"),
    fx("04", "tick_02", cue("04", "bosqichma-bosqich") + 10, 0.3, "Step 2 rises"),
    fx("04", "tick_03", cue("04", "rivojlanishga"), 0.3, "Step 3 rises"),
    fx("04", "whoosh_cyber_shift", exitHit("04"), 0.34, "Vertical whip into scene 05"),
  ],
  "05": [
    fx("05", "ui_click", cue("05", "video"), 0.32, "Lesson starts playing"),
    fx("05", "ui_zoom", cue("05", "siz") - 24, 0.34, "Camera pushes into laptop"),
    fx("05", "whoosh_digital", cue("05", "siz") - 4, 0.36, "Screen-to-screen match cut"),
    fx("05", "ping", cue("05", "siz") + 14, 0.26, "'JONLI' badge appears"),
    fx("05", "ui_confirm", cue("05", "mustahkamlaysiz"), 0.26, "'mustahkamlaysiz' highlight"),
    fx("05", "whoosh_07", exitHit("05"), 0.34, "Zoom-through into scene 06"),
  ],
  "06": [
    fx("06", "ui_pop", 20, 0.3, "Support badge pops in"),
    fx("06", "tick_01", cue("06", "javobsiz"), 0.28, "'javobsiz qolmaydi' highlight"),
    fx("06", "whoosh_08", cue("06", "uy") - 4, 0.32, "Cut to homework"),
    fx("06", "ui_wrong", cue("06", "xatolaringiz"), 0.32, "Wrong particle struck through"),
    fx("06", "ui_chime", cue("06", "ustida"), 0.4, "Correct particle 를 drops in"),
    fx("06", "whoosh_digital", cue("06", "har") - 4, 0.32, "Cut to progress"),
    fx("06", "ui_number_count", cue("06", "rivojlanishi") + 30, 0.22, "Progress line draws"),
    fx("06", "tick_03", cue("06", "kuzatib"), 0.28, "'kuzatib boramiz' highlight"),
    fx("06", "shimmer", exitHit("06"), 0.32, "Light flash into scene 07"),
  ],
  "07": [
    fx("07", "tick_01", cue("07", "yangi", 1), 0.26, "'Yangi til' blur-zoom"),
    fx("07", "whoosh_07", cue("07", "tanishuvlar"), 0.22, "3D flip: tanishuvlar"),
    fx("07", "whoosh_08", cue("07", "bilimlar"), 0.22, "3D flip: bilimlar"),
    fx("07", "riser_10", cue("07", "imkoniyatlar"), 0.3, "Build into 'imkoniyatlar'"),
    fx("07", "impact_boom", cue("07", "imkoniyatlar"), 0.4, "'imkoniyatlar' lime impact"),
    fx("07", "whoosh_03", exitHit("07"), 0.36, "Zoom-through into CTA"),
  ],
  "08": [
    fx("08", "ui_pop", cue("08", "instagram") - 4, 0.32, "Direct button appears"),
    fx("08", "ui_click", cue("08", "murojaat"), 0.36, "Cursor taps Direct"),
    fx("08", "bell_chime", cue("08", "qiling") + 8, 0.3, "Message sent"),
    fx("08", "whoosh_cyber_shift", cue("08", "yangi") - 6, 0.32, "Portrait reveal"),
    fx("08", "shimmer", cue("08", "bugun") - 8, 0.3, "Final poster reveal"),
    fx("08", "impact_cine_strike", cue("08", "boshlang"), 0.46, "Final hit"),
  ],
};

export const startFrameFor = (p: SfxPlacement) => Math.max(0, p.hitFrame - sec(p.peak));
