import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, FilmFinish, GradientBackground, LightStreak, Particles } from "../components/Atmosphere";
import { ImagePlate } from "../components/ImagePlate";
import { BlurZoom, HighlightWord, LetterReveal } from "../components/KineticText";
import { HangulPill } from "../components/Glass";
import { Block } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, progress } from "../utils/timing";
import { SAFE_CENTER_Y } from "../utils/safeZones";

/** Words that replace each other with a 3D flip on the X axis. */
const FlipWords: React.FC<{ words: { text: string; at: number; highlight?: boolean }[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: 190, width: 900, perspective: 1200 }}>
      {words.map((w, i) => {
        const next = words[i + 1];
        const inP = ease.out(progress(frame, w.at - 6, 16));
        const outP = next ? ease.in(progress(frame, next.at - 8, 12)) : 0;
        if (inP <= 0 || outP >= 1) return null;
        const rot = (1 - inP) * -90 + outP * 90;
        const blur = (1 - inP) * 12 + outP * 12;
        return (
          <div
            key={w.text}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformOrigin: "50% 50% -60px",
              transform: `rotateX(${rot}deg)`,
              opacity: Math.min(inP * 1.5, 1 - outP),
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
            }}
          >
            {w.highlight ? (
              <HighlightWord text={w.text} start={w.at - 4} fontSize={124} fontWeight={800} />
            ) : (
              <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 124, letterSpacing: "-0.03em", color: colors.white }}>{w.text}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** SCENE 07 — emotional conclusion: a new language = new opportunities. */
export const Scene07: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("07");
  const c = (w: string, n = 1) => cue("07", w, n);
  const part2 = c("bu", 2);
  const impact = frame >= c("imkoniyatlar") ? Math.exp(-(frame - c("imkoniyatlar")) / 24) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      <GradientBackground reveal={1} glow={impact} />
      <AbsoluteFill style={{ opacity: 0.42 }}>
        <ImagePlate src="assets/images/s07a_future_student.png" from={{ scale: 1.25, x: -40, y: 0 }} to={{ scale: 1.12, x: 0, y: 0 }} dur={D} originX={300} originY={850} globalBlur={26} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 55% at 50% 48%, rgba(1,26,20,0.55) 0%, rgba(1,26,20,0.15) 70%)" }} />
      <Particles seed="s07-far" tier="far" count={40} />

      <Block y={SAFE_CENTER_Y} gap={18}>
        <LetterReveal text="Esingizda boʻlsin," start={c("esingizda") - 4} fontSize={64} fontWeight={600} exitAt={part2 - 10} />
        <BlurZoom text="Yangi til —" start={c("yangi", 1) - 4} fontSize={150} fontWeight={800} exitAt={part2 - 10} />
        <LetterReveal text="shunchaki yangi soʻzlar emas." start={c("shunchaki") - 4} fontSize={64} fontWeight={600} stagger={1.4} exitAt={part2 - 10} />
      </Block>

      {frame >= part2 - 6 ? (
        <Block y={SAFE_CENTER_Y} gap={8}>
          <LetterReveal text="Bu yangi" start={part2 - 4} fontSize={96} fontWeight={700} />
          <FlipWords
            words={[
              { text: "tanishuvlar", at: c("tanishuvlar") },
              { text: "bilimlar", at: c("bilimlar") },
              { text: "imkoniyatlar", at: c("imkoniyatlar"), highlight: true },
            ]}
          />
        </Block>
      ) : null}
      {frame >= c("imkoniyatlar") ? (
        <Block y={SAFE_CENTER_Y - 330}>
          <HangulPill ko="새로운 기회" uz="yangi imkoniyatlar" start={c("imkoniyatlar") + 14} />
        </Block>
      ) : null}

      <Particles seed="s07-near" tier="near" count={6} />
      <LightStreak p={progress(frame, c("imkoniyatlar") - 6, 40)} y={SAFE_CENTER_Y + 40} intensity={0.9} />
      <Bloom amount={impact} y={48} />
      <FilmFinish />
      <SceneAudio scene="07" sfx={SFX["07"]} />
    </AbsoluteFill>
  );
};
