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
            padding: '56px var(--pad) 28px',
          }}
        >
          <Flower
            color="#E7F269"
            size={210}
            style={{
              position: 'absolute',
              right: -60,
              top: 90,
            }}
          />
          <Flower
            color="#E7F269"
            size={120}
            style={{
              position: 'absolute',
              right: 90,
              top: -40,
            }}
          />
          <div
            className="row"
            style={{
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {user.role === 'host' ? (
              <span
                className="row"
                style={{
                  gap: 6,
                }}
              >
                <span className="tag host">
                  <BadgeCheck size={12} /> {t('hostBadge')}
                </span>
                <span
                  className="eyebrow"
                  style={{
                    color: 'var(--ink)',
                  }}
                >
                  {user.org}
                </span>
              </span>
            ) : (
              <span
                className="eyebrow"
                style={{
                  color: 'var(--ink)',
                }}
              >
                {user.area}
              </span>
            )}
            <button
              className="icon-btn white"
              aria-label={t(hasNews ? 'updatesNew' : 'updates')}
              onClick={() => nav('/updates')}
              style={{
                position: 'relative',
              }}
            >
              <Bell size={20} />
              {hasNews && (
                <span
                  className="dot"
                  style={{
                    position: 'absolute',
                    top: 9,
                    right: 11,
                  }}
                />
              )}
            </button>
          </div>
          <h1
            className="h-display"
            style={{
              fontSize: 46,
              marginTop: 14,
              position: 'relative',
            }}
          >
            {t('hoi')}
            <br />
            {user.firstName || t('neighbour')}
          </h1>
          <div
            className="row"
            style={{
              marginTop: 20,
              position: 'relative',
            }}
          >
            <button
              onClick={() => nav('/search')}
              style={{
                flex: 1,
                minWidth: 0,
                height: 56,
                borderRadius: 999,
                background: 'var(--white)',
                boxShadow: 'inset 0 0 0 2px var(--ink)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 18px',
                color: 'var(--muted)',
                fontSize: 15,
              }}
            >
              <SearchIcon
                size={20}
                color="var(--ink)"
                style={{
                  flex: 'none',
                }}
              />{' '}
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('searchPlaceholder')}
              </span>
            </button>
            <button
              className="icon-btn dark"
              style={{
                width: 56,
                height: 56,
              }}
              aria-label={t('filter')}
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
        <div className="pad">
          {upcoming && (
            <button
              onClick={() => nav(`/event/${upcoming.id}`)}
              style={{
                marginTop: 20,
                width: '100%',
                background: 'var(--ink)',
                color: 'var(--white)',
                borderRadius: 20,
                padding: '14px 14px 14px 18px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'start',
              }}
            >
              <span
                style={{
                  flex: 1,
                }}
              >
                <span
                  className="eyebrow"
                  style={{
                    color: 'var(--lime)',
                    fontSize: 11,
                  }}
                >
                  {t('nextEvent', {
                    when: dayLabel(upcoming.date),
                    time: upcoming.start,
                  })}
                </span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 20,
                    marginTop: 2,
                  }}
                >
                  {ev(upcoming).title}
                </strong>
              </span>
              <span
                className="icon-btn lime"
                style={{
                  color: 'var(--ink)',
                }}
              >
                <ArrowRight size={20} className="flip-rtl" />
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
            gap: 10,
            overflowX: 'auto',
            padding: '0 var(--pad) 4px',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: 20,
          }}
          className="scroll-x"
        >
          {forYou.map((e) => (
            <TileCard key={e} e={byId(e)} />
          ))}
        </div>
        <div className="pad">
          <div className="section-head">
            <h2 className="h2">{t('popular')}</h2>
            <button className="link" onClick={() => nav('/search')}>
              {t('seeAll')}
            </button>
          </div>
          <div
            className="stack"
            style={{
              gap: 6,
            }}
          >
            {popular.map((e) => (
              <RowCard key={e} e={byId(e)} />
            ))}
          </div>
          <div className="section-head">
            <h2 className="h2">{t('joinToday')}</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              rowGap: 10,
              position: 'relative',
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 37,
                top: 20,
                bottom: 20,
                borderLeft: '2px dotted #CFCDC7',
              }}
            />
            {joinToday.map((e) => {
              const f = ev(byId(e))
              const g = f.capacity - goingCount(e)
              return [
                <span
                  key={e + 't'}
                  className="eyebrow"
                  style={{
                    color: 'var(--ink)',
                    alignSelf: 'center',
                    background: 'var(--white)',
                    position: 'relative',
                    fontSize: 12,
                  }}
                >
                  {f.start}
                </span>,
                <button
                  key={e}
                  onClick={() => nav(`/event/${e}`)}
                  className="card"
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: 12,
                    textAlign: 'start',
                  }}
                >
                  <Flower accent={f.accent} size={50}>
                    <Icon name={f.icon} size={22} />
                  </Flower>
                  <span
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontSize: 17,
                      }}
                    >
                      {f.title}
                    </strong>
                    <span
                      className="tiny"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <PinIcon size={11} />
                      {f.place}
                      {' · '}
                      {t('byHost', {
                        name: f.host.name,
                      })}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {t('going', {
                        n: goingCount(e),
                      })}
                      {g <= 3
                        ? ` · ${t('spotsLeft', {
                            n: g,
                          })}`
                        : ''}
                    </span>
                  </span>
                </button>,
              ]
            })}
          </div>
          <button
            onClick={() => nav('/map')}
            style={{
              marginTop: 28,
              width: '100%',
              background: 'var(--turq)',
              borderRadius: 24,
              padding: 20,
              minHeight: 150,
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <svg
              aria-hidden
              viewBox="0 0 362 150"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <path
                d="M-10 120 C 80 90, 140 140, 220 70 S 330 20, 380 60"
                stroke="#8FE3EE"
                strokeWidth="14"
                fill="none"
              />
              <path d="M150 -10 C 170 60, 260 90, 250 170" stroke="#8FE3EE" strokeWidth="10" fill="none" />
            </svg>
            <Flower
              accent="lime"
              size={40}
              style={{
                position: 'absolute',
                right: 120,
                top: 24,
              }}
            />
            <Flower
              accent="pink"
              size={34}
              style={{
                position: 'absolute',
                right: 70,
                top: 64,
              }}
            />
            <Flower
              accent="orange"
              size={38}
              style={{
                position: 'absolute',
                right: 26,
                top: 22,
              }}
            />
            <span
              className="eyebrow"
              style={{
                color: 'var(--ink)',
                position: 'relative',
              }}
            >
              {t('nearYou')}
            </span>
            <span
              className="row"
              style={{
                position: 'relative',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: 40,
              }}
            >
              <strong
                style={{
                  fontSize: 24,
                  lineHeight: 1.15,
                  fontWeight: 600,
                  maxWidth: 220,
                }}
              >
                {t('thingsNear', {
                  n: events.length,
                })}
              </strong>
              <span className="icon-btn dark">
                <ArrowRight size={20} className="flip-rtl" />
              </span>
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
