import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Avatar } from '../components/Img'
import { BackButton, Screen, Sheet } from '../components/UI'
import { organisations } from '../data/events'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const petalColors = ['var(--lime)', 'var(--pink)', 'var(--turq)', 'var(--lav)', 'var(--orange)']
export const RING_RADIUS = {
  friends: 98,
  seeds: 140,
  following: 178,
}
export function BloomFlower({ p: person, size, i: index }) {
  const color = petalColors[index % petalColors.length]
  return (
    <span
      className="bloom"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg viewBox="0 0 55 55" width={size} height={size} aria-hidden>
        {[
          [27.5, 14.85],
          [40.15, 27.5],
          [27.5, 40.15],
          [14.85, 27.5],
        ].map(([c, d], e) => (
          <circle
            key={e}
            className="petal"
            cx={c}
            cy={d}
            r="14.85"
            fill={color}
            style={{
              animationDelay: `${index * 0.12 + e * 0.09}s`,
            }}
          />
        ))}
        <rect
          className="petal"
          x="14.85"
          y="14.85"
          width="25.3"
          height="25.3"
          fill={color}
          style={{
            animationDelay: `${index * 0.12}s`,
          }}
        />
      </svg>
      <span
        className="bloom-face"
        style={{
          animationDelay: `${index * 0.12 + 0.4}s`,
        }}
      >
        <Avatar name={person.name} img={person.avatar} size={size * 0.52} ring />
      </span>
    </span>
  )
}
export function Seed({ i: index }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={34}
      height={34}
      aria-hidden
      style={{
        overflow: 'visible',
      }}
    >
      <g
        className="sprout"
        style={{
          animationDelay: `${index * 0.4}s`,
        }}
      >
        <path d="M16 18 V8" stroke="var(--lime)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 11 C11 11 9 8 9 5 C13 5 16 7 16 11 Z" fill="var(--lime)" />
        <path d="M16 13 C21 13 23 10 23 7 C19 7 16 9 16 13 Z" fill="var(--lime)" />
      </g>
      <ellipse cx="16" cy="23" rx="7.5" ry="5.5" fill="#B9874F" />
      <ellipse cx="13.5" cy="21.5" rx="2.2" ry="1.2" fill="#D9AE7A" />
    </svg>
  )
}
export function Ring({ r: radius, dur, reverse, offset = 0, children }) {
  const count = children.length
  return (
    <div
      className="orbit-ring"
      style={{
        '--dur': `${dur}s`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {children.map((child, c) => {
        const d = offset + (360 / Math.max(count, 1)) * c
        return (
          <div
            key={child.key ?? c}
            className="orbit-slot"
            style={{
              transform: `rotate(${d}deg) translateY(-${radius}px) rotate(${-d}deg)`,
            }}
          >
            <div
              className="orbit-item"
              style={{
                '--dur': `${dur}s`,
                animationDirection: reverse ? 'normal' : 'reverse',
              }}
            >
              {child}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export function Network() {
  const nav = useNavigate()
  const { user, friends, following, setFriend, showToast } = useApp()
  const { t } = useI18n()
  const [openSeed, setOpenSeed] = useState(null)
  const flowers = Object.entries(friends)
    .filter(([, f]) => f === 'friends')
    .map(([f]) => profiles[f])
    .filter(Boolean)
  const seeds = Object.entries(friends)
    .filter(([, f]) => f === 'sent')
    .map(([f]) => profiles[f])
    .filter(Boolean)
  const followed = following.map((f) => {
    const [l, m] = f.split(':')
    return {
      k: f,
      name:
        l === 'org'
          ? (organisations.find((organisation) => organisation.id === m)?.name ?? m)
          : (profiles[m]?.name ?? m),
      avatar: l === 'person' ? profiles[m]?.avatar : undefined,
      link: l === 'org' ? `/org/${m}` : `/person/${m}`,
    }
  })
  const isEmpty = flowers.length + seeds.length === 0
  return (
    <Screen className="garden-screen">
      <div
        className="scroll garden"
        style={{
          paddingBottom: 30,
        }}
      >
        <div className="pad safe-top">
          <BackButton to="/profile?section=garden" />
          <h1
            className="h1"
            style={{
              marginTop: 18,
              color: 'var(--white)',
            }}
          >
            {t('gardenTitle')}
          </h1>
          <p
            className="small"
            style={{
              marginTop: 8,
              color: 'rgba(255,255,255,.8)',
              fontSize: 15,
            }}
          >
            {t('gardenSub')}
          </p>
        </div>
        <div
          className="orbit"
          role="group"
          aria-label={t('orbitLabel', {
            f: flowers.length,
            s: seeds.length,
            g: followed.length,
          })}
        >
          <svg className="orbit-lines" viewBox="-192 -192 384 384" aria-hidden>
            {Object.values(RING_RADIUS).map((f) => (
              <circle
                key={f}
                r={f}
                fill="none"
                stroke="rgba(255,255,255,.22)"
                strokeWidth="1.5"
                strokeDasharray="3 6"
              />
            ))}
          </svg>
          {followed.length > 0 && (
            <Ring r={RING_RADIUS.following} dur={140} offset={20}>
              {followed.map((f) => (
                <button
                  key={f.k}
                  onClick={() => nav(f.link)}
                  aria-label={t('viewProfile', {
                    name: f.name,
                  })}
                  className="orbit-dot"
                >
                  {f.avatar ? (
                    <Avatar name={f.name} img={f.avatar} size={24} />
                  ) : (
                    <span>{f.name.replace(/^(Het|De) /, '').slice(0, 1)}</span>
                  )}
                </button>
              ))}
            </Ring>
          )}
          {seeds.length > 0 && (
            <Ring r={RING_RADIUS.seeds} dur={90} reverse offset={45}>
              {seeds.map((seed, g) => (
                <button
                  key={seed.id}
                  onClick={() => setOpenSeed(seed)}
                  aria-label={`${t('seedPlanted')}: ${seed.name}`}
                  style={{
                    display: 'grid',
                    justifyItems: 'center',
                  }}
                >
                  <Seed i={g} />
                  <span className="orbit-name">{seed.name}</span>
                </button>
              ))}
            </Ring>
          )}
          {flowers.length > 0 && (
            <Ring r={RING_RADIUS.friends} dur={60}>
              {flowers.map((flower, g) => (
                <button
                  key={flower.id}
                  onClick={() => nav(`/person/${flower.id}`)}
                  aria-label={t('viewProfile', {
                    name: flower.name,
                  })}
                  style={{
                    display: 'grid',
                    justifyItems: 'center',
                  }}
                >
                  <BloomFlower p={flower} size={62} i={g} />
                  <span className="orbit-name">{flower.name}</span>
                </button>
              ))}
            </Ring>
          )}
          <div className="orbit-centre">
            <span
              className="bloom"
              style={{
                width: 104,
                height: 104,
              }}
            >
              <svg viewBox="0 0 55 55" width={104} height={104} aria-hidden>
                <g fill="var(--white)">
                  <circle cx="27.5" cy="14.85" r="14.85" />
                  <circle cx="40.15" cy="27.5" r="14.85" />
                  <circle cx="27.5" cy="40.15" r="14.85" />
                  <circle cx="14.85" cy="27.5" r="14.85" />
                  <rect x="14.85" y="14.85" width="25.3" height="25.3" />
                </g>
              </svg>
              <span
                className="bloom-face"
                style={{
                  animation: 'none',
                }}
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt=""
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <Avatar name={user.firstName || 'R'} img="ruben" size={60} />
                )}
              </span>
            </span>
          </div>
        </div>
        <div className="pad">
          <div className="garden-legend">
            <span>
              <svg viewBox="0 0 55 55" width={20} height={20} aria-hidden>
                <g fill="var(--pink)">
                  <circle cx="27.5" cy="14.85" r="14.85" />
                  <circle cx="40.15" cy="27.5" r="14.85" />
                  <circle cx="27.5" cy="40.15" r="14.85" />
                  <circle cx="14.85" cy="27.5" r="14.85" />
                </g>
              </svg>
              {t('nFlowers', {
                n: flowers.length,
              })}
            </span>
            <span>
              <Seed i={0} />
              {t('nSeeds', {
                n: seeds.length,
              })}
            </span>
            <span>
              <span
                className="orbit-dot"
                style={{
                  width: 18,
                  height: 18,
                  fontSize: 10,
                }}
              >
                ·
              </span>
              {t('followingCount', {
                n: followed.length,
              })}
            </span>
          </div>
          {isEmpty && (
            <div
              className="card"
              style={{
                background: 'rgba(255,255,255,.12)',
                color: 'var(--white)',
                padding: 16,
                marginTop: 16,
              }}
            >
              <strong>{t('gardenEmpty')}</strong>
              <p
                style={{
                  fontSize: 14,
                  margin: '4px 0 0',
                  opacity: 0.85,
                }}
              >
                {t('gardenEmptySub')}
              </p>
            </div>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 18,
            }}
          >
            <button
              className="btn btn-sm"
              style={{
                background: 'var(--white)',
                color: 'var(--ink)',
                width: '100%',
              }}
              onClick={() => nav('/connections')}
            >
              <Users size={16} aria-hidden /> {t('friendsLabel')}
            </button>
            <button
              className="btn btn-sm"
              style={{
                background: 'var(--lime)',
                color: 'var(--ink)',
                width: '100%',
              }}
              onClick={() => nav('/search')}
            >
              {t('meetPeople')}
            </button>
          </div>
        </div>
      </div>
      <Sheet open={!!openSeed} onClose={() => setOpenSeed(null)}>
        {openSeed && (
          <div
            style={{
              display: 'grid',
              justifyItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <Avatar name={openSeed.name} img={openSeed.avatar} size={72} />
            </div>
            <span
              className="eyebrow"
              style={{
                marginTop: 12,
              }}
            >
              {t('seedPlanted')}
            </span>
            <h2
              className="h2"
              style={{
                marginTop: 4,
              }}
            >
              {openSeed.name}
            </h2>
            <p
              className="small"
              style={{
                marginTop: 6,
              }}
            >
              {t('waitingFor', {
                name: openSeed.name,
              })}
            </p>
            <div
              className="stack"
              style={{
                width: '100%',
                marginTop: 18,
                gap: 8,
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFriend(openSeed.id, 'friends')
                  showToast(
                    t('bloomed', {
                      name: openSeed.name,
                    }),
                  )
                  setOpenSeed(null)
                }}
              >
                {t('demoAccept', {
                  name: openSeed.name,
                })}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const f = openSeed.id
                  setOpenSeed(null)
                  nav(`/person/${f}`)
                }}
              >
                {t('viewProfile', {
                  name: openSeed.name,
                })}
              </button>
              <button
                className="btn btn-soft"
                onClick={() => {
                  setFriend(openSeed.id, null)
                  showToast(t('requestCancelled'))
                  setOpenSeed(null)
                }}
              >
                {t('cancelRequest')}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </Screen>
  )
}
