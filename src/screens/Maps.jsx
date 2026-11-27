import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Heart,
  LocateFixed,
  Moon,
  Navigation,
  MapPin as PinIcon,
  Plus,
  Search as SearchIcon,
  Toilet,
  Utensils,
  X,
} from 'lucide-react'
import { HeartButton } from '../components/Cards'
import { CityMap, LAT0, LAT1, LNG0, LNG1, MAP_H, MAP_W, MapPin } from '../components/CityMap'
import { Flower } from '../components/Flower'
import { OrgLogo } from '../components/OrgLogo'
import { Icon } from '../components/Icon'
import { Img } from '../components/Img'
import { BackButton, NavBar, Screen } from '../components/UI'
import { byId, events, organisations } from '../data/events'
import { activityPins, cvdPos, placeKinds, places } from '../data/places'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const YOU = [51.9112, 4.4572]
export function EventPin({ e: event, label, onClick: a }) {
  const { t, ev } = useI18n()
  return (
    <button
      className={`pin ${label ? '' : 'small'}`}
      onClick={(b) => {
        b.stopPropagation()
        a?.()
      }}
      aria-label={t('atPlace', {
        title: ev(event).title,
        place: event.place,
      })}
    >
      <span
        className="pin-ic"
        style={{
          background: `var(--${event.accent})`,
        }}
      >
        <Icon name={event.icon} size={15} />
      </span>
      {label && event.place}
    </button>
  )
}
export const walkRoute = (from, to) => [from, [from[0], to[1]], to]
export function EventMap() {
  const { id = '' } = useParams()
  const raw = byId(id)
  const nav = useNavigate()
  const { showToast } = useApp()
  const { t, ev, full } = useI18n()
  if (!raw) return null
  const e = ev(raw)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${e.place}, ${e.address}`)}&travelmode=walking`
  return (
    <Screen>
      <CityMap route={walkRoute(YOU, e.coords)} you={YOU}>
        <MapPin at={e.coords} z={5}>
          <EventPin e={e} label onClick={() => showToast(`${e.place} · ${e.walk}`)} />
        </MapPin>
      </CityMap>
      <div
        className="row"
        style={{
          position: 'absolute',
          top: 'max(52px, env(safe-area-inset-top))',
          left: 20,
          right: 20,
        }}
      >
        <BackButton variant="white" />
        <button
          onClick={() => nav(`/event/${e.id}`)}
          className="row"
          style={{
            background: 'var(--white)',
            borderRadius: 999,
            padding: '6px 16px 6px 6px',
            boxShadow: '0 2px 10px rgba(0,0,0,.12)',
            gap: 8,
            textAlign: 'start',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: `var(--${e.accent})`,
            }}
          >
            <Icon name={e.icon} size={16} />
          </span>
          <span>
            <strong
              style={{
                display: 'block',
                fontSize: 15,
              }}
            >
              {e.title}
            </strong>
            <span
              className="eyebrow"
              style={{
                fontSize: 10,
              }}
            >
              {full(e.date)}
              {' · '}
              {e.time}
            </span>
          </span>
        </button>
      </div>
      <button
        className="icon-btn white"
        aria-label={t('whereAmI')}
        style={{
          position: 'absolute',
          insetInlineEnd: 20,
          bottom: 300,
        }}
        onClick={() =>
          showToast(
            t('youreOnWalk', {
              walk: e.walk,
            }),
          )
        }
      >
        <LocateFixed size={20} />
      </button>
      <div
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'var(--white)',
          borderRadius: 28,
          padding: 14,
          boxShadow: '0 10px 30px rgba(0,0,0,.18)',
        }}
      >
        <div
          className="row"
          style={{
            alignItems: 'flex-start',
          }}
        >
          <Img
            name={e.place === 'Zorgvrijstaat' ? 'place-zorgvrijstaat' : undefined}
            alt={e.place}
            accent={e.accent}
            icon={e.icon}
            radius={16}
            style={{
              width: 96,
              height: 96,
              flex: 'none',
            }}
          />
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              className="eyebrow"
              style={{
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <PinIcon size={12} /> {t('eventLocation')}
            </div>
            <strong
              style={{
                display: 'block',
                fontSize: 22,
              }}
            >
              {e.place}
            </strong>
            <span
              style={{
                fontSize: 14,
                display: 'block',
                color: 'var(--muted-2)',
              }}
            >
              {e.address}
            </span>
            <span className="tiny">{e.walk}</span>
          </div>
        </div>
        <div
          className="row"
          style={{
            gap: 6,
            marginTop: 10,
            flexWrap: 'wrap',
          }}
        >
          <span
            className="tag"
            style={{
              fontSize: 13,
              padding: '4px 10px',
              color: 'var(--ink)',
            }}
          >
            {e.area}
          </span>
          {e.place === 'Zorgvrijstaat' && (
            <span
              className="tag"
              style={{
                fontSize: 13,
                padding: '4px 10px',
                color: 'var(--ink)',
              }}
            >
              {t('ringBell')}
            </span>
          )}
        </div>
        <div
          className="row"
          style={{
            marginTop: 12,
          }}
        >
          <a
            className="btn btn-primary"
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              textDecoration: 'none',
            }}
          >
            <Navigation size={18} /> {t('directions')}
          </a>
          <HeartButton id={e.id} size={56} />
        </div>
      </div>
    </Screen>
  )
}
const kindStyle = {
  activities: { color: 'var(--pink)', key: 'mapActivities' },
  food: { color: 'var(--lime)', key: 'mapFood', Icon: Utensils },
  toilet: { color: 'var(--orange)', fg: 'var(--white)', key: 'mapToilet', Icon: Toilet },
  health: { color: 'var(--turq)', key: 'mapHealth', Icon: Plus },
  sleep: { color: 'var(--lav)', fg: 'var(--white)', key: 'mapSleep', Icon: Moon },
}
const listKey = { food: 'nFoodPlaces', toilet: 'nToilets', health: 'nHealthPlaces', sleep: 'nSleepPlaces', activities: 'nActivitiesNear' }
// A map position from an offset (in map pixels) to where you are
// Where you are on the Near you map (same spot as in the Figma design)
const ME = [210, 410]
const at = ([dx, dy]) => [LAT0 - ((ME[1] + dy) / MAP_H) * (LAT0 - LAT1), LNG0 + ((ME[0] + dx) / MAP_W) * (LNG1 - LNG0)]
const MAP_YOU = at([0, 0])
function PlacePin({ p, label, selected, onClick }) {
  const k = kindStyle[p.kind]
  const KIcon = k.Icon
  const icon = (
    <span
      className="pin-ic"
      style={{ background: k.color, color: k.fg ?? 'var(--ink)', boxShadow: selected || label ? undefined : '0 0 0 2px var(--white)' }}
    >
      <KIcon size={15} aria-hidden />
    </span>
  )
  return (
    <button
      className={`pin ${selected || label ? '' : 'small'}`}
      style={!selected && label ? { background: 'var(--white)', color: 'var(--ink)' } : !selected ? { background: 'transparent', padding: 0 } : undefined}
      onClick={(b) => {
        b.stopPropagation()
        onClick()
      }}
      aria-label={p.name}
    >
      {icon}
      {(selected || label) && p.name}
    </button>
  )
}
function ActivityPin({ e, label, selected, onClick }) {
  return (
    <button
      className={`pin ${selected || label ? '' : 'small'}`}
      style={!selected && label ? { background: 'var(--white)', color: 'var(--ink)' } : !selected ? { background: 'transparent', padding: 0 } : undefined}
      onClick={(b) => {
        b.stopPropagation()
        onClick()
      }}
      aria-label={e.title}
    >
      <Flower accent={e.accent} size={30}>
        <Icon name={e.icon} size={14} />
      </Flower>
      {(selected || label) && (
        <>
          {e.title}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, opacity: 0.7 }}>{e.start}</span>
        </>
      )}
    </button>
  )
}
function Status({ open }) {
  const { t } = useI18n()
  return <span style={{ color: open ? 'var(--green)' : 'var(--orange)', fontWeight: 600 }}>{t(open ? 'openNow' : 'closedNow')}</span>
}
export function MapTab() {
  const nav = useNavigate()
  const { showToast } = useApp()
  const { t, ev } = useI18n()
  const [kind, setKind] = useState('all')
  const [openOnly, setOpenOnly] = useState(false)
  const [mode, setMode] = useState('card') // card | list | detail
  const [selectedId, setSelectedId] = useState(null)
  const acts = Object.entries(activityPins)
    .map(([id, a]) => ({ e: ev(byId(id)), ...a }))
    .filter((a) => a.e)
    .sort((x, y) => x.m - y.m)
  const shownPlaces = places.filter((p) => (kind === 'all' || kind === p.kind) && (!openOnly || p.open))
  const showActs = kind === 'all' || kind === 'activities'
  const inKind = kind === 'activities' ? acts : shownPlaces.slice().sort((x, y) => x.m - y.m)
  const nearest = kind === 'all' ? null : inKind[0]
  const selected = places.find((p) => p.id === selectedId)
  const choose = (k) => {
    setKind(kind === k ? 'all' : k)
    setMode('card')
    setSelectedId(null)
  }
  const openPlace = (p) => {
    setKind(p.kind)
    setSelectedId(p.id)
    setMode('detail')
  }
  const chip = (k, label, color) => {
    const on = kind === k
    return (
      <button
        key={k}
        className={`chip ${on ? 'on' : ''}`}
        aria-pressed={on}
        onClick={() => (k === 'all' ? choose('all') : choose(k))}
        style={{ flex: 'none', height: 34, padding: '0 14px', fontSize: 14, background: on ? undefined : 'var(--white)', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}
      >
        {color && <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />}
        {label}
      </button>
    )
  }
  const sheet = {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 'calc(var(--nav-h) + 30px)',
    background: 'var(--white)',
    borderRadius: 24,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,.18)',
    zIndex: 6,
  }
  const cvd = organisations.find((o) => o.id === 'cvd')
  return (
    <Screen>
      <CityMap you={MAP_YOU} onBackgroundClick={() => mode !== 'card' && setMode('card')}>
        <MapPin at={at(cvdPos)} z={2}>
          <button className="row" style={{ gap: 6 }} onClick={(b) => (b.stopPropagation(), nav('/org/cvd'))} aria-label={cvd.name}>
            <span style={{ background: 'var(--white)', borderRadius: 10, padding: 3, boxShadow: '0 0 0 2px var(--ink)' }}>
              <OrgLogo org={cvd} size={28} />
            </span>
            <span style={{ background: 'var(--white)', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>CVD</span>
          </button>
        </MapPin>
        {showActs &&
          acts.map((a) => (
            <MapPin key={a.e.id} at={at(a.pos)} z={kind === 'activities' && a === nearest ? 5 : 1}>
              <ActivityPin
                e={a.e}
                label={kind === 'activities'}
                selected={kind === 'activities' && a === nearest}
                onClick={() => nav(`/event/${a.e.id}`)}
              />
            </MapPin>
          ))}
        {shownPlaces.map((p) => (
          <MapPin key={p.id} at={at(p.pos)} z={p.id === selectedId ? 5 : 1}>
            <PlacePin p={p} label={kind === p.kind} selected={p.id === selectedId} onClick={() => openPlace(p)} />
          </MapPin>
        ))}
      </CityMap>
      <div style={{ position: 'absolute', top: 'max(44px, env(safe-area-inset-top))', left: 0, right: 0, zIndex: 4 }}>
        <div className="pad">
          <button
            onClick={() => nav('/search')}
            className="row"
            style={{
              width: '100%',
              height: 48,
              background: 'var(--white)',
              borderRadius: 999,
              padding: '0 16px',
              gap: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,.1)',
              color: 'var(--muted)',
              fontSize: 15,
            }}
          >
            <SearchIcon size={18} color="var(--ink)" aria-hidden />
            {t('mapSearch')}
          </button>
        </div>
        <div role="group" aria-label={t('mapFilters')} className="scroll-x" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 20px' }}>
          {chip('all', t('catAll'))}
          {chip('activities', t('mapActivities'), kindStyle.activities.color)}
          {placeKinds.map((k) => chip(k, t(kindStyle[k].key), kindStyle[k].color))}
        </div>
      </div>
      {kind === 'all' && (
        <button
          className="row"
          aria-pressed={openOnly}
          onClick={() => setOpenOnly(!openOnly)}
          style={{
            position: 'absolute',
            left: 20,
            bottom: 'calc(var(--nav-h) + 36px)',
            background: openOnly ? 'var(--ink)' : 'var(--white)',
            color: openOnly ? 'var(--white)' : 'var(--ink)',
            borderRadius: 999,
            padding: '10px 14px',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 2px 10px rgba(0,0,0,.12)',
          }}
        >
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: '#3BB273' }} />
          {t('openNow')}
        </button>
      )}
      {(kind === 'all' || mode === 'card') && (
        <button
          className="icon-btn white"
          aria-label={t('whereAmI')}
          style={{ position: 'absolute', insetInlineEnd: 20, bottom: kind === 'all' ? 'calc(var(--nav-h) + 32px)' : 'calc(var(--nav-h) + 140px)' }}
          onClick={() => showToast(t('youreOn'))}
        >
          <LocateFixed size={20} />
        </button>
      )}
      {nearest && mode === 'card' && (
        <div style={{ ...sheet, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            style={{ flex: 1, minWidth: 0, textAlign: 'start' }}
            onClick={() => (kind === 'activities' ? nav(`/event/${nearest.e.id}`) : openPlace(nearest))}
          >
            <span className="eyebrow" style={{ fontSize: 10, color: 'var(--ink)' }}>
              {kind === 'activities' ? `${t('today')} · ${t('nearYou')}` : t('nearest')}
            </span>
            <strong style={{ display: 'block', fontSize: 18, fontWeight: 600 }}>{kind === 'activities' ? nearest.e.title : nearest.name}</strong>
            <span style={{ fontSize: 13 }}>
              {kind === 'activities' ? (
                `${nearest.e.start} · ${nearest.e.place} · ${nearest.m} m`
              ) : (
                <>
                  <Status open={nearest.open} /> · {nearest.m} m
                </>
              )}
            </span>
          </button>
          <button
            className="row"
            onClick={() => setMode('list')}
            style={{ background: 'var(--grey)', borderRadius: 999, padding: '8px 12px', fontSize: 13, fontWeight: 600, gap: 4, flex: 'none' }}
          >
            {t('seeAllN', { n: inKind.length })} <ChevronRight size={14} className="flip-rtl" />
          </button>
        </div>
      )}
      {kind !== 'all' && mode === 'list' && (
        <div style={{ ...sheet, padding: '16px 16px 8px', maxHeight: '48%', overflowY: 'auto' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <strong style={{ fontSize: 17, fontWeight: 600 }}>{t(listKey[kind], { n: inKind.length })}</strong>
            <span className="eyebrow" style={{ fontSize: 10 }}>
              {t('byDistance')}
            </span>
          </div>
          {inKind.map((x) => {
            const isAct = kind === 'activities'
            const k = kindStyle[kind]
            const KIcon = k.Icon
            return (
              <button
                key={isAct ? x.e.id : x.id}
                className="row"
                onClick={() => (isAct ? nav(`/event/${x.e.id}`) : openPlace(x))}
                style={{ width: '100%', textAlign: 'start', padding: '10px 0', gap: 12, borderTop: '1px solid var(--grey-2)' }}
              >
                {isAct ? (
                  <Flower accent={x.e.accent} size={36}>
                    <Icon name={x.e.icon} size={16} />
                  </Flower>
                ) : (
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: k.color, color: k.fg ?? 'var(--ink)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                    <KIcon size={16} aria-hidden />
                  </span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{isAct ? x.e.title : x.name}</strong>
                  <span style={{ fontSize: 12 }}>
                    {isAct ? (
                      `${x.e.start} · ${x.e.place}`
                    ) : (
                      <>
                        <Status open={x.open} /> · {x.info}
                      </>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{x.m} m</span>
              </button>
            )
          })}
        </div>
      )}
      {selected && mode === 'detail' && (
        <div style={sheet}>
          <button
            className="icon-btn"
            style={{ position: 'absolute', top: 12, insetInlineEnd: 12, width: 30, height: 30 }}
            aria-label={t('closeLabel')}
            onClick={() => {
              setMode('card')
              setSelectedId(null)
            }}
          >
            <X size={15} />
          </button>
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 84,
                height: 84,
                borderRadius: 16,
                background: kindStyle[selected.kind].color,
                color: kindStyle[selected.kind].fg ?? 'var(--ink)',
                display: 'grid',
                placeItems: 'center',
                flex: 'none',
              }}
            >
              {(() => {
                const KIcon = kindStyle[selected.kind].Icon
                return <KIcon size={30} aria-hidden />
              })()}
            </span>
            <span style={{ flex: 1, minWidth: 0, paddingInlineEnd: 24 }}>
              <span className="eyebrow row" style={{ fontSize: 10, color: 'var(--ink)', gap: 6 }}>
                <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: kindStyle[selected.kind].color }} />
                {t(kindStyle[selected.kind].key)}
                {selected.free ? ` · ${t('free')}` : ''}
              </span>
              <strong style={{ display: 'block', fontSize: 20, fontWeight: 600, marginTop: 2 }}>{selected.name}</strong>
              <span style={{ display: 'block', fontSize: 13 }}>
                <Status open={selected.open} />
                {selected.open && selected.until ? ` · ${t('untilTime', { time: selected.until })}` : ` · ${selected.info}`}
              </span>
              <span className="tiny">{t('walkDist', { m: selected.m, min: Math.max(1, Math.round(selected.m / 70)) })}</span>
            </span>
          </div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {selected.tags.map((tag) => (
              <span key={tag} style={{ fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 999, background: 'var(--grey)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="row" style={{ gap: 10, marginTop: 12 }}>
            <a
              className="btn btn-primary"
              style={{ flex: 1, textDecoration: 'none', height: 50 }}
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/dir/?api=1&destination=${at(selected.pos).join(',')}&travelmode=walking`}
            >
              <Navigation size={16} aria-hidden /> {t('directions')}
            </a>
            <button
              className="icon-btn"
              style={{ width: 50, height: 50, background: 'var(--white)', boxShadow: 'inset 0 0 0 1.5px var(--ink)' }}
              aria-label={t('save')}
              onClick={() => showToast(t('savedPlace'))}
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      )}
      <NavBar />
    </Screen>
  )
}
