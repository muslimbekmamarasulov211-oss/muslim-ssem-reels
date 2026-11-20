import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { ease, FPS, progress } from "../utils/timing";
import { rgba } from "./Atmosphere";
import { CheckMark, GlassCard } from "./Glass";

const PORTRAIT = "assets/images/s04_teacher_portrait.png";

/** The real teacher portrait, cropped around the face (source px). */
export const PortraitCrop: React.FC<{ w: number; h: number; cx?: number; cy?: number; zoom?: number; style?: React.CSSProperties }> = ({
  w,
  h,
  cx = 455,
  cy = 430,
  zoom = 1,
  style,
}) => {
  // Source portrait 941 x 1670. Show a window of the image centred on (cx, cy).
  const scale = (w / 520) * zoom; // ~520 source px across the window at zoom 1
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(PORTRAIT)}
        style={{
          position: "absolute",
          width: 941 * scale,
          height: 1670 * scale,
          left: w / 2 - cx * scale,
          top: h / 2 - cy * scale,
        }}
      />
    </div>
  );
};

const label = (size: number, weight = 600, opacity = 1): React.CSSProperties => ({
  fontFamily: fonts.display,
  fontSize: size,
  fontWeight: weight,
  color: colors.white,
  opacity,
  whiteSpace: "nowrap",
});

/** Video-lesson player UI (covers the laptop screen of s05a). */
export const LessonPlayer: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const prog = 0.18 + 0.5 * ease.inOut(progress(frame, start + 20, 200));
  const lessons = ["1-dars. Salomlashish", "2-dars. Tanishtirish", "3-dars. Oila", "4-dars. Kundalik hayot"];
  const active = Math.min(3, Math.floor(Math.max(0, t - 30) / 70));
  return (
    <div style={{ width: "100%", height: "100%", background: "#07130f", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#0b1d17" }}>
        <span style={label(20, 800)}>@muslim.ssem</span>
        <span style={{ ...label(16, 700), color: colors.ink, background: colors.lime, borderRadius: 30, padding: "5px 14px" }}>Koreys tili darsi</span>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 12, padding: 12 }}>
        <div style={{ width: "34%", display: "flex", flexDirection: "column", gap: 10 }}>
          {lessons.map((l, i) => (
            <div
              key={l}
              style={{
                ...label(14, 600),
                padding: "10px 10px",
                borderRadius: 8,
                background: i === active ? rgba(colors.emerald500, 0.85) : "rgba(255,255,255,0.06)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ▶ {l}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", background: "#0e2a20" }}>
          <PortraitCrop w={250} h={260} cx={455} cy={520} zoom={0.75} style={{ position: "absolute", left: 0, bottom: 0 }} />
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 22,
              width: 170,
              height: 150,
              background: "#f4f6f4",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <span style={{ fontFamily: fonts.korean, fontWeight: 900, fontSize: 30, color: colors.ink }}>안녕하세요!</span>
            <span style={{ width: 120 * ease.out(progress(frame, start + 40, 30)), height: 4, background: colors.emerald500, marginTop: 6, borderRadius: 2 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "6px 16px 14px" }}>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ width: `${prog * 100}%`, height: 6, borderRadius: 3, background: colors.lime, boxShadow: `0 0 12px ${rgba(colors.lime, 0.7)}` }} />
        </div>
      </div>
    </div>
  );
};

