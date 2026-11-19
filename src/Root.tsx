import React from "react";
import { Composition } from "remotion";
import "./theme/typography";
import { Scene01, SCENE01_DURATION } from "./scenes/Scene01";
import { FPS, HEIGHT, WIDTH } from "./utils/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Scene 01 — psychological hook (test build, native 60 FPS) */}
      <Composition
        id="S01-Hook"
        component={Scene01}
        durationInFrames={SCENE01_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ withAudio: true }}
      />
    </>
  );
};
