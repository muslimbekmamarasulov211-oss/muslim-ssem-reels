import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SceneId, VO, VO_LEAD } from "../audio/AudioTimeline";
import { SfxPlacement, startFrameFor } from "../audio/SoundMapping";

/** Voice-over clip + sound effects of one scene (scene-relative frames). */
export const SceneAudio: React.FC<{ scene: SceneId; sfx: SfxPlacement[] }> = ({ scene, sfx }) => (
  <>
    <Sequence from={VO_LEAD} name={`VO ${scene}`}>
      <Audio src={staticFile(VO[scene].file)} />
    </Sequence>
    {sfx.map((s, i) => (
      <Sequence key={`${s.file}-${i}`} from={startFrameFor(s)} name={`SFX ${s.animation}`}>
        <Audio src={staticFile(s.file)} volume={s.gain} />
      </Sequence>
    ))}
  </>
);