/** Live-class UI (covers the laptop screen of s05b). */
export const LiveClass: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / FPS;
  const pulse = 0.55 + 0.45 * Math.sin(t * 6);
  return (
    <div style={{ width: "100%", height: "100%", background: "#07130f", borderRadius: 10, overflow: "hidden", position: "relative", display: "flex", gap: 10, padding: 10, boxSizing: "border-box" }}>
      <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", background: "#0e2a20" }}>
        <PortraitCrop w={420} h={390} cx={470} cy={560} zoom={0.62} />
        <div style={{ position: "absolute", left: 14, top: 14, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.55)", borderRadius: 20, padding: "6px 14px" }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: colors.lime, opacity: pulse, boxShadow: `0 0 10px ${colors.lime}` }} />
          <span style={label(17, 800)}>JONLI</span>
        </div>
        <div style={{ position: "absolute", right: 14, bottom: 16, display: "flex", gap: 4, alignItems: "flex-end" }}>
          {new Array(9).fill(0).map((_, i) => (
            <span key={i} style={{ width: 6, borderRadius: 3, background: colors.lime, height: 8 + 22 * Math.abs(Math.sin(t * 7 + i * 0.9)) }} />
          ))}
        </div>
      </div>
      <div style={{ width: "24%", display: "flex", flexDirection: "column", gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, borderRadius: 8, background: i % 2 ? "#123528" : "#0f2c21", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="16" r="9" fill={rgba(colors.emerald300, 0.8)} />
              <path d="M6 42 C 8 30, 36 30, 38 42 Z" fill={rgba(colors.emerald300, 0.8)} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Chat thread card: student question -> typing -> teacher answer. */
export const ChatCard: React.FC<{ start: number; width?: number }> = ({ start, width = 760 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b1 = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 160 } });
  const typing = frame > start + 20 && frame < start + 55;
  const b2 = spring({ frame: frame - start - 55, fps, config: { damping: 14, stiffness: 160 } });
  const bubble = (s: number, mine: boolean): React.CSSProperties => ({
    alignSelf: mine ? "flex-end" : "flex-start",
    maxWidth: "82%",
    padding: "20px 26px",
    borderRadius: 30,
    background: mine ? colors.lime : "rgba(255,255,255,0.12)",
    color: mine ? colors.ink : colors.white,
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: 38,
    lineHeight: 1.22,
    opacity: s,
    transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`,
    transformOrigin: mine ? "right bottom" : "left bottom",
  });
  return (
    <GlassCard strong sheenStart={start + 70} style={{ width, padding: 30, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={bubble(b1, false)}>Ustoz, bu grammatikani yana tushuntirib bera olasizmi?</div>
      {typing ? (
        <div style={{ alignSelf: "flex-end", display: "flex", gap: 8, padding: "16px 22px", borderRadius: 26, background: rgba(colors.lime, 0.85) }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.ink, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - start) / 6 + i)) }} />
          ))}
        </div>
      ) : null}
      {frame >= start + 55 ? <div style={bubble(b2, true)}>Albatta! Mana, misollar bilan tushuntiraman.</div> : null}
    </GlassCard>
  );
};

/** Homework correction: 한국어을 (wrong) -> 한국어를 (right) with rule. */
export const HomeworkFix: React.FC<{ start: number; strikeAt: number; fixAt: number }> = ({ start, strikeAt, fixAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = ease.out(progress(frame, strikeAt, 14));
  const shake = frame >= strikeAt && frame < strikeAt + 16 ? Math.sin((frame - strikeAt) * 2.2) * 8 * (1 - (frame - strikeAt) / 16) : 0;
  const fix = spring({ frame: frame - fixAt, fps, config: { damping: 12, stiffness: 170 } });
  const ko = (s: number): React.CSSProperties => ({ fontFamily: fonts.korean, fontWeight: 900, fontSize: s, color: colors.white, lineHeight: 1.1 });
  const rows = ["저는 학교에 갑니다.", "내일 만날까요?"];
  return (
    <GlassCard strong sheenStart={start + 8} style={{ width: 900, padding: "34px 40px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ ...label(40, 800), color: colors.ink, background: colors.lime, borderRadius: 16, padding: "6px 18px" }}>Uy vazifasi</span>
      </div>
      {rows.map((r, i) => (
        <div key={r} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={ko(50)}>{`${i + 1}. ${r}`}</span>
          <CheckMark start={start + 10 + i * 8} size={50} />
        </div>
      ))}
      <div style={{ height: 2, background: rgba(colors.lime, 0.3) }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, transform: `translateX(${shake}px)` }}>
        <span style={{ ...label(32, 700), opacity: 0.85, width: 150 }}>Xato:</span>
        <span style={{ ...ko(60), position: "relative" }}>
          한국어
          <span style={{ position: "relative", display: "inline-block" }}>
            을
            <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, borderRadius: 3, background: colors.white, transformOrigin: "left", transform: `scaleX(${strike})` }} />
          </span>{" "}
          공부해요.
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, fix * 1.3) }}>
        <span style={{ ...label(32, 700), opacity: 0.85, width: 150 }}>Toʻgʻrisi:</span>
        <span style={ko(60)}>
          한국어
          <span style={{ display: "inline-block", color: colors.ink, background: colors.lime, borderRadius: 10, padding: "0 6px", transform: `translateY(${(1 - fix) * -40}px) scale(${0.6 + 0.4 * fix})` }}>를</span> 공부해요.
        </span>
      </div>
      <div style={{ ...label(30, 600, 0.9), whiteSpace: "normal", opacity: ease.out(progress(frame, fixAt + 18, 20)) }}>
        Unli bilan tugagan soʻzdan keyin <b style={{ fontFamily: fonts.korean }}>를</b> qoʻshiladi.
      </div>
    </GlassCard>
  );
};

/** Progress chart: stages only, no invented numbers. */
export const ProgressCard: React.FC<{ start: number; drawAt: number; minHeight?: number }> = ({ start, drawAt, minHeight }) => {
  const frame = useCurrentFrame();
  const draw = ease.inOut(progress(frame, drawAt, 70));
  const path = "M 70 250 C 160 240, 200 190, 270 170 S 420 90, 510 50";
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, path);
  const stages = [
    { x: 70, y: 250, l: "1-bosqich", at: 0 },
    { x: 270, y: 170, l: "2-bosqich", at: 0.48 },
    { x: 510, y: 50, l: "3-bosqich", at: 0.98 },
  ];
  return (
    <GlassCard strong sheenStart={start + 8} style={{ width: 640, padding: "30px 34px", minHeight, boxSizing: "border-box" }}>
      <div style={label(44, 800)}>Rivojlanish</div>
      <div style={{ ...label(28, 600, 0.75), marginTop: 6 }}>har bir oʻquvchi uchun</div>
      <svg width="570" height="300" viewBox="0 0 570 300" style={{ marginTop: 18, overflow: "visible" }}>
        {[60, 140, 220].map((y) => (
          <line key={y} x1="20" x2="550" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        ))}
        <path d={path} fill="none" stroke={rgba(colors.lime, 0.25)} strokeWidth="18" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
        <path d={path} fill="none" stroke={colors.lime} strokeWidth="7" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
        {stages.map((s) => {
          const on = draw >= s.at ? 1 : 0;
          return (
            <g key={s.l} opacity={on}>
              <circle cx={s.x} cy={s.y} r="14" fill={colors.lime} />
              <circle cx={s.x} cy={s.y} r="26" fill="none" stroke={rgba(colors.lime, 0.5)} strokeWidth="3" />
              <text x={s.x} y={s.y + 58} textAnchor="middle" fill="#fff" fontFamily={fonts.display} fontWeight={700} fontSize="26">
                {s.l}
              </text>
            </g>
          );
        })}
      </svg>
    </GlassCard>
  );
};

/** Paper-plane (Direct) glyph. */
export const PlaneIcon: React.FC<{ size: number; color?: string }> = ({ size, color = colors.ink }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M44 5 L4 21 L19 27 L25 43 Z" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    <path d="M44 5 L19 27" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/** Pointer cursor that travels in and taps. */
export const TapCursor: React.FC<{ tapAt: number; x: number; y: number }> = ({ tapAt, x, y }) => {
  const frame = useCurrentFrame();
  const inP = ease.out(progress(frame, tapAt - 28, 24));
  const press = frame >= tapAt && frame < tapAt + 8 ? 0.85 : 1;
  const ring = progress(frame, tapAt, 26);
  return (
    <div style={{ position: "absolute", left: x + (1 - inP) * 220, top: y + (1 - inP) * 260, opacity: inP, pointerEvents: "none" }}>
      {ring > 0 && ring < 1 ? (
        <div style={{ position: "absolute", left: -60 * ring, top: -60 * ring, width: 120 * ring, height: 120 * ring, borderRadius: "50%", border: `4px solid ${rgba(colors.lime, 1 - ring)}` }} />
      ) : null}
      <svg width="70" height="80" viewBox="0 0 70 80" style={{ transform: `scale(${press})`, transformOrigin: "10px 6px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}>
        <path d="M8 4 L8 62 L22 50 L32 74 L42 70 L32 46 L52 46 Z" fill="#fff" stroke={colors.ink} strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
