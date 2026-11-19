import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors } from "../theme/colors";
import { FPS, HEIGHT, WIDTH } from "../utils/timing";

export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Animated emerald gradient field. Soft radial "blobs" drift on a noise
 * field; `reveal` blooms them out of black, `glow` adds a lime lift.
 */
export const GradientBackground: React.FC<{ reveal: number; glow?: number }> = ({
  reveal,
  glow = 0,
}) => {
  const t = useCurrentFrame() / FPS;
  const blobs = [
    { seed: "a", color: colors.emerald800, r: 1250, x: 0.5, y: 0.92, a: 0.95 },
    { seed: "b", color: colors.emerald700, r: 950, x: 0.22, y: 0.32, a: 0.85 },
    { seed: "c", color: colors.emerald500, r: 720, x: 0.82, y: 0.58, a: 0.5 },
    { seed: "d", color: colors.lime, r: 560, x: 0.6, y: 0.2, a: 0.22 },
    { seed: "e", color: colors.emerald400, r: 480, x: 0.12, y: 0.78, a: 0.3 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundColor: colors.emerald950, opacity: reveal }} />
      {blobs.map((b) => {
        const nx = noise2D(b.seed, t * 0.09, 0) * 0.14;
        const ny = noise2D(b.seed + "y", 0, t * 0.09) * 0.1;
        const r = b.r * (0.55 + 0.45 * reveal);
        const cx = (b.x + nx) * WIDTH;
        const cy = (b.y + ny) * HEIGHT;
        const alpha = b.a * reveal * (b.seed === "d" ? 1 + glow * 1.6 : 1 + glow * 0.3);
        return (
          <div
            key={b.seed}
            style={{
              position: "absolute",
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(b.color, Math.min(1, alpha))} 0%, ${rgba(
                b.color,
                0,
              )} 68%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Floating bokeh dust. `tier` controls size/softness so layers read as depth. */
export const Particles: React.FC<{
  count?: number;
  seed: string;
  tier: "far" | "mid" | "near";
  opacity?: number;
}> = ({ count = 30, seed, tier, opacity = 1 }) => {
  const t = useCurrentFrame() / FPS;
  const cfg = {
    far: { size: [3, 7], speed: 14, alpha: 0.5, soft: 0.45 },
    mid: { size: [6, 14], speed: 26, alpha: 0.45, soft: 0.35 },
    near: { size: [18, 46], speed: 48, alpha: 0.22, soft: 0.05 },
  }[tier];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const r1 = random(`${seed}-x-${i}`);
        const r2 = random(`${seed}-y-${i}`);
        const r3 = random(`${seed}-s-${i}`);
        const size = cfg.size[0] + (cfg.size[1] - cfg.size[0]) * r3;
        const x = r1 * WIDTH + noise2D(`${seed}${i}`, t * 0.12, 0) * 60;
        const yRaw = r2 * (HEIGHT + 200) - t * cfg.speed * (0.6 + r3);
        const y = ((yRaw % (HEIGHT + 200)) + HEIGHT + 200) % (HEIGHT + 200) - 100;
        const twinkle = 0.6 + 0.4 * Math.sin(t * (1.2 + r1 * 2) + r2 * 10);
        const isLime = r1 > 0.72;
        const c = isLime ? colors.limeSoft : colors.emerald300;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(c, cfg.alpha * twinkle)} ${
                cfg.soft * 100
              }%, ${rgba(c, 0)} 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Anamorphic light streak. `p` 0..1 sweeps the bright head across frame. */
export const LightStreak: React.FC<{ p: number; y: number; intensity?: number; tilt?: number }> = ({
  p,
  y,
  intensity = 1,
  tilt = 0,
}) => {
  if (p <= 0 || p >= 1 || intensity <= 0) return null;
  const headX = -300 + p * (WIDTH + 600);
  const fade = Math.sin(Math.PI * p) * intensity;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", transform: `rotate(${tilt}deg)` }}>
      {/* wide atmospheric flare */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: y - 220,
          width: WIDTH + 400,
          height: 440,
          background: `radial-gradient(ellipse 60% 50% at ${(headX / WIDTH) * 100}% 50%, ${rgba(
            colors.lime,
            0.22 * fade,
          )} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {/* halo */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: y - 26,
          width: WIDTH + 400,
          height: 52,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(colors.lime, 0.35 * fade)} ${
            Math.max(0, (headX / (WIDTH + 400)) * 100 - 25)
          }%, ${rgba(colors.limeSoft, 0.7 * fade)} ${(headX / (WIDTH + 400)) * 100 + 8}%, rgba(0,0,0,0) ${
            (headX / (WIDTH + 400)) * 100 + 30
          }%)`,
          filter: "blur(10px)",
        }}
      />
      {/* core line */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: y - 2,
          width: WIDTH + 400,
          height: 4,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(colors.lime, 0.8 * fade)} ${
            Math.max(0, (headX / (WIDTH + 400)) * 100 - 30)
          }%, ${rgba("#FFFFFF", fade)} ${(headX / (WIDTH + 400)) * 100 + 8}%, rgba(0,0,0,0) ${
            (headX / (WIDTH + 400)) * 100 + 24
          }%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Subtle animated film grain + vignette (cheap: rendered at half resolution). */
export const FilmFinish: React.FC<{ grain?: number; vignette?: number }> = ({
  grain = 0.06,
  vignette = 0.55,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <svg
        width={WIDTH / 2}
        height={HEIGHT / 2}
        style={{
          position: "absolute",
          inset: 0,
          width: WIDTH,
          height: HEIGHT,
          opacity: grain,
          mixBlendMode: "overlay",
        }}
      >
        <filter id={`grain-${frame % 12}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame % 12})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Radial bloom flash (used on impacts). */
export const Bloom: React.FC<{ amount: number; color?: string; x?: number; y?: number }> = ({
  amount,
  color = colors.lime,
  x = 50,
  y = 47,
}) => {
  if (amount <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        background: `radial-gradient(ellipse 70% 40% at ${x}% ${y}%, ${rgba(color, 0.45 * amount)} 0%, rgba(0,0,0,0) 70%)`,
      }}
    />
  );
};
