import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ease, HEIGHT, progress, WIDTH } from "../utils/timing";

/** Source images are 941 x ~1672 px; they are shown at 1080 px wide. */
export const SRC_W = 941;
export const K = WIDTH / SRC_W;
export const PLATE_H = Math.round(1672 * K);

/** Source-image pixels -> plate pixels. */
export const ip = (v: number) => v * K;

export type KenBurns = { scale: number; x: number; y: number };

export type BlurRegion = { x: number; y: number; w: number; h: number; blur: number };

/**
 * A photo plate with a Ken Burns camera move, optional depth-of-field blur
 * patches (used to soften backgrounds and hide third-party logos/text) and
 * overlays positioned in source-image pixel coordinates.
 */
export const ImagePlate: React.FC<{
  src: string;
  from: KenBurns;
  to: KenBurns;
  start?: number;
  dur: number;
  originX?: number; // source px
  originY?: number; // source px
  blurRegions?: BlurRegion[];
  globalBlur?: number;
  scrim?: number; // 0..1 darkening for text legibility
  children?: React.ReactNode;
}> = ({ src, from, to, start = 0, dur, originX = SRC_W / 2, originY = 836, blurRegions = [], globalBlur = 0, scrim = 0, children }) => {
  const frame = useCurrentFrame();
  const p = ease.inOut(progress(frame, start, dur));
  const s = from.scale + (to.scale - from.scale) * p;
  const x = from.x + (to.x - from.x) * p;
  const y = from.y + (to.y - from.y) * p;
  const file = staticFile(src);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#03140f" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (HEIGHT - PLATE_H) / 2,
          width: WIDTH,
          height: PLATE_H,
          transformOrigin: `${ip(originX)}px ${ip(originY)}px`,
          transform: `translate(${x}px, ${y}px) scale(${s})`,
          filter: globalBlur > 0.1 ? `blur(${globalBlur}px)` : undefined,
        }}
      >
        <Img src={file} style={{ position: "absolute", inset: 0, width: WIDTH, height: PLATE_H }} />
        {blurRegions.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ip(r.x),
              top: ip(r.y),
              width: ip(r.w),
              height: ip(r.h),
              overflow: "hidden",
              WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)",
            }}
          >
            <Img
              src={file}
              style={{
                position: "absolute",
                left: -ip(r.x),
                top: -ip(r.y),
                width: WIDTH,
                height: PLATE_H,
                filter: `blur(${r.blur}px) saturate(1.05)`,
              }}
            />
          </div>
        ))}
        {children}
      </div>
      {scrim > 0 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(1,20,15,${0.35 * scrim}) 0%, rgba(1,20,15,0) 30%, rgba(1,20,15,0) 52%, rgba(1,20,15,${
              0.85 * scrim
            }) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** Absolutely positioned box in source-image pixels (for overlays on a plate). */
export const At: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  h,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: ip(x), top: ip(y), width: ip(w), height: ip(h), ...style }}>{children}</div>
);
