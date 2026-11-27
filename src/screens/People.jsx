import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, Globe, Users } from 'lucide-react'
import { BadgeRow } from '../components/Badges'
import { RowCard } from '../components/Cards'
import { OrgLogo } from '../components/OrgLogo'
import { Flower } from '../components/Flower'
import { Avatar } from '../components/Img'
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
      style={
        isFollowing
          ? {
              background: 'var(--lime)',
              color: 'var(--ink)',
            }
          : undefined
      }
      onClick={() => {
        const b = toggleFollow(followKey)
        showToast(
          t(b ? 'nowFollowing' : 'unfollowed', {
            name,
          }),
        )
      }}
    >
      {isFollowing ? <Check size={17} aria-hidden /> : null}
      {t(isFollowing ? 'followingBtn' : 'follow')}
    </button>
  )
}
export function PersonRow({ p: person, right }) {
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
          <span className="tiny">{person.area}</span>
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
export function PersonScreen() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { t, ev } = useI18n()
  const person = profiles[id]
  // only hosts have a public profile: neighbours stay private
  if (!person || !hostedBy(person.id).length) return <Navigate to="/home" replace />
  const hosts = hostedBy(person.id)
  const orgs = orgsOfHost(person.id)
  const role = hosts[0] ? ev(hosts[0]).host.role : null
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
            background: 'var(--pink)',
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
            <Avatar name={person.name} img={person.avatar} size={96} ring />
            <h1
              className="h1"
              style={{
                marginTop: 12,
              }}
            >
              {person.name}
            </h1>
            {role && (
              <span
                className="tag host"
                style={{
                  marginTop: 6,
                }}
              >
                {role}
              </span>
            )}
            <p
              className="small"
              style={{
                marginTop: 8,
                color: 'var(--ink)',
              }}
            >
              {t('livesIn', {
                area: person.area,
              })}
              {' · '}
              {t('neighbourSince', {
                year: person.since,
              })}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              marginTop: 18,
            }}
          >
            <FollowButton k={`person:${person.id}`} name={person.name} />
          </div>
        </div>
        <div className="pad">
          <div className="section-head">
            <h2 className="h2">{t('badgesTitle')}</h2>
          </div>
          <div
            className="card"
            style={{
              padding: 10,
            }}
          >
            <BadgeRow ids={personBadges(person, hosts.length)} />
          </div>
          {hosts.length > 0 && (
            <>
              <div className="section-head">
                <h2 className="h2">{t('hostsLabel')}</h2>
                <span className="eyebrow">
                  {t('nActivities', {
                    n: hosts.length,
                  })}
                </span>
              </div>
              {orgs.map((org) => (
                <button
                  key={org.id}
                  className="row"
                  style={{
                    marginBottom: 12,
                    gap: 8,
                  }}
                  onClick={() => nav(`/org/${org.id}`)}
                >
                  <Users size={16} aria-hidden />
                  <span
                    style={{
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                      fontSize: 15,
                    }}
                  >
                    {t('hostsWith', {
                      org: org.name,
                    })}
                  </span>
                </button>
              ))}
              <div className="stack">
                {hosts.map((host) => (
                  <RowCard key={host.id} e={host} />
                ))}
              </div>
            </>
          )}
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
          <h1 className="h2">{t('followingTab')}</h1>
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
                return <PersonRow key={d} p={profiles[f]} right={<FollowButton compact k={d} name={profiles[f].name} />} />
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
                    onClick={() => nav(`/org/${g.id}`)}
                  >
                    <OrgLogo org={g} size={44} background="var(--turq)" />
                    <span>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 16,
                        }}
                      >
                        {g.name}
                      </strong>
                      <span className="tiny">{t(orgKindKey[orgInfo[g.id].kind])}</span>
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
