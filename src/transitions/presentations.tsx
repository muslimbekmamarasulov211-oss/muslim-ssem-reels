import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { ease } from "../utils/timing";
import { colors } from "../theme/colors";
import { rgba } from "../components/Atmosphere";

/*
 * Custom scene transitions built with CSS 3D + SVG filters only (no
 * experimental canvas APIs), so they render reliably in headless Chrome.
 * Motion blur is directional: an SVG Gaussian blur stretched along the
 * direction of travel, scaled by the instantaneous velocity.
 */

const DirBlur: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
    </filter>
  </svg>
);

// ---------------------------------------------------------------- whip pan
type WhipProps = { axis: "x" | "y" };
const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const entering = presentationDirection === "entering";
  const e = ease.inOut(p);
  const dist = passedProps.axis === "x" ? 1080 : 1920;
  const offset = entering ? (1 - e) * dist : -e * dist;
  const vel = Math.sin(Math.PI * p); // 0 -> 1 -> 0
  const blur = vel * 46;
  const id = `whip-${presentationDirection}`;
  const tx = passedProps.axis === "x" ? offset : 0;
  const ty = passedProps.axis === "y" ? -offset : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${tx}px, ${ty}px)`,
        filter: blur > 0.4 ? `url(#${id})` : undefined,
      }}
    >
      <DirBlur id={id} x={passedProps.axis === "x" ? blur : 0} y={passedProps.axis === "y" ? blur : 0} />
      {children}
    </AbsoluteFill>
  );
};
export const whip = (axis: "x" | "y" = "x"): TransitionPresentation<WhipProps> => ({ component: Whip, props: { axis } });

// ----------------------------------------------------------- zoom through
type ZoomProps = { dark: boolean };
const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const entering = presentationDirection === "entering";
  if (!entering) {
    const e = ease.in(p);
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${1 + e * 0.75})`,
          opacity: 1 - ease.inOut(Math.min(1, p * 1.25)) * 0.999,
          filter: `blur(${e * 22}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const e = ease.out(p);
  return (
    <AbsoluteFill style={{ opacity: passedProps.dark ? 1 : 1 }}>
      <AbsoluteFill
        style={{
          transform: `scale(${0.8 + 0.2 * e})`,
          opacity: ease.inOut(Math.min(1, p * 1.6)),
          filter: (1 - e) * 16 > 0.3 ? `blur(${(1 - e) * 16}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const zoomThrough = (dark = true): TransitionPresentation<ZoomProps> => ({
  component: ZoomThrough,
  props: { dark },
});

// ------------------------------------------------------------ light flash
type FlashProps = Record<string, never>;
const Flash: React.FC<TransitionPresentationComponentProps<FlashProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const glow = Math.sin(Math.PI * p);
  if (!entering) {
    return (
      <AbsoluteFill style={{ transform: `scale(${1 + ease.in(p) * 0.08})`, filter: `brightness(${1 + glow * 1.4})` }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: ease.inOut(Math.min(1, Math.max(0, (p - 0.35) / 0.4))), transform: `scale(${1.06 - 0.06 * ease.out(p)})` }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: glow,
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255,255,255,0.95) 0%, ${rgba(
            colors.limeSoft,
            0.75,
          )} 45%, ${rgba(colors.emerald500, 0.0)} 100%)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
export const flash = (): TransitionPresentation<FlashProps> => ({ component: Flash, props: {} });
