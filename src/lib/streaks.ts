import { rgbString } from '@/lib/color'
import { mulberry32 } from '@/lib/rng'

export type StreakMode = 'diagonal' | 'radial'

export type StreakParams = {
  mode: StreakMode
  /** Gradient stops, from the dark corner to the bright one. */
  shadow: string
  mid: string
  light: string
  /** Tint of the light streaks. */
  streak: string
  /** Direction of the streaks in degrees (diagonal mode). */
  angle: number
  /** Random angle spread between streaks, in degrees (diagonal mode). */
  fan: number
  count: number
  /** Overall brightness of the streaks. 1 = default. */
  intensity: number
  /** Multiplier on every streak's thickness. 1 = default. */
  thickness: number
  /** Halo around the sharpest streaks. 1 = default. */
  glow: number
  /** Film grain, 0 to 100. */
  grain: number
  seed: number
}

/** Streak sizes are authored for this width and scaled for other sizes. */
export const REFERENCE_WIDTH = 1280

type Tier = { th: number; a: number; blur: number; hair: boolean }

/**
 * Every streak rolls a thickness class, which is what gives the image its
 * depth: many sharp hairlines, some medium lines, a few soft wide beams and
 * the odd huge, barely-there band.
 */
function rollTier(rand: () => number, thickness: number): Tier {
  const r = rand()
  let tier: Tier
  if (r < 0.5) {
    tier = { th: rand() * 1.2 + 0.6, a: 0.55 + rand() * 0.45, blur: 0, hair: true }
  } else if (r < 0.8) {
    tier = { th: rand() * 4 + 2, a: 0.35 + rand() * 0.45, blur: rand() * 1.5, hair: false }
  } else if (r < 0.95) {
    const th = rand() * 14 + 8
    tier = { th, a: 0.15 + rand() * 0.3, blur: th * 0.35, hair: false }
  } else {
    const th = rand() * 50 + 40
    tier = { th, a: 0.08 + rand() * 0.15, blur: th * 0.6, hair: false }
  }
  tier.th *= thickness
  tier.blur *= thickness
  return tier
}

// Grain tile cache: one 512px tile per seed, drawn at native resolution.
const TILE = 512
let tileCache: { seed: number; canvas: HTMLCanvasElement } | null = null

/**
 * Signed noise tile: white specks lighten, black specks darken. Painting it
 * over the image at a given alpha is what produces the "film" grain.
 */
function grainTile(seed: number): HTMLCanvasElement {
  if (tileCache?.seed === seed) return tileCache.canvas
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = TILE
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(TILE, TILE)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() + rand() + rand()) / 1.5 - 1 // roughly bell-shaped, -1..1
    const v = n > 0 ? 255 : 0
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = Math.abs(n) * 255
  }
  ctx.putImageData(img, 0, 0)
  tileCache = { seed, canvas }
  return canvas
}

function drawDiagonal(
  ctx: CanvasRenderingContext2D,
  p: StreakParams,
  rand: () => number,
  W: number,
  H: number,
  k: number,
  setBlur: (px: number) => void,
) {
  const D = Math.hypot(W, H)
  const tint = rgbString(p.streak)

  for (let i = 0; i < p.count; i++) {
    const t = rollTier(rand, p.thickness)
    const a = Math.min(1, t.a * p.intensity)
    const ang = ((p.angle + (rand() - 0.5) * p.fan) * Math.PI) / 180
    const len = D * (rand() * 0.7 + 0.25)
    const y = (rand() - 0.5) * D * 0.8
    const x = (rand() - 0.5) * D * 0.7 - len / 2
    const peak = rand() * 0.6 + 0.2
    const col = rand() < 0.4 ? '255,255,255' : tint
    const th = t.th * k

    ctx.save()
    ctx.translate(W / 2, H / 2)
    ctx.rotate(ang)

    if (t.hair && a > 0.7 && p.glow > 0) {
      setBlur(7)
      const hg = ctx.createLinearGradient(x, 0, x + len, 0)
      hg.addColorStop(0, `rgba(${tint},0)`)
      hg.addColorStop(peak, `rgba(${tint},${a * 0.35 * p.glow})`)
      hg.addColorStop(1, `rgba(${tint},0)`)
      ctx.fillStyle = hg
      ctx.fillRect(x, y - th * 4, len, th * 8)
    }

    setBlur(t.blur)
    const g = ctx.createLinearGradient(x, 0, x + len, 0)
    g.addColorStop(0, `rgba(${col},0)`)
    g.addColorStop(peak, `rgba(${col},${a})`)
    g.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = g
    ctx.fillRect(x, y - th / 2, len, th)
    ctx.restore()
  }
}

