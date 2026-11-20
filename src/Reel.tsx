import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { flash, whip, zoomThrough } from "./transitions/presentations";
import { sceneDuration, TRANSITION } from "./timeline";
import { SceneId } from "./audio/AudioTimeline";

const T = linearTiming({ durationInFrames: TRANSITION });

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  "01": Scene01,
  "02": Scene02,
  "03": Scene03,
  "04": Scene04,
  "05": Scene05,
  "06": Scene06,
  "07": Scene07,
  "08": Scene08,
};

/** Master timeline: 8 scenes joined by cinematic transitions (60 FPS). */
export const Reel: React.FC = () => {
  const seq = (id: SceneId) => {
    const C = SCENE_COMPONENTS[id];
    return (
      <TransitionSeries.Sequence durationInFrames={sceneDuration(id)} name={`Scene ${id}`}>
        <C />
      </TransitionSeries.Sequence>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {seq("01")}
        <TransitionSeries.Transition presentation={whip("x")} timing={T} />
        {seq("02")}
        <TransitionSeries.Transition presentation={zoomThrough()} timing={T} />
        {seq("03")}
        <TransitionSeries.Transition presentation={flash()} timing={T} />
        {seq("04")}
        <TransitionSeries.Transition presentation={whip("y")} timing={T} />
        {seq("05")}
        <TransitionSeries.Transition presentation={zoomThrough()} timing={T} />
        {seq("06")}
        <TransitionSeries.Transition presentation={flash()} timing={T} />
        {seq("07")}
        <TransitionSeries.Transition presentation={zoomThrough()} timing={T} />
        {seq("08")}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export { SCENE_COMPONENTS };
