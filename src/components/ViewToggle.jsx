import { CalendarDays, List } from 'lucide-react'
import { useI18n } from '../i18n/index'

// List / calendar switch: a grey pill with two round buttons, the active one black
export function ViewToggle({ value, onChange }) {
  const { t } = useI18n()
  const opt = (id, Icon, label) => (
    <button
      key={id}
      aria-pressed={value === id}
      aria-label={label}
      onClick={() => onChange(id)}
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: value === id ? 'var(--ink)' : 'transparent',
        color: value === id ? 'var(--white)' : 'var(--ink)',
      }}
    >
      <Icon size={15} />
    </button>
  )
  return (
    <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--grey)', flex: 'none' }}>
      {opt('list', List, t('listView'))}
      {opt('calendar', CalendarDays, t('calendarView'))}
    </div>
  )
}
