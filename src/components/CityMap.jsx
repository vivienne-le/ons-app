import { useLayoutEffect, useRef, useState } from 'react'
export const MAP_W = 402
export const MAP_H = 874
export const LNG0 = 4.4505
export const LNG1 = 4.4705
export const LAT0 = 51.9205
export const LAT1 = 51.8915
// extra map drawn left and right of the main area, so the map can be dragged sideways
export const EXT = 90
// and a little above and below
export const EXTY = 90
export const toXY = ([lat, lng]) => [((lng - LNG0) / (LNG1 - LNG0)) * MAP_W, ((LAT0 - lat) / (LAT0 - LAT1)) * MAP_H]
export const streets = [
  [-20, 214, 430, 196, 18, 'Nieuwe Binnenweg'],
  [-20, 392, 430, 382, 22, 'Middellandstraat'],
  [-20, 560, 430, 548, 16, 'Claes de Vrieselaan'],
  [-20, 720, 430, 700, 14],
  [96, -20, 104, 900, 14, 'Heemraadssingel'],
  [232, -20, 226, 900, 16, 'Henegouwerlaan'],
  [356, -20, 350, 900, 14, '’s-Gravendijkwal'],
  [-20, 70, 430, 60, 10],
  [-20, 300, 430, 292, 8],
  [-20, 470, 430, 462, 8],
  [-20, 640, 430, 628, 8],
  [164, -20, 160, 900, 8],
  [294, -20, 290, 900, 8],
  // side streets beyond the main area
  [-296, -20, -300, 900, 8],
  [-224, -20, -220, 900, 14, 'Mathenesserlaan'],
  [-158, -20, -160, 900, 8],
  [-90, -20, -86, 900, 14],
  [-24, -20, -28, 900, 8],
  [428, -20, 432, 900, 8],
  [496, -20, 492, 900, 14],
  [562, -20, 566, 900, 8],
  [632, -20, 628, 900, 14, 'Westersingel'],
  [702, -20, 706, 900, 8],
].map(([x1, y1, x2, y2, w, name]) => {
  // stretch the east–west streets across the wider map, keeping their slope
  if (Math.abs(x2 - x1) < Math.abs(y2 - y1)) {
    const x = (y) => x1 + ((x2 - x1) * (y - y1)) / (y2 - y1)
    return [x(-EXTY - 20), -EXTY - 20, x(MAP_H + EXTY + 20), MAP_H + EXTY + 20, w, name]
  }
  const y = (x) => y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)
  return [-EXT - 20, y(-EXT - 20), MAP_W + EXT + 20, y(MAP_W + EXT + 20), w, name]
})
export function Blocks() {
  const xs = [-380, -296, -222, -159, -88, -26, 103, 161, 229, 292, 353, 430, 494, 564, 630, 704, 780]
  const ys = [-110, -20, 62, 205, 295, 387, 466, 554, 634, 710, 900]
  const blocks = []
  for (let d = 0; d < xs.length - 1; d++)
    for (let e = 0; e < ys.length - 1; e++) {
      const f = xs[d] + 10
      const g = ys[e] + 12
      const h = xs[d + 1] - xs[d] - 20
      const i = ys[e + 1] - ys[e] - 24
      h > 10 && i > 10 && blocks.push(<rect key={`${d}-${e}`} x={f} y={g} width={h} height={i} rx={6} fill="#E6E3DC" />)
    }
  return blocks
}
export function CityMap({ children, route, you, onBackgroundClick }) {
  const viewport = useRef(null)
  const [view, setView] = useState({
    s: 1,
    x: 0,
    y: 0,
  })
  useLayoutEffect(() => {
    const e = viewport.current
    if (!e) return
    const f = () => {
      const h = e.clientWidth
      const i = e.clientHeight
      const j = Math.max(h / MAP_W, i / MAP_H)
      setView({
        s: j,
        x: (h - MAP_W * j) / 2,
        y: 0,
      })
    }
    f()
    const g = new ResizeObserver(f)
    g.observe(e)
    return () => g.disconnect()
  }, [])
  const youXY = you && toXY(you)
  // drag (or trackpad-scroll) the map a little in any direction, kept inside the drawn area
  const drag = useRef(null)
  const moved = useRef(false)
  const panTo = (x, y) =>
    setView((v) => {
      const w = viewport.current?.clientWidth ?? MAP_W
      const h = viewport.current?.clientHeight ?? MAP_H
      const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))
      return {
        ...v,
        x: clamp(x, w - (MAP_W + EXT) * v.s, EXT * v.s),
        y: clamp(y, h - (MAP_H + EXTY) * v.s, EXTY * v.s),
      }
    })
  return (
    <div
      ref={viewport}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#EFEDE8',
        touchAction: 'none',
        cursor: drag.current ? 'grabbing' : 'grab',
      }}
      onPointerDown={(ev) => {
        drag.current = { x: ev.clientX, y: ev.clientY, sx: view.x, sy: view.y }
        moved.current = false
      }}
      onPointerMove={(ev) => {
        if (!drag.current) return
        const dx = ev.clientX - drag.current.x
        const dy = ev.clientY - drag.current.y
        if (Math.hypot(dx, dy) > 4) moved.current = true
        if (moved.current) panTo(drag.current.sx + dx, drag.current.sy + dy)
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onWheel={(ev) => panTo(view.x - ev.deltaX, view.y - ev.deltaY)}
      onClickCapture={(ev) => {
        // a drag is not a tap on a pin or the background
        if (moved.current) {
          ev.stopPropagation()
          ev.preventDefault()
          moved.current = false
        }
      }}
      onClick={onBackgroundClick}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: MAP_W,
          height: MAP_H,
          transformOrigin: '0 0',
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
        }}
      >
        <svg
          width={MAP_W + 2 * EXT}
          height={MAP_H + 2 * EXTY}
          viewBox={`${-EXT} ${-EXTY} ${MAP_W + 2 * EXT} ${MAP_H + 2 * EXTY}`}
          aria-hidden
          style={{
            position: 'absolute',
            left: -EXT,
            top: -EXTY,
          }}
        >
          <rect x={-EXT} y={-EXTY} width={MAP_W + 2 * EXT} height={MAP_H + 2 * EXTY} fill="#EFEDE8" />
          {Blocks()}
          <rect x={18} y={322} width={72} height={52} rx={10} fill="#D5E7C6" />
          <path d="M172 566 H284 Q300 566 300 582 V690 H166 V576 Q166 566 172 566Z" fill="#D5E7C6" />
          <path d="M-400 820 C -200 800, -60 790, 80 790 S 220 830, 430 800 S 700 790, 800 815 V1000 H-400Z" fill="#BFE0EA" />
          <path d="M95 -110 L105 980" stroke="#CDE6EE" strokeWidth={6} />
          {streets.map(([e, f, g, h, i], j) => (
            <line key={j} x1={e} y1={f} x2={g} y2={h} stroke="#FFFFFF" strokeWidth={i} strokeLinecap="round" />
          ))}
          {streets
            .filter((street) => street[5])
            .map(([e, f, g, h, , i], j) => {
              const k = Math.abs(g - e) < Math.abs(h - f)
              const l = k ? e + (g - e) * 0.12 : e + (g - e) * 0.62
              const m = k ? f + (h - f) * 0.12 : f + (h - f) * 0.62
              const n = (Math.atan2(h - f, g - e) * 180) / Math.PI
              return (
                <text
                  key={j}
                  x={l}
                  y={m}
                  transform={`rotate(${n} ${l} ${m})`}
                  fontSize={9}
                  fill="#9A978F"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {i}
                </text>
              )
            })}
          <text x={233} y={630} fontSize={10} fill="#7FA06B" fontFamily="Inter, sans-serif" textAnchor="middle">
            Het Park
          </text>
          <text x={300} y={848} fontSize={10} fill="#6EA2B3" fontFamily="Inter, sans-serif">
            Nieuwe Maas
          </text>
          {route && route.length > 1 && (
            <polyline
              points={route.map((e) => toXY(e).join(',')).join(' ')}
              fill="none"
              stroke="#201E1F"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        {youXY && (
          <div
            style={{
              position: 'absolute',
              left: youXY[0],
              top: youXY[1],
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            <div className="you-dot" />
            <div className="you-label">You</div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
export function MapPin({ at, children, z = 1 }) {
  const [x, y] = toXY(at)
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        zIndex: z,
      }}
    >
      {children}
    </div>
  )
}
