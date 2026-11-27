import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../i18n/index'
import { TODAY } from '../screens/Home'

// The months the demo covers (month is 0-based like Date)
export const calMonths = [
  [2026, 9],
  [2026, 10],
  [2026, 11],
  [2027, 0],
]
export const dayKey = (y, m, d) => `${y}-${m}-${d}`

// Month grid in the Figma style: grey card, Monday first, days of the
// neighbouring months greyed, today ringed, the selected day filled black.
// marks: { 'y-m-d': [{ color, ring }] } draws small dots under a day.
// bold: Set of 'y-m-d' keys shown in bold (days with plans).
export function MonthCalendar({ selected, onSelect, marks = {}, bold, legend }) {
  const { t, lang } = useI18n()
  const [monthIndex, setMonthIndex] = useState(2)
  const [year, month] = calMonths[monthIndex]
  const locale = lang === 'ar' ? 'ar' : lang
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7
  const cells = Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - lead + i))
  const rows = cells[35].getMonth() === month ? 6 : 5
  const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(first)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2026, 11, 7 + i)).replace('.', ''),
  )
  const longDay = (d) => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  return (
    <section className="card" style={{ padding: '16px 12px', borderRadius: 24 }} aria-label={t('calTitle')}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 4px' }}>
        <button
          className="icon-btn white"
          style={{ width: 36, height: 36, boxShadow: 'none' }}
          aria-label={t('prevMonth')}
          disabled={monthIndex === 0}
          onClick={() => setMonthIndex(monthIndex - 1)}
        >
          <ChevronLeft size={18} className="flip-rtl" />
        </button>
        <strong style={{ fontSize: 17, fontWeight: 600, textTransform: 'capitalize' }} aria-live="polite">
          {title}
        </strong>
        <button
          className="icon-btn white"
          style={{ width: 36, height: 36, boxShadow: 'none' }}
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
          rowGap: 4,
          marginTop: 14,
          textAlign: 'center',
        }}
      >
        {weekdays.map((w, i) => (
          <span key={i} aria-hidden className="eyebrow" style={{ fontSize: 10, paddingBottom: 6, color: 'var(--muted)' }}>
            {w}
          </span>
        ))}
        {cells.slice(0, rows * 7).map((date) => {
          const y = date.getFullYear()
          const m = date.getMonth()
          const d = date.getDate()
          const key = dayKey(y, m, d)
          const inMonth = m === month
          const isToday = y === 2026 && m === 11 && d === TODAY
          const isSel = selected === key
          const dots = inMonth ? (marks[key] ?? []) : []
          const isBold = inMonth && (bold?.has(key) || dots.length > 0)
          return (
            <button
              key={key}
              disabled={!inMonth}
              onClick={() => onSelect?.(key)}
              aria-pressed={isSel}
              aria-label={longDay(date)}
              style={{ height: 46, display: 'grid', placeItems: 'center', alignContent: 'start', gap: 2 }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 15,
                  fontWeight: isSel || isBold ? 600 : 400,
                  background: isSel ? 'var(--ink)' : 'transparent',
                  color: isSel ? 'var(--white)' : inMonth ? 'var(--ink)' : '#B5B3AE',
                  boxShadow: isToday && !isSel ? 'inset 0 0 0 1.5px var(--ink)' : undefined,
                }}
              >
                {d}
              </span>
              <span style={{ display: 'flex', gap: 3, height: 6 }} aria-hidden>
                {dots.slice(0, 3).map((dot, i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: dot.ring ? 'transparent' : dot.color,
                      boxShadow: dot.ring ? `inset 0 0 0 1.5px ${dot.color}` : undefined,
                    }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>
      {legend && (
        <div className="row" style={{ gap: 16, marginTop: 8, padding: '0 6px', fontSize: 12 }}>
          {legend.map((l) => (
            <span key={l.label} className="row" style={{ gap: 6 }}>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: l.ring ? 'transparent' : l.color,
                  boxShadow: l.ring ? `inset 0 0 0 1.5px ${l.color}` : undefined,
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
