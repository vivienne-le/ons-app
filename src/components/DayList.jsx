import { useNavigate } from 'react-router-dom'
import { Check, MapPin } from 'lucide-react'
import { HeartButton } from './Cards'
import { Flower } from './Flower'
import { Icon } from './Icon'
import { useI18n } from '../i18n/index'
import { TODAY } from '../screens/Home'
import { useApp } from '../state/AppState'

// "TODAY · SUN 13 DEC" / "TOMORROW · MON 14 DEC" / "THU 17 DEC"
export function useDayLabel() {
  const { t, full } = useI18n()
  return (date) => {
    const base = full(date)
    if (date === TODAY) return `${t('today')} · ${base}`
    if (date === TODAY + 1) return `${t('tomorrow')} · ${base}`
    return base
  }
}

// One activity as a grey card (lime when you're going), like the Figma search result
export function EventRow({ e: event }) {
  const nav = useNavigate()
  const { joined, goingCount } = useApp()
  const { t, ev } = useI18n()
  const e = ev(event)
  const going = joined.includes(e.id)
  const clover = going && e.accent === 'lime' ? 'pink' : e.accent
  const open = () => nav(`/event/${e.id}`)
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(k) => k.key === 'Enter' && open()}
      className="row"
      style={{
        cursor: 'pointer',
        background: going ? 'var(--lime)' : 'var(--grey)',
        borderRadius: 20,
        padding: 12,
        gap: 12,
        marginBottom: 8,
      }}
    >
      <Flower accent={clover} size={52}>
        <Icon name={e.icon} size={22} />
      </Flower>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="eyebrow" style={{ color: 'var(--ink)', fontSize: 11 }}>
          {e.start}
        </span>
        <strong style={{ display: 'block', fontSize: 16, fontWeight: 600, marginTop: 2 }}>{e.title}</strong>
        <span className="row" style={{ gap: 3, fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          <MapPin size={11} aria-hidden />
          {e.place}
          {' · '}
          {t('going', { n: goingCount(e.id) })}
        </span>
      </span>
      {going ? (
        <span
          className="tag"
          style={{ background: 'var(--ink)', color: 'var(--white)', padding: '6px 10px', fontSize: 13, fontWeight: 600 }}
        >
          <Check size={13} /> {t('goingTag')}
        </span>
      ) : (
        <HeartButton id={e.id} light />
      )}
    </div>
  )
}

// Activities grouped by day with a mono date header; the first header can carry a count
export function DayList({ items, count, hideHeader }) {
  const dayLabel = useDayLabel()
  const days = [...new Set(items.map((e) => e.date))]
  return days.map((date, i) => (
    <section key={date} style={{ marginTop: i ? 18 : 6 }}>
      {!hideHeader && (
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="eyebrow" style={{ color: 'var(--ink)' }}>
          {dayLabel(date)}
        </h2>
        {i === 0 && count && (
          <span className="eyebrow" style={{ fontSize: 10 }}>
            {count}
          </span>
        )}
      </div>
      )}
      {items
        .filter((e) => e.date === date)
        .map((e) => (
          <EventRow key={e.id} e={e} />
        ))}
    </section>
  ))
}
