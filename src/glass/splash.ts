import { createSplash, TILE_PRESETS } from 'even-toolkit/splash'

/**
 * Browse splash renderer — globe icon + app name.
 * Single tile (200x100), top-center on display.
 * "LOADING..." is shown as text in the menu container below.
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

  ctx.textAlign = 'left'
}

/**
 * G2 glasses splash — 1 image tile (globe + name) top-center,
 * "LOADING..." as centered text in the menu container below.
 */
export const browseSplash = createSplash({
  tiles: 1,
  tileLayout: 'vertical',
  tilePositions: TILE_PRESETS.topCenter1,
  canvasSize: { w: 200, h: 200 },
  minTimeMs: 1500,
  maxTimeMs: 5000,
  menuText: '\n\n' + ' '.repeat(48) + 'LOADING...',
  render: renderBrowseSplash,
})