function drawRadial(
  ctx: CanvasRenderingContext2D,
  p: StreakParams,
  rand: () => number,
  W: number,
  H: number,
  setBlur: (px: number) => void,
) {
  const cx = W / 2
  const cy = -H * 0.38
  const R = H * 2.4
  const tint = rgbString(p.streak)
  const light = rgbString(p.light)

  // The burst of light the rays come from.
  setBlur(30)
  const cap = (a: number) => Math.min(1, a * p.glow)
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 1.3)
  glow.addColorStop(0, `rgba(235,242,255,${cap(0.95)})`)
  glow.addColorStop(0.32, `rgba(${light},${cap(0.85)})`)
  glow.addColorStop(0.62, `rgba(${light},${cap(0.3)})`)
  glow.addColorStop(1, `rgba(${light},0)`)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  for (let i = 0; i < p.count; i++) {
    const t = rollTier(rand, p.thickness)
    const a = Math.min(1, t.a * p.intensity * 0.8)
    const ang = Math.PI * (0.07 + rand() * 0.86)
    const spread = t.hair
      ? rand() * 0.0008 + 0.0004
      : t.th < 7
        ? rand() * 0.003 + 0.0018
        : t.th < 24
          ? rand() * 0.012 + 0.007
          : rand() * 0.03 + 0.03
    const sp = spread * p.thickness
    const col = rand() < 0.35 ? '255,255,255' : tint

    setBlur(Math.min(t.blur, 14))
    // Each ray fades out at its own distance, so some reach the edges and
    // most die out early.
    const reach = R * (0.3 + rand() * 0.7)
    const g = ctx.createRadialGradient(cx, cy, H * 0.3, cx, cy, reach)
    g.addColorStop(0, `rgba(${col},${a})`)
    g.addColorStop(0.5, `rgba(${col},${a * 0.35})`)
    g.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(ang - sp) * R, cy + Math.sin(ang - sp) * R)
    ctx.lineTo(cx + Math.cos(ang + sp) * R, cy + Math.sin(ang + sp) * R)
    ctx.fill()
  }
}

/**
 * Paints the whole image onto `canvas` at `width` x `height`.
 * Deterministic: the same params always give the same pixels.
 */
export function renderStreaks(
  canvas: HTMLCanvasElement,
  p: StreakParams,
  width: number,
  height: number,
) {
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rand = mulberry32(p.seed)
  const k = width / REFERENCE_WIDTH
  // Safari has no ctx.filter, so streaks come out sharper there.
  const hasFilter = 'filter' in ctx
  const setBlur = (px: number) => {
    ctx.filter = hasFilter && px * k > 0.3 ? `blur(${px * k}px)` : 'none'
  }

  const bg = ctx.createLinearGradient(0, height, width, 0)
  bg.addColorStop(0, p.shadow)
  bg.addColorStop(0.55, p.mid)
  bg.addColorStop(1, p.light)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  // Streaks add up like light, not like paint.
  ctx.globalCompositeOperation = 'screen'
  if (p.mode === 'diagonal') drawDiagonal(ctx, p, rand, width, height, k, setBlur)
  else drawRadial(ctx, p, rand, width, height, setBlur)

  ctx.filter = 'none'
  ctx.globalCompositeOperation = 'source-over'

  if (p.grain > 0) {
    const pattern = ctx.createPattern(grainTile(p.seed), 'repeat')
    if (pattern) {
      ctx.globalAlpha = Math.min(1, p.grain / 100)
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1
    }
  }
}
