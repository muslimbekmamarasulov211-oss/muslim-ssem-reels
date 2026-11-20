import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { Bloom, FilmFinish, GradientBackground, LightStreak, Particles } from "../components/Atmosphere";
import { Camera3D, Layer } from "../components/Camera3D";
import { BlurZoom, HighlightWord, LetterReveal } from "../components/KineticText";
import { SceneAudio } from "../components/SceneAudio";
import { Block } from "../components/Block";
import { cue as voCue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { ease, FPS, logLerp, progress } from "../utils/timing";
import { SAFE_CENTER_Y } from "../utils/safeZones";

/** SCENE 01 — psychological hook: dark-to-emerald reveal + kinetic type. */
export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const D = sceneDuration("01");
  const c = (w: string) => voCue("01", w);
  const cue = {
    eng: c("eng"),
    biz: c("bizneslar"),
    aslida: c("aslida"),
    sotmaydi: c("sotmaydi"),
    ular: c("ular"),
    insonlarning: c("insonlarning"),
    orzularini: c("orzularini"),
    sotadi: c("sotadi"),
  };

  const reveal = ease.out(progress(frame, 6, 80));
  const impact = frame >= cue.orzularini ? Math.exp(-(frame - cue.orzularini) / 22) : 0;
  const softHit = frame >= cue.sotmaydi ? Math.exp(-(frame - cue.sotmaydi) / 16) : 0;
  const dolly = logLerp(1, 1.09, ease.inOut(progress(frame, 0, D)));
  const camera = {
    zoom: dolly + 0.022 * softHit + 0.045 * impact,
    rotY: noise2D("cam-y", t * 0.18, 0) * 2.2,
    rotX: noise2D("cam-x", 0, t * 0.18) * 1.4,
    rotZ: noise2D("cam-z", t * 0.1, 3) * 0.4,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Camera3D camera={camera}>
        <Layer z={-520}>
          <GradientBackground reveal={reveal} glow={impact} />
        </Layer>
        <Layer z={-280}>
          <Particles seed="s01-far" tier="far" count={46} opacity={reveal} />
        </Layer>
        <Layer z={-120}>
          <Particles seed="s01-mid" tier="mid" count={22} opacity={reveal} />
        </Layer>
        <Layer z={0}>
          <Block y={SAFE_CENTER_Y}>
            <BlurZoom text="Eng muvaffaqiyatli" start={cue.eng} fontSize={92} fontWeight={700} exitAt={cue.aslida - 8} />
            <LetterReveal text="bizneslar" start={cue.biz - 6} fontSize={150} fontWeight={800} exitAt={cue.aslida - 8} />
          </Block>
          <Block y={SAFE_CENTER_Y}>
            <LetterReveal text="aslida mahsulot" start={cue.aslida - 2} fontSize={92} fontWeight={700} exitAt={cue.ular - 10} />
            <BlurZoom text="sotmaydi." start={cue.sotmaydi - 4} dur={22} fontSize={150} fontWeight={800} exitAt={cue.ular - 10} />
          </Block>
          <Block y={SAFE_CENTER_Y} gap={18}>
            <div style={{ display: "flex", gap: 24 }}>
              <LetterReveal text="Ular" start={cue.ular - 2} fontSize={90} fontWeight={700} />
              <LetterReveal text="insonlarning" start={cue.insonlarning - 2} fontSize={90} fontWeight={700} />
            </div>
            <HighlightWord text="orzularini" start={cue.orzularini - 3} fontSize={128} fontWeight={800} />
            <LetterReveal text="sotadi." start={cue.sotadi - 2} fontSize={128} fontWeight={800} />
          </Block>
        </Layer>
        <Layer z={260}>
          <Particles seed="s01-near" tier="near" count={7} opacity={reveal * 0.9} />
        </Layer>
      </Camera3D>

      <LightStreak p={ease.inOut(progress(frame, 2, 50))} y={SAFE_CENTER_Y} intensity={1} />
      <Bloom amount={impact} y={47} />
      <FilmFinish />
      <SceneAudio scene="01" sfx={SFX["01"]} />
    </AbsoluteFill>
  );
};
