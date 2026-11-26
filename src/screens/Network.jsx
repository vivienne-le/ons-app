import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { Avatar } from '../components/Img'
import { OrgLogo } from '../components/OrgLogo'
import { BackButton, Screen, Sheet } from '../components/UI'
import { beenTo, byId, organisations } from '../data/events'
import { goingPeople, profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'

// Hub geometry, in viewBox units (the hub scales with the screen width).
const SIZE = 340
const C = SIZE / 2
const MOMENT_R = 98 // you → activity
const PEOPLE_R = 148 // activity → people
const SPREAD = 19 // degrees between faces around one activity
const MAX_FACES = 4

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}
const pct = (v) => `${(v / SIZE) * 100}%`

/** Group everyone you're connected with by the first activity (most visited first) you both went to. */
function useMoments() {
  const { friends } = useApp()
  const connected = Object.entries(friends)
    .filter(([id, status]) => profiles[id] && (status === 'friends' || status === 'sent'))
    .map(([id, status]) => ({ ...profiles[id], status }))
  const placed = new Set()
  const moments = beenTo.map((visit) => {
    const there = new Set(goingPeople(byId(visit.eventId)).map((p) => p.id))
    const people = connected.filter((p) => !placed.has(p.id) && there.has(p.id))
    people.forEach((p) => placed.add(p.id))
    return { ...visit, key: visit.eventId, people }
  })
  const rest = connected.filter((p) => !placed.has(p.id))
  if (rest.length) moments.push({ key: 'around', icon: 'home', accent: 'grey-2', people: rest })
  return { moments, connected }
}

