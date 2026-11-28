import { useEffect, useState } from 'react'
import { Accessibility, Euro, UserPlus, VolumeX } from 'lucide-react'
import { Sheet, Switch } from './UI'
import { useI18n } from '../i18n/index'
import { TODAY } from '../screens/Home'

export const emptyFilters = { when: '', where: '', sizes: [], free: false, stairs: false, quiet: false, newbies: false }

export const whenOpts = [
  { id: 'today', key: 'today' },
  { id: 'week', key: 'thisWeek' },
  { id: 'weekend', key: 'weekend' },
]
export const whereOpts = [
  { id: 'near', key: 'nearMe', sub: '< 1km' },
  { id: 'middelland', label: 'Middelland' },
  { id: 'rotterdam', label: 'Rotterdam' },
]
export const sizeOpts = [
  { id: '1-3', min: 1, max: 3, key: 'sizeIntimate' },
  { id: '4-8', min: 4, max: 8, key: 'sizeSmall' },
  { id: '9-15', min: 9, max: 15, key: 'sizeMedium' },
  { id: '16+', min: 16, max: 999, key: 'sizeLarge' },
]
export const toggleOpts = [
  { id: 'free', key: 'freeOnly', chipKey: 'free', Icon: Euro },
  { id: 'stairs', key: 'noStairs', Icon: Accessibility },
  { id: 'quiet', key: 'quietPlace', Icon: VolumeX },
  { id: 'newbies', key: 'newPeopleWelcome', Icon: UserPlus },
]

// Places without stairs and quiet places (demo data)
const stepFree = ['walk-talk', 'open-kitchen', 'kerststol-kitchen', 'warm-hats', 'board-games', 'christmas-dinner', 'oliebollen']
const quiet = ['walk-talk', 'warm-hats', 'board-games', 'kerststol-kitchen', 'retro-games']
const metres = (walk) => {
  const [n, unit] = walk.split(' ')
  return unit === 'km' ? parseFloat(n) * 1000 : parseFloat(n)
}
// Group size of an activity: how many people it is for
const groupSize = (e) => e.capacity

export function filtersFromParams(p) {
  return {
    when: p.get('when') ?? '',
    where: p.get('where') ?? '',
    sizes: p.get('size') ? p.get('size').split(',') : [],
    free: p.get('free') === '1',
    stairs: p.get('stairs') === '1',
    quiet: p.get('quiet') === '1',
    newbies: p.get('new') === '1',
  }
}
export function filtersToParams(f, base = {}) {
  const out = { ...base }
  if (f.when) out.when = f.when
  if (f.where) out.where = f.where
  if (f.sizes.length) out.size = f.sizes.join(',')
  if (f.free) out.free = '1'
  if (f.stairs) out.stairs = '1'
  if (f.quiet) out.quiet = '1'
  if (f.newbies) out.new = '1'
  return out
}
export function matches(e, f) {
  if (f.when === 'today' && e.date !== TODAY) return false
  if (f.when === 'week' && (e.date < TODAY || e.date > TODAY + 7)) return false
  if (f.when === 'weekend' && !['Sat', 'Sun'].includes(e.day)) return false
  if (f.where === 'near' && metres(e.walk) >= 1000) return false
  if (f.where === 'middelland' && e.area !== 'Middelland') return false
  if (f.sizes.length) {
    const ok = f.sizes.some((id) => {
      const s = sizeOpts.find((o) => o.id === id)
      return groupSize(e) >= s.min && groupSize(e) <= s.max
    })
    if (!ok) return false
  }
  if (f.free && !e.tags.includes('Free')) return false
  if (f.stairs && !stepFree.includes(e.id)) return false
  if (f.quiet && !quiet.includes(e.id)) return false
  if (f.newbies && !e.tags.includes('NewPeopleWelcome') && !e.tags.includes('Beginners')) return false
  return true
}
// The black chips under the search bar, each with its own clear action
export function filterChips(f, t) {
  const chips = []
  if (f.when) chips.push({ id: 'when', label: t(whenOpts.find((o) => o.id === f.when).key), clear: { when: '' } })
  if (f.where) {
    const o = whereOpts.find((w) => w.id === f.where)
    chips.push({ id: 'where', label: o.label ?? t(o.key), clear: { where: '' } })
  }
  if (f.sizes.length) {
    const picked = sizeOpts.filter((o) => f.sizes.includes(o.id))
    const min = picked[0].min
    const max = picked[picked.length - 1].max
    chips.push({
      id: 'size',
      label: t('nPeople', { n: max >= 999 ? `${min}+` : `${min}-${max}` }),
      clear: { sizes: [] },
    })
  }
  for (const o of toggleOpts) if (f[o.id]) chips.push({ id: o.id, label: t(o.chipKey ?? o.key), clear: { [o.id]: false } })
  return chips
}

