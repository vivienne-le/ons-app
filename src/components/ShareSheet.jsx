import { Check, Ellipsis, Link2, Mail, MapPin, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Flower } from './Flower'
import { Avatar, Img } from './Img'
import { Sheet } from './UI'
import { P } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'

// People you've met at activities, to send the activity to
const friends = ['mo', 'sara', 'sam', 'lisa', 'diego']

export function ShareSheet({ open, onClose, e: event }) {
  const { showToast } = useApp()
  const { t, full } = useI18n()
  const [sentTo, setSentTo] = useState([])
  const message = t('shareMsg', { title: event.title, date: full(event.date), place: event.place })
  const close = () => {
    onClose()
    setSentTo([])
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${window.location.href}`)
    } catch {}
    showToast(t('linkCopied'))
  }
  const apps = [
    { name: t('copyLink'), I: Link2, accent: 'lime', run: copyLink },
    { name: t('msgApp'), I: MessageCircle, accent: 'turq' },
    { name: t('emailApp'), I: Mail, accent: 'pink' },
    { name: t('moreOptions'), I: Ellipsis, color: 'var(--grey)' },
  ]
  return (
    <Sheet open={open} onClose={close}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="h2">{t('shareTitle')}</h2>
        <button className="icon-btn" style={{ width: 36, height: 36 }} aria-label={t('closeLabel')} onClick={close}>
          <X size={18} />
        </button>
      </div>
      <div className="row" style={{ background: 'var(--grey)', borderRadius: 18, padding: 10, gap: 12 }}>
        <Img
          name={event.card}
          photo={event.photo}
          w={200}
          alt=""
          accent={event.accent}
          icon={event.icon}
          radius={12}
          style={{ width: 64, height: 56, flex: 'none' }}
        />
        <span style={{ minWidth: 0 }}>
          <span className="eyebrow" style={{ color: 'var(--ink)', fontSize: 11 }}>
            {full(event.date)} · {event.start}
          </span>
          <strong style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>{event.title}</strong>
          <span className="row" style={{ gap: 3, fontSize: 12, color: 'var(--muted)' }}>
            <MapPin size={12} aria-hidden /> {event.place}
          </span>
        </span>
      </div>
      <div className="eyebrow" style={{ margin: '20px 0 10px', color: 'var(--ink)' }}>
        {t('sendToFriend')}
      </div>
      <div className="row no-bar" style={{ gap: 14, overflowX: 'auto', justifyContent: 'space-between' }}>
        {friends.map((id) => {
          const p = P[id]
          const sent = sentTo.includes(id)
          return (
            <button
              key={id}
              onClick={() => {
                if (sent) return
                setSentTo([...sentTo, id])
                showToast(t('sentToName', { name: p.name }))
              }}
              style={{ display: 'grid', justifyItems: 'center', gap: 6, position: 'relative', flex: 'none' }}
            >
              <Avatar name={p.name} img={p.avatar} size={52} />
              {sent && (
                <span
                  style={{
                    position: 'absolute',
                    top: 34,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--lime)',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 0 0 2px var(--white)',
                  }}
                >
                  <Check size={12} />
                </span>
              )}
              <span style={{ fontSize: 12 }}>{p.name}</span>
            </button>
          )
        })}
      </div>
      <div className="eyebrow" style={{ margin: '20px 0 10px', color: 'var(--ink)' }}>
        {t('shareVia')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {apps.map(({ name, I, accent, color, run }) => (
          <button
            key={name}
            onClick={run ?? (() => showToast(t('sharedVia', { app: name })))}
            style={{ display: 'grid', justifyItems: 'center', gap: 6 }}
          >
            <Flower accent={accent} color={color} size={52}>
              <I size={20} aria-hidden />
            </Flower>
            <span style={{ fontSize: 12 }}>{name}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}
