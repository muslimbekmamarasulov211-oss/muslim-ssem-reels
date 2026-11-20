import React from "react";
import { SAFE, SAFE_WIDTH } from "../utils/safeZones";

/** Centered text block inside the Instagram safe area, anchored at `y`. */
export const Block: React.FC<{ y: number; children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  y,
  children,
  gap = 10,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      width: SAFE_WIDTH,
      top: y,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Shot visibility helper for in-scene cuts: zoom-through in/out. */
export const shotStyle = (frame: number, start: number, end: number, isFirst: boolean, isLast: boolean): React.CSSProperties => {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const inP = isFirst ? 1 : clamp((frame - start) / 16);
  const outP = isLast ? 0 : clamp((frame - (end - 2)) / 16);
  const eIn = 1 - Math.pow(1 - inP, 3);
  const eOut = outP * outP * outP;
  if (frame < start || frame > end + 16) return { display: "none" };
  const blur = (1 - eIn) * 14 + eOut * 18;
  return {
    position: "absolute",
    inset: 0,
    opacity: eIn * (1 - eOut),
    transform: `scale(${(isFirst ? 1 : 0.9 + 0.1 * eIn) * (1 + 0.38 * eOut)})`,
    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
  };
};
