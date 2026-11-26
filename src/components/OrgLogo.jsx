// An organisation's logo inside a clover. Falls back to its first letter while no logo file exists.
// Logo files live in public/img/orgs/ and are set with `logo:` in src/data/events.js (organisations).
import { Flower } from './Flower'

export function OrgLogo({ org, size = 44, background = 'var(--white)' }) {
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
