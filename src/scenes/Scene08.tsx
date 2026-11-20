import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bloom, FilmFinish, GradientBackground, LightStreak, Particles, rgba } from "../components/Atmosphere";
import { ImagePlate } from "../components/ImagePlate";
import { BlurZoom, HighlightWord, LetterReveal } from "../components/KineticText";
import { GlassCard, Reveal } from "../components/Glass";
import { PlaneIcon, PortraitCrop, TapCursor } from "../components/UI";
import { Block, shotStyle } from "../components/Block";
import { SceneAudio } from "../components/SceneAudio";
import { cue } from "../audio/AudioTimeline";
import { SFX } from "../audio/SoundMapping";
import { sceneDuration } from "../timeline";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, FPS, progress } from "../utils/timing";

const BTN_Y = 940;

/** Instagram Direct call-to-action button (generic paper-plane glyph). */
const DirectButton: React.FC<{ start: number; tapAt: number }> = ({ start, tapAt }) => {
  const frame = useCurrentFrame();
  const pressed = frame >= tapAt && frame < tapAt + 10 ? 0.95 : 1;
  const glow = frame >= tapAt ? Math.exp(-(frame - tapAt) / 20) : 0;
  return (
    <Reveal start={start} y={80} rotX={20} z={-260}>
      <div style={{ transform: `scale(${pressed})` }}>
        <GlassCard
          strong
          radius={120}
          sheenStart={start + 14}
          style={{ width: 860, height: 200, display: "flex", alignItems: "center", gap: 34, padding: "0 30px", boxSizing: "border-box", boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 ${60 + 80 * glow}px ${rgba(colors.lime, 0.2 + 0.5 * glow)}` }}
        >
          <div style={{ width: 150, height: 150, borderRadius: 75, background: colors.lime, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <PlaneIcon size={82} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 66, color: colors.white, letterSpacing: "-0.02em" }}>Instagram Direct</span>
            <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 40, color: colors.white, opacity: 0.85 }}>@muslim.ssem</span>
          </div>
        </GlassCard>
      </div>
    </Reveal>
  );
};

/** Outgoing message bubble that lifts off after the tap. */
const SentMessage: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 150 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        alignSelf: "flex-end",
        marginRight: 40,
        padding: "22px 30px",
        borderRadius: "34px 34px 8px 34px",
        background: colors.lime,
        color: colors.ink,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 42,
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + 0.2 * s})`,
        transformOrigin: "right bottom",
        boxShadow: `0 16px 40px rgba(0,0,0,0.35)`,
      }}
    >
      Assalomu alaykum! Kursga yozilmoqchiman.
    </div>
  );
};

/** SCENE 08 — call to action: Instagram Direct, teacher, final reveal. */
export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const D = sceneDuration("08");
  const c = (w: string, n = 1) => cue("08", w, n);
  const cut1 = c("yangi") - 10;
  const cut2 = c("bugun") - 12;
  const hit = frame >= c("boshlang") ? Math.exp(-(frame - c("boshlang")) / 26) : 0;
  const ring = (t * 40) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: "#021a13" }}>
      {/* Phase 1 — Direct CTA */}
      <div style={shotStyle(frame, 0, cut1, true, false)}>
        <GradientBackground reveal={1} />
        <Particles seed="s08a" tier="far" count={40} />
        <Block y={600} gap={14}>
          <BlurZoom text="Siz ham" start={c("siz") - 4} fontSize={130} fontWeight={800} exitAt={c("kursimizga") - 10} />
          <LetterReveal text="koreys tilini" start={c("koreys") - 4} fontSize={84} fontWeight={700} exitAt={c("kursimizga") - 10} />
          <HighlightWord text="oʻrganishni istasangiz" start={c("oʻrganishni") - 3} fontSize={80} fontWeight={800} exitAt={c("kursimizga") - 10} />
        </Block>
        <Block y={600} gap={12}>
          <LetterReveal text="Kursimizga yozilish uchun" start={c("kursimizga") - 4} fontSize={74} fontWeight={700} />
        </Block>
        <Block y={BTN_Y + 230} gap={0} style={{ alignItems: "stretch" }}>
          <SentMessage at={c("qiling") + 6} />
        </Block>
        <Block y={BTN_Y}>
          <DirectButton start={c("instagram") - 8} tapAt={c("murojaat")} />
        </Block>
        <TapCursor tapAt={c("murojaat")} x={300} y={BTN_Y + 10} />
        <Block y={1360}>
          <LetterReveal text="orqali murojaat qiling" start={c("orqali") - 4} fontSize={70} fontWeight={700} />
        </Block>
      </div>

      {/* Phase 2 — teacher + handle */}
      <div style={shotStyle(frame, cut1, cut2, false, false)}>
        <GradientBackground reveal={1} glow={0.4} />
        <Particles seed="s08b" tier="mid" count={18} />
        <Block y={760}>
          <Reveal start={cut1 + 6} y={40} z={-300}>
            <div style={{ position: "relative", width: 470, height: 470 }}>
              <div
                style={{
                  position: "absolute",
                  inset: -14,
                  borderRadius: "50%",
                  background: `conic-gradient(from ${ring}deg, ${colors.lime}, ${colors.emerald500}, ${rgba(colors.lime, 0.1)}, ${colors.lime})`,
                }}
              />
              <PortraitCrop w={470} h={470} cx={455} cy={420} zoom={1.05} style={{ borderRadius: "50%", border: `8px solid ${colors.emerald950}`, boxSizing: "border-box" }} />
            </div>
          </Reveal>
        </Block>
        <Block y={1130} gap={12}>
          <LetterReveal text="@muslim.ssem" start={cut1 + 16} fontSize={96} fontWeight={800} />
          <LetterReveal text="Muslimbek Mamarasulov · Koreys tili ustozi" start={cut1 + 26} fontSize={40} fontWeight={600} stagger={0.9} />
        </Block>
        <Block y={1350} gap={10}>
          <LetterReveal text="Yangi imkoniyatlar sari" start={c("yangi") - 2} fontSize={70} fontWeight={700} />
          <HighlightWord text="birinchi qadam" start={c("birinchi") - 3} fontSize={96} fontWeight={800} />
        </Block>
      </div>

      {/* Phase 3 — final poster reveal */}
      <div style={shotStyle(frame, cut2, D, false, true)}>
        <ImagePlate src="assets/images/s08b_final_direct.png" from={{ scale: 1.12, x: 0, y: 20 }} to={{ scale: 1.02, x: 0, y: 0 }} start={cut2} dur={D - cut2} originX={470} originY={700} />
        <AbsoluteFill style={{ opacity: ease.out(progress(frame, cut2 + 30, 30)) }}>
          <div style={{ position: "absolute", left: 44, top: 238 }}>
            <GlassCard strong radius={50} style={{ padding: "10px 28px" }}>
              <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 38, color: colors.white }}>@muslim.ssem</span>
            </GlassCard>
          </div>
        </AbsoluteFill>
      </div>

      <LightStreak p={progress(frame, cut2 - 4, 44)} y={980} intensity={1} />
      <Bloom amount={hit} y={52} />
      <FilmFinish vignette={0.45} />
      <SceneAudio scene="08" sfx={SFX["08"]} />
    </AbsoluteFill>
  );
};
