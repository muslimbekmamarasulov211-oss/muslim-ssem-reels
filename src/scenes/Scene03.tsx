import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, FilmFinish, GradientBackground, LightStreak, Particles } from "../components/Atmosphere";
import { ImagePlate } from "../components/ImagePlate";
import { BlurZoom, HighlightWord, LetterReveal } from "../components/KineticText";
import { Hangul3D } from "../components/Hangul3D";
import { Block } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { ease, HEIGHT, progress, WIDTH } from "../utils/timing";
import { SAFE_CENTER_Y } from "../utils/safeZones";

/** One half of the emerald "door" that swings open to reveal Korea. */
const Door: React.FC<{ side: "left" | "right"; open: number }> = ({ side, open }) => {
  const left = side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: left ? 0 : WIDTH / 2,
        width: WIDTH / 2,
        height: HEIGHT,
        overflow: "hidden",
        transformOrigin: left ? "left center" : "right center",
        transform: `perspective(1700px) rotateY(${(left ? -1 : 1) * open * 102}deg)`,
        filter: `brightness(${1 - open * 0.45})`,
        boxShadow: `inset ${left ? -3 : 3}px 0 0 rgba(182,242,58,${0.55 * Math.sin(Math.PI * Math.min(1, open * 1.5))})`,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: left ? 0 : -WIDTH / 2, width: WIDTH, height: HEIGHT }}>
        <GradientBackground reveal={1} />
      </div>
    </div>
  );
};

/** SCENE 03 — the solution: language, Hangul assembling in 3D, doors open. */
export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("03");
  const c = (w: string, n = 1) => cue("03", w, n);
  const tilAt = c("til");
  const koreysAt = c("koreys");
  const doorAt = c("eshiklarni") - 12;
  const open = ease.inOut(progress(frame, doorAt, 34));
  const tilHit = frame >= tilAt ? Math.exp(-(frame - tilAt) / 18) : 0;
  const lockHit = frame >= koreysAt + 44 ? Math.exp(-(frame - koreysAt - 44) / 20) : 0;
  const contentOut = ease.in(progress(frame, doorAt - 6, 18));

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      {/* Korea behind the doors */}
      <ImagePlate
        src="assets/images/s03_korea.png"
        from={{ scale: 1.28, x: 0, y: 30 }}
        to={{ scale: 1.1, x: 0, y: 0 }}
        start={doorAt}
        dur={D - doorAt}
        originX={470}
        originY={800}
        scrim={0.85}
      />
      {open < 1 ? (
        <>
          <Door side="left" open={open} />
          <Door side="right" open={open} />
        </>
      ) : null}

      <AbsoluteFill style={{ opacity: 1 - contentOut, transform: `scale(${1 + contentOut * 0.25})`, filter: contentOut > 0.02 ? `blur(${contentOut * 14}px)` : undefined }}>
        <Particles seed="s03-far" tier="far" count={40} />
        <Block y={SAFE_CENTER_Y}>
          <LetterReveal text="Imkoniyatlar sari" start={c("imkoniyatlar") - 4} fontSize={84} fontWeight={700} exitAt={tilAt - 10} />
          <LetterReveal text="yoʻl ochadigan" start={c("yoʻl") - 4} fontSize={84} fontWeight={700} exitAt={tilAt - 10} />
          <BlurZoom text="muhim vosita —" start={c("muhim") - 4} fontSize={104} fontWeight={800} exitAt={tilAt - 10} />
        </Block>
        <Block y={SAFE_CENTER_Y - 20}>
          <div style={{ transform: `scale(${1 + tilHit * 0.08})` }}>
            <BlurZoom text="til." start={tilAt - 3} dur={20} fromScale={2.1} fontSize={300} fontWeight={900} exitAt={koreysAt - 6} />
          </div>
        </Block>
        <Block y={SAFE_CENTER_Y - 60} gap={30}>
          <div style={{ transform: `scale(${1 + lockHit * 0.05})` }}>
            <Hangul3D text="한국어" start={koreysAt - 8} fontSize={240} />
          </div>
          <LetterReveal text="koreys tili" start={c("tilini") - 2} fontSize={72} fontWeight={700} />
        </Block>
        <Particles seed="s03-near" tier="near" count={6} />
      </AbsoluteFill>

      {open > 0.25 ? (
        <Block y={1280} gap={10}>
          <LetterReveal text="yangi" start={doorAt + 16} fontSize={96} fontWeight={700} />
          <HighlightWord text="eshiklar" start={doorAt + 22} fontSize={140} fontWeight={800} />
        </Block>
      ) : null}

      <LightStreak p={progress(frame, doorAt - 4, 40)} y={960} intensity={0.9} tilt={90} />
      <Bloom amount={tilHit * 0.6 + lockHit * 0.8} y={44} />
      <FilmFinish />
      <SceneAudio scene="03" sfx={SFX["03"]} />
    </AbsoluteFill>
  );
};
