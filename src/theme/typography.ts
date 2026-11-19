import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Fonts are bundled locally in public/fonts (SIL Open Font License) so
// renders never depend on the network.
//  - Inter Display: Latin / Uzbek copy (covers oʻ gʻ with U+02BB)
//  - Noto Sans KR: Hangul (educational / cultural elements only)
const FACES: { family: string; file: string; weight: string; format: string }[] = [
  { family: "InterDisplay", file: "fonts/InterDisplay-Medium.otf", weight: "500", format: "opentype" },
  { family: "InterDisplay", file: "fonts/InterDisplay-SemiBold.otf", weight: "600", format: "opentype" },
  { family: "InterDisplay", file: "fonts/InterDisplay-Bold.otf", weight: "700", format: "opentype" },
  { family: "InterDisplay", file: "fonts/InterDisplay-ExtraBold.otf", weight: "800", format: "opentype" },
  { family: "InterDisplay", file: "fonts/InterDisplay-Black.otf", weight: "900", format: "opentype" },
  { family: "NotoSansKR", file: "fonts/NotoSansKR-Bold.woff", weight: "700", format: "woff" },
  { family: "NotoSansKR", file: "fonts/NotoSansKR-Black.woff", weight: "900", format: "woff" },
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading local fonts");
  Promise.all(
    FACES.map((f) => {
      const face = new FontFace(f.family, `url('${staticFile(f.file)}') format('${f.format}')`, {
        weight: f.weight,
        style: "normal",
      });
      return face.load().then((loaded) => {
        document.fonts.add(loaded);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}

export const fonts = {
  display: "InterDisplay, sans-serif",
  korean: "NotoSansKR, InterDisplay, sans-serif",
};

export const type = {
  hero: { fontSize: 150, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.0 },
  title: { fontSize: 112, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04 },
  phrase: { fontSize: 92, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08 },
  body: { fontSize: 60, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15 },
} as const;
