import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronLeft, House, Map as MapIcon, Plus, User } from 'lucide-react'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function BackButton({ to, variant = 'grey', label }) {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <button
      className={`icon-btn ${variant === 'white' ? 'white' : ''}`}
      aria-label={label ?? t('back')}
      onClick={() => (to ? nav(to) : window.history.length > 1 ? nav(-1) : nav('/home'))}
    >
      <ChevronLeft size={22} className="flip-rtl" />
    </button>
  )
}
export function Screen({ children, lime, className = '' }) {
  return <div className={`screen ${lime ? 'lime' : ''} ${className}`}>{children}</div>
}
export function NavBar() {
  const { t } = useI18n()
  const items = [
    {
      to: '/home',
      label: t('navHome'),
      Icon: House,
    },
    {
      to: '/map',
      label: t('navMap'),
      Icon: MapIcon,
    },
    {
      to: '/plans',
      label: t('navPlans'),
      Icon: CalendarDays,
    },
    {
      to: '/profile',
      label: t('navProfile'),
      Icon: User,
    },
  ]
  const isHost = useApp().user.role === 'host'
  const renderLink = ({ to: d, label, Icon }) => (
    <NavLink key={d} to={d} className={({ isActive }) => (isActive ? 'active' : '')}>
      <Icon size={20} aria-hidden /> {label}
    </NavLink>
  )
  return (
    <nav className={`nav ${isHost ? 'has-post' : ''}`} aria-label={t('mainNav')}>
      {items.slice(0, 2).map(renderLink)}
      {isHost && (
        <NavLink to="/post" className="nav-post" aria-label={t('newActivity')}>
          <span className="nav-post-btn">
            <Plus size={26} strokeWidth={2.5} aria-hidden />
          </span>
        </NavLink>
      )}
      {items.slice(2).map(renderLink)}
    </nav>
  )
}
export function ToastHost() {
  const { toast } = useApp()
  return toast ? (
    <div key={toast.id} className="toast" role="status">
      <span>{toast.text}</span>
      {toast.action && <button onClick={toast.action.run}>{toast.action.label}</button>}
    </div>
  ) : null
}
export function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const a = (b) => b.key === 'Escape' && onClose()
    window.addEventListener('keydown', a)
    return () => window.removeEventListener('keydown', a)
  }, [open, onClose])
  return open ? (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-handle" />
        {title && (
          <h2
            className="h2"
            style={{
              marginBottom: 16,
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </>
  ) : null
}
export function WhenWhere({ date, time, place, area, onMap }) {
  const { t, full } = useI18n()
  return (
    <div className="when-where">
      <div>
        <div className="eyebrow">{t('whenLabel')}</div>
        <strong>{full(date)}</strong>
        <span>{time}</span>
      </div>
      <div>
        <div className="eyebrow">{t('whereLabel')}</div>
        <strong>{place}</strong>
        {onMap ? (
          <button
            onClick={onMap}
            style={{
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontSize: 14,
              opacity: 0.9,
            }}
          >
            {t('mapLink', {
              area,
            })}
          </button>
        ) : (
          <span>{area}</span>
        )}
      </div>
    </div>
  )
}
export function SegTabs({ value, options, onChange }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        background: 'var(--grey)',
        borderRadius: 999,
        padding: 0,
        height: 50,
      }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          role="tab"
          aria-selected={value === option.id}
          onClick={() => onChange(option.id)}
          style={{
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
            background: value === option.id ? 'var(--ink)' : 'transparent',
            color: value === option.id ? 'var(--white)' : 'var(--ink)',
            transition: 'background .2s, color .2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
export function Progress({ step, total = 5 }) {
  const { t } = useI18n()
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
      }}
      aria-label={t('stepOf', {
        n: step,
        total,
      })}
    >
      {Array.from(
        {
          length: total,
        },
        (a, b) => (
          <span
            key={b}
            style={{
              width: 22,
              height: 4,
              borderRadius: 2,
              background: b < step ? 'var(--ink)' : '#E8E6E0',
              transition: 'background .3s',
            }}
          />
        ),
      )}
    </div>
  )
}
export function Switch({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      style={{
        width: 50,
        height: 30,
        borderRadius: 999,
        background: on ? 'var(--ink)' : 'var(--grey-2)',
        position: 'relative',
        transition: 'background .2s',
        flex: 'none',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--white)',
          transition: 'left .2s var(--ease)',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }}
      />
    </button>
  )
}
