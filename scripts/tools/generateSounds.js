/**
 * Generates the game's sound effects as small WAV files in assets/sounds.
 *
 * They're synthesized here rather than recorded, so they can be tweaked and
 * regenerated: node scripts/tools/generateSounds.js
 *
 * - tap_0 ... tap_5: soft, short "plops" like Cookie Clicker's clicks, each a little
 *   different so taps don't sound like the same click over and over
 * - shiny: a short sparkling chime
 * - building: a light two-note "bling", like a coin into a till
 * - upgrade: a quick, soft three-note sparkle, a little brighter than a building
 */
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 22050;
const OUT_DIR = path.join(__dirname, "..", "..", "assets", "sounds");

/** Writes 16-bit mono PCM samples (-1 to 1) as a WAV file */
function writeWav(file, samples) {
    const data = Buffer.alloc(samples.length * 2);
    samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
    const header = Buffer.alloc(44);
    header.write("RIFF", 0);
    header.writeUInt32LE(36 + data.length, 4);
    header.write("WAVE", 8);
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16); // fmt chunk size
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(1, 22); // mono
    header.writeUInt32LE(SAMPLE_RATE, 24);
    header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
    header.writeUInt16LE(2, 32); // block align
    header.writeUInt16LE(16, 34); // bits per sample
    header.write("data", 36);
    header.writeUInt32LE(data.length, 40);
    fs.writeFileSync(path.join(OUT_DIR, file), Buffer.concat([header, data]));
}

/** A note number (A4 = 69) to hertz */
const hz = note => 440 * Math.pow(2, (note - 69) / 12);

/**
 * A soft "plop", like a click in Cookie Clicker: a low sine that drops quickly in
 * pitch, with a faint, short tick of filtered noise at the start, all over in ~60 ms
 *
 * @param pitch where the drop starts and ends, in hertz
 * @param decay how fast it fades, in seconds
 */
function plop(pitch, decay, seed) {
    const out = new Float32Array(Math.round(SAMPLE_RATE * 0.09));
    // Repeatable noise, so regenerating gives the same files
    let rand = seed;
    const noise = () => { rand = (rand * 16807) % 2147483647; return rand / 2147483647 * 2 - 1; };
    let phase = 0, lowNoise = 0;
    for (let i = 0; i < out.length; i++) {
        const t = i / SAMPLE_RATE;
        const f = pitch.end + (pitch.start - pitch.end) * Math.exp(-t / 0.01);
        phase += 2 * Math.PI * f / SAMPLE_RATE;
        const attack = Math.min(1, t / 0.002);
        const body = Math.sin(phase) * Math.exp(-t / decay);
        // Noise smoothed down to a soft tick rather than a hiss
        lowNoise += (noise() - lowNoise) * 0.25;
        const tick = lowNoise * Math.exp(-t / 0.004) * 0.5;
        out[i] = (body + tick) * attack * 0.4;
    }
    return out;
}

/**
 * A small bell: a sine with a quiet inharmonic partial, which is what makes it ring
 *
 * @param ring how long it rings, in seconds (how fast it fades)
 */
function bell(note, seconds, volume, ring = 0.22) {
    const f = hz(note);
    const out = new Float32Array(Math.round(SAMPLE_RATE * seconds));
    for (let i = 0; i < out.length; i++) {
        const t = i / SAMPLE_RATE;
        const attack = Math.min(1, t / 0.004);
        const body = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / ring);
        const shimmer = 0.25 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.08);
        out[i] = (body + shimmer) * attack * volume;
    }
    return out;
}

/** Mixes sounds, each starting at its own offset (seconds) */
function mix(parts, seconds) {
    const out = new Float32Array(Math.round(SAMPLE_RATE * seconds));
    parts.forEach(([sound, offset]) => {
        const start = Math.round(offset * SAMPLE_RATE);
        sound.forEach((s, i) => { if (start + i < out.length) out[start + i] += s; });
    });
    return out;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Slightly different plops, so taps don't sound like the same click over and over
const TAPS = [
    { start: 620, end: 240, decay: 0.018 },
    { start: 580, end: 220, decay: 0.020 },
    { start: 660, end: 260, decay: 0.016 },
    { start: 540, end: 210, decay: 0.022 },
    { start: 700, end: 270, decay: 0.017 },
    { start: 600, end: 230, decay: 0.019 },
];
TAPS.forEach(({ start, end, decay }, i) => writeWav(`tap_${i}.wav`, plop({ start, end }, decay, 1234 + i * 97)));

// A rising sparkle: E major arpeggio, then a high glint
writeWav("shiny.wav", mix([
    [bell(88, 0.7, 0.22), 0],
    [bell(92, 0.7, 0.2), 0.06],
    [bell(95, 0.7, 0.18), 0.12],
    [bell(100, 0.8, 0.16), 0.18],
    [bell(107, 0.5, 0.06), 0.26],
], 1.0));

// A coin into a till: two quick high notes, a fourth apart
writeWav("building.wav", mix([
    [bell(84, 0.25, 0.16, 0.05), 0],
    [bell(89, 0.3, 0.18, 0.07), 0.045],
], 0.35));

// A quick rising major arpeggio, shorter and quieter than the shiny chime
writeWav("upgrade.wav", mix([
    [bell(84, 0.35, 0.15, 0.08), 0],
    [bell(88, 0.35, 0.15, 0.08), 0.05],
    [bell(91, 0.45, 0.16, 0.11), 0.1],
], 0.6));

console.log(`Wrote ${TAPS.length} tap sounds, shiny, building and upgrade to ${OUT_DIR}`);
