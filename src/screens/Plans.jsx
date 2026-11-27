import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, MessageSquare, PartyPopper, MapPin as PinIcon } from 'lucide-react'
import { FlowerRow } from '../components/Cards'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { MonthCalendar, dayKey } from '../components/MonthCalendar'
import { useDayLabel } from '../components/DayList'
import { ViewToggle } from '../components/ViewToggle'
import { NavBar, Screen, SegTabs } from '../components/UI'
import { beenTo, byId } from '../data/events'
import { useI18n } from '../i18n/index'
import { TODAY } from './Home'
import { useApp } from '../state/AppState'
export function Plans() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'upcoming'
  const view = params.get('view') === 'calendar' ? 'calendar' : 'list'
  const setView = (v) => setParams(v === 'calendar' ? { tab, view: v } : { tab }, { replace: true })
  const dayLabel = useDayLabel()
  const app = useApp()
  const { t, ev, full, dm, beenTo: b, commentIn } = useI18n()
  const upcoming = app.joined
    .map((d) => byId(d))
    .filter(Boolean)
    .sort((d, i) => d.date - i.date)
  const saved = app.saved
    .map((d) => byId(d))
    .filter(Boolean)
    .sort((d, i) => d.date - i.date)
  const [selected, setSelected] = useState(dayKey(2026, 11, upcoming[0]?.date ?? TODAY))
  const [selY, selM, selD] = selected.split('-').map(Number)
  const inDec = selY === 2026 && selM === 11
  const onDay = (d) => view === 'list' || (inDec && d.date === selD)
  const visitKey = (v) => {
    const [day, mon] = v.last.split(' ')
    return dayKey(2026, { Oct: 9, Nov: 10, Dec: 11 }[mon], +day)
  }
  const upShown = upcoming.filter(onDay)
  const savedShown = saved.filter(onDay)
  const beenShown = view === 'list' ? beenTo : beenTo.filter((v) => visitKey(v) === selected)
  const thisWeek = savedShown.filter((d) => d.date <= TODAY + 6)
  const later = savedShown.filter((d) => d.date > TODAY + 6)
  const marks = {}
  const mark = (k, color) => (marks[k] ??= []).push({ color })
  if (tab === 'upcoming') upcoming.forEach((d) => mark(dayKey(2026, 11, d.date), `var(--${d.accent === 'lime' ? 'ink' : d.accent})`))
  if (tab === 'saved') saved.forEach((d) => mark(dayKey(2026, 11, d.date), `var(--${d.accent === 'lime' ? 'ink' : d.accent})`))
  if (tab === 'been') beenTo.forEach((v) => mark(visitKey(v), `var(--${v.accent === 'lime' ? 'ink' : v.accent})`))
  const summary =
    view === 'calendar'
      ? null
      : tab === 'upcoming'
        ? t('nPlansInDec', { n: upcoming.length })
        : tab === 'been'
          ? t('nPlacesSince', { n: 12 })
          : null
  const savedRow = (d) => {
    const i = app.joined.includes(d.id)
    return (
      <div
        key={d.id}
        className="card"
        style={{
          padding: '4px 14px',
          marginBottom: 8,
        }}
      >
        <FlowerRow
          e={d}
          line1={`${full(d.date)} · ${d.place}`}
          line2={
            d.date <= TODAY + 6 && d.date > TODAY
              ? t('startsIn', { n: d.date - TODAY })
              : t('going', {
                  n: app.goingCount(d.id),
                })
          }
          right={
            i ? (
              <span
                className="tag"
                style={{
                  background: 'var(--lime)',
                  color: 'var(--ink)',
                  padding: '6px 10px',
                }}
              >
                <Check size={13} /> {t('goingTag')}
              </span>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                style={{
                  height: 34,
                  padding: '0 16px',
                  fontSize: 14,
                }}
                onClick={(j) => {
                  j.stopPropagation()
                  app.join(d.id)
                  nav(`/event/${d.id}/joined`)
                }}
              >
                {t('join')}
              </button>
            )
          }
        />
      </div>
    )
  }
  return (
    <Screen>
      <div
        className="pad safe-top"
        style={{
          paddingBottom: 12,
        }}
      >
        <h1 className="h1">{t('plans')}</h1>
        <div
          style={{
            marginTop: 18,
          }}
        >
          <SegTabs
            value={tab}
            onChange={(d) =>
              setParams(
                view === 'calendar' ? { tab: d, view } : { tab: d },
                {
                  replace: true,
                },
              )
            }
            options={[
              {
                id: 'upcoming',
                label: t('upcoming'),
              },
              {
                id: 'saved',
                label: t('saved'),
              },
              {
                id: 'been',
                label: t('beenTo'),
              },
            ]}
          />
        </div>
      </div>
      <div className="scroll pad with-nav">
        <div className="row" style={{ justifyContent: 'space-between', margin: '2px 0 12px', gap: 12 }}>
          {tab === 'saved' && view === 'list' ? (
            <p className="small" style={{ fontSize: 14 }}>
              {t('onlyYouSaved')}
            </p>
          ) : (
            <span className="eyebrow" style={{ color: 'var(--ink)' }}>
              {summary ?? t('decemberYear')}
            </span>
          )}
          <ViewToggle value={view} onChange={setView} />
        </div>
        {view === 'calendar' && (
          <div style={{ marginBottom: 18 }}>
            <MonthCalendar selected={selected} onSelect={setSelected} marks={marks} />
          </div>
        )}
        {tab === 'upcoming' &&
          (upShown.length === 0 ? (
            view === 'calendar' ? (
              <p className="small">{t('nothingThatDay')}</p>
            ) :
            <EmptyState
              title={t('noPlans')}
              text={t('noPlansSub')}
              cta={t('findSomething')}
              onCta={() => nav('/search')}
            />
          ) : (
            upShown.map((d) => {
              const i = ev(d)
              const j = i.comments.slice(-1)[0]
              return (
                <section
                  key={i.id}
                  style={{
                    marginTop: 14,
                  }}
                >
                  <h2
                    className="eyebrow"
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    {dayLabel(i.date)}
                  </h2>
                  <div
                    className="card"
                    role="link"
                    tabIndex={0}
                    onClick={() => nav(`/event/${i.id}`)}
                    onKeyDown={(k) => k.key === 'Enter' && nav(`/event/${i.id}`)}
                    style={{
                      background: `var(--${i.accent})`,
                      padding: 16,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className="eyebrow"
                      style={{
                        color: 'var(--ink)',
                        fontSize: 11,
                      }}
                    >
                      {i.time}
                    </div>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: 24,
                        margin: '4px 0',
                      }}
                    >
                      {i.title}
                    </strong>
                    <span
                      style={{
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <PinIcon size={13} /> {i.place}
                      {' · '}
                      {t('going', {
                        n: app.goingCount(i.id),
                      })}
                    </span>
                    {j && (
                      <button
                        className="row"
                        onClick={(k) => {
                          k.stopPropagation()
                          nav(`/event/${i.id}?c=1`)
                        }}
                        style={{
                          marginTop: 12,
                          background: 'rgba(255,255,255,.7)',
                          borderRadius: 14,
                          padding: '10px 12px',
                          width: '100%',
                          textAlign: 'start',
                        }}
                      >
                        <MessageSquare size={18} />
                        <span
                          style={{
                            flex: 1,
                          }}
                        >
                          <strong
                            style={{
                              display: 'block',
                              fontSize: 14,
                            }}
                          >
                            {t('eventComment')}
                          </strong>
                          <span
                            style={{
                              fontSize: 13,
                            }}
                          >
                            {i.comments.length > 1
                              ? t('commentedOthers', {
                                  name: j.author.id === i.host.id ? `${j.author.name} (${t('host')})` : j.author.name,
                                  n: i.comments.length - 1,
                                })
                              : t('commentedOne', { name: j.author.name })}
                          </span>
                        </span>
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: 'var(--ink)',
                            color: 'var(--white)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 12,
                            fontWeight: 600,
                            flex: 'none',
                          }}
                        >
                          {i.comments.length}
                        </span>
                      </button>
                    )}
                  </div>
                </section>
              )
            })
          ))}
        {tab === 'saved' &&
          (saved.length === 0 ? (
            <EmptyState
              title={t('nothingSaved')}
              text={t('nothingSavedSub')}
              cta={t('exploreActivities')}
              onCta={() => nav('/search')}
            />
          ) : (
            <>
              {view === 'calendar' && savedShown.length === 0 && <p className="small">{t('nothingThatDay')}</p>}
              {thisWeek.length > 0 && (
                <h2
                  className="eyebrow"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  {t('thisWeek')}
                </h2>
              )}
              {thisWeek.map(savedRow)}
              {later.length > 0 && (
                <h2
                  className="eyebrow"
                  style={{
                    margin: '16px 0 8px',
                  }}
                >
                  {t('later')}
                </h2>
              )}
              {later.map(savedRow)}
            </>
          ))}
        {tab === 'been' && (
          <>
            {view === 'calendar' && beenShown.length === 0 && <p className="small">{t('nothingThatDay')}</p>}
            {view === 'list' && (
            <div
              className="card row"
              style={{
                background: 'var(--pink)',
                padding: 18,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  flex: 1,
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    fontSize: 26,
                  }}
                >
                  {t('nEvents', {
                    n: 12,
                  })}
                </strong>
                <span
                  style={{
                    fontSize: 14,
                  }}
                >
                  {t('sinceOct')}
                </span>
              </span>
              <button className="btn btn-primary btn-sm" onClick={() => app.showToast(t('regular'))}>
                <PartyPopper size={16} /> {t('nice')}
              </button>
            </div>
            )}
            {view === 'list' && (
            <h2
              className="eyebrow"
              style={{
                margin: '22px 0 8px',
              }}
            >
              {t('mostJoined')}
            </h2>
            )}
            {beenShown.map((i) => (
              <div
                key={i.title}
                className="card row"
                role="link"
                tabIndex={0}
                onClick={() => nav(`/event/${i.eventId}`)}
                onKeyDown={(d) => d.key === 'Enter' && nav(`/event/${i.eventId}`)}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <Flower accent={i.accent} size={46}>
                  <Icon name={i.icon} size={20} />
                </Flower>
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 17,
                    }}
                  >
                    {b(i.title)}
                  </strong>
                  <span className="tiny">
                    {t('lastTime', {
                      d: dm(i.last),
                    })}
                  </span>
                </span>
                <span
                  className="tag"
                  style={{
                    background: 'var(--white)',
                    color: 'var(--ink)',
                    padding: '6px 10px',
                  }}
                >
                  {i.times === 1
                    ? t('once')
                    : t('nTimes', {
                        n: i.times,
                      })}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      <NavBar />
    </Screen>
  )
}
export function EmptyState({ title, text, cta, onCta }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '56px 16px',
      }}
    >
      <Flower accent="lime" size={90}>
        <Icon name="star" size={30} />
      </Flower>
      <h2
        className="h3"
        style={{
          marginTop: 16,
        }}
      >
        {title}
      </h2>
      <p
        className="small"
        style={{
          marginTop: 6,
        }}
      >
        {text}
      </p>
      <button
        className="btn btn-primary btn-sm"
        style={{
          margin: '18px auto 0',
        }}
        onClick={onCta}
      >
        {cta}
      </button>
    </div>
  )
}
