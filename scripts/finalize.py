"""Finish the rendered reel into the two deliverables.

  V1 = voice-over + sound effects            -> out/muslim_ssem_reels_V1_ovoz_sfx.mp4
  V2 = voice-over + sound effects + music    -> out/muslim_ssem_reels_V2_toliq.mp4

Steps
 1. Video is encoded once: H.264 High, yuv420p (TV range, BT.709), 60 FPS CFR.
 2. A voice-only stem is rebuilt from the VO clips at their timeline offsets;
    it keys a sidechain compressor that ducks the music under speech.
 3. Both mixes are loudness-normalised (two-pass) to -14 LUFS, TP -1.5 dBTP,
    AAC 48 kHz, and muxed with the same video stream (-c:v copy).

Usage: python3 -I scripts/finalize.py out/reel_v1_raw.mp4
"""
import json, re, subprocess, sys

SRC = sys.argv[1]
OUT = "out"
FPS = 60
LEAD, TAIL, TRANSITION, FINAL_HOLD = 12, 6, 18, 78  # frames, mirrors src/timeline.ts
MUSIC = "public/assets/audio/background_music/music_elevenlabs_B.mp3"
MUSIC_OFFSET = 0.6  # s: puts the track's lift (9.3 s) on the university cut (~9.8 s)


def run(cmd):
    print("+", " ".join(cmd[:6]), "...")
    subprocess.run(cmd, check=True)


def probe_duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True, check=True).stdout)


def loudnorm(inp, out, extra_filter=""):
    """Two-pass EBU R128 normalisation to -14 LUFS / -1.5 dBTP."""
    pre = f"{extra_filter}," if extra_filter else ""
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", inp, "-af", f"{pre}loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    f = (f"{pre}loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
         f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    run(["ffmpeg", "-v", "error", "-y", "-i", inp, "-af", f, "-ar", "48000", "-c:a", "pcm_s16le", out])


timings = json.load(open("src/audio/vo_timings.json"))
dur_v = probe_duration(SRC)

# 1. video once
video = f"{OUT}/_video_only.mp4"
run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-an",
     "-vf", "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p",
     "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "16", "-r", str(FPS),
     "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", video])

# 2. rendered VO+SFX mix
mix_v1 = f"{OUT}/_mix_v1.wav"
run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vn", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", mix_v1])

# voice-only stem (sidechain key) from clip offsets
start, inputs, filters = 0, [], []
for i, sid in enumerate(sorted(timings)):
    d = LEAD + round(timings[sid]["duration"] * FPS) + TAIL + (FINAL_HOLD if sid == "08" else 0)
    offset_ms = round((start + LEAD) / FPS * 1000)
    inputs += ["-i", "public/" + timings[sid]["file"]]
    filters.append(f"[{i}]aresample=48000,adelay={offset_ms}|{offset_ms}[v{i}]")
    start += d - TRANSITION
n = len(timings)
vo_stem = f"{OUT}/_vo_stem.wav"
run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
     ";".join(filters) + ";" + "".join(f"[v{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,apad,atrim=0:{dur_v:.3f}[o]",
     "-map", "[o]", "-ac", "1", "-c:a", "pcm_s16le", vo_stem])

# 3. music: offset, level, sidechain ducking under the voice, fade out at the end
music_d = f"{OUT}/_music_ducked.wav"
off = round(MUSIC_OFFSET * 1000)
run(["ffmpeg", "-v", "error", "-y", "-i", MUSIC, "-i", vo_stem, "-filter_complex",
     f"[0]aresample=48000,aformat=channel_layouts=stereo,adelay={off}|{off},volume=-4dB,atrim=0:{dur_v:.3f},"
     f"afade=t=out:st={dur_v - 1.4:.3f}:d=1.4[m];"
     f"[1]aresample=48000,aformat=channel_layouts=stereo[k];"
     f"[m][k]sidechaincompress=threshold=0.05:ratio=4:attack=25:release=420:makeup=1[o]",
     "-map", "[o]", "-c:a", "pcm_s16le", music_d])

mix_v2 = f"{OUT}/_mix_v2.wav"
run(["ffmpeg", "-v", "error", "-y", "-i", mix_v1, "-i", music_d, "-filter_complex",
     "[0][1]amix=inputs=2:normalize=0:duration=first[o]", "-map", "[o]", "-c:a", "pcm_s16le", mix_v2])

# 4. loudness + mux
for tag, mix, name in [("V1", mix_v1, "muslim_ssem_reels_V1_ovoz_sfx.mp4"), ("V2", mix_v2, "muslim_ssem_reels_V2_toliq.mp4")]:
    norm = f"{OUT}/_mix_{tag}_norm.wav"
    loudnorm(mix, norm)
    run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", norm, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
         "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", "-shortest", f"{OUT}/{name}"])
    print("done", name)
