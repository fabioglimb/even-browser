import { createSplash, TILE_PRESETS } from 'even-toolkit/splash'

/**
 * Browse splash renderer — globe icon + app name (tile 1),
 * "Loading..." text (tile 2). Canvas is 200x200 (vertical 2-tile layout).
 * Reusable: used for both G2 glasses splash and web hero canvas.
 */
export function renderBrowseSplash(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fg = '#e0e0e0'
  const dim = '#808080'
  const cx = w / 2

  // Scale factor (designed for 200x200 canvas, tile 1 = top 100px, tile 2 = bottom 100px)
  const s = Math.min(w / 200, h / 200)

  // ── Tile 1: Globe + Name (top 100px) ──

  const globeMidY = 40 * s

  // Globe outer circle
  const r = 22 * s
  ctx.strokeStyle = fg
  ctx.lineWidth = 2 * s

  ctx.beginPath()
  ctx.arc(cx, globeMidY, r, 0, Math.PI * 2)
  ctx.stroke()

  // Horizontal lines (latitude)
  for (const offset of [-0.4, 0, 0.4]) {
    const y = globeMidY + offset * r
    const halfW = Math.sqrt(r * r - (offset * r) ** 2)
    ctx.beginPath()
    ctx.moveTo(cx - halfW, y)
    ctx.lineTo(cx + halfW, y)
    ctx.stroke()
  }

  // Vertical ellipse (longitude)
  ctx.beginPath()
  ctx.ellipse(cx, globeMidY, r * 0.4, r, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Vertical line (prime meridian)
  ctx.beginPath()
  ctx.moveTo(cx, globeMidY - r)
  ctx.lineTo(cx, globeMidY + r)
  ctx.stroke()

  // App name (below globe, still in tile 1)
  ctx.fillStyle = fg
  ctx.font = `bold ${14 * s}px "Courier New", monospace`
  ctx.textAlign = 'center'
  ctx.fillText('EVENBROWSER', cx, 88 * s)

  // ── Tile 2: Loading text (bottom 100px, y=100..200) ──

  ctx.fillStyle = dim
  ctx.font = `bold ${20 * s}px "Courier New", monospace`
  ctx.fillText('Loading...', cx, 155 * s)

  ctx.textAlign = 'left'
}

/**
 * G2 glasses splash — 2 vertical tiles, top-center on display.
 * Tile 1: Globe + name. Tile 2: "Loading..." text.
 */
export const browseSplash = createSplash({
  tiles: 2,
  tileLayout: 'vertical',
  tilePositions: TILE_PRESETS.topCenterVertical2,
  minTimeMs: 2500,
  maxTimeMs: 5000,
  menuText: '',
  render: renderBrowseSplash,
})