const tile = (on) => ({
  background: on ? 'var(--ink)' : 'var(--grey)',
  color: on ? 'var(--white)' : 'var(--ink)',
  borderRadius: 16,
  minHeight: 56,
  padding: '8px 6px',
  display: 'grid',
  placeItems: 'center',
  alignContent: 'center',
  fontSize: 16,
  fontWeight: 600,
})

export function FilterSheet({ open, onClose, value, onSearch }) {
  const { t } = useI18n()
  const [f, setF] = useState(value ?? emptyFilters)
  useEffect(() => {
    if (open) setF(value ?? emptyFilters)
  }, [open])
  const set = (patch) => setF({ ...f, ...patch })
  const label = (text) => (
    <div className="eyebrow" style={{ margin: '18px 0 8px', color: 'var(--ink)' }}>
      {text}
    </div>
  )
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 className="h2">{t('filters')}</h2>
        <button onClick={() => setF(emptyFilters)} style={{ fontSize: 14, fontWeight: 600, textDecoration: 'underline' }}>
          {t('clearAll')}
        </button>
      </div>
      {label(t('when'))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {whenOpts.map((o) => (
          <button key={o.id} aria-pressed={f.when === o.id} style={tile(f.when === o.id)} onClick={() => set({ when: f.when === o.id ? '' : o.id })}>
            {t(o.key)}
          </button>
        ))}
      </div>
      {label(t('where'))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {whereOpts.map((o) => (
          <button key={o.id} aria-pressed={f.where === o.id} style={tile(f.where === o.id)} onClick={() => set({ where: f.where === o.id ? '' : o.id })}>
            <span>{o.label ?? t(o.key)}</span>
            {o.sub && <span style={{ fontSize: 10, fontWeight: 400 }}>{o.sub}</span>}
          </button>
        ))}
      </div>
      {label(t('groupSize'))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {sizeOpts.map((o) => {
          const on = f.sizes.includes(o.id)
          return (
            <button
              key={o.id}
              aria-pressed={on}
              style={tile(on)}
              onClick={() => set({ sizes: on ? f.sizes.filter((s) => s !== o.id) : sizeOpts.map((s) => s.id).filter((s) => s === o.id || f.sizes.includes(s)) })}
            >
              <span>{o.id}</span>
              <span style={{ fontSize: 10, fontWeight: 400 }}>{t(o.key)}</span>
            </button>
          )
        })}
      </div>
      {label(t('goodToKnow'))}
      {toggleOpts.map(({ id, key, Icon }) => (
        <div key={id} className="row" style={{ padding: '7px 0', gap: 12 }}>
          <Icon size={18} aria-hidden />
          <span style={{ flex: 1, fontSize: 15 }}>{t(key)}</span>
          <Switch on={f[id]} label={t(key)} onChange={(on) => set({ [id]: on })} />
        </div>
      ))}
      <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => onSearch(f)}>
        {t('search')}
      </button>
    </Sheet>
  )
}
