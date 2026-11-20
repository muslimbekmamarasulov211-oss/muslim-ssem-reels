import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, progress } from "../utils/timing";
import { rgba } from "./Atmosphere";

/**
 * Spring-driven 3D entrance (and optional exit) for any element:
 * rises from depth with a slight tilt and defocus, settles sharp.
 */
export const Reveal: React.FC<{
  start: number;
  exitAt?: number;
  y?: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  blur?: number;
  scale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ start, exitAt, y = 60, z = -180, rotX = 14, rotY = 0, blur = 14, scale = 0.94, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120, mass: 0.9 } });
  const e = exitAt === undefined ? 0 : ease.in(progress(frame, exitAt, 14));
  const k = 1 - s;
  const b = k * blur + e * 16;
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.4) * (1 - e),
        transform: `perspective(1400px) translate3d(0, ${k * y - e * 40}px, ${k * z}px) rotateX(${k * rotX}deg) rotateY(${
          k * rotY
        }deg) scale(${(scale + (1 - scale) * s) * (1 + e * 0.06)})`,
        filter: b > 0.3 ? `blur(${b}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Frosted emerald glass panel with a travelling sheen. */
export const GlassCard: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
  sheenStart?: number;
  strong?: boolean;
}> = ({ children, style, radius = 34, sheenStart, strong = false }) => {
  const frame = useCurrentFrame();
  const sp = sheenStart === undefined ? -1 : progress(frame, sheenStart, 50);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        background: `linear-gradient(150deg, ${rgba(colors.emerald800, strong ? 0.94 : 0.8)} 0%, ${rgba(
          colors.emerald900,
          strong ? 0.97 : 0.88,
        )} 100%)`,
        border: `2px solid ${rgba(colors.lime, 0.38)}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${rgba(colors.lime, 0.14)}, inset 0 1px 0 rgba(255,255,255,0.18)`,
        ...style,
      }}
    >
      {children}
      {sp > 0 && sp < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${sp * 160 - 40}%, rgba(255,255,255,0.22) ${
              sp * 160 - 20
            }%, rgba(255,255,255,0) ${sp * 160}%)`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Hangul tag: Korean word + Uzbek meaning, as a glass pill. */
export const HangulPill: React.FC<{ ko: string; uz: string; start: number; exitAt?: number }> = ({ ko, uz, start, exitAt }) => (
  <Reveal start={start} exitAt={exitAt} y={-40} rotX={-18}>
    <GlassCard radius={60} sheenStart={start + 10} style={{ padding: "18px 40px", display: "flex", alignItems: "center", gap: 26 }}>
      <span style={{ fontFamily: fonts.korean, fontWeight: 900, fontSize: 76, color: colors.white, lineHeight: 1 }}>{ko}</span>
      <span style={{ width: 2, height: 54, background: rgba(colors.lime, 0.6) }} />
      <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 44, color: colors.white, opacity: 0.92 }}>{uz}</span>
    </GlassCard>
  </Reveal>
);

/** Check mark drawn with a stroke animation inside a lime disc. */
export const CheckMark: React.FC<{ start: number; size?: number }> = ({ start, size = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 200 } });
  const draw = ease.out(progress(frame, start + 4, 16));
  const path = "M 14 30 L 25 41 L 45 19";
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, path);
  return (
    <svg width={size} height={size} viewBox="0 0 58 58" style={{ transform: `scale(${pop})`, flex: "none" }}>
      <circle cx="29" cy="29" r="27" fill={colors.lime} />
      <path d={path} fill="none" stroke={colors.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
    </svg>
  );
};

/** A row with an animated check mark and label. */
export const CheckRow: React.FC<{ label: string; start: number; size?: number }> = ({ label, start, size = 46 }) => {
  const frame = useCurrentFrame();
  const p = ease.out(progress(frame, start, 18));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
      <CheckMark start={start} />
      <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: size, color: colors.white, letterSpacing: "-0.01em" }}>{label}</span>
    </div>
  );
};
