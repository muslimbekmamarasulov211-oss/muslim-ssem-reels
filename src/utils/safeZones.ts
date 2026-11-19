// Instagram Reels UI safe area for a 1080x1920 frame.
export const SAFE = {
  top: 220,
  bottom: 420,
  right: 140,
  left: 60,
} as const;

/** Vertical centre of the safe area (where key typography sits). */
export const SAFE_CENTER_Y = SAFE.top + (1920 - SAFE.top - SAFE.bottom) / 2;
/** Horizontal centre of the safe area. */
export const SAFE_CENTER_X = SAFE.left + (1080 - SAFE.left - SAFE.right) / 2;
/** Usable text width inside the safe area. */
export const SAFE_WIDTH = 1080 - SAFE.left - SAFE.right;
