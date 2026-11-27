import { useNavigate } from 'react-router-dom'
import { Heart, MapPin as PinIcon } from 'lucide-react'
import { Flower } from './Flower'
import { Icon } from './Icon'
import { AvatarStack, Img } from './Img'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function HeartButton({ id, light, size: a = 32 }) {
  const { saved, toggleSave, showToast } = useApp()
  const { t } = useI18n()
  const isSaved = saved.includes(id)
  return (
    <button
      aria-label={t(isSaved ? 'unsave' : 'save')}
      aria-pressed={isSaved}
      onClick={(c) => {
        c.stopPropagation()
        const d = toggleSave(id)
        showToast(t(d ? 'savedToPlans' : 'removedSaved'), {
          label: t('undo'),
          run: () => toggleSave(id),
        })
      }}
      style={{
        width: a,
        height: a,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: light ? 'var(--white)' : 'var(--grey)',
        flex: 'none',
      }}
    >
      <Heart
        key={String(isSaved)}
        className={isSaved ? 'pop' : ''}
        size={a * 0.5}
        fill={isSaved ? 'var(--ink)' : 'none'}
      />
    </button>
  )
}
export function TileCard({ e: event, accent }) {
  const nav = useNavigate()
  const { goingCount } = useApp()
  const { t, ev, wd } = useI18n()
  const e = { ...ev(event), ...(accent ? { accent } : {}) }
  const onDark = e.accent === 'lav'
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => nav(`/event/${e.id}`)}
      onKeyDown={(b) => b.key === 'Enter' && nav(`/event/${e.id}`)}
      style={{
        width: 173,
        height: 185,
        flex: 'none',
        borderRadius: 24,
        background: `var(--${e.accent})`,
        color: onDark ? 'var(--white)' : 'var(--ink)',
        cursor: 'pointer',
        position: 'relative',
        scrollSnapAlign: 'start',
      }}
    >
      <Img
        name={e.card}
        photo={e.photo}
        w={500}
        alt=""
        accent={e.accent}
        icon={e.icon}
        radius={16}
        style={{ position: 'absolute', left: 6, top: 8, width: 162, height: 93 }}
      />
      <div style={{ position: 'absolute', top: 13, left: 131 }}>
        <HeartButton id={e.id} light />
      </div>
      <div style={{ position: 'absolute', left: 14, top: 110, right: 10 }}>
        <div className="eyebrow" style={{ color: 'inherit' }}>
          {wd(e.date)} {e.date} · {e.start}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 15,
            lineHeight: '20px',
            letterSpacing: '-0.01em',
            marginTop: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {e.title}
        </div>
        <div style={{ fontSize: 12, lineHeight: '18px', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: onDark ? '#D5D9F5' : 'inherit' }}>
          <PinIcon size={10} />
          {e.place} · {t('going', { n: goingCount(e.id) })}
        </div>
      </div>
    </div>
  )
}
const rowFrame = { warm: 'orange', lime: 'orange' }
export function RowCard({ e: event, sub, frame }) {
  const nav = useNavigate()
  const { goingCount } = useApp()
  const { t, ev, wd } = useI18n()
  const e = ev(event)
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => nav(`/event/${e.id}`)}
      onKeyDown={(b) => b.key === 'Enter' && nav(`/event/${e.id}`)}
      className="row"
      style={{ cursor: 'pointer', alignItems: 'center', gap: 17 }}
    >
      <span
        style={{
          width: 80,
          height: 80,
          padding: 4,
          borderRadius: 20,
          background: `var(--${frame ?? rowFrame[e.accent] ?? e.accent})`,
          flex: 'none',
          boxSizing: 'border-box',
        }}
      >
        <Img name={e.thumb ?? e.card} photo={e.photo} w={200} alt="" accent={e.accent} icon={e.icon} radius={16} style={{ width: 71, height: 71 }} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 4 }}>
        <span className="eyebrow" style={{ color: 'var(--ink)' }}>
          {wd(e.date)} {e.date} · {e.start}
        </span>
        <span style={{ display: 'block', fontWeight: 600, fontSize: 20, lineHeight: '24px', letterSpacing: '-0.02em' }}>{e.title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, lineHeight: '18px', color: 'var(--muted)' }}>
          <PinIcon size={10} />
          {sub ?? e.place}
        </span>
        <AvatarStack ids={e.goingAvatars} label={t('going', { n: goingCount(e.id) })} />
      </span>
      <HeartButton id={e.id} />
    </div>
  )
}
export function FlowerRow({ e: event, title, line1, line2, right, onClick: a }) {
  const nav = useNavigate()
  const { ev, full } = useI18n()
  const e = ev(event)
  const handleClick = a ?? (() => nav(`/event/${e.id}`))
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(d) => d.key === 'Enter' && handleClick()}
      className="row"
      style={{
        cursor: 'pointer',
        padding: '10px 0',
      }}
    >
      <Flower accent={e.accent} size={46}>
        <Icon name={e.icon} size={20} />
      </Flower>
      <span
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <strong
          style={{
            display: 'block',
            fontSize: 17,
          }}
        >
          {title ?? e.title}
        </strong>
        <span
          className="tiny"
          style={{
            display: 'block',
          }}
        >
          {line1 ?? `${full(e.date)} · ${e.start} · ${e.place}`}
        </span>
        {line2 && (
          <span
            className="tiny"
            style={{
              display: 'block',
            }}
          >
            {line2}
          </span>
        )}
      </span>
      {right}
    </div>
  )
}
