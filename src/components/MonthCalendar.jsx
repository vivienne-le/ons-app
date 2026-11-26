import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { beenTo, byId, organisations } from '../data/events'
import { useI18n } from '../i18n/index'
import { TODAY } from '../screens/Home'
import { useApp } from '../state/AppState'
export const kindStyle = {
  going: {
    bg: 'var(--ink)',
    key: 'legGoing',
  },
  hosting: {
    bg: 'var(--orange)',
    key: 'legHosting',
  },
  saved: {
    bg: 'var(--pink)',
    key: 'legSaved',
  },
  been: {
    bg: '#7FB241',
    key: 'legBeen',
  },
}
export const monthIdx = {
  Oct: 9,
  Nov: 10,
  Dec: 11,
  Jan: 0,
}
export const calMonths = [
  [2026, 9],
  [2026, 10],
  [2026, 11],
  [2027, 0],
]
export function MonthCalendar() {
  const nav = useNavigate()
  const { joined, saved, posts, user } = useApp()
  const { t, lang, ev } = useI18n()
  const [monthIndex, setMonthIndex] = useState(2)
  const [selected, setSelected] = useState(`2026-11-${TODAY}`)
  const [year, month] = calMonths[monthIndex]
  const locale = lang === 'ar' ? 'ar' : lang
  const byDay = useMemo(() => {
    const p = {}
    const B = (H, G, q, Ne) => {
      var D
      ;(p[(D = `${H}-${G}-${q}`)] ?? (p[D] = [])).push(Ne)
    }
    const F = user.role === 'host' ? (organisations.find((H) => H.name === user.org)?.events ?? []) : []
    for (const H of F) {
      const G = byId(H)
      G &&
        B(2026, 11, G.date, {
          kind: 'hosting',
          title: ev(G).title,
          time: G.start,
          to: `/event/${H}`,
        })
    }
    for (const H of posts)
      B(2026, 11, H.date, {
        kind: 'hosting',
        title: H.title,
        time: H.start,
        to: `/post/mine/${H.id}`,
      })
    for (const H of joined) {
      const G = byId(H)
      G &&
        !F.includes(H) &&
        B(2026, 11, G.date, {
          kind: 'going',
          title: ev(G).title,
          time: G.start,
          to: `/event/${H}`,
        })
    }
    for (const H of saved) {
      const G = byId(H)
      G &&
        !joined.includes(H) &&
        !F.includes(H) &&
        B(2026, 11, G.date, {
          kind: 'saved',
          title: ev(G).title,
          time: G.start,
          to: `/event/${H}`,
        })
    }
    for (const H of beenTo) {
      const [G, q] = H.last.split(' ')
      const Ne = byId(H.eventId)
      B(2026, monthIdx[q], +G, {
        kind: 'been',
        title: Ne ? ev(Ne).title : H.title,
        to: `/event/${H.eventId}`,
      })
    }
    return p
  }, [joined, saved, posts, user, ev])
  const firstDay = new Date(year, month, 1)
  const leadingBlanks = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(firstDay)
  const weekdayNames = Array.from(
    {
      length: 7,
    },
    (n, B) =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'narrow',
      }).format(new Date(2026, 11, 7 + B)),
  )
  const formatDay = (n, B, F) =>
    new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date(n, B, F))
  const [selYear, selMonth, selDay] = selected.split('-').map(Number)
  const selectedItems = byDay[selected] ?? []
  return (
    <section
      className="card"
      style={{
        padding: 14,
        marginTop: 4,
      }}
      aria-label={t('calTitle')}
    >
      <div
        className="row"
        style={{
          justifyContent: 'space-between',
        }}
      >
        <button
          className="icon-btn white"
          style={{
            width: 36,
            height: 36,
          }}
          aria-label={t('prevMonth')}
          disabled={monthIndex === 0}
          onClick={() => setMonthIndex(monthIndex - 1)}
        >
          <ChevronLeft size={18} className="flip-rtl" />
        </button>
        <strong
          style={{
            fontSize: 17,
            textTransform: 'capitalize',
          }}
          aria-live="polite"
        >
          {monthTitle}
        </strong>
        <button
          className="icon-btn white"
          style={{
            width: 36,
            height: 36,
          }}
          aria-label={t('nextMonth')}
          disabled={monthIndex === calMonths.length - 1}
          onClick={() => setMonthIndex(monthIndex + 1)}
        >
          <ChevronRight size={18} className="flip-rtl" />
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2,
          marginTop: 10,
          textAlign: 'center',
        }}
      >
        {weekdayNames.map((n, B) => (
          <span
            key={B}
            aria-hidden
            className="tiny"
            style={{
              fontSize: 11,
              fontWeight: 600,
              paddingBottom: 4,
            }}
          >
            {n}
          </span>
        ))}
        {Array.from(
          {
            length: leadingBlanks,
          },
          (n, B) => (
            <span key={`e${B}`} />
          ),
        )}
        {Array.from(
          {
            length: daysInMonth,
          },
          (p, B) => {
            const F = B + 1
            const q = `${year}-${month}-${F}`
            const H = byDay[q] ?? []
            const G = year === 2026 && month === 11 && F === TODAY
            const r = H.some((A) => A.kind === 'going' || A.kind === 'hosting')
            const Ne = selected === q
            const D = [...new Set(H.map((A) => A.kind))]
            return (
              <button
                key={F}
                onClick={() => setSelected(q)}
                aria-pressed={Ne}
                aria-label={t('dayPlans', {
                  date: formatDay(year, month, F),
                  n: H.length,
                })}
                style={{
                  height: 44,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  alignContent: 'center',
                  gap: 2,
                  background: Ne ? 'var(--white)' : 'transparent',
                  boxShadow: Ne ? '0 0 0 2px var(--ink)' : undefined,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 14,
                    fontWeight: r || G ? 700 : 400,
                    background: r
                      ? H.some((A) => A.kind === 'hosting')
                        ? 'var(--orange)'
                        : 'var(--ink)'
                      : 'transparent',
                    color: r ? 'var(--white)' : 'var(--ink)',
                    boxShadow: G && !r ? 'inset 0 0 0 2px var(--ink)' : undefined,
                  }}
                >
                  {F}
                </span>
                <span
                  style={{
                    display: 'flex',
                    gap: 2,
                    height: 5,
                  }}
                  aria-hidden
                >
                  {D.filter((A) => A !== 'going' && A !== 'hosting').map((A) => (
                    <span
                      key={A}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: kindStyle[A].bg,
                      }}
                    />
                  ))}
                </span>
              </button>
            )
          },
        )}
      </div>
      <div
        className="row"
        style={{
          flexWrap: 'wrap',
          gap: '4px 12px',
          marginTop: 10,
          fontSize: 12,
        }}
      >
        {Object.keys(kindStyle).map((n) => (
          <span
            key={n}
            className="row"
            style={{
              gap: 5,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: kindStyle[n].bg,
              }}
            />
            {t(kindStyle[n].key)}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          borderTop: '1px solid var(--grey-2)',
          paddingTop: 10,
        }}
        aria-live="polite"
      >
        {selectedItems.length > 0 && (
          <div
            className="eyebrow"
            style={{
              marginBottom: 6,
            }}
          >
            {formatDay(selYear, selMonth, selDay)}
          </div>
        )}
        {selectedItems.length === 0 ? (
          <p className="small">
            {t('nothingOnDay', {
              date: formatDay(selYear, selMonth, selDay),
            })}
          </p>
        ) : (
          selectedItems.map((n, B) => (
            <button
              key={B}
              className="row"
              onClick={() => nav(n.to)}
              style={{
                width: '100%',
                padding: '8px 0',
                textAlign: 'start',
                gap: 10,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: kindStyle[n.kind].bg,
                  flex: 'none',
                }}
              />
              <span
                style={{
                  flex: 1,
                }}
              >
                <strong
                  style={{
                    fontSize: 15,
                  }}
                >
                  {n.title}
                </strong>
                <span
                  className="tiny"
                  style={{
                    display: 'block',
                  }}
                >
                  {t(kindStyle[n.kind].key)}
                  {n.time ? ` · ${n.time}` : ''}
                </span>
              </span>
              <ChevronRight size={16} className="flip-rtl" aria-hidden />
            </button>
          ))
        )}
      </div>
    </section>
  )
}
