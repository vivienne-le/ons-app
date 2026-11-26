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
export function TileCard({ e: event }) {
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
      style={{
        width: 172,
        flex: 'none',
        borderRadius: 20,
        overflow: 'hidden',
        background: `var(--${e.accent})`,
        cursor: 'pointer',
        position: 'relative',
        scrollSnapAlign: 'start',
      }}
    >
      <div
        style={{
          padding: 5,
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
          style={{
            width: '100%',
            height: 100,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
        }}
      >
        <HeartButton id={e.id} light />
      </div>
      <div
        style={{
          padding: '6px 12px 12px',
        }}
      >
        <div
          className="eyebrow"
          style={{
            color: 'var(--ink)',
            fontSize: 11,
          }}
        >
          {wd(e.date)} {e.date}
          {' · '}
          {e.start}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            marginTop: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {e.title}
        </div>
        <div
          style={{
            fontSize: 12,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <PinIcon size={11} />
          {e.place}
          {' · '}
          {t('going', {
            n: goingCount(e.id),
          })}
        </div>
      </div>
    </div>
  )
}
export function RowCard({ e: event, sub }) {
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
      style={{
        cursor: 'pointer',
        padding: '8px 0',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          padding: 3,
          borderRadius: 18,
          background: `var(--${e.accent === 'lime' ? 'orange' : e.accent})`,
          flex: 'none',
        }}
      >
        <Img
          name={e.card}
          photo={e.photo}
          w={200}
          alt=""
          accent={e.accent}
          icon={e.icon}
          radius={15}
          style={{
            width: 71,
            height: 71,
          }}
        />
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
          {wd(e.date)} {e.date}
          {' · '}
          {e.start}
        </span>
        <span
          style={{
            display: 'block',
            fontWeight: 600,
            fontSize: 19,
            margin: '2px 0',
          }}
        >
          {e.title}
        </span>
        <span
          className="tiny"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <PinIcon size={12} />
          {sub ?? e.place}
        </span>
        <span
          style={{
            display: 'block',
            marginTop: 4,
          }}
        >
          <AvatarStack
            ids={e.goingAvatars}
            label={t('going', {
              n: goingCount(e.id),
            })}
          />
        </span>
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
