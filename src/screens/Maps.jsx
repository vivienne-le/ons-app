import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BedDouble,
  Droplet,
  Flame,
  LocateFixed,
  Navigation,
  MapPin as PinIcon,
  PlugZap,
  ShowerHead,
  Soup,
  Stethoscope,
  Toilet,
} from 'lucide-react'
import { HeartButton } from '../components/Cards'
import { CityMap, MapPin } from '../components/CityMap'
import { Icon } from '../components/Icon'
import { Img } from '../components/Img'
import { BackButton, NavBar, Screen } from '../components/UI'
import { byId, events } from '../data/events'
import { distanceM, serviceKinds, services } from '../data/services'
import { useI18n } from '../i18n/index'
import { catKey } from './Search'
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
export const activityCats = ['Sport', 'Social', 'Creative', 'Outdoors', 'Food']
export const svcIcon = {
  toilet: Toilet,
  sleep: BedDouble,
  meals: Soup,
  shower: ShowerHead,
  water: Droplet,
  warm: Flame,
  health: Stethoscope,
  charge: PlugZap,
}
export const svcKey = {
  toilet: 'svcToilet',
  sleep: 'svcSleep',
  meals: 'svcMeals',
  shower: 'svcShower',
  water: 'svcWater',
  warm: 'svcWarm',
  health: 'svcHealth',
  charge: 'svcCharge',
}
export const tagKey = {
  free: 'tagFree',
  accessible: 'tagAccessible',
  noId: 'tagNoId',
  walkIn: 'tagWalkIn',
  pets: 'tagPets',
}
export const isService = (filter) => !!filter && serviceKinds.includes(filter)
export function ServicePin({ s: service, label, onClick: a }) {
  const { t } = useI18n()
  const CompR = svcIcon[service.kind]
  return (
    <button
      className={`pin ${label ? '' : 'small'}`}
      onClick={(b) => {
        b.stopPropagation()
        a()
      }}
      aria-label={`${t(svcKey[service.kind])}: ${service.name}`}
    >
      <span
        className="pin-ic"
        style={{
          background: 'var(--orange)',
          color: 'var(--white)',
        }}
      >
        <CompR size={15} aria-hidden />
      </span>
      {label && service.name}
    </button>
  )
}
export function MapTab() {
  const nav = useNavigate()
  const { goingCount, showToast } = useApp()
  const { t, ev, wd } = useI18n()
  const [filter, setFilter] = useState(null)
  const [selectedId, setSelectedId] = useState('kerststol-kitchen')
  const serviceList = isService(filter)
    ? services
        .filter((service) => service.kind === filter)
        .sort((m, n) => distanceM(YOU, m.coords) - distanceM(YOU, n.coords))
    : []
  const eventList = isService(filter) ? [] : events.filter((event) => !filter || event.category === filter)
  const places = Object.values(
    eventList.reduce((m, n) => {
      const S = n.coords.join()
      ;(!m[S] || n.id === selectedId) && (m[S] = n)
      return m
    }, {}),
  )
  const currentRaw = eventList.find((m) => m.id === selectedId) ?? eventList[0]
  const current = currentRaw && ev(currentRaw)
  const selectedService = serviceList.find((m) => m.id === selectedId) ?? serviceList[0]
  const choose = (m) => {
    const n = filter === m ? null : m
    if ((setFilter(n), isService(n))) {
      const S = services
        .filter((service) => service.kind === n)
        .sort((N, E) => distanceM(YOU, N.coords) - distanceM(YOU, E.coords))[0]
      S && setSelectedId(S.id)
    } else {
      const S = events.find((event) => !n || event.category === n)
      S && setSelectedId(S.id)
    }
  }
  const renderChip = (m, n, S, N) => {
    const E = filter === m
    return (
      <button
        key={m}
        className={`chip ${E ? 'on' : ''}`}
        aria-pressed={E}
        onClick={() => choose(m)}
        style={{
          flex: 'none',
          background: E ? undefined : N ? 'var(--orange-soft)' : 'var(--white)',
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          fontWeight: N ? 600 : undefined,
        }}
      >
        {S && <S size={16} aria-hidden />}
        {n}
      </button>
    )
  }
  const openingHours = (m) =>
    m.hours === '24/7'
      ? t('open247')
      : t(m.hours.days === 'daily' ? 'hoursDaily' : 'hoursWeekdays', {
          from: m.hours.from,
          to: m.hours.to,
        })
  const walkText = (n) => {
    const q = distanceM(YOU, n.coords)
    return t('walkDist', {
      m: q,
      min: Math.max(1, Math.round(q / 80)),
    })
  }
  return (
    <Screen>
      <CityMap you={YOU}>
        {serviceList.map((m) => (
          <MapPin key={m.id} at={m.coords} z={m.id === selectedService?.id ? 5 : 1}>
            <ServicePin s={m} label={m.id === selectedService?.id} onClick={() => setSelectedId(m.id)} />
          </MapPin>
        ))}
        {places.map((place) => (
          <MapPin key={place.id} at={place.coords} z={place.id === current?.id ? 5 : 1}>
            <EventPin
              e={place}
              label={place.id === current?.id}
              onClick={() => (place.id === current?.id ? nav(`/event/${place.id}`) : setSelectedId(place.id))}
            />
          </MapPin>
        ))}
      </CityMap>
      <div
        style={{
          position: 'absolute',
          top: 'max(52px, env(safe-area-inset-top))',
          left: 0,
          right: 0,
        }}
      >
        <div className="pad">
          <h1
            className="h2"
            style={{
              background: 'var(--white)',
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: 999,
              boxShadow: '0 2px 10px rgba(0,0,0,.1)',
            }}
          >
            {t('nearYou')}
          </h1>
        </div>
        <div
          role="group"
          aria-label={t('mapFilters')}
          className="scroll-x"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            padding: '12px 20px',
            scrollSnapType: 'x proximity',
            scrollPaddingInline: 20,
          }}
        >
          {serviceKinds.map((serviceKind) =>
            renderChip(serviceKind, t(svcKey[serviceKind]), svcIcon[serviceKind], true),
          )}
          <span
            aria-hidden
            style={{
              flex: 'none',
              width: 2,
              margin: '6px 4px',
              borderRadius: 2,
              background: 'rgba(32,30,31,.25)',
            }}
          />
          {activityCats.map((activityCat) => renderChip(activityCat, t(catKey[activityCat])))}
        </div>
      </div>
      <button
        className="icon-btn white"
        aria-label={t('whereAmI')}
        style={{
          position: 'absolute',
          insetInlineEnd: 20,
          bottom: 'calc(var(--nav-h) + 150px)',
        }}
        onClick={() => showToast(t('youreOn'))}
      >
        <LocateFixed size={20} />
      </button>
      {selectedService &&
        (() => {
          const CompX = svcIcon[selectedService.kind]
          return (
            <div
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 'calc(var(--nav-h) + 36px)',
                background: 'var(--white)',
                borderRadius: 24,
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
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: 'var(--orange)',
                    color: 'var(--white)',
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  <CompX size={24} aria-hidden />
                </span>
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    className="eyebrow"
                    style={{
                      color: 'var(--ink)',
                      fontSize: 11,
                    }}
                  >
                    {t(svcKey[selectedService.kind])}
                    {' · '}
                    {openingHours(selectedService)}
                  </span>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 18,
                      lineHeight: 1.2,
                      marginTop: 2,
                    }}
                  >
                    {selectedService.name}
                  </strong>
                  <span className="tiny">
                    {selectedService.address}
                    {' · '}
                    {walkText(selectedService)}
                  </span>
                </span>
                <span
                  className="tag"
                  style={{
                    alignSelf: 'flex-start',
                  }}
                >
                  {t('nPlaces', {
                    n: serviceList.length,
                  })}
                </span>
              </div>
              <div
                className="row"
                style={{
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {selectedService.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: tag === 'free' ? 'var(--lime)' : 'var(--grey)',
                    }}
                  >
                    {t(tagKey[tag])}
                  </span>
                ))}
              </div>
              <a
                className="btn btn-primary btn-sm"
                style={{
                  width: '100%',
                  marginTop: 12,
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedService.coords.join(',')}&travelmode=walking`}
              >
                <Navigation size={16} aria-hidden /> {t('directions')}
              </a>
            </div>
          )
        })()}
      {current && (
        <button
          onClick={() => nav(`/event/${current.id}`)}
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 'calc(var(--nav-h) + 36px)',
            background: 'var(--white)',
            borderRadius: 24,
            padding: 12,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            textAlign: 'start',
            boxShadow: '0 10px 30px rgba(0,0,0,.18)',
          }}
        >
          <Img
            name={current.card}
            photo={current.photo}
            w={200}
            alt=""
            accent={current.accent}
            icon={current.icon}
            radius={14}
            style={{
              width: 72,
              height: 72,
              flex: 'none',
            }}
          />
          <span
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <span
              className="eyebrow"
              style={{
                color: 'var(--ink)',
                fontSize: 11,
              }}
            >
              {wd(current.date)} {current.date}
              {' · '}
              {current.start}
            </span>
            <strong
              style={{
                display: 'block',
                fontSize: 18,
              }}
            >
              {current.title}
            </strong>
            <span className="tiny">
              {current.place}
              {' · '}
              {t('going', {
                n: goingCount(current.id),
              })}
            </span>
          </span>
          <span
            className="tag"
            style={{
              alignSelf: 'flex-start',
            }}
          >
            {t('nNear', {
              n: eventList.length,
            })}
          </span>
        </button>
      )}
      <NavBar />
    </Screen>
  )
}
