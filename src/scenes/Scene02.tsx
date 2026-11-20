import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmFinish, Particles } from "../components/Atmosphere";
import { ImagePlate } from "../components/ImagePlate";
import { HighlightWord, LetterReveal } from "../components/KineticText";
import { HangulPill } from "../components/Glass";
import { Block, shotStyle } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";

const TEXT_Y = 1270;
const PILL_Y = 330;

/** SCENE 02 — human dreams: travel, university, career (3 cinematic shots). */
export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("02");
  const c = (w: string, n = 1) => cue("02", w, n);
  const cut1 = c("kimdir", 2) - 8;
  const cut2 = c("yana") - 8;

  const shots = [
    {
      s: 0,
      e: cut1,
      plate: (
        <ImagePlate src="assets/images/s02a_travel.png" from={{ scale: 1.06, x: 20, y: 10 }} to={{ scale: 1.2, x: -50, y: -20 }} dur={cut1 + 16} originX={560} originY={760} scrim={0.9} />
      ),
      pill: <HangulPill ko="여행" uz="sayohat" start={14} exitAt={cut1 - 10} />,
      text: (
        <>
          <LetterReveal text="Goʻzal joylarga" start={c("goʻzal") - 4} fontSize={92} fontWeight={700} exitAt={cut1 - 8} />
          <HighlightWord text="sayohat" start={c("sayohat") - 3} fontSize={132} fontWeight={800} exitAt={cut1 - 8} />
        </>
      ),
    },
    {
      s: cut1,
      e: cut2,
      plate: (
        <ImagePlate
          src="assets/images/s02b_university.png"
          from={{ scale: 1.16, x: 0, y: 50 }}
          to={{ scale: 1.22, x: -10, y: -40 }}
          start={cut1}
          dur={cut2 - cut1 + 16}
          originX={500}
          originY={700}
          scrim={0.9}
          blurRegions={[{ x: 560, y: 450, w: 450, h: 350, blur: 20 }]}
        />
      ),
      pill: <HangulPill ko="대학교" uz="universitet" start={cut1 + 16} exitAt={cut2 - 10} />,
      text: (
        <>
          <LetterReveal text="Zamonaviy" start={c("zamonaviy") - 4} fontSize={92} fontWeight={700} exitAt={cut2 - 8} />
          <HighlightWord text="universitetlar" start={c("universitetlarda") - 3} fontSize={112} fontWeight={800} exitAt={cut2 - 8} />
        </>
      ),
    },
    {
      s: cut2,
      e: D,
      plate: (
        <ImagePlate
          src="assets/images/s02c_career.png"
          from={{ scale: 1.08, x: 30, y: 0 }}
          to={{ scale: 1.2, x: -30, y: -10 }}
          start={cut2}
          dur={D - cut2}
          originX={420}
          originY={700}
          scrim={0.9}
          blurRegions={[
            { x: 420, y: 90, w: 720, h: 820, blur: 22 },
            { x: 680, y: 220, w: 300, h: 200, blur: 18 },
          ]}
        />
      ),
      pill: <HangulPill ko="직장" uz="ish joyi" start={cut2 + 16} />,
      text: (
        <>
          <LetterReveal text="Nufuzli" start={c("nufuzli") - 4} fontSize={92} fontWeight={700} />
          <HighlightWord text="kompaniyalar" start={c("kompaniyalarda") - 3} fontSize={120} fontWeight={800} />
        </>
      ),
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      {shots.map((sh, i) => (
        <div key={i} style={shotStyle(frame, sh.s, sh.e, i === 0, i === shots.length - 1)}>
          {sh.plate}
        </div>
      ))}
      <Particles seed="s02-near" tier="mid" count={16} opacity={0.7} />
      {shots.map((sh, i) =>
        frame >= sh.s - 2 && frame <= sh.e + 18 ? (
          <React.Fragment key={`t${i}`}>
            <Block y={PILL_Y}>{sh.pill}</Block>
            <Block y={TEXT_Y} gap={14}>
              {sh.text}
            </Block>
          </React.Fragment>
        ) : null,
      )}
      <FilmFinish vignette={0.45} />
      <SceneAudio scene="02" sfx={SFX["02"]} />
    </AbsoluteFill>
  );
};
