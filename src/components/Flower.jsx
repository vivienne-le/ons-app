export const cssVar = (name) => `var(--${name})`
export function Flower({ accent = 'lime', size = 40, color, children, className: a, style: b }) {
  const fill = color ?? cssVar(accent)
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
        <g fill={fill}>
          <circle cx="27.5" cy="14.85" r="14.85" />
          <circle cx="40.15" cy="27.5" r="14.85" />
          <circle cx="27.5" cy="40.15" r="14.85" />
          <circle cx="14.85" cy="27.5" r="14.85" />
          <rect x="14.85" y="14.85" width="25.3" height="25.3" />
        </g>
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
