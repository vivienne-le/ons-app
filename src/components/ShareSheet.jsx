import { useState } from 'react'
import { Camera, Check, Ellipsis, Link2, Mail, MessageCircle, MessageSquare, Send, ThumbsUp } from 'lucide-react'
import { Avatar, Img } from './Img'
import { Sheet } from './UI'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function ShareSheet({ open, onClose, e: event }) {
  const { showToast } = useApp()
  const { t, full } = useI18n()
  const message = t('shareMsg', {
    title: event.title,
    date: full(event.date),
    place: event.place,
  })
  const apps = [
    {
      name: 'WhatsApp',
      I: MessageCircle,
      bg: '#25D366',
      fg: '#fff',
    },
    {
      name: t('msgApp'),
      I: MessageSquare,
      bg: '#34C759',
      fg: '#fff',
    },
    {
      name: t('emailApp'),
      I: Mail,
      bg: 'var(--turq)',
      fg: 'var(--ink)',
    },
    {
      name: 'Telegram',
      I: Send,
      bg: '#2AABEE',
      fg: '#fff',
    },
    {
      name: 'Facebook',
      I: ThumbsUp,
      bg: '#1877F2',
      fg: '#fff',
    },
    {
      name: 'Instagram',
      I: Camera,
      bg: 'var(--pink)',
      fg: 'var(--ink)',
    },
    {
      name: t('moreOptions'),
      I: Ellipsis,
      bg: 'var(--grey)',
      fg: 'var(--ink)',
    },
  ]
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${window.location.href}`)
    } catch {}
    showToast(t('linkCopied'))
  }
  return (
    <Sheet
      open={open}
      onClose={() => {
        onClose()
        setSentTo([])
      }}
      title={t('shareTitle')}
    >
      <div
        className="row"
        style={{
          background: 'var(--grey)',
          borderRadius: 18,
          padding: 10,
          gap: 12,
        }}
      >
        <Img
          name={event.card}
          photo={event.photo}
          w={200}
          alt=""
          accent={event.accent}
          icon={event.icon}
          radius={12}
          style={{
            width: 56,
            height: 56,
            flex: 'none',
          }}
        />
        <span
          style={{
            minWidth: 0,
          }}
        >
          <strong
            style={{
              display: 'block',
              fontSize: 16,
            }}
          >
            {event.title}
          </strong>
          <span className="tiny">
            {full(event.date)}
            {' · '}
            {event.start}
            {' · '}
            {event.place}
          </span>
        </span>
      </div>
      <div
        className="eyebrow"
        style={{
          margin: '18px 0 10px',
        }}
      >
        {t('shareVia')}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px 6px',
        }}
      >
        {apps.map(({ name, I, bg, fg }) => (
          <button
            key={name}
            onClick={() =>
              showToast(
                t('sharedVia', {
                  app: name,
                }),
              )
            }
            style={{
              display: 'grid',
              justifyItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: bg,
                color: fg,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <I size={22} aria-hidden />
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {name}
            </span>
          </button>
        ))}
      </div>
      <div
        className="row"
        style={{
          marginTop: 20,
          background: 'var(--grey)',
          borderRadius: 16,
          padding: '6px 6px 6px 14px',
          gap: 8,
        }}
      >
        <Link2
          size={18}
          aria-hidden
          style={{
            flex: 'none',
          }}
        />
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 14,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'var(--muted)',
          }}
        >
          cvd.app/a/{event.id}
        </span>
        <button className="btn btn-sm btn-primary" onClick={copyLink}>
          {t('copyLink')}
        </button>
      </div>
    </Sheet>
  )
}
