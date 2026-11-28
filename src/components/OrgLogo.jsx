// An organisation's logo inside a clover. Falls back to its first letter while no logo file exists.
// Logo files live in public/img/orgs/ and are set with `logo:` in src/data/events.js (organisations).
import { Flower } from './Flower'

// CVD's heart mark, drawn from the Figma vectors so it stays sharp at any size
export function CvdHeart({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="-1.3 -0.5 32 32" aria-hidden style={{ display: 'block', flex: 'none' }}>
      <path d="M14.7 0.98L23.39 9.67L14.7 18.36L6.01 9.67Z" fill="#F6C746" />
      <path d="M14.7 12.41C13.41 10.96 11.48 9.51 8.9 9.51C6.01 9.51 3.75 10.47 3.59 12.08L14.7 23.35L25.81 12.08C25.65 10.47 23.39 9.51 20.5 9.51C17.92 9.51 15.99 10.96 14.7 12.41Z" fill="#65AEBB" />
      <path d="M14.7 22.07L4.07 11.44C2.91 12.68 2.29 14.33 2.34 16.03C2.39 17.73 3.11 19.34 4.35 20.51L14.7 30.86L25.05 20.51C26.28 19.34 27 17.73 27.05 16.03C27.11 14.33 26.48 12.68 25.33 11.44Z" fill="#29615A" stroke="#29615A" strokeWidth={0.805} strokeLinejoin="round" />
    </svg>
  )
}
// White clover with the C♥D wordmark (Sent to CVD screen)
export function CvdBadge({ size = 140 }) {
  const k = size / 140
  const letter = { font: `700 ${35 * k}px/${42 * k}px Inter, sans-serif`, letterSpacing: -1.4 * k, color: '#29615A' }
  return (
    <Flower color="var(--white)" size={size}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 2 * k }} aria-label="CVD">
        <span style={letter}>C</span>
        <svg width={29.4 * k} height={32.2 * k} viewBox="0 0 29.4 32.2" aria-hidden style={{ display: 'block' }}>
          <path d="M14.7 0.98L23.39 9.67L14.7 18.36L6.01 9.67Z" fill="#F6C746" />
          <path d="M14.7 12.41C13.41 10.96 11.48 9.51 8.9 9.51C6.01 9.51 3.75 10.47 3.59 12.08L14.7 23.35L25.81 12.08C25.65 10.47 23.39 9.51 20.5 9.51C17.92 9.51 15.99 10.96 14.7 12.41Z" fill="#65AEBB" />
          <path d="M14.7 22.07L4.07 11.44C2.91 12.68 2.29 14.33 2.34 16.03C2.39 17.73 3.11 19.34 4.35 20.51L14.7 30.86L25.05 20.51C26.28 19.34 27 17.73 27.05 16.03C27.11 14.33 26.48 12.68 25.33 11.44Z" fill="#29615A" stroke="#29615A" strokeWidth={0.805} strokeLinejoin="round" />
        </svg>
        <span style={letter}>D</span>
      </span>
    </Flower>
  )
}
export function OrgLogo({ org, size = 44, background = 'var(--white)' }) {
  if (org.id === 'cvd') return <CvdHeart size={size} />
  if (org.photo)
    return (
      <img
        src={`${import.meta.env.BASE_URL}img/${org.photo}.jpg`}
        alt=""
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', flex: 'none' }}
      />
    )
  const letter = org.name.replace(/^(Het|De) /, '').slice(0, 1)
  return (
    <Flower color={background} size={size}>
      {org.logo ? (
        <img
          src={`${import.meta.env.BASE_URL}img/orgs/${org.logo}`}
          alt=""
          style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <strong style={{ fontSize: size * 0.32 }}>{letter}</strong>
      )}
    </Flower>
  )
}
