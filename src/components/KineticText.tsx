import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, progress } from "../utils/timing";

type TextStyle = {
  fontSize: number;
  fontWeight?: number;
  letterSpacing?: string;
  lineHeight?: number;
  color?: string;
  fontFamily?: string;
};

type ExitProps = { exitAt?: number; exitDur?: number };

/** Shared exit: blur out, lift and slightly grow (matches reference sample). */
const useExit = ({ exitAt, exitDur = 14 }: ExitProps) => {
  const frame = useCurrentFrame();
  if (exitAt === undefined) return { opacity: 1, blur: 0, y: 0, scale: 1 };
  const e = ease.in(progress(frame, exitAt, exitDur));
  return { opacity: 1 - e, blur: e * 18, y: -e * 34, scale: 1 + e * 0.07 };
};

const baseStyle = (s: TextStyle): React.CSSProperties => ({
  fontFamily: s.fontFamily ?? fonts.display,
  fontSize: s.fontSize,
  fontWeight: s.fontWeight ?? 800,
  letterSpacing: s.letterSpacing ?? "-0.03em",
  lineHeight: s.lineHeight ?? 1.05,
  color: s.color ?? colors.white,
  whiteSpace: "nowrap",
  textShadow: (s.color ?? colors.white) === colors.white ? "0 6px 28px rgba(0,0,0,0.45)" : undefined,
});

/**
 * Letter-by-letter blur reveal: each glyph fades in from blur with a small
 * horizontal travel, staggered left -> right.
 */
export const LetterReveal: React.FC<
  TextStyle &
    ExitProps & {
      text: string;
      start: number;
      stagger?: number;
      dur?: number;
      fromBlur?: number;
      fromX?: number;
      fromY?: number;
      fromScale?: number;
    }
> = ({ text, start, stagger = 2.4, dur = 22, fromBlur = 18, fromX = 26, fromY = 0, fromScale = 1, exitAt, exitDur, ...style }) => {
  const frame = useCurrentFrame();
  const exit = useExit({ exitAt, exitDur });
  const glyphs = Array.from(text);
  return (
    <div
      style={{
        ...baseStyle(style),
        display: "inline-block",
        opacity: exit.opacity,
        filter: exit.blur > 0.05 ? `blur(${exit.blur}px)` : undefined,
        transform: `translateY(${exit.y}px) scale(${exit.scale})`,
      }}
    >
      {glyphs.map((g, i) => {
        const p = ease.out(progress(frame, start + i * stagger, dur));
        const blur = (1 - p) * fromBlur;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
              transform: `translate(${(1 - p) * fromX}px, ${(1 - p) * fromY}px) scale(${
                fromScale + (1 - fromScale) * p
              })`,
            }}
          >
            {g}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Blur-zoom entrance: the whole word arrives large and defocused, settles
 * sharp, then keeps a slow shrinking drift so it never freezes.
 */
export const BlurZoom: React.FC<
  TextStyle &
    ExitProps & {
      text: string;
      start: number;
      dur?: number;
      fromScale?: number;
      fromBlur?: number;
      drift?: number;
    }
> = ({ text, start, dur = 26, fromScale = 1.55, fromBlur = 26, drift = 0.04, exitAt, exitDur, ...style }) => {
  const frame = useCurrentFrame();
  const exit = useExit({ exitAt, exitDur });
  const p = ease.out(progress(frame, start, dur));
  const hold = Math.max(0, frame - start - dur);
  const driftScale = 1 - Math.min(drift, hold * 0.0006);
  const scale = (fromScale + (1 - fromScale) * p) * driftScale * exit.scale;
  const blur = (1 - p) * fromBlur + exit.blur;
  return (
    <div
      style={{
        ...baseStyle(style),
        display: "inline-block",
        opacity: p * exit.opacity,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        transform: `translateY(${exit.y}px) scale(${scale})`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Lime highlight box that wipes in from the left (with directional blur on
 * its leading edge), then the word reveals in black with a spring punch.
 */
export const HighlightWord: React.FC<
  TextStyle &
    ExitProps & {
      text: string;
      start: number;
      boxColor?: string;
      textColor?: string;
      padX?: number;
      padY?: number;
    }
> = ({ text, start, boxColor = colors.lime, textColor = colors.ink, padX = 30, padY = 10, exitAt, exitDur, ...style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = useExit({ exitAt, exitDur });
  const wipe = ease.out(progress(frame, start, 16));
  const punch = spring({ frame: frame - start - 4, fps, config: { damping: 11, stiffness: 190, mass: 0.6 } });
  const scale = (frame < start ? 1.16 : 1.16 - 0.16 * punch) * exit.scale;
  const edgeBlur = (1 - wipe) * 22;
  const id = `hl-${start}`;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity: exit.opacity,
        filter: exit.blur > 0.05 ? `blur(${exit.blur}px)` : undefined,
        transform: `translateY(${exit.y}px) scale(${scale})`,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${edgeBlur} 0`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          background: boxColor,
          borderRadius: 18,
          transformOrigin: "left center",
          transform: `scaleX(${wipe})`,
          filter: edgeBlur > 0.2 ? `url(#${id})` : undefined,
          boxShadow: `0 0 ${60 * wipe}px rgba(182, 242, 58, ${0.35 * wipe})`,
        }}
      />
      <div style={{ position: "relative", padding: `${padY}px ${padX}px` }}>
        <LetterReveal
          text={text}
          start={start + 5}
          stagger={1.8}
          dur={16}
          fromBlur={12}
          fromX={18}
          {...style}
          color={textColor}
        />
      </div>
    </div>
  );
};
