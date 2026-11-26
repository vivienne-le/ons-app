import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { RowCard } from '../components/Cards'
import { BackButton, NavBar, Screen, Sheet } from '../components/UI'
import { byId, events, forYou, joinToday, popular } from '../data/events'
import { useI18n } from '../i18n/index'
import { TODAY } from './Home'
import { useApp } from '../state/AppState'
export const lists = {
  foryou: {
    title: 'forYou',
    ids: forYou,
  },
  popular: {
    title: 'popular',
    ids: popular,
  },
  today: {
    title: 'joinToday',
    ids: joinToday,
  },
}
export const whenKey = {
  'Any day': 'anyDay',
  Today: 'today',
  'This week': 'thisWeek',
  Weekend: 'weekend',
}
export const catKey = {
  All: 'catAll',
  Food: 'catFood',
  Sport: 'catSport',
  Social: 'catSocial',
  Creative: 'catCreative',
  Outdoors: 'catOutdoors',
}
export const whenOptions = ['Any day', 'Today', 'This week', 'Weekend']
export const catOptions = ['Food', 'Sport', 'Social', 'Creative', 'Outdoors']
export function Search() {
  const [params, setParams] = useSearchParams()
  const { goingCount } = useApp()
  const { t, ev } = useI18n()
  const list = lists[params.get('list') ?? '']
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(params.get('filter') === '1')
  const [when, setWhen] = useState('Any day')
  const [cats, setCats] = useState([])
  const [freeOnly, setFreeOnly] = useState(false)
  const filterCount = (when !== 'Any day' ? 1 : 0) + cats.length + (freeOnly ? 1 : 0)
  const results = useMemo(() => {
    const n = list ? list.ids.map((q) => byId(q)) : [...events].sort((q, S) => q.date - S.date)
    const p = query.trim().toLowerCase()
    return n.filter((q) => {
      const S = ev(q)
      return !(
        (p &&
          !`${q.title} ${S.title} ${S.short} ${q.place} ${q.tags.join(' ')} ${S.tags.join(' ')} ${q.category} ${t(catKey[q.category])} ${q.host.name}`
            .toLowerCase()
            .includes(p)) ||
        (when === 'Today' && q.date !== TODAY) ||
        (when === 'This week' && (q.date < TODAY || q.date > TODAY + 6)) ||
        (when === 'Weekend' && !['Sat', 'Sun'].includes(q.day)) ||
        (cats.length && !cats.includes(q.category)) ||
        (freeOnly && q.capacity - goingCount(q.id) <= 0)
      )
    })
  }, [query, when, cats, freeOnly, list, goingCount, ev, t])
  const resetFilters = () => {
    setWhen('Any day')
    setCats([])
    setFreeOnly(false)
  }
  return (
    <Screen>
      <div
        className="pad safe-top"
        style={{
          paddingBottom: 8,
        }}
      >
        <div className="row">
          <BackButton />
          <h1
            className="h2"
            style={{
              flex: 1,
            }}
          >
            {t(list ? list.title : 'explore')}
          </h1>
        </div>
        <div
          className="row"
          style={{
            marginTop: 16,
          }}
        >
          <label
            style={{
              flex: 1,
              height: 52,
              borderRadius: 999,
              background: 'var(--grey)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 16px',
            }}
          >
            <SearchIcon size={20} aria-hidden />
            <span className="sr-only">{t('search')}</span>
            <input
              value={query}
              onChange={(n) => setQuery(n.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus={!list && params.get('filter') !== '1'}
              style={{
                flex: 1,
                border: 0,
                background: 'transparent',
                outline: 'none',
                fontSize: 16,
                minWidth: 0,
              }}
            />
            {query && (
              <button aria-label={t('clearSearch')} onClick={() => setQuery('')}>
                <X size={18} />
              </button>
            )}
          </label>
          <button
            className="icon-btn dark"
            style={{
              width: 52,
              height: 52,
              position: 'relative',
            }}
            aria-label={t('filters')}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={20} />
            {filterCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  background: 'var(--lime)',
                  color: 'var(--ink)',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 20,
                  height: 20,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="scroll pad with-nav">
        <p
          className="tiny"
          style={{
            margin: '8px 0',
          }}
          aria-live="polite"
        >
          {results.length === 1
            ? t('resultOne')
            : t('resultCount', {
                n: results.length,
              })}
          {filterCount ? ` · ${t('filtered')}` : ''}
        </p>
        {results.map((n) => (
          <RowCard key={n.id} e={n} />
        ))}
        {results.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 12px',
            }}
          >
            <h2 className="h3">{t('nothingFound')}</h2>
            <p
              className="small"
              style={{
                marginTop: 6,
              }}
            >
              {t('tryAnother')}
            </p>
            <button
              className="btn btn-soft btn-sm"
              style={{
                margin: '16px auto 0',
              }}
              onClick={() => {
                setQuery('')
                resetFilters()
              }}
            >
              {t('clearEverything')}
            </button>
          </div>
        )}
      </div>
      <NavBar />
      <Sheet
        open={filtersOpen}
        onClose={() => {
          setFiltersOpen(false)
          params.get('filter') &&
            (params.delete('filter'),
            setParams(params, {
              replace: true,
            }))
        }}
        title={t('filters')}
      >
        <div className="eyebrow label">{t('when')}</div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {whenOptions.map((n) => (
            <button
              key={n}
              className={`chip ${when === n ? 'on' : ''}`}
              aria-pressed={when === n}
              onClick={() => setWhen(n)}
            >
              {t(whenKey[n])}
            </button>
          ))}
        </div>
        <div
          className="eyebrow label"
          style={{
            marginTop: 22,
          }}
        >
          {t('type')}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {catOptions.map((n) => {
            const p = cats.includes(n)
            return (
              <button
                key={n}
                className={`chip ${p ? 'on' : ''}`}
                aria-pressed={p}
                onClick={() => setCats(p ? cats.filter((q) => q !== n) : [...cats, n])}
              >
                {t(catKey[n])}
              </button>
            )
          })}
        </div>
        <div
          className="eyebrow label"
          style={{
            marginTop: 22,
          }}
        >
          {t('goodToKnow')}
        </div>
        <button
          className={`chip ${freeOnly ? 'on' : ''}`}
          aria-pressed={freeOnly}
          onClick={() => setFreeOnly(!freeOnly)}
        >
          {t('spotsLeftFilter')}
        </button>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 10,
            marginTop: 28,
          }}
        >
          <button className="btn btn-soft" onClick={resetFilters}>
            {t('clear')}
          </button>
          <button className="btn btn-primary" onClick={() => setFiltersOpen(false)}>
            {t('showN', {
              n: results.length,
            })}
          </button>
        </div>
      </Sheet>
    </Screen>
  )
}
