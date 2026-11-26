import { useEffect, useRef, useState } from 'react'
import { Camera, Trash2, X } from 'lucide-react'
import { Avatar } from './Img'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export function resizeAvatar(file) {
  return new Promise((b, c) => {
    const d = new Image()
    d.onload = () => {
      const e = document.createElement('canvas')
      e.width = e.height = 320
      const f = Math.min(d.width, d.height)
      e.getContext('2d').drawImage(d, (d.width - f) / 2, (d.height - f) / 2, f, f, 0, 0, 320, 320)
      b(e.toDataURL('image/jpeg', 0.82))
    }
    d.onerror = c
    d.src = URL.createObjectURL(file)
  })
}
export const pronounOptions = ['he/him', 'she/her', 'they/them']
export function EditProfile({ open, onClose }) {
  const { user, setUser, showToast } = useApp()
  const { t } = useI18n()
  const fileInput = useRef(null)
  const [photo, setPhoto] = useState(user.photo)
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [pronouns, setPronouns] = useState(user.pronouns)
  const [customPronouns, setCustomPronouns] = useState(!pronounOptions.includes(user.pronouns) && !!user.pronouns)
  const [bio, setBio] = useState(user.bio ?? '')
  const [tried, setTried] = useState(false)
  useEffect(() => {
    if (!open) return
    setPhoto(user.photo)
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setPronouns(user.pronouns)
    setCustomPronouns(!pronounOptions.includes(user.pronouns) && !!user.pronouns)
    setBio(user.bio ?? '')
    setTried(false)
    const onKey = (ev) => ev.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  if (!open) return null
  const pronounLabels = {
    'he/him': t('pronHe'),
    'she/her': t('pronShe'),
    'they/them': t('pronThey'),
  }
  const save = () => {
    setTried(true)
    firstName.trim() &&
      (setUser({
        photo,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        pronouns: pronouns.trim(),
        bio: bio.trim(),
      }),
      showToast(t('profileSaved')),
      onClose())
  }
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ep-title"
        style={{
          maxHeight: '94%',
        }}
      >
        <div className="sheet-handle" />
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <h2 className="h2" id="ep-title">
            {t('editProfile')}
          </h2>
          <button className="icon-btn" aria-label={t('closeLabel')} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div
          className="row"
          style={{
            gap: 16,
          }}
        >
          <button
            onClick={() => {
              return fileInput.current?.click()
            }}
            aria-label={t('changePhoto')}
            style={{
              position: 'relative',
              flex: 'none',
            }}
          >
            {photo ? (
              <img
                src={photo}
                alt=""
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar name={firstName || '?'} img={user.role === 'host' ? undefined : 'ruben'} size={88} />
            )}
            <span
              className="icon-btn dark"
              style={{
                position: 'absolute',
                insetInlineEnd: -4,
                bottom: -2,
                width: 34,
                height: 34,
              }}
            >
              <Camera size={16} />
            </span>
          </button>
          <div
            className="stack"
            style={{
              gap: 6,
            }}
          >
            <button
              className="link"
              style={{
                textAlign: 'start',
              }}
              onClick={() => {
                return fileInput.current?.click()
              }}
            >
              {t('changePhoto')}
            </button>
            {photo && (
              <button
                className="row tiny"
                style={{
                  gap: 6,
                  color: 'var(--orange)',
                  fontWeight: 600,
                }}
                onClick={() => setPhoto('')}
              >
                <Trash2 size={14} /> {t('removePhoto')}
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={async (p) => {
              const S = p.target.files?.[0]
              if (S)
                try {
                  setPhoto(await resizeAvatar(S))
                } catch {
                  showToast(t('photoFailed'))
                }
              p.target.value = ''
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 22,
          }}
        >
          <div>
            <label className="eyebrow label" htmlFor="ep-fn">
              {t('firstName')}
            </label>
            <input
              id="ep-fn"
              className="field"
              autoComplete="given-name"
              value={firstName}
              onChange={(p) => setFirstName(p.target.value)}
              aria-invalid={tried && !firstName.trim()}
              style={
                tried && !firstName.trim()
                  ? {
                      borderColor: 'var(--orange)',
                    }
                  : undefined
              }
            />
          </div>
          <div>
            <label className="eyebrow label" htmlFor="ep-ln">
              {t('lastName')}
            </label>
            <input
              id="ep-ln"
              className="field"
              autoComplete="family-name"
              value={lastName}
              onChange={(p) => setLastName(p.target.value)}
            />
          </div>
        </div>
        {tried && !firstName.trim() && (
          <p
            className="tiny"
            role="alert"
            style={{
              color: 'var(--orange)',
              fontWeight: 600,
              marginTop: 6,
            }}
          >
            {t('firstNameRequired')}
          </p>
        )}
        <p
          className="tiny"
          style={{
            marginTop: 8,
          }}
        >
          {t('onlyFirstName')}
        </p>
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            marginTop: 18,
          }}
        >
          <label
            className="eyebrow label"
            htmlFor="ep-bio"
            style={{
              margin: 0,
            }}
          >
            {t('bioLabel')}{' '}
            <span
              style={{
                textTransform: 'none',
              }}
            >
              {t('optional')}
            </span>
          </label>
          <span className="tiny" aria-live="polite">
            {bio.length}/160
          </span>
        </div>
        <textarea
          id="ep-bio"
          className="field"
          rows={3}
          maxLength={160}
          placeholder={t('bioPh')}
          value={bio}
          onChange={(ev) => setBio(ev.target.value)}
          style={{
            height: 'auto',
            marginTop: 8,
            padding: '12px 16px',
            fontSize: 16,
            lineHeight: 1.4,
            resize: 'none',
          }}
        />
        <div
          className="eyebrow label"
          style={{
            marginTop: 22,
          }}
          id="ep-pr"
        >
          {t('pronouns')}
        </div>
        <div
          role="radiogroup"
          aria-labelledby="ep-pr"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {pronounOptions.map((pronounOption) => (
            <button
              key={pronounOption}
              role="radio"
              aria-checked={!customPronouns && pronouns === pronounOption}
              className={`chip ${!customPronouns && pronouns === pronounOption ? 'on' : ''}`}
              onClick={() => {
                setCustomPronouns(false)
                setPronouns(pronounOption)
              }}
            >
              {pronounLabels[pronounOption]}
            </button>
          ))}
          <button
            role="radio"
            aria-checked={customPronouns}
            className={`chip ${customPronouns ? 'on' : ''}`}
            onClick={() => {
              setCustomPronouns(true)
              pronounOptions.includes(pronouns) && setPronouns('')
            }}
          >
            {t('pronOwn')}
          </button>
          <button
            role="radio"
            aria-checked={!customPronouns && !pronouns}
            className={`chip ${!customPronouns && !pronouns ? 'on' : ''}`}
            onClick={() => {
              setCustomPronouns(false)
              setPronouns('')
            }}
          >
            {t('pronNone')}
          </button>
        </div>
        {customPronouns && (
          <>
            <label className="sr-only" htmlFor="ep-own">
              {t('pronOwnLabel')}
            </label>
            <input
              id="ep-own"
              className="field"
              style={{
                marginTop: 10,
                fontSize: 16,
              }}
              maxLength={20}
              placeholder={t('pronOwnPlaceholder')}
              value={pronouns}
              onChange={(p) => setPronouns(p.target.value)}
              autoFocus
            />
          </>
        )}
        <p
          className="tiny"
          style={{
            marginTop: 8,
          }}
        >
          {t('pronounsHint')}
        </p>
        <div
          className="stack"
          style={{
            marginTop: 24,
          }}
        >
          <button className="btn btn-primary" onClick={save}>
            {t('saveChanges')}
          </button>
          <button className="btn btn-soft" onClick={onClose}>
            {t('cancel')}
          </button>
        </div>
      </div>
    </>
  )
}
export function usePronounLabel() {
  const { t } = useI18n()
  return (a) => (a === 'he/him' ? t('pronHe') : a === 'she/her' ? t('pronShe') : a === 'they/them' ? t('pronThey') : a)
}
