import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  Compass,
  Crown,
  Footprints,
  HandHeart,
  HeartHandshake,
  House,
  Lock as LockIcon,
  MessageCircle,
  PartyPopper,
  Repeat,
  Smile,
  Sparkles,
} from 'lucide-react'
import { Sheet } from './UI'
import { beenTo, byId, organisations } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const badges = [
  {
    id: 'firstStep',
    group: 'guest',
    stat: 'attended',
    goal: 1,
    icon: Footprints,
    accent: 'lime',
  },
  {
    id: 'regular',
    group: 'guest',
    stat: 'attended',
    goal: 5,
    icon: Repeat,
    accent: 'turq',
  },
  {
    id: 'familiarFace',
    group: 'guest',
    stat: 'attended',
    goal: 10,
    icon: Smile,
    accent: 'pink',
  },
  {
    id: 'localLegend',
    group: 'guest',
    stat: 'attended',
    goal: 25,
    icon: Crown,
    accent: 'orange',
  },
  {
    id: 'loyal',
    group: 'guest',
    stat: 'loyal',
    goal: 4,
    icon: CalendarCheck,
    accent: 'lime',
  },
  {
    id: 'explorer',
    group: 'guest',
    stat: 'types',
    goal: 3,
    icon: Compass,
    accent: 'lav',
  },
  {
    id: 'goodNeighbour',
    group: 'guest',
    stat: 'friends',
    goal: 3,
    icon: HeartHandshake,
    accent: 'pink',
  },
  {
    id: 'chatty',
    group: 'guest',
    stat: 'comments',
    goal: 1,
    icon: MessageCircle,
    accent: 'turq',
  },
  {
    id: 'firstHost',
    group: 'host',
    stat: 'sessions',
    goal: 1,
    icon: Sparkles,
    accent: 'lime',
  },
  {
    id: 'hostFive',
    group: 'host',
    stat: 'sessions',
    goal: 5,
    icon: House,
    accent: 'turq',
  },
  {
    id: 'builder',
    group: 'host',
    stat: 'sessions',
    goal: 25,
    icon: Building2,
    accent: 'orange',
  },
  {
    id: 'welcomer',
    group: 'host',
    stat: 'welcomed',
    goal: 20,
    icon: HandHeart,
    accent: 'pink',
  },
  {
    id: 'fullHouse',
    group: 'host',
    stat: 'fullHouse',
    goal: 1,
    icon: PartyPopper,
    accent: 'lav',
  },
  {
    id: 'verifiedHost',
    group: 'host',
    stat: 'verified',
    goal: 1,
    icon: BadgeCheck,
    accent: 'lime',
  },
]
export function useStats() {
  const { user, joined, friends, myComments, goingCount } = useApp()
  return useMemo(() => {
    const b = beenTo.reduce((g, h) => g + h.times, 0)
    const c = new Set(
      [
        ...beenTo.map((g) => {
          return byId(g.eventId)?.category
        }),
        ...joined.map((g) => {
          return byId(g)?.category
        }),
      ].filter(Boolean),
    )
    const d = user.role === 'host'
    const e = d ? (organisations.find((g) => g.name === user.org)?.events ?? []) : []
    const f = d ? (user.verifiedBy ? 0 : e.length * 4) : 0
    return {
      attended: b,
      types: c.size,
      friends: Object.values(friends).filter((g) => g === 'friends').length,
      comments: Object.values(myComments).reduce((g, h) => g + h.length, 0),
      loyal: Math.max(0, ...beenTo.map((g) => g.times)),
      sessions: f,
      fullHouse: e.some((g) => {
        const h = byId(g)
        return !!h && goingCount(g) >= h.capacity
      })
        ? 1
        : 0,
      welcomed: f * 2,
      verified: d ? 1 : 0,
    }
  }, [user, joined, friends, myComments, goingCount])
}
export const badgeName = (id) => `badge_${id}`
export const badgeDesc = (id) => `badgeD_${id}`
export const shapeOf = {
  firstStep: 'postmark',
  regular: 'scallopRect',
  familiarFace: 'oval',
  localLegend: 'burst',
  loyal: 'ticket',
  explorer: 'ring',
  goodNeighbour: 'heart',
  chatty: 'cloud',
  firstHost: 'flower',
  hostFive: 'seal',
  builder: 'burst',
  welcomer: 'heart',
  fullHouse: 'ticket',
  verifiedHost: 'postmark',
}
export const inkOf = {
  lime: '#3F8A3A',
  turq: '#1E8BA3',
  pink: '#C8449A',
  orange: '#E05424',
  lav: '#5A5FC4',
}
export const solidShapes = ['heart', 'flower', 'seal']
export const scallopRect = (x, y, w, h, r) => {
  let d = `M ${x} ${y}`
  const cols = Math.round(w / (2 * r))
  const rows = Math.round(h / (2 * r))
  const stepX = w / cols
  const stepY = h / rows
  for (let k = 0; k < cols; k++) d += ` a ${stepX / 2} ${r} 0 0 1 ${stepX} 0`
  for (let k = 0; k < rows; k++) d += ` a ${r} ${stepY / 2} 0 0 1 0 ${stepY}`
  for (let k = 0; k < cols; k++) d += ` a ${stepX / 2} ${r} 0 0 1 ${-stepX} 0`
  for (let k = 0; k < rows; k++) d += ` a ${r} ${stepY / 2} 0 0 1 0 ${-stepY}`
  return d + ' Z'
}
export const scallopCircle = (r, bumps, depth) => {
  let d = ''
  for (let e = 0; e <= bumps; e++) {
    const f = (e / bumps) * Math.PI * 2
    const g = 60 + r * Math.cos(f)
    const h = 60 + r * Math.sin(f)
    d += e === 0 ? `M ${g.toFixed(2)} ${h.toFixed(2)}` : ` A ${depth} ${depth} 0 0 1 ${g.toFixed(2)} ${h.toFixed(2)}`
  }
  return d + ' Z'
}
export const burst = (points, outer, inner) =>
  Array.from(
    {
      length: points * 2,
    },
    (d, e) => {
      const f = e % 2 ? inner : outer
      const g = (e / (points * 2)) * Math.PI * 2 - Math.PI / 2
      return `${(60 + f * Math.cos(g)).toFixed(2)},${(60 + f * Math.sin(g)).toFixed(2)}`
    },
  ).join(' ')
