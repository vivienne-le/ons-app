import { useNavigate, useParams } from 'react-router-dom'
import { Bell, CalendarPlus, Check, MessageSquare } from 'lucide-react'
import { Flower } from '../components/Flower'
import { Screen, WhenWhere } from '../components/UI'
import { byId } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function calendarFile(event) {
  const [start, end] = event.time.split(' - ').map((g) => g.replace(':', '') + '00')
  const day = `202612${String(event.date).padStart(2, '0')}`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CVD//Middelland//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@cvd-middelland`,
    `DTSTART;TZID=Europe/Amsterdam:${day}T${start}`,
    `DTEND;TZID=Europe/Amsterdam:${day}T${end}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.place}, ${event.address}`,
    `DESCRIPTION:${event.short}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join(`\r
`)
  const link = document.createElement('a')
  link.href = URL.createObjectURL(
    new Blob([lines], {
      type: 'text/calendar',
    }),
  )
  link.download = `${event.id}.ics`
  link.click()
}
export function Joined() {
  const { id = '' } = useParams()
  const raw = byId(id)
  const nav = useNavigate()
  const { user, showToast } = useApp()
  const { t, ev, dateShort } = useI18n()
  if (!raw)
    return (
      nav('/home', {
        replace: true,
      }),
      null
    )
  const e = ev(raw)
  const dayBefore = e.date - 1
  return (
    <Screen lime>
      <div
        className="scroll pad"
        style={{
          paddingTop: 'max(48px, env(safe-area-inset-top))',
          textAlign: 'center',
        }}
      >
        <Flower color="var(--ink)" size={116} className="pop joined-art">
          <Check size={52} color="var(--lime)" strokeWidth={2.4} />
        </Flower>
        <h1
          className="h-display"
          style={{
            fontSize: 34,
            marginTop: 14,
          }}
        >
          {t('youreGoing', {
            name: user.firstName || t('friend'),
          })}
        </h1>
        <div
          style={{
            marginTop: 22,
            textAlign: 'start',
          }}
        >
          <WhenWhere
            date={e.date}
            time={e.time}
            place={e.place}
            area={e.area}
            onMap={() => nav(`/event/${e.id}/map`)}
          />
        </div>
        <div
          style={{
            textAlign: 'start',
            marginTop: 24,
          }}
        >
          <div
            className="eyebrow"
            style={{
              color: 'var(--ink)',
            }}
          >
            {t('whatNext')}
          </div>
          <div
            className="row"
            style={{
              marginTop: 14,
              alignItems: 'flex-start',
            }}
          >
            <span
              className="icon-btn"
              style={{
                background: 'var(--pink)',
                width: 40,
                height: 40,
              }}
            >
              <Bell size={18} />
            </span>
            <span>
              <strong
                style={{
                  display: 'block',
                }}
              >
                {t('remindDay')}
              </strong>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--muted-2)',
                }}
              >
                {t('remindAt', {
                  date: dateShort(dayBefore),
                })}
              </span>
            </span>
          </div>
          <button
            className="row"
            style={{
              marginTop: 14,
              textAlign: 'start',
              alignItems: 'flex-start',
            }}
            onClick={() => nav(`/event/${e.id}?c=1`)}
          >
            <span
              className="icon-btn"
              style={{
                background: 'var(--turq)',
                width: 40,
                height: 40,
              }}
            >
              <MessageSquare size={18} />
            </span>
            <span>
              <strong
                style={{
                  display: 'block',
                }}
              >
                {t('gotQuestion')}
              </strong>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--muted-2)',
                }}
              >
                {t('askComments', {
                  host: e.host.name,
                })}
              </span>
            </span>
          </button>
          <button
            className="row"
            style={{
              marginTop: 14,
              textAlign: 'start',
              alignItems: 'flex-start',
            }}
            onClick={() => {
              calendarFile(raw)
              showToast(t('addedCalendar'))
            }}
          >
            <span
              className="icon-btn"
              style={{
                background: 'var(--white)',
                width: 40,
                height: 40,
              }}
            >
              <CalendarPlus size={18} />
            </span>
            <span>
              <strong
                style={{
                  display: 'block',
                }}
              >
                {t('addCalendar')}
              </strong>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--muted-2)',
                }}
              >
                {t('addCalendarSub')}
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/plans')}>
          {t('seePlans')}
        </button>
        <button className="btn btn-secondary" onClick={() => nav('/home')}>
          {t('backHome')}
        </button>
      </div>
    </Screen>
  )
}
