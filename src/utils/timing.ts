import { Easing } from "remotion";

// Native 60 FPS timeline. Every duration in the project is expressed
// through these helpers so nothing is ever designed at 30 FPS.
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Seconds -> frames (60 FPS). */
export const sec = (s: number) => Math.round(s * FPS);

/** Clamp to [0, 1]. */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Normalised progress of `frame` inside [start, start + duration]. */
export const progress = (frame: number, start: number, duration: number) =>
  clamp01((frame - start) / duration);

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-like out: fast start, long settle
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

/** Interpolate a zoom value in log space (perceptually even camera zooms). */
export const logLerp = (a: number, b: number, t: number) =>
  Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
