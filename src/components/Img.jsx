import { CvdHeart } from './OrgLogo'
import { useState } from 'react'
import { Flower } from './Flower'
import { Icon } from './Icon'
export const unsplash = (id, width = 800) => `./img/unsplash/${id}-${width <= 400 ? 400 : 800}.jpg`
export function Img({ name, photo, w, alt: b, accent = 'lime', icon = 'star', radius = 0, style: c, className: d }) {
  const sources = [name && `./img/${name}.jpg`, photo && unsplash(photo, w)].filter(Boolean)
  const [index, setIndex] = useState(0)
  return index >= sources.length ? (
    <div
      role="img"
      aria-label={b}
      className={d}
      style={{
        background: `var(--${accent})`,
        borderRadius: radius,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        ...c,
      }}
    >
      <Flower color="rgba(255,255,255,.55)" size={56}>
        <Icon name={icon} size={24} />
      </Flower>
    </div>
  ) : (
    <img
      key={sources[index]}
      src={sources[index]}
      alt={b}
      onError={() => setIndex(index + 1)}
      className={d}
      loading="lazy"
      style={{
        objectFit: 'cover',
        borderRadius: radius,
        ...c,
      }}
    />
  )
}
export const avatarColors = ['var(--lime)', 'var(--pink)', 'var(--turq)', 'var(--lav)', '#F7C9A9']
export function Avatar({ name, img: a, size = 40, ring }) {
  const [failed, setFailed] = useState(!a)
  const color = avatarColors[(name.charCodeAt(0) + name.length) % avatarColors.length]
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    flex: 'none',
    boxShadow: ring ? '0 0 0 2px var(--white)' : undefined,
  }
  if (a === 'cvd')
    return (
      <span aria-hidden style={{ ...style, background: 'var(--white)', display: 'grid', placeItems: 'center' }}>
        <CvdHeart size={size * 0.8} />
      </span>
    )
  return failed ? (
    <span
      aria-hidden
      style={{
        ...style,
        background: color,
        display: 'grid',
        placeItems: 'center',
        fontWeight: 600,
        fontSize: size * 0.42,
      }}
    >
      {name.slice(0, 1)}
    </span>
  ) : (
    <img
      src={`./img/${a}.jpg`}
      alt=""
      onError={() => setFailed(true)}
      style={{
        ...style,
        objectFit: 'cover',
      }}
    />
  )
}
export const neighbourNames = {
  g1: 'Aya',
  g2: 'Joris',
  g3: 'Kemal',
  g4: 'Marta',
  g5: 'Rosa',
  g6: 'Sven',
  g7: 'Tariq',
  g8: 'Yara',
  g9: 'Lotte',
}
export function AvatarStack({ ids, label }) {
  return (
    <span
      className="row"
      style={{
        gap: 6,
      }}
    >
      <span
        style={{
          display: 'flex',
        }}
      >
        {ids.map((id, b) => (
          <span
            key={id}
            style={{
              marginLeft: b ? -7 : 0,
              display: 'flex',
            }}
          >
            <Avatar name={neighbourNames[id] ?? id} img={id} size={23} ring />
          </span>
        ))}
      </span>
      <span
        style={{
          color: 'var(--ink)',
          fontSize: 12,
          lineHeight: '18px',
        }}
      >
        {label}
      </span>
    </span>
  )
}
