import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmFinish, Particles } from "../components/Atmosphere";
import { At, ImagePlate } from "../components/ImagePlate";
import { HighlightWord, LetterReveal } from "../components/KineticText";
import { GlassCard, Reveal } from "../components/Glass";
import { HomeworkFix, ProgressCard } from "../components/UI";
import { Block, shotStyle } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

/** Glass badge that replaces the unapproved "24/7" claim in s06a. */
const SupportBadge: React.FC<{ start: number }> = ({ start }) => (
  <Reveal start={start} y={-30} rotX={-16}>
    <GlassCard strong sheenStart={start + 12} radius={40} style={{ width: 380, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <svg width="110" height="96" viewBox="0 0 110 96">
        <path d="M10 10 H100 a8 8 0 0 1 8 8 V62 a8 8 0 0 1 -8 8 H44 L22 90 V70 H10 a8 8 0 0 1 -8 -8 V18 a8 8 0 0 1 8 -8 Z" fill={colors.lime} />
        <circle cx="34" cy="40" r="7" fill={colors.ink} />
        <circle cx="55" cy="40" r="7" fill={colors.ink} />
        <circle cx="76" cy="40" r="7" fill={colors.ink} />
      </svg>
      <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 44, color: colors.white, lineHeight: 1.05, textAlign: "center" }}>
        Savollarga
        <br />
        javob
      </span>
    </GlassCard>
  </Reveal>
);

/** SCENE 06 — student support: questions, homework correction, progress. */
export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("06");
  const c = (w: string, n = 1) => cue("06", w, n);
  const cut1 = c("uy") - 8;
  const cut2 = c("har") - 8;

  const shots = [
    {
      s: 0,
      e: cut1,
      el: (
        <ImagePlate src="assets/images/s06a_teacher_support.png" from={{ scale: 1.08, x: 0, y: 0 }} to={{ scale: 1.17, x: -10, y: 10 }} dur={cut1 + 16} originX={500} originY={600} scrim={0.95}>
          <At x={545} y={110} w={340} h={290}>
            <SupportBadge start={14} />
          </At>
        </ImagePlate>
      ),
    },
    {
      s: cut1,
      e: cut2,
      el: (
        <ImagePlate src="assets/images/s06b_homework.png" from={{ scale: 1.04, x: 0, y: 30 }} to={{ scale: 1.1, x: 0, y: 0 }} start={cut1} dur={cut2 - cut1 + 16} originX={470} originY={500} scrim={0.6}>
          <At x={18} y={186} w={906} h={560}>
            <Reveal start={cut1 + 10} y={50}>
              <div style={{ transform: "scale(1.12)", transformOrigin: "top left" }}>
                <HomeworkFix start={cut1 + 10} strikeAt={c("xatolaringiz")} fixAt={c("ustida")} />
              </div>
            </Reveal>
          </At>
        </ImagePlate>
      ),
    },
    {
      s: cut2,
      e: D,
      el: (
        <ImagePlate src="assets/images/s06c_student_progress.png" from={{ scale: 1.06, x: 0, y: 20 }} to={{ scale: 1.14, x: 10, y: 0 }} start={cut2} dur={D - cut2} originX={420} originY={520} scrim={0.95}>
          <At x={14} y={196} w={470} h={500}>
            <Reveal start={cut2 + 10} y={50}>
              <div style={{ transform: "scale(0.84)", transformOrigin: "top left" }}>
                <ProgressCard start={cut2 + 10} drawAt={c("rivojlanishi")} minHeight={690} />
              </div>
            </Reveal>
          </At>
        </ImagePlate>
      ),
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      {shots.map((sh, i) => (
        <div key={i} style={shotStyle(frame, sh.s, sh.e, i === 0, i === shots.length - 1)}>
          {sh.el}
        </div>
      ))}
      <Particles seed="s06" tier="mid" count={12} opacity={0.5} />
      {frame < cut1 + 18 ? (
        <Block y={1290} gap={14}>
          <LetterReveal text="Savollaringiz" start={c("savollaringiz") - 2} fontSize={92} fontWeight={700} exitAt={cut1 - 8} />
          <HighlightWord text="javobsiz qolmaydi" start={c("javobsiz") - 3} fontSize={100} fontWeight={800} exitAt={cut1 - 8} />
        </Block>
      ) : null}
      {frame >= cut2 - 2 ? (
        <Block y={1150} gap={14}>
          <LetterReveal text="Natijalarni" start={c("natijalarini") - 4} fontSize={92} fontWeight={700} />
          <HighlightWord text="kuzatib boramiz" start={c("kuzatib") - 3} fontSize={104} fontWeight={800} />
        </Block>
      ) : null}
      <FilmFinish vignette={0.45} />
      <SceneAudio scene="06" sfx={SFX["06"]} />
    </AbsoluteFill>
  );
};
