// Prints docs/AUDIO_MAP.md from the live sound mapping (single source of truth).
import { SFX, startFrameFor } from "../src/audio/SoundMapping";
import { VO } from "../src/audio/AudioTimeline";
import { SCENES, sceneDuration, sceneStart, TOTAL_FRAMES } from "../src/timeline";

const s = (f: number) => (f / 60).toFixed(2);
let md = `# Audio map — @muslim.ssem Korean Reels\n\nTimeline: ${TOTAL_FRAMES} frames @ 60 FPS = ${s(TOTAL_FRAMES)} s. Times are absolute (master timeline).\n\n`;
md += `## Voice-over (NeuronAI · Kamronbek · speed 1.12)\n\n| Scene | File | Start | Duration |\n|---|---|---|---|\n`;
for (const id of SCENES) md += `| ${id} | \`${VO[id].file.split("/").pop()}\` | ${s(sceneStart(id) + 12)} s | ${VO[id].duration.toFixed(2)} s |\n`;
md += `\n## Sound effects (user-supplied packs only)\n\n| Audio file | Scene | Animation | Start | Hit | Duration (clip) | Gain |\n|---|---|---|---|---|---|---|\n`;
for (const id of SCENES) {
  for (const p of SFX[id]) {
    const abs = sceneStart(id) + startFrameFor(p);
    md += `| \`${p.file.split("/").pop()}\` | ${id} | ${p.animation} | ${s(abs)} s | ${s(sceneStart(id) + p.hitFrame)} s | — | ${(20 * Math.log10(p.gain)).toFixed(1)} dB |\n`;
  }
}
md += `\n## Music (V2 only)\n\nElevenLabs Music v2.5, instrumental, variant B (\`music_elevenlabs_B.mp3\`), starts at 0.60 s, −4 dB, sidechain-ducked under the voice (threshold 0.05, ratio 4, attack 25 ms, release 420 ms), 1.4 s fade-out. Final mixes: −14 LUFS integrated, −1.5 dBTP.\n\nScene lengths: ${SCENES.map((id) => `${id}=${sceneDuration(id)}f`).join(", ")}.\n`;
console.log(md);
