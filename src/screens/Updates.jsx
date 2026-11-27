import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftRight, Bell, Check, MessageSquare, Star } from 'lucide-react'
import { FlowerRow } from '../components/Cards'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { Avatar } from '../components/Img'
import { BackButton, Screen, SegTabs } from '../components/UI'
import { byId, invites, suggestions, updates } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const updateIcons = {
  bell: Bell,
  change: ArrowLeftRight,
  chat: MessageSquare,
  star: Star,
}
export function Updates() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'invites'
  const app = useApp()
  const { t, ev, full, wd, update, invite, why } = useI18n()
  const visibleInvites = invites.filter((f) => app.invites[f.id] !== 'dismissed')
  const openCount = invites.filter((f) => !app.invites[f.id]).length
  useEffect(() => {
    tab === 'updates' && app.markUpdatesRead()
  }, [tab])
  const accept = (f, g) => {
    app.setInvite(f, 'joined')
    app.join(g)
    nav(`/event/${g}/joined`)
  }
  const dismiss = (f) => {
    app.setInvite(f, 'dismissed')
    app.showToast(t('inviteHidden'), {
      label: t('undo'),
      run: () => app.setInvite(f, null),
    })
  }
  return (
    <Screen>
      <div
        className="pad safe-top"
        style={{
          paddingBottom: 12,
        }}
      >
        <div className="row">
          <BackButton />
          <h1
            className="h2"
            style={{
              fontSize: 28,
            }}
          >
            {t('updates')}
          </h1>
        </div>
        <div
          style={{
            marginTop: 18,
          }}
        >
          <SegTabs
            value={tab}
            onChange={(f) =>
              setParams(
                {
                  tab: f,
                },
                {
                  replace: true,
                },
              )
            }
            options={[
              {
                id: 'invites',
                label: (
                  <>
                    {t('invites')}
                    {openCount ? ` · ${openCount}` : ''}
                  </>
                ),
              },
              {
                id: 'updates',
                label: (
                  <>
                    {t('updates')} {!app.updatesRead && <span className="dot" />}
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
      <div
        className="scroll pad"
        style={{
          paddingBottom: 40,
        }}
      >
        {tab === 'invites' ? (
          <>
            <div
              className="stack"
              style={{
                gap: 16,
                marginTop: 8,
              }}
            >
              {visibleInvites.length === 0 && (
                <p
                  className="small"
                  style={{
                    padding: '24px 0',
                    textAlign: 'center',
                  }}
                >
                  {t('noInvites')}
                </p>
              )}
              {visibleInvites.map((visibleInvite) => {
                const g = ev(byId(visibleInvite.eventId))
                const h = app.invites[visibleInvite.id] === 'joined' || app.joined.includes(g.id)
                return (
                  <article
                    key={visibleInvite.id}
                    className="card"
                    style={{
                      background: `var(--${visibleInvite.accent})`,
                      padding: 16,
                    }}
                  >
                    <div className="row">
                      <Avatar name={visibleInvite.from.name} img={visibleInvite.from.avatar} size={40} />
                      <div>
                        <strong
                          style={{
                            fontSize: 17,
                          }}
                        >
                          {t('invitedYou', {
                            name: visibleInvite.from.name,
                          })}
                        </strong>
                        <div
                          className="eyebrow"
                          style={{
                            color: 'var(--ink)',
                            fontSize: 11,
                          }}
                        >
                          {t('fromHost', {
                            when: visibleInvite.when === 'Just now' ? t('justNow') : visibleInvite.when === '2h ago' ? t('ago2h') : t('yesterday'),
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => nav(`/event/${g.id}`)}
                      className="row"
                      style={{
                        background: 'rgba(255,255,255,.65)',
                        borderRadius: 16,
                        padding: 12,
                        width: '100%',
                        marginTop: 12,
                        textAlign: 'start',
                      }}
                    >
                      <Flower accent={visibleInvite.accent} size={40}>
                        <Icon name={g.icon} size={18} />
                      </Flower>
                      <span>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: 18,
                          }}
                        >
                          {g.title}
                        </strong>
                        <span
                          style={{
                            fontSize: 14,
                          }}
                        >
                          {full(g.date)}
                          {' · '}
                          {g.start}
                          {' · '}
                          {g.place}
                        </span>
                      </span>
                    </button>
                    <p
                      style={{
                        margin: '14px 0',
                        fontSize: 15,
                      }}
                    >
                      “{invite(visibleInvite.id, visibleInvite.note)}”
                    </p>
                    {h ? (
                      <button
                        className="btn"
                        style={{
                          height: 48,
                          background: 'rgba(255,255,255,.7)',
                        }}
                        onClick={() => nav(`/event/${g.id}`)}
                      >
                        <Check size={18} /> {t('goingView')}
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 10,
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            height: 48,
                          }}
                          onClick={() => accept(visibleInvite.id, g.id)}
                        >
                          {t('join')}
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            height: 48,
                          }}
                          onClick={() => dismiss(visibleInvite.id)}
                        >
                          {t('notNow')}
                        </button>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
            <div className="section-head">
              <h2 className="h2">{t('forYouWeek')}</h2>
              <span className="eyebrow">
                {t('nNew', {
                  n: 3,
                })}
              </span>
            </div>
            {suggestions.map((suggestion) => {
              const g = byId(suggestion.eventId)
              return <FlowerRow key={suggestion.eventId} e={g} line2={why(suggestion.eventId, suggestion.why)} />
            })}
            <p
              className="tiny"
              style={{
                marginTop: 18,
              }}
            >
              {t('weeklyNote')}{' '}
              <button
                className="link"
                style={{
                  fontSize: 13,
                  color: 'var(--ink)',
                }}
                onClick={() => nav('/profile?section=settings')}
              >
                {t('changeInSettings')}
              </button>
            </p>
          </>
        ) : (
          ['Today', 'Yesterday', 'This week'].map((f) => (
            <section key={f}>
              <h2
                className="eyebrow"
                style={{
                  margin: '18px 0 10px',
                }}
              >
                {t(
                  {
                    Today: 'groupToday',
                    Yesterday: 'groupYesterday',
                    'This week': 'groupThisWeek',
                  }[f],
                )}
              </h2>
              <div
                className="stack"
                style={{
                  gap: 10,
                }}
              >
                {updates
                  .filter((g) => g.group === f)
                  .map((g) => {
                    const h = {
                      ...g,
                      ...update(g.id, g),
                    }
                    const CompY = updateIcons[h.icon]
                    const i = app.joined.includes(h.eventId)
                    return (
                      <article
                        key={h.id}
                        onClick={() => nav(`/event/${h.eventId}`)}
                        className="card"
                        style={{
                          background: f === 'Yesterday' ? 'var(--grey)' : `var(--${h.accent})`,
                          padding: 16,
                          display: 'flex',
                          gap: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          className="icon-btn"
                          style={{
                            width: 40,
                            height: 40,
                            background: f === 'Yesterday' ? `var(--${h.accent})` : 'rgba(255,255,255,.7)',
                          }}
                        >
                          <CompY size={18} />
                        </span>
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
                            {h.kind}
                            {' · '}
                            {h.when === 'Sat' ? wd(12) : h.when === 'Thu' ? wd(10) : h.when}
                          </span>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: 18,
                              margin: '2px 0',
                            }}
                          >
                            {h.title}
                          </strong>
                          <span
                            style={{
                              fontSize: 14,
                              color: 'var(--muted-2)',
                            }}
                          >
                            {h.text}
                          </span>
                          {h.action &&
                            (i ? (
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  marginTop: 8,
                                  fontWeight: 600,
                                  fontSize: 14,
                                }}
                              >
                                <Check size={16} /> {t('spotSaved')}
                              </span>
                            ) : (
                              <button
                                className="link"
                                style={{
                                  display: 'block',
                                  marginTop: 8,
                                }}
                                onClick={(j) => {
                                  j.stopPropagation()
                                  app.join(h.eventId)
                                  nav(`/event/${h.eventId}/joined`)
                                }}
                              >
                                {h.action}
                              </button>
                            ))}
                        </span>
                      </article>
                    )
                  })}
              </div>
            </section>
          ))
        )}
      </div>
    </Screen>
  )
}
