import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, MessageSquare, PartyPopper, MapPin as PinIcon } from 'lucide-react'
import { FlowerRow } from '../components/Cards'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { MonthCalendar } from '../components/MonthCalendar'
import { NavBar, Screen, SegTabs } from '../components/UI'
import { beenTo, byId } from '../data/events'
import { useI18n } from '../i18n/index'
import { TODAY } from './Home'
import { useApp } from '../state/AppState'
export function Plans() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'upcoming'
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
  const thisWeek = saved.filter((d) => d.date <= TODAY + 6)
  const later = saved.filter((d) => d.date > TODAY + 6)
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
          line2={t('going', {
            n: app.goingCount(d.id),
          })}
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
                {
                  tab: d,
                },
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
        <MonthCalendar />
        {tab === 'upcoming' &&
          (upcoming.length === 0 ? (
            <EmptyState
              title={t('noPlans')}
              text={t('noPlansSub')}
              cta={t('findSomething')}
              onCta={() => nav('/search')}
            />
          ) : (
            upcoming.map((d) => {
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
                    {full(i.date)}
                    {i.date === TODAY + 1 ? ` · ${t('tomorrow')}` : ''}
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
                              color: 'var(--muted-2)',
                            }}
                          >
                            {t('wrote', {
                              name: j.author.name,
                              text: commentIn(j).slice(0, 38) + '…',
                            })}
                          </span>
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
              <p
                className="tiny"
                style={{
                  margin: '6px 0 12px',
                }}
              >
                {t('onlyYouSaved')}
              </p>
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
            <h2
              className="eyebrow"
              style={{
                margin: '22px 0 8px',
              }}
            >
              {t('mostJoined')}
            </h2>
            {beenTo.map((i) => (
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
