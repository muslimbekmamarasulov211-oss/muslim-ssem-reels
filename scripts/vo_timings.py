"""Word-level timings for the voice-over clips.

NeuronAI transcription returns one segment per clip, so word times are
derived here: speech chunks come from silence detection, each pause is
snapped to the nearest phrase boundary (. , ! ? or a dash), and inside a
chunk words are spread in proportion to their syllable count (Uzbek: one
vowel = one syllable). Accuracy is roughly +-80 ms, enough for cueing
animations; key hits can be nudged by hand in AudioTimeline.ts.

Usage: python3 -I scripts/vo_timings.py > src/audio/vo_timings.json
"""
import json, re, subprocess, sys

VO = "public/assets/audio/voiceover/raw"
SCRIPT = {
    "01": ("vo_01_kamola.wav", "Eng muvaffaqiyatli bizneslar aslida mahsulot sotmaydi. Ular insonlarning orzularini sotadi."),
    "02": ("vo_02_kamola.wav", "Kimdir dunyoning eng goʻzal joylariga sayohat qilishni istaydi. Kimdir zamonaviy universitetlarda oʻqishni. Yana kimdir nufuzli kompaniyalarda ishlashni orzu qiladi."),
    "03": ("vo_03_kamola.wav", "Ammo bu imkoniyatlar sari yoʻl ochadigan muhim vositalardan biri — til. Ayniqsa, koreys tilini bilish sizga yangi eshiklarni ochishi mumkin."),
    "04": ("vo_04_kamronbek.wav", "Men Muslim, koreys tili ustoziman. Sizni bu yoʻlda noldan boshlab, bosqichma-bosqich rivojlanishga yoʻnaltiraman."),
    "05": ("vo_05_kamola.wav", "Kursimiz video darslar va jonli mashgʻulotlardan iborat. Siz istalgan vaqtda video darslarni koʻrib, jonli mashgʻulotlarda bilimlaringizni mustahkamlaysiz."),
    "06": ("vo_06_kamola.wav", "Savollaringiz javobsiz qolmaydi. Uy vazifalaringiz tekshiriladi, xatolaringiz ustida ishlaymiz. Har bir oʻquvchining rivojlanishi va natijalarini kuzatib boramiz."),
    "07": ("vo_07_kamola.wav", "Esingizda boʻlsin, yangi til — bu shunchaki yangi soʻzlar emas. Bu yangi tanishuvlar, yangi bilimlar va yangi imkoniyatlar demakdir."),
    "08": ("vo_08_kamola.wav", "Siz ham koreys tilini oʻrganishni istasangiz, kursimizga yozilish uchun Instagram Direct orqali murojaat qiling. Yangi imkoniyatlar sari birinchi qadamingizni bugun boshlang!"),
}

def chunks(path):
    err = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-af", "silencedetect=n=-38dB:d=0.11", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               capture_output=True, text=True).stdout)
    ev = [(m.group(1), float(m.group(2))) for m in re.finditer(r"silence_(start|end): ([0-9.]+)", err)]
    out, cur = [], 0.0
    for k, t in ev:
        if k == "start":
            if t - cur > 0.08:
                out.append([cur, t])
        else:
            cur = t
    if ev and ev[-1][0] == "end" and dur - cur > 0.08:
        out.append([cur, dur])
    # Very short chunks are breaths, clicks or a clipped short word: merge them
    # into the neighbouring chunk instead of treating them as phrases.
    merged = [list(c) for c in out]
    while True:
        short = [i for i, c in enumerate(merged) if c[1] - c[0] < 0.3]
        if not short or len(merged) == 1:
            break
        i = short[0]
        gap_prev = merged[i][0] - merged[i - 1][1] if i > 0 else 1e9
        gap_next = merged[i + 1][0] - merged[i][1] if i < len(merged) - 1 else 1e9
        if gap_prev <= gap_next:  # join the closer neighbour
            merged[i - 1][1] = merged[i][1]
        else:
            merged[i + 1][0] = merged[i][0]
        del merged[i]
    return merged, dur

def syllables(word):
    w = word.lower().replace("ʻ", "").replace("‘", "").replace("'", "")
    return max(1, len(re.findall(r"[aeiouy]", w.replace("y", "")))) + 0.35  # small per-word onset cost

result = {}
for scene, (fname, text) in SCRIPT.items():
    path = f"{VO}/{fname}"
    cs, dur = chunks(path)
    words = [w for w in text.split() if w != "—"]
    weights = [syllables(w) for w in words]
    total_w = sum(weights)
    speech = sum(e - s for s, e in cs)

    # Phrase boundaries (after . , ! ? or before a dash) as syllable positions.
    raw_tokens = text.split()
    bounds, acc_w, k = [], 0.0, 0
    for i, tok in enumerate(raw_tokens):
        if tok == "—":
            bounds.append((acc_w, 1.6))  # dash: weaker pause
            continue
        acc_w += weights[k]
        k += 1
        if re.search(r"[.!?]$", tok):
            bounds.append((acc_w, 1.0))  # sentence end: strong pause
        elif tok.endswith(","):
            bounds.append((acc_w, 1.6))  # comma: weaker pause
    bounds = sorted(set(b for b in bounds if 0 < b[0] < total_w))
    # Each pause between speech chunks snaps to the nearest phrase boundary.
    gaps, acc = [], 0.0
    for s0, e0 in cs[:-1]:
        acc += e0 - s0
        gaps.append(acc / speech * total_w)
    chosen, last = [], 0.0
    for g in gaps:
        cands = [b for b in bounds if b[0] > last]
        b = min(cands, key=lambda x: abs(x[0] - g) * x[1])[0] if cands else g
        chosen.append(b)
        last = b
    # Piecewise map: syllable position -> real time, chunk by chunk.
    knots_w = [0.0] + chosen + [total_w]
    def w_to_t(x):
        for ci in range(len(cs)):
            a, b = knots_w[ci], knots_w[ci + 1]
            if x <= b + 1e-9 or ci == len(cs) - 1:
                f = 0 if b == a else (x - a) / (b - a)
                return cs[ci][0] + max(0, min(1, f)) * (cs[ci][1] - cs[ci][0])
        return cs[-1][1]
    out, acc = [], 0.0
    for w, wt in zip(words, weights):
        start, end_ = w_to_t(acc + 1e-6), w_to_t(acc + wt - 1e-6)
        out.append({"w": w.strip(".,!?"), "start": round(start, 3), "end": round(end_, 3)})
        acc += wt
    result[scene] = {"file": f"assets/audio/voiceover/raw/{fname}", "duration": round(dur, 3),
                     "speech": [[round(s, 3), round(e, 3)] for s, e in cs], "words": out}

json.dump(result, sys.stdout, ensure_ascii=False, indent=1)
