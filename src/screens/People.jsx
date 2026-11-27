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
      ['firstHost', 1],
      ['hostFive', 5],
      ['welcomer', 5],
      ['verifiedHost', 1],
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
  return (
    <Screen>
      <div className="scroll" style={{ paddingBottom: 40 }}>
        <div
          style={{
            background: 'var(--pink)',
            padding: 'max(48px, env(safe-area-inset-top)) var(--pad) 20px',
            borderRadius: '0 0 32px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Flower color="#D98BDF" size={170} style={{ position: 'absolute', right: -40, top: 10 }} />
          <div className="row" style={{ gap: 12, position: 'relative' }}>
            <BackButton variant="white" />
            <span className="eyebrow" style={{ color: 'var(--ink)' }}>
              {t('host')}
            </span>
          </div>
          <div className="row" style={{ gap: 14, marginTop: 14, position: 'relative' }}>
            <span style={{ borderRadius: '50%', boxShadow: '0 0 0 3px var(--white)', display: 'flex' }}>
              <Avatar name={person.name} img={person.avatar} size={80} />
            </span>
            <span>
              <h1 className="h-display" style={{ fontSize: 40, lineHeight: 1 }}>
                {person.name}
              </h1>
              <span style={{ fontSize: 13 }}>
                {person.area} · {t('neighbourSince', { year: person.since })}
              </span>
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18, position: 'relative' }}>
            <div className="card" style={{ background: 'var(--ink)', color: 'var(--white)', padding: 14 }}>
              <strong style={{ display: 'block', fontSize: 22, color: 'var(--lime)' }}>{hosts.length}</strong>
              <span style={{ fontSize: 13 }}>{t('activitiesArrow')}</span>
            </div>
            <button
              className="card"
              aria-pressed={isFollowing}
              onClick={() => {
                const on = toggleFollow(key)
                showToast(t(on ? 'nowFollowing' : 'unfollowed', { name: person.name }))
              }}
              style={{ background: isFollowing ? 'var(--lime)' : 'var(--white)', padding: 14, textAlign: 'start', display: 'grid', gap: 4 }}
            >
              {isFollowing ? <Check size={18} /> : <Plus size={18} />}
              <strong style={{ fontSize: 15, fontWeight: 600 }}>{t(isFollowing ? 'followingBtn' : 'follow')}</strong>
            </button>
          </div>
        </div>
        <div className="pad">
          {info.about && (
            <div className="card" style={{ background: 'var(--lime)', padding: 16, marginTop: 12 }}>
              <div className="eyebrow" style={{ color: 'var(--ink)' }}>
                {t('aboutName', { name: person.name })}
              </div>
              <p style={{ fontSize: 15, marginTop: 8 }}>{info.about}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div className="card" style={{ background: 'var(--turq)', padding: 14 }}>
              <strong style={{ display: 'block', fontSize: 22 }}>{info.hostingSince}</strong>
              <span className="tiny" style={{ color: 'var(--ink)' }}>
                {t('hostingSince')}
              </span>
            </div>
            <div className="card" style={{ background: 'var(--pink)', padding: 14 }}>
              <strong style={{ display: 'block', fontSize: 22 }}>{info.timesHosted}</strong>
              <span className="tiny" style={{ color: 'var(--ink)' }}>
                {t('timesHosted')}
              </span>
            </div>
          </div>
          <div className="section-head">
            <h2 className="h2">{t('badgesTitle')}</h2>
          </div>
          <div className="card" style={{ padding: '14px 8px 6px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center' }}>
            {info.stickers.map(([bid, n]) => {
              const b = badges.find((x) => x.id === bid)
              return (
                <span key={bid} style={{ position: 'relative', paddingBottom: 14 }} title={t(`badge_${bid}`)}>
                  <BadgeIcon b={b} earned size={60} />
                  <StickerTag b={{ ...b, goal: 1, stat: 'n' }} stats={{ n }} size={60} />
                </span>
              )
            })}
          </div>
          <div className="section-head">
            <h2 className="h2">{t('hostsLabel')}</h2>
            <span className="eyebrow">{t('nActivities', { n: hosts.length })}</span>
          </div>
          {orgs.map((org) => (
            <button
              key={org.id}
              className="card row"
              style={{ width: '100%', padding: '10px 12px', gap: 10, textAlign: 'start', marginBottom: 6 }}
              onClick={() => {}}
            >
              <OrgLogo org={org} size={36} />
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{org.name}</strong>
                <span className="tiny">{t('verifiedBy', { org: org.name })}</span>
              </span>
              <ChevronRight size={18} className="flip-rtl" />
            </button>
          ))}
          {hosts.map((e) => (
            <button
              key={e.id}
              className="row"
              onClick={() => nav(`/event/${e.id}`)}
              style={{ width: '100%', textAlign: 'start', padding: '8px 0', gap: 12 }}
            >
              <Img name={e.card} photo={e.photo} w={200} alt="" accent={e.accent} icon={e.icon} radius={12} style={{ width: 48, height: 48, flex: 'none' }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="eyebrow" style={{ color: 'var(--ink)', fontSize: 10 }}>
                  {full(e.date)} · {e.start}
                </span>
                <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{e.title}</strong>
                <span className="row" style={{ gap: 3, fontSize: 12, color: 'var(--muted)' }}>
                  <MapPin size={11} aria-hidden /> {e.place}
                </span>
              </span>
              <ChevronRight size={18} className="flip-rtl" />
            </button>
          ))}
          <div className="row" style={{ background: 'var(--grey)', borderRadius: 16, padding: '12px 14px', gap: 10, marginTop: 16, alignItems: 'flex-start' }}>
            <MessageCircle size={16} aria-hidden style={{ flex: 'none', marginTop: 2 }} />
            <span className="small" style={{ fontSize: 13 }}>
              {t('askHostInComments', { name: person.name })}
            </span>
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
export function ConnectionsScreen() {
  const nav = useNavigate()
  const { following } = useApp()
  const { t } = useI18n()
  return (
    <Screen>
      <div className="scroll pad safe-top with-nav">
        <div className="row">
          <BackButton to="/profile" />
          <h1 className="h2" style={{ marginInlineStart: 4 }}>
            {t('followingTab')}
          </h1>
        </div>
        <p
          className="small"
          style={{
            marginTop: 10,
          }}
        >
          {t('followingSub')}
        </p>
        <div
          style={{
            marginTop: 10,
          }}
        >
          {following.length ? (
            following.map((d) => {
              const [e, f] = d.split(':')
              if (e === 'person' && profiles[f])
                return (
                  <PersonRow
                    key={d}
                    p={profiles[f]}
                    sub={orgsOfHost(f)[0] ? t('hostsWith', { org: orgsOfHost(f)[0].name }) : profiles[f].area}
                    right={<FollowButton compact k={d} name={profiles[f].name} />}
                  />
                )
              const g = organisations.find((organisation) => organisation.id === f)
              return g ? (
                <div
                  key={d}
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
                    }}
                    onClick={() => {}}
                  >
                    <OrgLogo org={g} size={44} />
                    <span>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 16,
                        }}
                      >
                        {g.name}
                      </strong>
                      <span className="tiny">
                        {t(orgKindKey[orgInfo[g.id].kind])} · {t('nActivitiesLower', { n: g.events.length })}
                      </span>
                    </span>
                  </button>
                  <FollowButton compact k={d} name={g.name} />
                </div>
              ) : null
            })
          ) : (
            <EmptyCard title={t('noFollowingYet')} sub={t('noFollowingSub')} />
          )}
        </div>
      </div>
      <NavBar />
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
