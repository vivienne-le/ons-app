import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { DayList, useDayLabel } from '../components/DayList'
import { FilterSheet, filterChips, filtersFromParams, filtersToParams, matches } from '../components/Filters'
import { MonthCalendar, dayKey } from '../components/MonthCalendar'
import { BackButton, NavBar, Screen } from '../components/UI'
import { ViewToggle } from '../components/ViewToggle'
import { byId, events, forYou, joinToday, popular } from '../data/events'
import { useI18n } from '../i18n/index'
import { TODAY } from './Home'
import { useApp } from '../state/AppState'
export const lists = {
  foryou: { title: 'forYou', ids: forYou },
  popular: { title: 'popular', ids: popular },
  today: { title: 'joinToday', ids: joinToday },
}
export const catKey = {
  All: 'catAll',
  Food: 'catFood',
  Sport: 'catSport',
  Social: 'catSocial',
  Creative: 'catCreative',
  Outdoors: 'catOutdoors',
}
export function Search() {
  const [params, setParams] = useSearchParams()
  const { joined } = useApp()
  const { t, ev } = useI18n()
  const dayLabel = useDayLabel()
  const list = lists[params.get('list') ?? '']
  const filters = filtersFromParams(params)
  const view = params.get('view') === 'calendar' ? 'calendar' : 'list'
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(params.get('filter') === '1')
  const [selected, setSelected] = useState(dayKey(2026, 11, TODAY))
  const keep = () => {
    const base = {}
    if (params.get('list')) base.list = params.get('list')
    if (view === 'calendar') base.view = 'calendar'
    return base
  }
  const apply = (f, extra = {}) => {
    const next = filtersToParams(f, { ...keep(), ...extra })
    Object.keys(next).forEach((k) => next[k] === undefined && delete next[k])
    setParams(next, { replace: true })
  }
  const results = useMemo(() => {
    const pool = list ? list.ids.map((id) => byId(id)) : events
    const q = query.trim().toLowerCase()
    return pool
      .filter((e) => {
        const s = ev(e)
        const text = `${e.title} ${s.title} ${s.short} ${e.place} ${e.tags.join(' ')} ${s.tags.join(' ')} ${e.category} ${e.host.name}`
        return (!q || text.toLowerCase().includes(q)) && matches(e, filters)
      })
      .sort((a, b) => a.date - b.date || a.start.localeCompare(b.start))
  }, [query, params, list, ev])
  const chips = filterChips(filters, t)
  // Calendar: a dot for every activity, a lime ring when you're going
  const marks = {}
  for (const e of results) {
    const k = dayKey(2026, 11, e.date)
    marks[k] ??= []
    if (joined.includes(e.id)) marks[k].push({ color: '#A8B400', ring: true })
    else if (!marks[k].some((m) => !m.ring)) marks[k].push({ color: 'var(--ink)' })
  }
  const selDay = +selected.split('-')[2]
  const dayItems = selected.startsWith('2026-11-') ? results.filter((e) => e.date === selDay) : []
  return (
    <Screen>
      <div className="pad safe-top" style={{ paddingBottom: 8 }}>
        <div className="row">
          <BackButton />
          <h1 className="h2" style={{ flex: 1 }}>
            {t(list ? list.title : 'allEvents')}
          </h1>
          <ViewToggle value={view} onChange={(v) => apply(filters, v === 'calendar' ? { view: 'calendar' } : { view: undefined })} />
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <label
            style={{
              flex: 1,
              height: 48,
              borderRadius: 999,
              background: 'var(--grey)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 16px',
            }}
          >
            <SearchIcon size={18} aria-hidden />
            <span className="sr-only">{t('search')}</span>
            <input
              value={query}
              onChange={(n) => setQuery(n.target.value)}
              placeholder={t('searchPlaceholder')}
              style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 15, minWidth: 0 }}
            />
            {query && (
              <button aria-label={t('clearSearch')} onClick={() => setQuery('')}>
                <X size={18} />
              </button>
            )}
          </label>
          <button
            className="icon-btn dark"
            style={{ width: 48, height: 48 }}
            aria-label={t('filters')}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
        {chips.length > 0 && (
          <div className="row no-bar" style={{ gap: 8, marginTop: 12, overflowX: 'auto', marginInline: 'calc(var(--pad) * -1)', paddingInline: 'var(--pad)' }}>
            {chips.map((c) => (
              <span
                key={c.id}
                className="row"
                style={{
                  flex: 'none',
                  gap: 8,
                  background: 'var(--ink)',
                  color: 'var(--white)',
                  borderRadius: 999,
                  padding: '6px 6px 6px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {c.label}
                <button
                  aria-label={t('removeFilter', { name: c.label })}
                  onClick={() => apply({ ...filters, ...c.clear })}
                  style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'grid', placeItems: 'center' }}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="scroll pad with-nav">
        {view === 'calendar' && (
          <>
            <div style={{ marginTop: 6 }}>
              <MonthCalendar
                selected={selected}
                onSelect={setSelected}
                marks={marks}
                legend={[
                  { color: 'var(--ink)', label: t('legEvents') },
                  { color: '#A8B400', ring: true, label: t('legYouGoing') },
                ]}
              />
            </div>
            <div className="row" style={{ justifyContent: 'space-between', margin: '20px 0 8px' }}>
              <h2 className="eyebrow" style={{ color: 'var(--ink)' }}>
                {selected.startsWith('2026-11-') ? dayLabel(selDay) : ''}
              </h2>
              <span className="eyebrow" style={{ fontSize: 10 }}>
                {t('nEventsCount', { n: dayItems.length })}
              </span>
            </div>
            {dayItems.length === 0 ? (
              <p className="small">{t('nothingThatDay')}</p>
            ) : (
              <DayList items={dayItems} hideHeader />
            )}
          </>
        )}
        {view === 'list' &&
          (results.length > 0 ? (
            <DayList items={results} count={t('nFound', { n: results.length })} />
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 12px' }}>
              <h2 className="h3">{t('nothingFound')}</h2>
              <p className="small" style={{ marginTop: 6 }}>
                {t('tryAnother')}
              </p>
              <button
                className="btn btn-soft btn-sm"
                style={{ margin: '16px auto 0' }}
                onClick={() => {
                  setQuery('')
                  apply({ ...filters, when: '', where: '', sizes: [], free: false, stairs: false, quiet: false, newbies: false })
                }}
              >
                {t('clearEverything')}
              </button>
            </div>
          ))}
      </div>
      <NavBar />
      <FilterSheet
        open={filtersOpen}
        value={filters}
        onClose={() => setFiltersOpen(false)}
        onSearch={(f) => {
          setFiltersOpen(false)
          apply(f)
        }}
      />
    </Screen>
  )
}
