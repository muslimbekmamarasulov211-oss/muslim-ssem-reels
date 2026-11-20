import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { rgba } from "./Atmosphere";

/**
 * Extruded 3D Hangul word. Each syllable flies in from its own point in
 * 3D space, spins into place and locks with a lime rim light. Depth comes
 * from stacked translateZ copies (real CSS 3D, no WebGL). A velocity-based
 * blur gives the fast flight a motion-blurred streak.
 */
export const Hangul3D: React.FC<{ text: string; start: number; fontSize?: number; stagger?: number; seed?: string }> = ({
  text,
  start,
  fontSize = 250,
  stagger = 7,
  seed = "hg",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glyphs = Array.from(text);
  const DEPTH = 14;
  const t = (frame - start) / fps;
  return (
    <div style={{ perspective: 1500, display: "flex", justifyContent: "center", gap: fontSize * 0.04 }}>
      {glyphs.map((g, i) => {
        const conf = { damping: 15, stiffness: 95, mass: 1 };
        const s = spring({ frame: frame - start - i * stagger, fps, config: conf });
        const sPrev = spring({ frame: frame - 1 - start - i * stagger, fps, config: conf });
        const r = (k: string) => random(`${seed}-${k}-${i}`) * 2 - 1;
        const fx = r("x") * 700;
        const fy = r("y") * 520 - 200;
        const fz = -1600 - random(`${seed}-z-${i}`) * 900;
        const k = 1 - s;
        const vel = Math.abs(s - sPrev); // per-frame travel (0..~0.1)
        const blur = Math.min(18, vel * 260);
        const idle = s > 0.98 ? Math.sin(t * 1.4 + i) * 4 : 0;
        const rimAlpha = Math.max(0, (s - 0.85) / 0.15);
        return (
          <div
            key={i}
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              opacity: Math.min(1, s * 2),
              transform: `translate3d(${k * fx}px, ${k * fy}px, ${k * fz}px) rotateY(${k * r("ry") * 120 + idle}deg) rotateX(${
                k * r("rx") * 70 + idle * 0.4
              }deg) rotateZ(${k * r("rz") * 40}deg)`,
              filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
            }}
          >
            {new Array(DEPTH).fill(0).map((_, d) => (
              <span
                key={d}
                style={{
                  position: d === 0 ? "relative" : "absolute",
                  left: 0,
                  top: 0,
                  display: "block",
                  fontFamily: fonts.korean,
                  fontWeight: 900,
                  fontSize,
                  lineHeight: 1.1,
                  color: d === 0 ? colors.white : d < 3 ? colors.emerald300 : d < DEPTH - 1 ? colors.emerald700 : colors.emerald950,
                  transform: `translateZ(${-d * 3.2}px)`,
                  textShadow:
                    d === 0
                      ? `0 0 ${30 * rimAlpha}px ${rgba(colors.lime, 0.55 * rimAlpha)}, 0 0 2px ${rgba(colors.limeSoft, 0.8 * rimAlpha)}`
                      : undefined,
                }}
              >
                {g}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
