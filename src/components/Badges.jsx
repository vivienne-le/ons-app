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
import { useNavigate } from 'react-router-dom'
import { BackButton, Screen, Sheet, Switch } from './UI'
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
    stat: 'hosts',
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
  const { user, joined, myComments, goingCount } = useApp()
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
    const e = d ? (organisations.find((organisation) => organisation.name === user.org)?.events ?? []) : []
    const f = d ? (user.verifiedBy ? 0 : e.length * 4) : 0
    return {
      attended: b,
      types: c.size,
      hosts: new Set([...beenTo.map((g) => byId(g.eventId)?.host.id), ...joined.map((g) => byId(g)?.host.id)].filter(Boolean)).size,
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
  }, [user, joined, myComments, goingCount])
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
  return null
}
const CLOVER =
  'M20.47 20.47 A23.76 23.76 0 1 1 67.53 20.47 A23.76 23.76 0 1 1 67.53 67.53 A23.76 23.76 0 1 1 20.47 67.53 A23.76 23.76 0 1 1 20.47 20.47 Z'
// A sticker: a clover in the sticker's colour with a small inner clover and its icon.
// Earned stickers get an ink outline and a drop shadow; locked ones are grey and dashed.
export function BadgeIcon({ b, earned, size = 64 }) {
  const BIcon = b.icon
  const c = size * (58 / 64)
  return (
    <span aria-hidden style={{ position: 'relative', width: size, height: size, display: 'block', flex: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g transform="scale(0.659)">
          {earned && <path d={CLOVER} transform="translate(4.5 4.5)" fill="var(--ink)" />}
          <path
            d={CLOVER}
            fill={earned ? `var(--${b.accent})` : '#E4E2DC'}
            stroke={earned ? 'var(--ink)' : '#BDBBB6'}
            strokeWidth={earned ? 2.65 : 2.3}
            strokeDasharray={earned ? undefined : '6 4.5'}
          />
          <path d={CLOVER} transform="translate(19.7 19.7) scale(0.552)" fill="#fff" fillOpacity={earned ? 0.55 : 0.6} />
        </g>
      </svg>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: c,
          height: c,
          display: 'grid',
          placeItems: 'center',
          color: earned ? 'var(--ink)' : '#9A9893',
        }}
      >
        <BIcon size={size * 0.27} strokeWidth={1.8} />
      </span>
    </span>
  )
}
// Black count for earned stickers, a grey n/m pill while you're on the way
export function StickerTag({ b, stats, size = 64 }) {
  const n = stats[b.stat]
  const earned = n >= b.goal
  return (
    <span
      style={{
        position: 'absolute',
        top: size * 0.86,
        left: size * (29 / 64),
        transform: 'translateX(-50%)',
        background: earned ? 'var(--ink)' : 'var(--grey)',
        color: earned ? 'var(--white)' : 'var(--muted)',
        boxShadow: earned ? undefined : 'inset 0 0 0 1px #BDBBB6',
        borderRadius: 999,
        padding: '1px 7px',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {earned ? n : `${Math.min(n, b.goal)}/${b.goal}`}
    </span>
  )
}
export function Sticker({ b, stats, onClick, locked }) {
  const { t } = useI18n()
  const n = stats[b.stat]
  const earned = n >= b.goal
  return (
    <button
      onClick={onClick}
      style={{ display: 'grid', justifyItems: 'center', gap: 4, textAlign: 'center' }}
      aria-label={`${t(badgeName(b.id))}. ${earned ? t('earned') : t('progress', { n: Math.min(n, b.goal), m: b.goal })}`}
    >
      <span style={{ position: 'relative', paddingBottom: 12 }}>
        <BadgeIcon b={b} earned={earned} />
        {!locked && <StickerTag b={b} stats={stats} />}
        {locked && (
          <span
            style={{
              position: 'absolute',
              top: 55,
              left: 29,
              transform: 'translateX(-50%)',
              background: 'var(--grey)',
              color: 'var(--muted)',
              boxShadow: 'inset 0 0 0 1px #BDBBB6',
              borderRadius: 999,
              padding: '1px 7px',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            0/{b.goal}
          </span>
        )}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{t(badgeName(b.id))}</span>
    </button>
  )
}
export function StickerSheet({ b, stats, onClose }) {
  const nav = useNavigate()
  const { user } = useApp()
  const { t } = useI18n()
  if (!b) return <Sheet open={false} onClose={onClose} />
  const n = stats[b.stat]
  const earned = n >= b.goal
  const locked = b.group === 'host' && user.role !== 'host'
  // What to work towards: the next sticker on the same count, or this one
  const next = earned ? badges.find((x) => x.stat === b.stat && x.goal > b.goal && n < x.goal) : b
  return (
    <Sheet open onClose={onClose}>
      <div style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', paddingBottom: 6 }}>
        <BadgeIcon b={b} earned={earned} size={110} />
        <h2 className="h2" style={{ marginTop: 14 }}>
          {t(badgeName(b.id))}
        </h2>
        <p className="body" style={{ marginTop: 6 }}>
          {t(badgeDesc(b.id), { n: b.goal })}
          {earned ? ` ${t('nice')}` : ''}
        </p>
        {locked ? (
          <p className="small" style={{ marginTop: 14 }}>
            {t('unlockAsHost')}
          </p>
        ) : (
          next && (
            <div style={{ width: '100%', marginTop: 16, background: 'var(--grey)', borderRadius: 16, padding: 14, textAlign: 'start' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 14, fontWeight: 600 }}>
                  {next === b ? t(badgeName(b.id)) : t('nextSticker', { name: t(badgeName(next.id)) })}
                </strong>
                <span className="eyebrow" style={{ color: 'var(--ink)' }}>
                  {Math.min(n, next.goal)} / {next.goal}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--white)', overflow: 'hidden', marginTop: 10 }}>
                <div style={{ height: '100%', width: `${(Math.min(n, next.goal) / next.goal) * 100}%`, background: 'var(--pink)', borderRadius: 4 }} />
              </div>
              <p className="tiny" style={{ marginTop: 8 }}>
                {t('moreToGo', { n: next.goal - Math.min(n, next.goal) })}
              </p>
            </div>
          )
        )}
        <button
          className="btn btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            onClose()
            nav(locked ? '/become-host' : '/home')
          }}
        >
          {t(locked ? 'hostAnActivity' : 'findActivity')}
        </button>
      </div>
    </Sheet>
  )
}
// Profile: the stickers you have, with a count and a link to all of them
export function StickersPreview() {
  const nav = useNavigate()
  const { t } = useI18n()
  const stats = useStats()
  const [open, setOpen] = useState(null)
  const earned = badges.filter((b) => stats[b.stat] >= b.goal)
  return (
    <section>
      <div className="section-head">
        <h2 className="h2">{t('badgesTitle')}</h2>
        <span className="row" style={{ gap: 10 }}>
          <span className="eyebrow">{t('nOfM', { n: earned.length, m: badges.length })}</span>
          <button className="link" onClick={() => nav('/stickers')}>
            {t('seeAll')}
          </button>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {earned.slice(0, 4).map((b) => (
          <Sticker key={b.id} b={b} stats={stats} onClick={() => setOpen(b)} />
        ))}
      </div>
      <p className="small" style={{ marginTop: 10 }}>
        {t('stickersSub')}
      </p>
      <StickerSheet b={open} stats={stats} onClose={() => setOpen(null)} />
    </section>
  )
}
export function StickersScreen() {
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const stats = useStats()
  const [open, setOpen] = useState(null)
  const earned = badges.filter((b) => stats[b.stat] >= b.goal).length
  const isHost = user.role === 'host'
  const grid = (group) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 4px' }}>
      {badges
        .filter((b) => b.group === group)
        .map((b) => (
          <Sticker key={b.id} b={b} stats={stats} locked={group === 'host' && !isHost} onClick={() => setOpen(b)} />
        ))}
    </div>
  )
  return (
    <Screen>
      <div className="scroll pad safe-top" style={{ paddingBottom: 40 }}>
        <BackButton />
        <div className="eyebrow" style={{ marginTop: 20 }}>
          {t('profile')} · {t('nOfM', { n: earned, m: badges.length })}
        </div>
        <h1 className="h1" style={{ marginTop: 6 }}>
          {t('badgesTitle')}
        </h1>
        <p className="small" style={{ marginTop: 6 }}>
          {t('stickersSub')}
        </p>
        <div className="row" style={{ background: 'var(--grey)', borderRadius: 18, padding: '12px 14px', marginTop: 16, gap: 12 }}>
          <span style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{t('showBadgesSetting')}</strong>
            <span className="tiny">{t('showBadgesSub')}</span>
          </span>
          <Switch on={user.showBadges} onChange={(on) => setUser({ showBadges: on })} label={t('showBadgesSetting')} />
        </div>
        <h2 className="h2" style={{ margin: '24px 0 14px' }}>
          {t('guestBadgesTitle')}
        </h2>
        {grid('guest')}
        <h2 className="h2" style={{ marginTop: 28 }}>
          {t('hostBadgesTitle')}
        </h2>
        {!isHost && (
          <p className="small" style={{ margin: '4px 0 14px' }}>
            {t('unlockAsHost')}
          </p>
        )}
        {grid('host')}
      </div>
      <StickerSheet b={open} stats={stats} onClose={() => setOpen(null)} />
    </Screen>
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
      {ids.map((id) => {
        const b = badges.find((badge) => badge.id === id)
        return (
          <span
            key={id}
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
            {t(badgeName(id))}
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
  const earned = badges.filter((badge) => stats[badge.stat] >= badge.goal).map((badge) => badge.id)
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