export const HEART =
  'M60 104 C 30 84 10 66 10 44 C 10 26 24 14 39 14 C 49 14 56 20 60 28 C 64 20 71 14 81 14 C 96 14 110 26 110 44 C 110 66 90 84 60 104 Z'
export const TICKET = 'M14 26 H106 V50 A10 10 0 0 0 106 70 V94 H14 V70 A10 10 0 0 0 14 50 Z'
export function StampDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      style={{
        position: 'absolute',
      }}
    >
      <filter id="stamp-ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.45"
          result="mask"
        />
        <feComposite in="SourceGraphic" in2="mask" operator="in" result="speckled" />
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" result="wobble" />
        <feDisplacementMap in="speckled" in2="wobble" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
export function BadgeIcon({ b, earned, size = 64 }) {
  const { t } = useI18n()
  const CompR = b.icon
  const index = badges.indexOf(b)
  const shape = shapeOf[b.id] ?? 'ring'
  const ink = earned ? inkOf[b.accent] : '#BDBBB6'
  const isSolid = earned && solidShapes.includes(shape)
  const detailed = size >= 48
  const tilt = earned ? ((index * 37) % 11) - 5 : 0
  const label = t(badgeName(b.id)).toUpperCase()
  const ringPathId = `ring-${b.id}-${size}`
  const strokeW = earned ? 4 : 2.5
  const dash = earned ? undefined : '6 5'
  const outline = {
    fill: isSolid ? ink : 'none',
    stroke: ink,
    strokeWidth: strokeW,
    strokeDasharray: dash,
    strokeLinejoin: 'round',
  }
  const labelText = (s, S = ink) =>
    detailed && (
      <text
        x="60"
        y={s}
        textAnchor="middle"
        fontFamily="Roboto Mono, monospace"
        fontWeight="700"
        fill={S}
        fontSize={Math.min(10, 120 / Math.max(label.length, 6))}
        letterSpacing=".5"
      >
        {label}
      </text>
    )
  let o
  let iconY = 0.5
  let iconScale = 0.36
  switch (shape) {
    case 'postmark':
    case 'ring':
      ;((o = (
        <>
          <circle cx="60" cy="60" r="54" {...outline} />
          <circle
            cx="60"
            cy="60"
            r="38"
            fill="none"
            stroke={ink}
            strokeWidth={shape === 'ring' ? 3 : 1.6}
            strokeDasharray={dash}
          />
          {detailed && (
            <>
              <path id={ringPathId} d="M 60 60 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0" fill="none" />
              <text fontFamily="Roboto Mono, monospace" fontWeight="700" fontSize="9.5" fill={ink} letterSpacing="1">
                <textPath
                  href={`#${ringPathId}`}
                  startOffset="0"
                  textLength="284"
                  lengthAdjust="spacing"
                >{`${label} ★ CVD · ${b.goal} ★`}</textPath>
              </text>
            </>
          )}
          {shape === 'postmark' &&
            earned &&
            detailed &&
            [-8, 0, 8].map((s) => (
              <path
                key={s}
                d={`M 98 ${88 + s} q 5 -4 10 0 t 10 0`}
                fill="none"
                stroke={ink}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ))}
        </>
      )),
        (iconScale = 0.3))
      break
    case 'scallopRect':
      ;((o = (
        <>
          <path d={scallopRect(14, 10, 92, 100, 4)} {...outline} />
          <rect
            x="22"
            y="18"
            width="76"
            height="84"
            rx="2"
            fill="none"
            stroke={ink}
            strokeWidth="1.6"
            strokeDasharray={dash}
          />
          {detailed && (
            <text
              x="88"
              y="38"
              textAnchor="end"
              fontFamily="Roboto Mono, monospace"
              fontWeight="700"
              fontSize="16"
              fill={ink}
            >
              {b.goal}
            </text>
          )}
          {labelText(94)}
        </>
      )),
        (iconY = 0.5))
      break
    case 'oval':
      ;((o = (
        <>
          <ellipse cx="60" cy="60" rx="56" ry="42" {...outline} />
          <ellipse cx="60" cy="60" rx="46" ry="32" fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray={dash} />
          {labelText(86)}
          {detailed && (
            <text
              x="60"
              y="41"
              textAnchor="middle"
              fontFamily="Roboto Mono, monospace"
              fontWeight="700"
              fontSize="8"
              fill={ink}
              letterSpacing="2"
            >
              {'CVD · '}
              {b.goal}
            </text>
          )}
        </>
      )),
        (iconScale = 0.3))
      break
    case 'burst':
      ;((o = (
        <>
          <polygon points={burst(18, 57, 48)} {...outline} />
          <circle cx="60" cy="60" r="38" fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray={dash} />
          {labelText(84)}
        </>
      )),
        (iconY = 0.45),
        (iconScale = 0.3))
      break
    case 'ticket':
      ;((o = (
        <>
          <path d={TICKET} {...outline} />
          <rect x="24" y="34" width="72" height="52" fill="none" stroke={ink} strokeWidth="1.4" strokeDasharray="3 3" />
          {detailed && (
            <text
              x="60"
              y="22"
              textAnchor="middle"
              fontFamily="Roboto Mono, monospace"
              fontWeight="700"
              fontSize="8"
              fill={ink}
              letterSpacing="2"
            >
              {'TICKET · '}
              {b.goal}
            </text>
          )}
          {labelText(106)}
        </>
      )),
        (iconScale = 0.3))
      break
    case 'heart':
      ;((o = (
        <>
          <path d={HEART} {...outline} />
          {earned && (
            <path
              d={HEART}
              transform="translate(60 58) scale(.82) translate(-60 -58)"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
          )}
        </>
      )),
        (iconY = 0.45))
      break
    case 'cloud':
      ;((o = (
        <>
          <path d={scallopCircle(48, 14, 8)} {...outline} />
          {detailed && (
            <circle
              cx="60"
              cy="60"
              r="36"
              fill="none"
              stroke={ink}
              strokeWidth="1.4"
              strokeDasharray="2 4"
              strokeLinecap="round"
            />
          )}
          {labelText(86)}
        </>
      )),
        (iconScale = 0.3))
      break
    case 'flower':
      o = (
        <g {...outline}>
          {isSolid ? (
            <>
              <circle cx="60" cy="32" r="28" stroke="none" />
              <circle cx="88" cy="60" r="28" stroke="none" />
              <circle cx="60" cy="88" r="28" stroke="none" />
              <circle cx="32" cy="60" r="28" stroke="none" />
              <rect x="32" y="32" width="56" height="56" stroke="none" />
            </>
          ) : (
            <path
              d="M 32 60 A 28 28 0 0 1 60 32 A 28 28 0 0 1 88 60 A 28 28 0 0 1 60 88 A 28 28 0 0 1 32 60 Z M 60 4 A 28 28 0 0 1 116 60 A 28 28 0 0 1 60 116 A 28 28 0 0 1 4 60 A 28 28 0 0 1 60 4 Z"
              fill="none"
            />
          )}
        </g>
      )
      break
    case 'seal':
      ;((o = (
        <>
          <path d={scallopCircle(52, 16, 7)} {...outline} />
          {earned && <circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeWidth="2" />}
          {detailed && earned && (
            <text
              x="60"
              y="88"
              textAnchor="middle"
              fontFamily="Roboto Mono, monospace"
              fontWeight="700"
              fontSize="9"
              fill="#fff"
              letterSpacing="1"
            >
              {b.goal}
              {' ×'}
            </text>
          )}
        </>
      )),
        (iconY = 0.46))
      break
  }
  const iconColor = isSolid ? '#fff' : ink
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-grid',
        width: size,
        height: size,
        transform: `rotate(${tilt}deg)`,
        flex: 'none',
      }}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'visible',
          mixBlendMode: 'multiply',
        }}
      >
        <g filter={earned ? 'url(#stamp-ink)' : undefined}>{o}</g>
      </svg>
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: `${iconY * 100}%`,
          transform: 'translate(-50%, -50%)',
          color: iconColor,
          display: 'grid',
          opacity: earned ? 0.95 : 0.6,
        }}
      >
        <CompR size={size * (detailed ? iconScale : 0.42)} strokeWidth={2.4} aria-hidden />
      </span>
      {!earned && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            insetInlineEnd: -4,
            bottom: -4,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--white)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,.15)',
          }}
        >
          <LockIcon size={12} />
        </span>
      )}
    </span>
  )
}
export function BadgeSection() {
  const { user } = useApp()
  const { t } = useI18n()
  const stats = useStats()
  const [openBadge, setOpenBadge] = useState(null)
  const isHost = user.role === 'host'
  const groups = isHost ? ['host', 'guest'] : ['guest', 'host']
  const earnedCount = badges.filter((g) => stats[g.stat] >= g.goal).length
  return (
    <section>
      <div className="section-head">
        <h2 className="h2">{t('badgesTitle')}</h2>
        <span className="eyebrow">
          {t('nOfM', {
            n: earnedCount,
            m: badges.length,
          })}
        </span>
      </div>
      {!user.showBadges && (
        <p
          className="small"
          style={{
            marginTop: -6,
            marginBottom: 12,
          }}
        >
          <LockIcon
            size={12}
            aria-hidden
            style={{
              verticalAlign: -1,
            }}
          />{' '}
          {t('badgesHidden')}
        </p>
      )}
      {groups.map((g) => {
        const h = badges.filter((j) => j.group === g)
        const i = g === 'host' && !isHost
        return (
          <div
            key={g}
            style={{
              marginBottom: 18,
            }}
          >
            <div
              className="eyebrow"
              style={{
                marginBottom: 10,
              }}
            >
              {t(g === 'host' ? 'hostBadgesTitle' : 'guestBadgesTitle')}
            </div>
            {i && (
              <p
                className="small"
                style={{
                  marginTop: -4,
                  marginBottom: 10,
                }}
              >
                {t('unlockAsHost')}
              </p>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px 6px',
              }}
            >
              {h.map((j) => {
                const k = stats[j.stat]
                const l = k >= j.goal
                return (
                  <button
                    key={j.id}
                    onClick={() => setOpenBadge(j)}
                    style={{
                      display: 'grid',
                      justifyItems: 'center',
                      gap: 6,
                      textAlign: 'center',
                    }}
                    aria-label={`${t(badgeName(j.id))}. ${
                      l
                        ? t('earned')
                        : t('progress', {
                            n: Math.min(k, j.goal),
                            m: j.goal,
                          })
                    }`}
                  >
                    <BadgeIcon b={j} earned={l} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: l ? 'var(--ink)' : 'var(--muted)',
                      }}
                    >
                      {t(badgeName(j.id))}
                    </span>
                    {!l && j.goal > 1 && !i && (
                      <span
                        aria-hidden
                        style={{
                          width: 44,
                          height: 4,
                          borderRadius: 2,
                          background: 'var(--grey-2)',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            height: '100%',
                            width: `${(k / j.goal) * 100}%`,
                            background: 'var(--ink)',
                          }}
                        />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <Sheet open={!!openBadge} onClose={() => setOpenBadge(null)}>
        {openBadge &&
          (() => {
            const g = stats[openBadge.stat]
            const h = g >= openBadge.goal
            return (
              <div
                style={{
                  display: 'grid',
                  justifyItems: 'center',
                  textAlign: 'center',
                  paddingBottom: 6,
                }}
              >
                <BadgeIcon b={openBadge} earned={h} size={110} />
                <span
                  className="eyebrow"
                  style={{
                    marginTop: 14,
                  }}
                >
                  {t(openBadge.group === 'host' ? 'hostBadgesTitle' : 'guestBadgesTitle')}
                </span>
                <h2
                  className="h2"
                  style={{
                    marginTop: 6,
                  }}
                >
                  {t(badgeName(openBadge.id))}
                </h2>
                <p
                  className="body"
                  style={{
                    marginTop: 8,
                  }}
                >
                  {t(badgeDesc(openBadge.id), {
                    n: openBadge.goal,
                  })}
                </p>
                {h ? (
                  <span
                    className="tag host"
                    style={{
                      marginTop: 14,
                      fontSize: 14,
                      padding: '4px 12px',
                    }}
                  >
                    <BadgeCheck size={14} /> {t('earned')}
                  </span>
                ) : openBadge.group === 'host' && user.role !== 'host' ? (
                  <p
                    className="small"
                    style={{
                      marginTop: 14,
                    }}
                  >
                    {t('unlockAsHost')}
                  </p>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: 'var(--grey)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(g / openBadge.goal) * 100}%`,
                          background: 'var(--ink)',
                          borderRadius: 5,
                        }}
                      />
                    </div>
                    <p
                      className="small"
                      style={{
                        marginTop: 8,
                      }}
                    >
                      {t('progress', {
                        n: g,
                        m: openBadge.goal,
                      })}
                      {' · '}
                      {t('moreToGo', {
                        n: openBadge.goal - g,
                      })}
                    </p>
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{
                    marginTop: 20,
                  }}
                  onClick={() => setOpenBadge(null)}
                >
                  {t('gotIt')}
                </button>
              </div>
            )
          })()}
      </Sheet>
    </section>
  )
}
export function BadgeRow({ ids }) {
  const { t } = useI18n()
  return (
    <div
      className="row"
      style={{
        gap: 6,
        flexWrap: 'wrap',
      }}
    >
      {ids.map((a) => {
        const b = badges.find((c) => c.id === a)
        return (
          <span
            key={a}
            className="row"
            style={{
              gap: 8,
              background: 'var(--white)',
              borderRadius: 999,
              padding: '4px 12px 4px 8px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <BadgeIcon b={b} earned size={24} />
            {t(badgeName(a))}
          </span>
        )
      })}
    </div>
  )
}
export function BadgeWatcher() {
  const { onboarded, showToast } = useApp()
  const { t } = useI18n()
  const stats = useStats()
  const earned = badges.filter((d) => stats[d.stat] >= d.goal).map((d) => d.id)
  const seen = useRef(null)
  useEffect(() => {
    if (!onboarded) {
      seen.current = null
      return
    }
    if (!seen.current) {
      seen.current = new Set(earned)
      return
    }
    const d = earned.filter((e) => !seen.current.has(e))
    d.forEach((e) => seen.current.add(e))
    d.length &&
      showToast(
        t('newBadge', {
          name: t(badgeName(d[0])),
        }),
      )
  }, [earned.join(), onboarded])
  return null
}
