import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmFinish, Particles } from "../components/Atmosphere";
import { At, ImagePlate } from "../components/ImagePlate";
import { HighlightWord, LetterReveal } from "../components/KineticText";
import { GlassCard, Reveal } from "../components/Glass";
import { LessonPlayer, LiveClass } from "../components/UI";
import { Block } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { ease, progress } from "../utils/timing";

/** SCENE 05 — video lessons and live classes (screen-to-screen match cut). */
export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("05");
  const c = (w: string, n = 1) => cue("05", w, n);
  const cut = c("siz") - 6;

  // Shot A pushes into the laptop screen; shot B pulls back out of the next one.
  const pushIn = ease.in(progress(frame, cut - 22, 24));
  const pullOut = ease.out(progress(frame, cut, 30));
  const blurA = pushIn * 16;
  const blurB = (1 - pullOut) * 14;

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      {frame < cut + 4 ? (
        <AbsoluteFill
          style={{
            transformOrigin: "540px 760px",
            transform: `scale(${1 + pushIn * 1.3})`,
            opacity: 1 - Math.max(0, (frame - cut) / 4),
            filter: blurA > 0.3 ? `blur(${blurA}px)` : undefined,
          }}
        >
          <ImagePlate src="assets/images/s05a_video_lessons.png" from={{ scale: 1.12, x: 0, y: 0 }} to={{ scale: 1.3, x: 0, y: -10 }} dur={cut} originX={455} originY={645} scrim={0.95}>
            <At x={136} y={438} w={642} h={408} style={{ transform: "rotate(-0.6deg)", borderRadius: 8, overflow: "hidden" }}>
              <LessonPlayer start={8} />
            </At>
            <At x={66} y={800} w={200} h={220}>
              <Reveal start={c("video") + 6} y={40}>
                <GlassCard strong sheenStart={c("video") + 16} style={{ width: 230, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
                  <div style={{ width: 110, height: 110, borderRadius: 55, background: colors.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="46" height="46" viewBox="0 0 46 46">
                      <path d="M14 8 L38 23 L14 38 Z" fill={colors.ink} />
                    </svg>
                  </div>
                </GlassCard>
              </Reveal>
            </At>
          </ImagePlate>
        </AbsoluteFill>
      ) : null}

      {frame >= cut ? (
        <AbsoluteFill
          style={{
            transformOrigin: "540px 760px",
            transform: `scale(${1 + (1 - pullOut) * 1.1})`,
            filter: blurB > 0.3 ? `blur(${blurB}px)` : undefined,
          }}
        >
          <ImagePlate src="assets/images/s05b_live_lessons.png" from={{ scale: 1.16, x: 0, y: 0 }} to={{ scale: 1.08, x: 0, y: 10 }} start={cut} dur={D - cut} originX={455} originY={660} scrim={0.95}>
            <At x={116} y={438} w={676} h={444} style={{ borderRadius: 8, overflow: "hidden" }}>
              <LiveClass start={cut} />
            </At>
          </ImagePlate>
        </AbsoluteFill>
      ) : null}

      <Particles seed="s05" tier="mid" count={12} opacity={0.5} />

      {frame < cut + 10 ? (
        <Block y={1370} gap={14}>
          <HighlightWord text="Video darslar" start={c("video") - 3} fontSize={116} fontWeight={800} exitAt={cut - 14} />
          <LetterReveal text="va jonli mashgʻulotlar" start={c("jonli") - 4} fontSize={78} fontWeight={700} exitAt={cut - 14} />
        </Block>
      ) : null}
      {frame >= cut ? (
        <>
          <Block y={1290}>
            <LetterReveal text="Istalgan vaqtda" start={c("istalgan") - 4} fontSize={96} fontWeight={800} exitAt={c("bilimlaringizni") - 12} />
          </Block>
          <Block y={1290} gap={14}>
            <LetterReveal text="bilimlaringizni" start={c("bilimlaringizni") - 4} fontSize={86} fontWeight={700} />
            <HighlightWord text="mustahkamlaysiz" start={c("mustahkamlaysiz") - 3} fontSize={104} fontWeight={800} />
          </Block>
        </>
      ) : null}
      <FilmFinish vignette={0.45} />
      <SceneAudio scene="05" sfx={SFX["05"]} />
    </AbsoluteFill>
  );
};
