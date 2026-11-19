import React from "react";
import { AbsoluteFill } from "remotion";

export const PERSPECTIVE = 1600;

export type CameraState = {
  zoom?: number; // 1 = rest
  x?: number; // px
  y?: number; // px
  rotX?: number; // deg
  rotY?: number; // deg
  rotZ?: number; // deg
};

/**
 * A single virtual camera. Children are 3D layers placed with <Layer z>.
 * Moving the camera (rather than each layer) gives correct parallax for free.
 */
export const Camera3D: React.FC<{ camera: CameraState; children: React.ReactNode }> = ({ camera, children }) => {
  const { zoom = 1, x = 0, y = 0, rotX = 0, rotY = 0, rotZ = 0 } = camera;
  return (
    <AbsoluteFill style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A depth plane. `z` < 0 is further away. The plane is pre-scaled so it
 * still fills the frame at rest, which keeps compositions easy to author.
 */
export const Layer: React.FC<{ z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  z,
  children,
  style,
}) => {
  const compensate = (PERSPECTIVE - z) / PERSPECTIVE;
  return (
    <AbsoluteFill
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${z}px) scale(${compensate})`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