export function Network() {
  const nav = useNavigate()
  const { user, following, setFriend, showToast } = useApp()
  const { t, beenTo: eventTitle } = useI18n()
  const [openRequest, setOpenRequest] = useState(null)
  const { moments, connected } = useMoments()
  const title = (m) => (m.key === 'around' ? t('aroundHere') : eventTitle(m.title))
  const showMoment = (key) => {
    const el = document.getElementById(`moment-${key}`)
    if (!el) return
    el.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
    el.classList.remove('is-flash')
    void el.offsetWidth
    el.classList.add('is-flash')
    el.focus({ preventScroll: true })
  }
  const openPerson = (p) => (p.status === 'sent' ? setOpenRequest(p) : nav(`/person/${p.id}`))

  const followed = following.map((key) => {
    const [kind, id] = key.split(':')
    const org = kind === 'org' ? organisations.find((o) => o.id === id) : null
    return {
      k: key,
      org,
      name: org ? org.name : (profiles[id]?.name ?? id),
      avatar: kind === 'person' ? profiles[id]?.avatar : undefined,
      link: org ? `/org/${id}` : `/person/${id}`,
    }
  })

  const step = 360 / moments.length
  const nodes = moments.map((m, i) => {
    const angle = -90 + step * i
    const shown = m.people.slice(0, MAX_FACES)
    const extra = m.people.length - shown.length
    const faces = [...shown, ...(extra > 0 ? [{ more: extra }] : [])].map((p, j, all) => {
      const a = angle + (j - (all.length - 1) / 2) * SPREAD
      return { p, pos: polar(PEOPLE_R, a) }
    })
    return { m, angle, pos: polar(MOMENT_R, angle), faces }
  })

  const friendCount = connected.filter((p) => p.status === 'friends').length
  const requestCount = connected.length - friendCount

  return (
    <Screen className="garden-screen">
      <div className="scroll" style={{ paddingBottom: 30 }}>
        <div className="pad safe-top">
          <BackButton to="/profile?section=garden" />
          <h1 className="h1" style={{ marginTop: 18 }}>
            {t('gardenTitle')}
          </h1>
          <p className="small" style={{ marginTop: 8, fontSize: 15 }}>
            {t('gardenSub')}
          </p>
        </div>

        {/* The hub: you in the middle, the activities you went to around you, the people you met there outside. */}
        <div className="pad">
          <div className="moments-card">
            <div
              className="moments-hub"
              role="group"
              aria-label={t('orbitLabel', { f: friendCount, s: requestCount, g: followed.length })}
            >
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="moments-lines" aria-hidden>
                {nodes.map(({ m, pos, faces }) => (
                  <g key={m.key}>
                    <line
                      x1={C}
                      y1={C}
                      x2={pos[0]}
                      y2={pos[1]}
                      className={m.people.length ? 'line-strong' : 'line-empty'}
                    />
                    {faces.map(({ pos: f }, j) => (
                      <line key={j} x1={pos[0]} y1={pos[1]} x2={f[0]} y2={f[1]} className="line-soft" />
                    ))}
                  </g>
                ))}
              </svg>

              <span className="hub-item hub-you" style={{ left: '50%', top: '50%' }}>
                <Flower color="var(--white)" size={84}>
                  {user.photo ? (
                    <img src={user.photo} alt="" className="hub-you-photo" />
                  ) : (
                    <Avatar name={user.firstName || 'R'} img="ruben" size={52} />
                  )}
                </Flower>
              </span>

              {nodes.map(({ m, pos, faces }, i) => (
                <div key={m.key} style={{ display: 'contents' }}>
                  <button
                    className={`hub-item hub-moment ${m.people.length ? '' : 'is-empty'}`}
                    style={{ left: pct(pos[0]), top: pct(pos[1]), animationDelay: `${0.1 + i * 0.07}s` }}
                    onClick={() => showMoment(m.key)}
                    aria-label={`${title(m)}: ${m.people.length ? t('momentPeople', { n: m.people.length }) : t('noOneYet')}`}
                  >
                    <Flower accent={m.accent} size={52}>
                      <Icon name={m.icon} size={22} />
                    </Flower>
                  </button>
                  {faces.map(({ p, pos: f }, j) =>
                    p.more ? (
                      <span
                        key="more"
                        className="hub-item hub-more"
                        style={{ left: pct(f[0]), top: pct(f[1]) }}
                        aria-hidden
                      >
                        +{p.more}
                      </span>
                    ) : (
                      <button
                        key={p.id}
                        className={`hub-item hub-face ${p.status === 'sent' ? 'is-request' : ''}`}
                        style={{ left: pct(f[0]), top: pct(f[1]), animationDelay: `${0.3 + i * 0.07 + j * 0.05}s` }}
                        onClick={() => openPerson(p)}
                        aria-label={`${p.name}, ${p.status === 'sent' ? t('requestSent') : t('friendTag')} · ${title(m)}`}
                      >
                        <Avatar name={p.name} img={p.avatar} size={34} />
                      </button>
                    ),
                  )}
                </div>
              ))}
            </div>
            <div className="moments-legend" aria-hidden>
              <span>
                <i className="dot" /> {t('friendTag')}
              </span>
              <span>
                <i className="dot is-request" /> {t('requestSent')}
              </span>
            </div>
          </div>

          {connected.length === 0 && (
            <div className="card" style={{ background: 'var(--grey)', padding: 16, marginTop: 16 }}>
              <strong>{t('gardenEmpty')}</strong>
              <p style={{ fontSize: 14, margin: '4px 0 0', color: 'var(--muted-2)' }}>{t('gardenEmptySub')}</p>
            </div>
          )}

          {/* The same information as a plain list: easy to scan and to use with a screen reader. */}
          <h2 className="h2" style={{ marginTop: 26 }}>
            {t('whereMet')}
          </h2>
          <ul className="moments-list">
            {moments.map((m) => (
              <li
                key={m.key}
                id={`moment-${m.key}`}
                tabIndex={-1}
                className={`moment-row ${m.people.length ? '' : 'is-empty'}`}
              >
                <div className="row" style={{ gap: 12 }}>
                  <Flower accent={m.accent} size={40}>
                    <Icon name={m.icon} size={18} />
                  </Flower>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong className="moment-title">{title(m)}</strong>
                    <span className="moment-meta">
                      {m.people.length === 0
                        ? t('noOneYet')
                        : m.times
                          ? t('timesThere', { n: m.times, d: m.last })
                          : t('momentPeople', { n: m.people.length })}
                    </span>
                  </span>
                </div>
                {m.people.length > 0 && (
                  <ul className="moment-people">
                    {m.people.map((p) => (
                      <li key={p.id}>
                        <button className="moment-person" onClick={() => openPerson(p)}>
                          <span className={p.status === 'sent' ? 'avatar-request' : ''}>
                            <Avatar name={p.name} img={p.avatar} size={36} />
                          </span>
                          <span style={{ flex: 1, textAlign: 'start' }}>
                            <strong style={{ display: 'block', fontSize: 15 }}>{p.name}</strong>
                            <span className="moment-meta">
                              {p.status === 'sent' ? t('requestSent') : t('friendTag')}
                            </span>
                          </span>
                          <ChevronRight size={18} aria-hidden className="flip-rtl" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {followed.length > 0 && (
            <>
              <h2 className="h2" style={{ marginTop: 22 }}>
                {t('youFollow')}
              </h2>
              <div className="follow-chips">
                {followed.map((f) => (
                  <button key={f.k} className="follow-chip" onClick={() => nav(f.link)}>
                    {f.org ? <OrgLogo org={f.org} size={28} /> : <Avatar name={f.name} img={f.avatar} size={28} />}
                    {f.name}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
            <button className="btn btn-sm btn-secondary" style={{ width: '100%' }} onClick={() => nav('/connections')}>
              <Users size={16} aria-hidden /> {t('friendsLabel')}
            </button>
            <button className="btn btn-sm btn-primary" style={{ width: '100%' }} onClick={() => nav('/search')}>
              {t('meetPeople')}
            </button>
          </div>
        </div>
      </div>

      <Sheet open={!!openRequest} onClose={() => setOpenRequest(null)}>
        {openRequest && (
          <div style={{ display: 'grid', justifyItems: 'center', textAlign: 'center' }}>
            <Avatar name={openRequest.name} img={openRequest.avatar} size={72} />
            <span className="eyebrow" style={{ marginTop: 12 }}>
              {t('requestSent')}
            </span>
            <h2 className="h2" style={{ marginTop: 4 }}>
              {openRequest.name}
            </h2>
            <p className="small" style={{ marginTop: 6 }}>
              {t('waitingFor', { name: openRequest.name })}
            </p>
            <div className="stack" style={{ width: '100%', marginTop: 18, gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFriend(openRequest.id, 'friends')
                  showToast(t('bloomed', { name: openRequest.name }))
                  setOpenRequest(null)
                }}
              >
                {t('demoAccept', { name: openRequest.name })}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const id = openRequest.id
                  setOpenRequest(null)
                  nav(`/person/${id}`)
                }}
              >
                {t('viewProfile', { name: openRequest.name })}
              </button>
              <button
                className="btn btn-soft"
                onClick={() => {
                  setFriend(openRequest.id, null)
                  showToast(t('requestCancelled'))
                  setOpenRequest(null)
                }}
              >
                {t('cancelRequest')}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </Screen>
  )
}
