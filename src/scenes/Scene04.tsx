import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmFinish, Particles, rgba } from "../components/Atmosphere";
import { ImagePlate } from "../components/ImagePlate";
import { HighlightWord, LetterReveal } from "../components/KineticText";
import { Block } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, progress } from "../utils/timing";

/** Three glass steps rising one after another ("bosqichma-bosqich"). */
const Steps: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heights = [90, 170, 250];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 22, perspective: 900 }}>
      {heights.map((h, i) => {
        const s = spring({ frame: frame - at[i], fps, config: { damping: 13, stiffness: 140 } });
        const lit = s > 0.6;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: colors.white, opacity: s }}>{i + 1}</span>
            <div
              style={{
                width: 130,
                height: h * s,
                borderRadius: 16,
                transform: "rotateX(14deg)",
                transformOrigin: "bottom",
                background: lit
                  ? `linear-gradient(180deg, ${colors.lime} 0%, ${rgba(colors.emerald500, 0.85)} 100%)`
                  : `linear-gradient(180deg, ${rgba(colors.emerald400, 0.8)} 0%, ${rgba(colors.emerald800, 0.85)} 100%)`,
                border: `2px solid ${rgba(colors.lime, 0.6)}`,
                boxShadow: lit ? `0 0 40px ${rgba(colors.lime, 0.45)}` : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** SCENE 04 — teacher introduction (original portrait, untouched face). */
export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const D = sceneDuration("04");
  const c = (w: string) => cue("04", w);
  const sizniAt = c("sizni");
  const tilt = 1 - ease.out(progress(frame, 0, 50));
  const sweep = progress(frame, 12, 50);

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      <AbsoluteFill style={{ transform: `perspective(1800px) rotateY(${tilt * 12}deg) scale(${1 + tilt * 0.06})` }}>
        <ImagePlate
          src="assets/images/s04_teacher_portrait.png"
          from={{ scale: 1.14, x: 0, y: 40 }}
          to={{ scale: 1.03, x: 0, y: 0 }}
          dur={D}
          originX={470}
          originY={520}
          scrim={1}
        />
        {sweep > 0 && sweep < 1 ? (
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 170 - 50}%, rgba(217,249,157,0.28) ${sweep * 170 - 30}%, rgba(255,255,255,0) ${
                sweep * 170 - 10
              }%)`,
            }}
          />
        ) : null}
      </AbsoluteFill>
      <Particles seed="s04" tier="mid" count={14} opacity={0.6} />

      <Block y={1300} gap={16}>
        <LetterReveal text="Muslimbek Mamarasulov" start={c("muslim") - 6} fontSize={78} fontWeight={800} exitAt={sizniAt - 6} />
        <HighlightWord text="Koreys tili ustozi" start={c("ustoziman") - 2} fontSize={86} fontWeight={800} exitAt={sizniAt - 6} />
      </Block>

      {frame >= sizniAt - 4 ? (
        <>
          <Block y={1020}>
            <Steps at={[c("noldan"), c("bosqichma-bosqich") + 10, c("rivojlanishga")]} />
          </Block>
          <Block y={1330} gap={14}>
            <LetterReveal text="Noldan boshlab" start={c("noldan") - 4} fontSize={86} fontWeight={700} />
            <HighlightWord text="bosqichma-bosqich" start={c("bosqichma-bosqich") - 2} fontSize={96} fontWeight={800} />
          </Block>
        </>
      ) : null}
      <FilmFinish vignette={0.5} />
      <SceneAudio scene="04" sfx={SFX["04"]} />
    </AbsoluteFill>
  );
};
