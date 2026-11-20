import React from "react";
import { Composition } from "remotion";
import "./theme/typography";
import { Reel, SCENE_COMPONENTS } from "./Reel";
import { SCENES, sceneDuration, TOTAL_FRAMES } from "./timeline";
import { FPS, HEIGHT, WIDTH } from "./utils/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full advert — native 60 FPS, voice-over + sound effects */}
      <Composition id="Reel" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      {/* Individual scenes for review renders */}
      {SCENES.map((id) => (
        <Composition key={id} id={`S${id}`} component={SCENE_COMPONENTS[id]} durationInFrames={sceneDuration(id)} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </>
  );
};
