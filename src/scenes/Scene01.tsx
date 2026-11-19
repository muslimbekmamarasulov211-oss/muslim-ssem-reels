import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { noise2D } from "@remotion/noise";
import { Bloom, FilmFinish, GradientBackground, LightStreak, Particles } from "../components/Atmosphere";
import { Camera3D, Layer } from "../components/Camera3D";
import { BlurZoom, HighlightWord, LetterReveal } from "../components/KineticText";
import { cue as voCue, VO, VO_LEAD } from "../audio/AudioTimeline";
import { S01_SFX, startFrameFor } from "../audio/SoundMapping";
import { colors } from "../theme/colors";
import { ease, FPS, logLerp, progress, sec } from "../utils/timing";
import { SAFE, SAFE_CENTER_Y, SAFE_WIDTH } from "../utils/safeZones";

export const SCENE01_DURATION = sec(6.6); // 396 frames @ 60 FPS

const WHIP_START = sec(6.15);
const WHIP_LEN = sec(0.45);

/** Centered text block inside the Instagram safe area. */
const Block: React.FC<{ y: number; children: React.ReactNode; gap?: number }> = ({ y, children, gap = 10 }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      width: SAFE_WIDTH,
      top: y,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const Scene01Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

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

  // --- atmosphere ------------------------------------------------------
  const reveal = ease.out(progress(frame, 14, 84));
  const impact = frame >= cue.orzularini ? Math.exp(-(frame - cue.orzularini) / 22) : 0;
  const softHit = frame >= cue.sotmaydi ? Math.exp(-(frame - cue.sotmaydi) / 16) : 0;

  // --- camera ----------------------------------------------------------
  const dolly = logLerp(1, 1.09, ease.inOut(progress(frame, 0, SCENE01_DURATION)));
  const punch = 0.022 * softHit + 0.045 * impact;
  const whip = ease.in(progress(frame, WHIP_START, WHIP_LEN));
  const camera = {
    zoom: dolly + punch,
    x: -whip * 1500,
    rotY: noise2D("cam-y", t * 0.18, 0) * 2.2 - whip * 9,
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
          {/* A: "Eng muvaffaqiyatli / bizneslar" */}
          <Block y={SAFE_CENTER_Y}>
            <BlurZoom text="Eng muvaffaqiyatli" start={cue.eng} fontSize={92} fontWeight={700} exitAt={cue.aslida - 8} />
            <LetterReveal text="bizneslar" start={cue.biz - 6} fontSize={150} fontWeight={800} exitAt={cue.aslida - 8} />
          </Block>

          {/* B: "aslida mahsulot / sotmaydi." */}
          <Block y={SAFE_CENTER_Y}>
            <LetterReveal text="aslida mahsulot" start={cue.aslida - 2} fontSize={92} fontWeight={700} exitAt={cue.ular - 10} />
            <BlurZoom text="sotmaydi." start={cue.sotmaydi - 4} dur={22} fontSize={150} fontWeight={800} exitAt={cue.ular - 10} />
          </Block>

          {/* C: "Ular insonlarning / orzularini / sotadi." */}
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

      <LightStreak p={ease.inOut(progress(frame, 4, 50))} y={SAFE_CENTER_Y} intensity={1} />
      <LightStreak p={progress(frame, WHIP_START - 4, WHIP_LEN + 6)} y={SAFE_CENTER_Y + 120} intensity={0.9} tilt={-4} />
      <Bloom amount={impact} y={47} />
      <FilmFinish />
    </AbsoluteFill>
  );
};

export const Scene01: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const frame = useCurrentFrame();
  const inWhip = frame >= WHIP_START - 2;
  return (
    <AbsoluteFill>
      {inWhip ? (
        <CameraMotionBlur samples={8} shutterAngle={180}>
          <Scene01Visual />
        </CameraMotionBlur>
      ) : (
        <Scene01Visual />
      )}

      {withAudio ? (
        <>
          <Sequence from={VO_LEAD}>
            <Audio src={staticFile(VO["01"].file)} />
          </Sequence>
          {S01_SFX.map((s) => (
            <Sequence key={s.file} from={startFrameFor(s)}>
              <Audio src={staticFile(s.file)} volume={s.gain} />
            </Sequence>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
