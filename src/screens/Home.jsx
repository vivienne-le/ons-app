import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Bell, Mail, X, MapPin as PinIcon, Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { RowCard, TileCard } from '../components/Cards'
import { FilterSheet, filtersToParams } from '../components/Filters'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { NavBar, Screen } from '../components/UI'
import { byId, events, forYou, invites, joinToday, organisations, popular } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const sortKey = (id) => {
  const event = byId(id)
  return (event.month === 'Dec' ? 0 : 100) + event.date
}
export const TODAY = 13
const forYouAccent = { 'pool-tournament': 'turq', 'kerststol-kitchen': 'pink', 'football-beer': 'lime', 'bowling-monday': 'lav' }
const popularFrame = { 'warm-hats': 'orange', 'bike-repair': 'turq', 'football-beer': 'lav' }
export function upcomingOnly(ids) {
  return ids
    .map((id) => byId(id))
    .filter((b) => b && b.date > TODAY)
    .sort((b, c) => sortKey(b.id) - sortKey(c.id))[0]
}
export function Home() {
  const nav = useNavigate()
  const { user, joined, invites: inviteState, updatesRead, goingCount, posts } = useApp()
  const { t, ev, wd, full } = useI18n()
  const location = useLocation()
  const [ping, setPing] = useState(!!location.state?.invitePing)
  const [filterOpen, setFilterOpen] = useState(false)
  const pingInvite = invites[0]
  const pingEvent = ev(byId(pingInvite.eventId))
  const upcoming = upcomingOnly(joined)
  const hasNews = !updatesRead || invites.some((invite) => !inviteState[invite.id])
  const dayLabel = (e) => (e === TODAY + 1 ? t('tomorrow') : e === TODAY ? t('today') : `${wd(e)} ${e}`)
  return (
    <Screen>
      {ping && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => nav('/updates')}
          onKeyDown={(k) => k.key === 'Enter' && nav('/updates')}
          className="row"
          style={{
            position: 'absolute',
            top: 16,
            left: 'var(--pad)',
            right: 'var(--pad)',
            zIndex: 30,
            background: 'var(--white)',
            borderRadius: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,.14)',
            padding: '14px 40px 14px 14px',
            gap: 14,
            cursor: 'pointer',
            textAlign: 'start',
          }}
        >
          <Flower accent="pink" size={44}>
            <Mail size={18} />
          </Flower>
          <span style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: 15 }}>
              {t('invitePingTitle', { name: pingInvite.from.name })}
            </strong>
            <span style={{ fontSize: 14 }}>
              {t('invitePingBody', { event: '\u0001', date: full(pingEvent.date), time: pingEvent.start })
                .split('\u0001')
                .flatMap((part, i) => (i ? [<em key={i}>{pingEvent.title}</em>, part] : [part]))}
            </span>
          </span>
          <button
            aria-label={t('closeLabel')}
            onClick={(x) => {
              x.stopPropagation()
              setPing(false)
            }}
            style={{ position: 'absolute', top: 10, right: 10, padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="scroll with-nav">
        <div
          style={{
            background: 'var(--lime)',
            borderRadius: '0 0 40px 40px',
            position: 'relative',
            overflow: 'hidden',
            padding: '56px var(--pad) 23px',
          }}
        >
          <Flower color="#E7F269" size={190} style={{ position: 'absolute', right: -60, top: 10, transform: 'rotate(14deg)' }} />
          <div className="row" style={{ justifyContent: 'space-between', position: 'relative', alignItems: 'flex-start' }}>
            {user.role === 'host' ? (
              <span className="row" style={{ gap: 6, marginTop: 15 }}>
                <span className="tag host">
                  <BadgeCheck size={12} /> {t('hostBadge')}
                </span>
                <span className="eyebrow" style={{ color: 'var(--ink)' }}>
                  {user.org}
                </span>
              </span>
            ) : (
              <span className="eyebrow" style={{ color: 'var(--ink)', marginTop: 15 }}>
                {user.area || 'Middelland'}
              </span>
            )}
            <button
              aria-label={t(hasNews ? 'updatesNew' : 'updates')}
              onClick={() => nav('/updates')}
              style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: 'var(--white)', display: 'grid', placeItems: 'center', marginTop: 6 }}
            >
              <Bell size={20} />
              {hasNews && (
                <span
                  style={{ position: 'absolute', top: 2, right: -4, width: 12, height: 12, borderRadius: '50%', background: 'var(--orange)', boxShadow: '0 0 0 2px var(--lime)' }}
                />
              )}
            </button>
          </div>
          <h1 style={{ fontSize: 44, lineHeight: '48px', fontWeight: 500, letterSpacing: '-0.03em', margin: '11px 0 0', position: 'relative' }}>
            {t('hoi')}
            <br />
            {user.firstName || t('neighbour')}
          </h1>
          <div className="row" style={{ marginTop: 20, position: 'relative', justifyContent: 'space-between' }}>
            <button
              onClick={() => nav('/search')}
              style={{
                width: 284,
                maxWidth: 'calc(100% - 72px)',
                height: 56,
                borderRadius: 30,
                background: 'transparent',
                border: '2px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 20px',
                color: 'var(--ink)',
                fontSize: 14,
                lineHeight: '21px',
              }}
            >
              <SearchIcon size={20} style={{ flex: 'none' }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('searchPlaceholder')}</span>
            </button>
            <button className="icon-btn dark" style={{ width: 56, height: 56 }} aria-label={t('filter')} onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={22} />
            </button>
          </div>
        </div>
        <div className="pad">
          {upcoming && (
            <button
              onClick={() => nav(`/event/${upcoming.id}`)}
              style={{
                marginTop: 28,
                width: '100%',
                height: 67,
                background: 'var(--ink)',
                color: 'var(--white)',
                borderRadius: 20,
                padding: '0 19px 0 18px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'start',
              }}
            >
              <span style={{ flex: 1, display: 'grid', gap: 4 }}>
                <span className="eyebrow" style={{ color: 'var(--lime)' }}>
                  {t('nextEvent', { when: dayLabel(upcoming.date), time: upcoming.start })}
                </span>
                <strong style={{ display: 'block', fontSize: 20, lineHeight: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>{ev(upcoming).title}</strong>
              </span>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--lime)', color: 'var(--ink)', display: 'grid', placeItems: 'center' }}>
                <ArrowRight size={18} className="flip-rtl" />
              </span>
            </button>
          )}
          {user.role === 'host' &&
            (() => {
              const f =
                organisations.find((organisation) => organisation.name === user.org)?.events.map((g) => ev(byId(g))) ??
                []
              return (
                <>
                  <div className="section-head">
                    <h2 className="h2">{t('youreHosting')}</h2>
                    <span className="eyebrow">
                      {t('nActivities', {
                        n: f.length + posts.length,
                      })}
                    </span>
                  </div>
                  {posts.length > 0 && (
                    <div
                      className="stack"
                      style={{
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      {posts.map((post) => (
                        <button
                          key={post.id}
                          onClick={() => nav(`/post/mine/${post.id}`)}
                          className="card row"
                          style={{
                            padding: 12,
                            textAlign: 'start',
                            background: 'var(--white)',
                            boxShadow: 'inset 0 0 0 2px var(--ink)',
                          }}
                        >
                          {post.photo ? (
                            <img
                              src={post.photo}
                              alt=""
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Flower color="var(--lime)" size={44}>
                              <Icon name="star" size={19} />
                            </Flower>
                          )}
                          <span
                            style={{
                              flex: 1,
                            }}
                          >
                            <span
                              className="eyebrow"
                              style={{
                                color: 'var(--ink)',
                                fontSize: 11,
                              }}
                            >
                              {wd(post.date)} {post.date}
                              {' · '}
                              {post.start}
                            </span>
                            <strong
                              style={{
                                display: 'block',
                                fontSize: 17,
                              }}
                            >
                              {post.title}
                            </strong>
                          </span>
                          <span
                            className="tiny"
                            style={{
                              background: 'var(--orange)',
                              color: 'var(--white)',
                              borderRadius: 999,
                              padding: '4px 10px',
                              fontWeight: 600,
                            }}
                          >
                            {t('inReview')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {f.length === 0 && posts.length === 0 ? (
                    <div
                      className="card"
                      style={{
                        padding: 16,
                      }}
                    >
                      <strong>{t('noActivities')}</strong>
                      <p
                        className="small"
                        style={{
                          marginTop: 4,
                        }}
                      >
                        {t('noActivitiesSub', {
                          org: user.org,
                        })}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="stack"
                      style={{
                        gap: 8,
                      }}
                    >
                      {f.map((g) => {
                        const h = goingCount(g.id)
                        return (
                          <button
                            key={g.id}
                            onClick={() => nav(`/event/${g.id}`)}
                            className="card row"
                            style={{
                              padding: 12,
                              textAlign: 'start',
                              background: `var(--${g.accent})`,
                            }}
                          >
                            <Flower color="var(--white)" size={44}>
                              <Icon name={g.icon} size={19} />
                            </Flower>
                            <span
                              style={{
                                flex: 1,
                              }}
                            >
                              <span
                                className="eyebrow"
                                style={{
                                  color: 'var(--ink)',
                                  fontSize: 11,
                                }}
                              >
                                {wd(g.date)} {g.date}
                                {' · '}
                                {g.start}
                              </span>
                              <strong
                                style={{
                                  display: 'block',
                                  fontSize: 17,
                                }}
                              >
                                {g.title}
                              </strong>
                            </span>
                            <span
                              style={{
                                textAlign: 'right',
                              }}
                            >
                              <strong
                                style={{
                                  display: 'block',
                                  fontSize: 18,
                                }}
                              >
                                {h}/{g.capacity}
                              </strong>
                              <span
                                className="tiny"
                                style={{
                                  color: 'var(--ink)',
                                }}
                              >
                                {t('signedUp')}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )
            })()}
          <div className="section-head">
            <h2 className="h2">{t('forYou')}</h2>
            <button className="link" onClick={() => nav('/search')}>
              {t('seeAll')}
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            padding: '0 var(--pad) 0',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: 20,
          }}
          className="scroll-x"
        >
          {forYou.map((e) => (
            <TileCard key={e} e={byId(e)} accent={forYouAccent[e]} />
          ))}
        </div>
        <div className="pad">
          <div className="section-head">
            <h2 className="h2">{t('popular')}</h2>
            <button className="link" onClick={() => nav('/search')}>
              {t('seeAll')}
            </button>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            {popular.map((e, i) => [
              i > 0 && <div key={e + 'l'} style={{ height: 1, background: 'var(--grey-2)' }} />,
              <RowCard key={e} e={byId(e)} frame={popularFrame[e]} />,
            ])}
          </div>
          <div className="section-head">
            <h2 className="h2">{t('joinToday')}</h2>
          </div>
          <div style={{ paddingLeft: 20, marginTop: -4 }}>
            {joinToday.map((e) => {
              const f = ev(byId(e))
              const left = f.capacity - goingCount(e)
              return (
                <div key={e} style={{ display: 'flex', alignItems: 'flex-start', height: 86 }}>
                  <span style={{ width: 65, flex: 'none', position: 'relative', height: 86 }}>
                    <span className="eyebrow" style={{ color: 'var(--ink)', position: 'absolute', top: 12, left: 0 }}>
                      {f.start}
                    </span>
                    <span style={{ position: 'absolute', left: 19, top: 34, width: 2, height: 46, borderRadius: 2, background: '#E8E6E0' }} />
                  </span>
                  <button
                    onClick={() => nav(`/event/${e}`)}
                    style={{
                      flex: 1,
                      height: 80,
                      borderRadius: 20,
                      background: 'var(--grey)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '0 11px',
                      textAlign: 'start',
                      minWidth: 0,
                    }}
                  >
                    <Flower accent={f.accent} size={56}>
                      <Icon name={f.icon} size={24} />
                    </Flower>
                    <span style={{ minWidth: 0, display: 'grid', gap: 2 }}>
                      <strong style={{ display: 'block', fontSize: 17, lineHeight: '22px', fontWeight: 600, letterSpacing: '-0.01em' }}>{f.title}</strong>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, lineHeight: '21px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        <PinIcon size={10} />
                        {f.place} · {t('byHost', { name: f.host.name })}
                      </span>
                      <span style={{ fontSize: 13, lineHeight: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                        {t('going', { n: goingCount(e) })}
                        {left <= 3 ? ` · ${t('spotsLeft', { n: left })}` : ''}
                      </span>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => nav('/map')}
            style={{
              marginTop: 32,
              width: '100%',
              height: 155,
              background: 'var(--turq)',
              borderRadius: 28,
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'start',
              display: 'block',
            }}
          >
            <svg aria-hidden viewBox="0 0 362 155" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path d="M-10 128 C 70 120, 130 150, 220 112 S 320 70, 372 74" stroke="#8FE3EE" strokeWidth="12" fill="none" />
              <path d="M160 -10 C 175 50, 205 100, 200 170" stroke="#8FE3EE" strokeWidth="10" fill="none" />
              <path d="M300 -10 C 300 60, 320 110, 330 170" stroke="#8FE3EE" strokeWidth="9" fill="none" />
            </svg>
            <Flower accent="lime" stroke="var(--ink)" size={34} style={{ position: 'absolute', left: 206, top: 20 }} />
            <Flower accent="pink" stroke="var(--ink)" size={34} style={{ position: 'absolute', left: 262, top: 50 }} />
            <Flower accent="orange" stroke="var(--ink)" size={34} style={{ position: 'absolute', left: 318, top: 18 }} />
            <span className="eyebrow" style={{ color: 'var(--ink)', position: 'relative', display: 'block' }}>
              {t('nearYou')}
            </span>
            <strong
              style={{ position: 'absolute', left: 20, top: 81, fontSize: 24, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.02em', maxWidth: 220 }}
            >
              {t('thingsNear', { n: 6 })}
            </strong>
            <span
              style={{ position: 'absolute', right: 20, bottom: 18, width: 40, height: 40, borderRadius: '50%', background: 'var(--ink)', color: 'var(--white)', display: 'grid', placeItems: 'center' }}
            >
              <ArrowRight size={18} className="flip-rtl" />
            </span>
          </button>
        </div>
      </div>
      <NavBar />
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onSearch={(f) => nav(`/search?${new URLSearchParams(filtersToParams(f))}`)}
      />
    </Screen>
  )
}
