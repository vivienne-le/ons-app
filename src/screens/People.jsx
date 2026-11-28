import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronRight, Globe, MapPin, MessageCircle, Plus, Users } from 'lucide-react'
import { BadgeIcon, BadgeRow, StickerTag, badges } from '../components/Badges'
import { RowCard } from '../components/Cards'
import { OrgLogo } from '../components/OrgLogo'
import { Flower } from '../components/Flower'
import { Avatar, Img } from '../components/Img'
import { BackButton, NavBar, Screen } from '../components/UI'
import { byId, organisations } from '../data/events'
import { hostedBy, orgInfo, orgsOfHost, profileLink, profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const orgKindKey = {
  community: 'orgCommunity',
  care: 'orgCare',
  creative: 'orgCreative',
  sport: 'orgSport',
}
export function FollowButton({ k: followKey, name, compact }) {
  const { following, toggleFollow, showToast } = useApp()
  const { t } = useI18n()
  const isFollowing = following.includes(followKey)
  return (
    <button
      className={`btn ${compact ? 'btn-sm' : ''} btn-primary`}
      aria-pressed={isFollowing}
      style={{
        ...(isFollowing ? { background: 'var(--lime)', color: 'var(--ink)' } : {}),
        ...(compact ? { height: 30, padding: '0 12px', fontSize: 13, gap: 4 } : {}),
      }}
      onClick={() => {
        const b = toggleFollow(followKey)
        showToast(
          t(b ? 'nowFollowing' : 'unfollowed', {
            name,
          }),
        )
      }}
    >
      {isFollowing ? <Check size={compact ? 14 : 17} aria-hidden /> : null}
      {t(isFollowing ? 'followingBtn' : 'follow')}
    </button>
  )
}
export function PersonRow({ p: person, right, sub }) {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <div
      className="row"
      style={{
        padding: '10px 0',
        borderBottom: '1px solid var(--grey-2)',
      }}
    >
      <button
        className="row"
        style={{
          flex: 1,
          gap: 12,
          textAlign: 'start',
          minWidth: 0,
        }}
        disabled={!profileLink(person.id)}
        onClick={() => profileLink(person.id) && nav(profileLink(person.id))}
        aria-label={t('viewProfile', {
          name: person.name,
        })}
      >
        <Avatar name={person.name} img={person.avatar} size={44} />
        <span
          style={{
            minWidth: 0,
          }}
        >
          <strong
            style={{
              display: 'block',
              fontSize: 16,
            }}
          >
            {person.name}
          </strong>
          <span className="tiny">{sub ?? person.area}</span>
        </span>
      </button>
      {right}
    </div>
  )
}
export function personBadges(person, hostingCount) {
  const attended = (2026 - person.since) * 5 + 1
  const result = [
    attended >= 25 ? 'localLegend' : attended >= 10 ? 'familiarFace' : attended >= 5 ? 'regular' : 'firstStep',
  ]
  hostingCount && result.unshift(hostingCount * 4 >= 5 ? 'hostFive' : 'firstHost', 'verifiedHost')
  person.interests.length >= 3 && result.push('explorer')
  return result
}
// Host details shown on a host's profile (demo data, Noon as in the Figma design)
export const hostInfo = {
  noon: {
    about: 'Hoi! I run the community kitchen at Zorgvrijstaat. Come cook and bake with me. No experience needed, just bring your appetite.',
    hostingSince: 2023,
    timesHosted: 52,
    stickers: [
      ['firstHost', 1, 'lime'],
      ['hostFive', 5, 'turq'],
      ['welcomer', 5, 'pink'],
      ['verifiedHost', 1, 'lav'],
    ],
  },
}
const hostDefaults = (person, n) => ({
  about: '',
  hostingSince: Math.max(person.since, 2022),
  timesHosted: n * 6,
  stickers: [
    ['firstHost', 1],
    ['hostFive', n],
    ['verifiedHost', 1],
  ],
})
export function PersonScreen() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { following, toggleFollow, showToast } = useApp()
  const { t, ev, full } = useI18n()
  const person = profiles[id]
  // only hosts have a public profile: neighbours stay private
  if (!person || !hostedBy(person.id).length) return <Navigate to="/home" replace />
  const hosts = hostedBy(person.id)
    .map((e) => ev(e))
    .sort((x, y) => x.date - y.date)
  const orgs = orgsOfHost(person.id)
  const info = { ...hostDefaults(person, hosts.length), ...hostInfo[person.id] }
  const key = `person:${person.id}`
  const isFollowing = following.includes(key)
  const h2 = { flex: 1, margin: 0, font: '600 24px/30px Inter, sans-serif', letterSpacing: '-0.02em', color: 'var(--ink)' }
  const mono = { font: "500 12px/16px 'Roboto Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }
  const chevron = <ChevronRight size={18} className="flip-rtl" color="var(--ink)" style={{ flex: 'none' }} />
  return (
    <Screen>
      <div className="scroll" style={{ background: 'var(--white)' }}>
        <div style={{ background: 'var(--pink)', borderRadius: '0 0 40px 40px', height: 333, position: 'relative', overflow: 'hidden' }}>
          <Flower color="#D98BDF" size={182} style={{ position: 'absolute', left: 254, top: 38, transform: 'rotate(14deg)' }} />
          <span style={{ position: 'absolute', left: 20, top: 62 }}>
            <BackButton variant="white" />
          </span>
          <div style={{ ...mono, position: 'absolute', left: 76, top: 76, color: 'var(--ink)' }}>{t('host')}</div>
          <span style={{ position: 'absolute', left: 20, top: 117 }}>
            <Avatar name={person.name} img={person.avatar} size={90} />
          </span>
          <div style={{ position: 'absolute', left: 122, top: 126, right: 16, display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--ink)' }}>
            <p style={{ margin: 0, font: '500 44px/48px Inter, sans-serif', letterSpacing: '-0.03em' }}>{person.name}</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: '21px' }}>
              {person.area} · {t('neighbourSince', { year: person.since })}
            </p>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, top: 228, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <div style={{ height: 78, borderRadius: 20, background: 'var(--ink)', color: 'var(--white)', padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong style={{ font: '600 24px/28px Inter, sans-serif', letterSpacing: '-0.02em', color: 'var(--lime)' }}>{hosts.length}</strong>
              <span style={{ fontSize: 14, lineHeight: '21px' }}>{t('activitiesArrow')}</span>
            </div>
            <button
              aria-pressed={isFollowing}
              onClick={() => {
                const on = toggleFollow(key)
                showToast(t(on ? 'nowFollowing' : 'unfollowed', { name: person.name }))
              }}
              style={{ position: 'relative', height: 78, borderRadius: 20, background: isFollowing ? 'var(--lime)' : 'var(--white)', textAlign: 'start', color: 'var(--ink)' }}
            >
              <span style={{ position: 'absolute', left: 16, top: 14, display: 'flex' }}>{isFollowing ? <Check size={22} /> : <Plus size={22} />}</span>
              <strong style={{ position: 'absolute', left: 16, top: 42, font: '600 16px/21px Inter, sans-serif' }}>{t(isFollowing ? 'followingBtn' : 'follow')}</strong>
            </button>
          </div>
        </div>
        <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column' }}>
          {info.about && (
            <div style={{ background: 'var(--lime)', borderRadius: 20, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--ink)' }}>
              <div style={mono}>{t('aboutName', { name: person.name })}</div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: '24px' }}>{info.about}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 10, color: 'var(--ink)' }}>
            {[
              [info.hostingSince, t('hostingSince'), 'var(--turq)'],
              [info.timesHosted, t('timesHosted'), 'var(--pink)'],
            ].map(([v, l, bg]) => (
              <div key={l} style={{ flex: 1, background: bg, borderRadius: 20, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <strong style={{ font: '600 22px/28px Inter, sans-serif', letterSpacing: '-0.02em' }}>{v}</strong>
                <span style={{ fontSize: 12, lineHeight: '16px' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '26px 0 12px' }}>
            <h2 style={h2}>{t('badgesTitle')}</h2>
          </div>
          <div style={{ background: '#F1F0EC', borderRadius: 20, padding: '14px 10px', display: 'flex', justifyContent: 'space-between' }}>
            {info.stickers.map(([bid, n, accent]) => {
              const b = { ...badges.find((x) => x.id === bid), ...(accent ? { accent } : null) }
              return (
                <span key={bid} style={{ position: 'relative', width: 64, height: 73 }} title={t(`badge_${bid}`)}>
                  <BadgeIcon b={b} earned size={64} />
                  <StickerTag b={{ ...b, goal: n, stat: 'n' }} stats={{ n }} size={64} />
                </span>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '26px 0 12px' }}>
            <h2 style={h2}>{t('hostsLabel')}</h2>
            <span style={{ ...mono, color: '#737373' }}>{t('nActivities', { n: hosts.length })}</span>
          </div>
          {orgs.map((org) => (
            <div key={org.id} style={{ display: 'flex', alignItems: 'center', background: '#F1F0EC', borderRadius: 20, padding: '12px 14px', gap: 12 }}>
              <OrgLogo org={org} size={44} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: 'block', font: '600 17px/22px Inter, sans-serif', letterSpacing: '-0.01em', color: 'var(--ink)' }}>{org.name}</strong>
                <span style={{ fontSize: 12, lineHeight: '18px', color: '#737373' }}>{t('verifiedBy', { org: org.name })}</span>
              </span>
              {chevron}
            </div>
          ))}
          {hosts.map((e) => (
            <button key={e.id} onClick={() => nav(`/event/${e.id}`)} style={{ display: 'flex', alignItems: 'center', width: '100%', textAlign: 'start', padding: '10px 0', gap: 12 }}>
              <Img name={e.card} photo={e.photo} w={200} alt="" accent={e.accent} icon={e.icon} radius={16} style={{ width: 64, height: 64, flex: 'none' }} />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ ...mono, color: 'var(--ink)' }}>
                  {full(e.date)} · {e.start}
                </span>
                <strong style={{ font: '600 17px/22px Inter, sans-serif', letterSpacing: '-0.01em', color: 'var(--ink)' }}>{e.title}</strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, lineHeight: '18px', color: '#737373' }}>
                  <MapPin size={14} aria-hidden /> {e.place}
                </span>
              </span>
              {chevron}
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F0EC', borderRadius: 20, padding: '14px 16px', gap: 12, marginTop: 16 }}>
            <MessageCircle size={20} aria-hidden style={{ flex: 'none' }} />
            <span style={{ fontSize: 14, lineHeight: '21px', color: '#5C5C5C' }}>{t('askHostInComments', { name: person.name })}</span>
          </div>
        </div>
      </div>
    </Screen>
  )
}
export function OrgScreen() {
  const { id = '' } = useParams()
  const { following } = useApp()
  const { t } = useI18n()
  const org = organisations.find((organisation) => organisation.id === id)
  if (!org)
    return (
      <Screen>
        <div className="pad safe-top">
          <BackButton />
        </div>
      </Screen>
    )
  const info = orgInfo[org.id]
  const eventIds = org.events
  const hostIds = [
    ...new Set(
      eventIds
        .map((eventId) => {
          return byId(eventId)?.host.id
        })
        .filter((f) => !!f && !!profiles[f]),
    ),
  ]
  const followerCount = info.followers + (following.includes(`org:${org.id}`) ? 1 : 0)
  return (
    <Screen>
      <div
        className="scroll"
        style={{
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            background: 'var(--turq)',
            padding: 'max(52px, env(safe-area-inset-top)) var(--pad) 22px',
            borderRadius: '0 0 32px 32px',
          }}
        >
          <BackButton />
          <div
            style={{
              display: 'grid',
              justifyItems: 'center',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            <OrgLogo org={org} size={96} />
            <h1
              className="h1"
              style={{
                marginTop: 12,
              }}
            >
              {org.name}
            </h1>
            <p
              className="small"
              style={{
                marginTop: 6,
                color: 'var(--ink)',
              }}
            >
              {t(orgKindKey[info.kind])}
              {' · '}
              {info.area}
            </p>
            <p
              className="small"
              style={{
                marginTop: 4,
                color: 'var(--ink)',
              }}
            >
              <Globe
                size={13}
                aria-hidden
                style={{
                  verticalAlign: -2,
                }}
              />{' '}
              {org.domain}
              {' · '}
              {t('followers', {
                n: followerCount,
              })}
            </p>
          </div>
          <div
            style={{
              marginTop: 18,
            }}
          >
            <FollowButton k={`org:${org.id}`} name={org.name} />
          </div>
        </div>
        <div className="pad">
          <div className="section-head">
            <h2 className="h2">{t('upcomingActs')}</h2>
            <span className="eyebrow">
              {t('nActivities', {
                n: eventIds.length,
              })}
            </span>
          </div>
          <div className="stack">
            {eventIds.map((eventId) => {
              const g = byId(eventId)
              return g ? <RowCard key={eventId} e={g} /> : null
            })}
          </div>
          {hostIds.length > 0 && (
            <>
              <div className="section-head">
                <h2 className="h2">{t('hostsLabel')}</h2>
              </div>
              {hostIds.map((hostId) => (
                <PersonRow
                  key={hostId}
                  p={profiles[hostId]}
                  right={<FollowButton compact k={`person:${hostId}`} name={profiles[hostId].name} />}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Screen>
  )
}
function FollowChip({ k, name }) {
  const { following, toggleFollow, showToast } = useApp()
  const { t } = useI18n()
  const on = following.includes(k)
  return (
    <button
      aria-pressed={on}
      onClick={(x) => {
        x.stopPropagation()
        const now = toggleFollow(k)
        showToast(t(now ? 'nowFollowing' : 'unfollowed', { name }))
      }}
      className="row"
      style={{
        gap: 6,
        padding: '7px 12px',
        borderRadius: 999,
        background: on ? 'var(--lime)' : 'var(--ink)',
        color: on ? 'var(--ink)' : 'var(--white)',
        fontSize: 13,
        lineHeight: '20px',
        fontWeight: 600,
        flex: 'none',
      }}
    >
      {on ? <Check size={16} /> : <Plus size={16} />}
      {t(on ? 'followingBtn' : 'follow')}
    </button>
  )
}
export function ConnectionsScreen() {
  const nav = useNavigate()
  const { following } = useApp()
  const { t } = useI18n()
  const row = (key, avatar, name, sub, onClick) => (
    <div
      key={key}
      className="row"
      role={onClick ? 'link' : undefined}
      onClick={onClick}
      style={{ gap: 12, padding: '14px 0', borderBottom: '1px solid #E4E2DC', cursor: onClick ? 'pointer' : 'default' }}
    >
      {avatar}
      <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
        <strong style={{ fontSize: 17, lineHeight: '22px', fontWeight: 600, letterSpacing: '-0.01em' }}>{name}</strong>
        <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--muted)' }}>{sub}</span>
      </span>
      <FollowChip k={key} name={name} />
    </div>
  )
  return (
    <Screen>
      <div className="scroll" style={{ padding: 'max(62px, env(safe-area-inset-top)) 20px 0' }}>
        <div className="row" style={{ gap: 12 }}>
          <BackButton to="/profile" />
          <h1 style={{ fontSize: 24, lineHeight: '30px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{t('followingTab')}</h1>
        </div>
        <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--muted)', margin: '16px 0 0' }}>{t('followingSub')}</p>
        <div style={{ paddingTop: 20 }}>
          {following.length ? (
            following.map((d) => {
              const [kind, id] = d.split(':')
              if (kind === 'person' && profiles[id]) {
                const p = profiles[id]
                const org = orgsOfHost(id)[0]
                return row(
                  d,
                  <Avatar name={p.name} img={p.avatar} size={44} />,
                  p.name,
                  org ? t('hostsWith', { org: org.name }) : p.area,
                  profileLink(id) ? () => nav(profileLink(id)) : undefined,
                )
              }
              const g = organisations.find((o) => o.id === id)
              return g
                ? row(d, <OrgLogo org={g} size={44} />, g.name, `${t(orgKindKey[orgInfo[g.id].kind])} · ${t('nActivitiesLower', { n: g.events.length })}`)
                : null
            })
          ) : (
            <EmptyCard title={t('noFollowingYet')} sub={t('noFollowingSub')} />
          )}
        </div>
      </div>
    </Screen>
  )
}
export function EmptyCard({ title, sub }) {
  return (
    <div
      className="card"
      style={{
        padding: 18,
        marginTop: 10,
      }}
    >
      <strong>{title}</strong>
      <p
        className="small"
        style={{
          marginTop: 4,
        }}
      >
        {sub}
      </p>
    </div>
  )
}
