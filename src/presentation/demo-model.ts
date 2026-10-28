export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export const lerp = (from: number, to: number, progress: number) => from + (to - from) * clamp(progress)
const smooth = (progress: number) => { const t = clamp(progress); return t * t * (3 - 2 * t) }

// Snapshot and rollback share the same sampling function so positions and bullets rewind together.
export function firstAttack(frame: number) {
  return {
    playerX: lerp(320, 490, smooth((frame - 28) / 55)),
    bulletX: 320,
    bulletY: lerp(217, 390, (frame - 15) / 90),
  }
}

export function sampleBoss(frame: number) {
  const f = ((frame % 360) + 360) % 360
  if (f < 120) return { ...firstAttack(f), phase: 0, time: f / 30, hit: false }
  if (f < 180) {
    const recordedFrame = lerp(119, 0, (f - 120) / 59)
    return { ...firstAttack(recordedFrame), phase: 1, time: recordedFrame / 30, hit: false }
  }
  const elapsed = f - 180
  return {
    playerX: lerp(320, 490, smooth((elapsed - 28) / 55)),
    bulletX: lerp(320, 490, (elapsed - 15) / 90),
    bulletY: lerp(217, 390, (elapsed - 15) / 90),
    phase: 2,
    time: elapsed / 30,
    hit: elapsed > 101,
  }
}
