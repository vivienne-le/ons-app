import { useId } from 'react'
export const cssVar = (name) => `var(--${name})`
/** `gradient` = [top colour, bottom colour] draws the clover with a soft top-to-bottom gradient. */
export function Flower({ accent = 'lime', size = 40, color, gradient, stroke, children, className: a, style: b }) {
  const gradientId = 'clover' + useId().replace(/:/g, '')
  const fill = gradient ? `url(#${gradientId})` : (color ?? cssVar(accent))
  return (
    <span
      className={a}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-grid',
        placeItems: 'center',
        flex: 'none',
        ...b,
      }}
    >
      <svg
        viewBox="0 0 55 55"
        width={size}
        height={size}
        style={{
          position: 'absolute',
          inset: 0,
        }}
        aria-hidden
      >
        {/* one gradient across the whole clover (userSpaceOnUse), so the petals read as one shape */}
        {gradient && (
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="55">
              <stop offset="0" stopColor={gradient[0]} />
              <stop offset="1" stopColor={gradient[1]} />
            </linearGradient>
          </defs>
        )}
        {stroke ? (
          <path
            // the arcs bulge ~6.6 units past the 0–88 box, so fit -6.6…94.6 inside the 55 box
            transform="translate(4.9 4.9) scale(0.5138)"
            d="M20.47 20.47 A23.76 23.76 0 1 1 67.53 20.47 A23.76 23.76 0 1 1 67.53 67.53 A23.76 23.76 0 1 1 20.47 67.53 A23.76 23.76 0 1 1 20.47 20.47 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        ) : (
        <g fill={fill}>
          <circle cx="27.5" cy="14.85" r="14.85" />
          <circle cx="40.15" cy="27.5" r="14.85" />
          <circle cx="27.5" cy="40.15" r="14.85" />
          <circle cx="14.85" cy="27.5" r="14.85" />
          <rect x="14.85" y="14.85" width="25.3" height="25.3" />
        </g>
        )}
      </svg>
      <span
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          // icons on the strong blue flower are white, like in Figma
          color: !color && accent === 'lav' ? '#fff' : undefined,
        }}
      >
        {children}
      </span>
    </span>
  )
}
