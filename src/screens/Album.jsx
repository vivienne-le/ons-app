import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ImagePlus, Lock as LockIcon, Trash2, X } from 'lucide-react'
import { Avatar } from '../components/Img'
import { BackButton, Screen, Sheet } from '../components/UI'
import { albums, compressImage } from '../data/albums'
import { beenTo, byId } from '../data/events'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function useAlbum(eventId) {
  const { albumAdds, user } = useApp()
  const mine = (albumAdds[eventId] ?? []).map((d) => ({
    ...d,
    by: 'me',
    name: user.firstName || '?',
    avatar: undefined,
    mine: true,
  }))
  const theirs = (albums[eventId] ?? []).map((d) => {
    return {
      ...d,
      name: profiles[d.by]?.name ?? '',
      avatar: profiles[d.by]?.avatar,
      mine: false,
    }
  })
  return [...mine, ...theirs]
}
export const attended = (eventId) => beenTo.some((b) => b.eventId === eventId)
export function useAddPhotos(eventId) {
  const { addPhotos, showToast } = useApp()
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const f = () => showToast(t('storageFull'))
    window.addEventListener('cvd-storage-full', f)
    return () => window.removeEventListener('cvd-storage-full', f)
  }, [showToast, t])
  const onPick = async (f) => {
    if (f != null && f.length) {
      setBusy(true)
      try {
        const g = await Promise.all([...f].slice(0, 10).map((h) => compressImage(h)))
        addPhotos(eventId, g)
        showToast(
          t('photosAdded', {
            n: g.length,
          }),
        )
      } finally {
        setBusy(false)
        inputRef.current && (inputRef.current.value = '')
      }
    }
  }
  return {
    el: <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(f) => onPick(f.target.files)} />,
    open: () => {
      return inputRef.current?.click()
    },
    busy,
  }
}
export function useFormatDay() {
  const { lang } = useI18n()
  return (a, b) =>
    new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang, {
      day: 'numeric',
      month: 'short',
    })
      .format(new Date(2026, b - 1, a))
      .replace('.', '')
}
export function Album() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { t, ev } = useI18n()
  const raw = byId(id)
  const photos = useAlbum(id)
  const adder = useAddPhotos(id)
  const [openIndex, setOpenIndex] = useState(null)
  if (!raw)
    return (
      <Screen>
        <div className="pad safe-top">
          <BackButton />
        </div>
      </Screen>
    )
  const e = ev(raw)
  const canView = attended(id)
  return (
    <Screen>
      <div
        className="scroll pad safe-top"
        style={{
          paddingBottom: 110,
        }}
      >
        <BackButton to={`/event/${id}`} />
        <div
          className="eyebrow"
          style={{
            marginTop: 20,
          }}
        >
          {e.title}
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 6,
          }}
        >
          {t('albumTitle')}
        </h1>
        {canView ? (
          <>
            <p
              className="small"
              style={{
                marginTop: 8,
                fontSize: 15,
              }}
            >
              {t('albumSub', {
                n: photos.length,
              })}
            </p>
            {photos.length === 0 ? (
              <p
                className="card"
                style={{
                  padding: 16,
                  marginTop: 18,
                }}
              >
                {t('albumEmpty')}
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 4,
                  marginTop: 18,
                  borderRadius: 18,
                  overflow: 'hidden',
                }}
              >
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setOpenIndex(i)}
                    aria-label={`${t('photoOf', {
                      n: i + 1,
                      m: photos.length,
                    })} · ${photo.name}`}
                    style={{
                      aspectRatio: '1',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {photo.mine && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 6,
                          bottom: 6,
                          background: 'var(--lime)',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '1px 7px',
                        }}
                      >
                        {t('youSuffix').replace(/[()]/g, '')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <p
              className="tiny"
              style={{
                marginTop: 14,
              }}
            >
              {t('albumConsent')}
            </p>
          </>
        ) : (
          <div
            className="card row"
            style={{
              padding: 16,
              marginTop: 18,
            }}
          >
            <LockIcon size={20} aria-hidden />
            <span>{t('albumLocked')}</span>
          </div>
        )}
      </div>
      {canView && (
        <div className="bottom-cta">
          {adder.el}
          <button className="btn btn-primary" onClick={adder.open} disabled={adder.busy}>
            <ImagePlus size={18} aria-hidden /> {adder.busy ? t('adding') : t('addPhotos')}
          </button>
        </div>
      )}
      {openIndex !== null && photos[openIndex] && (
        <Lightbox
          photos={photos}
          index={openIndex}
          setIndex={setOpenIndex}
          eventId={id}
          onProfile={(h) => nav(`/person/${h}`)}
        />
      )}
    </Screen>
  )
}
export function Lightbox({ photos, index, setIndex, eventId, onProfile }) {
  const { removePhoto, showToast } = useApp()
  const { t } = useI18n()
  const formatDay = useFormatDay()
  const [confirming, setConfirming] = useState(false)
  const touchStartX = useRef(null)
  const photo = photos[index]
  const go = (h) => setIndex((index + h + photos.length) % photos.length)
  const closeButton = useRef(null)
  useEffect(() => {
    closeButton.current?.focus()
  }, [])
  useEffect(() => {
    const h = (i) => {
      confirming ||
        (i.key === 'Escape' && setIndex(null),
        i.key === 'ArrowRight' && go(document.documentElement.dir === 'rtl' ? -1 : 1),
        i.key === 'ArrowLeft' && go(document.documentElement.dir === 'rtl' ? 1 : -1))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('photoOf', {
        n: index + 1,
        m: photos.length,
      })}
      className="lightbox"
      onTouchStart={(h) => {
        touchStartX.current = h.touches[0].clientX
      }}
      onTouchEnd={(h) => {
        if (touchStartX.current === null) return
        const i = h.changedTouches[0].clientX - touchStartX.current
        Math.abs(i) > 50 && go(i < 0 ? 1 : -1)
        touchStartX.current = null
      }}
    >
      <div
        className="row"
        style={{
          justifyContent: 'space-between',
          padding: 'max(48px, env(safe-area-inset-top)) 16px 10px',
        }}
      >
        <button
          ref={closeButton}
          className="icon-btn"
          style={{
            background: 'rgba(255,255,255,.15)',
            color: 'var(--white)',
          }}
          aria-label={t('closeLabel')}
          onClick={() => setIndex(null)}
        >
          <X size={20} />
        </button>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
          }}
          aria-live="polite"
        >
          {index + 1}
          {' / '}
          {photos.length}
        </span>
        {photo.mine ? (
          <button
            className="icon-btn"
            style={{
              background: 'rgba(255,255,255,.15)',
              color: 'var(--white)',
            }}
            aria-label={t('deletePhoto')}
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={19} />
          </button>
        ) : (
          <span
            style={{
              width: 44,
            }}
          />
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          minHeight: 0,
        }}
      >
        <img key={photo.id} src={photo.src} alt="" className="lightbox-img" />
        {photos.length > 1 && (
          <>
            <button
              className="icon-btn lb-nav"
              style={{
                insetInlineStart: 10,
              }}
              aria-label={t('prevPhoto')}
              onClick={() => go(-1)}
            >
              <ChevronLeft size={22} className="flip-rtl" />
            </button>
            <button
              className="icon-btn lb-nav"
              style={{
                insetInlineEnd: 10,
              }}
              aria-label={t('nextPhoto')}
              onClick={() => go(1)}
            >
              <ChevronRight size={22} className="flip-rtl" />
            </button>
          </>
        )}
      </div>
      <button
        className="row"
        style={{
          padding: '14px 20px 34px',
          gap: 10,
          color: 'var(--white)',
          textAlign: 'start',
        }}
        disabled={photo.mine}
        onClick={() => !photo.mine && onProfile(photo.by)}
      >
        <Avatar name={photo.name} img={photo.avatar} size={36} />
        <span
          style={{
            fontSize: 15,
          }}
        >
          {t('addedBy', {
            name: photo.mine ? `${photo.name} ${t('youSuffix')}` : photo.name,
            date: formatDay(photo.day, photo.month),
          })}
        </span>
      </button>
      <Sheet open={confirming} onClose={() => setConfirming(false)} title={t('deletePhoto')}>
        <p className="body">{t('deletePhotoQ')}</p>
        <div
          className="stack"
          style={{
            marginTop: 18,
            gap: 8,
          }}
        >
          <button
            className="btn btn-primary"
            style={{
              background: 'var(--orange)',
            }}
            onClick={() => {
              removePhoto(eventId, photo.id)
              setConfirming(false)
              showToast(t('photoDeleted'))
              photos.length <= 1 ? setIndex(null) : setIndex(Math.min(index, photos.length - 2))
            }}
          >
            {t('deletePhoto')}
          </button>
          <button className="btn btn-secondary" onClick={() => setConfirming(false)}>
            {t('cancel')}
          </button>
        </div>
      </Sheet>
    </div>
  )
}
