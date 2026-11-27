import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Camera, Check, X } from 'lucide-react'
import { Screen } from './UI'
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
export function EditProfileScreen() {
  const nav = useNavigate()
  return <EditProfile open onClose={() => nav('/profile')} />
}
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
  const label = { font: "500 12px/16px 'Roboto Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink)' }
  const box = { width: '100%', border: '2px solid var(--ink)', borderRadius: 20, padding: '16px 18px', background: 'var(--white)', color: 'var(--ink)', outline: 'none' }
  const input = { ...box, font: '600 17px/22px Inter, sans-serif' }
  const hint = { fontSize: 12, lineHeight: '18px', color: '#737373' }
  const field = { display: 'flex', flexDirection: 'column', gap: 8 }
  const chip = (on) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: on ? 'var(--ink)' : '#F1F0EC', color: on ? 'var(--white)' : 'var(--ink)', font: '600 14px/20px Inter, sans-serif' })
  const pron = [
    ...pronounOptions.map((o) => ({ key: o, label: pronounLabels[o], on: !customPronouns && pronouns === o, pick: () => { setCustomPronouns(false); setPronouns(o) } })),
    { key: 'none', label: t('pronNone'), on: !customPronouns && !pronouns, pick: () => { setCustomPronouns(false); setPronouns('') } },
    { key: 'own', label: t('pronOwn'), on: customPronouns, pick: () => { setCustomPronouns(true); pronounOptions.includes(pronouns) && setPronouns('') } },
  ]
  return (
    <Screen>
      <div className="scroll" style={{ display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '62px 20px 0' }}>
          <h2 id="ep-title" style={{ flex: 1, margin: 0, font: '600 24px/30px Inter, sans-serif', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            {t('editProfile')}
          </h2>
          <button className="icon-btn" aria-label={t('closeLabel')} onClick={onClose} style={{ background: '#F1F0EC' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button onClick={() => fileInput.current?.click()} aria-label={t('changePhoto')} style={{ position: 'relative', width: 104, height: 104, flex: 'none' }}>
              {photo ? (
                <img src={photo} alt="" style={{ width: 104, height: 104, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <Avatar name={firstName || '?'} img={user.role === 'host' ? undefined : 'ruben'} size={104} />
              )}
              <span style={{ position: 'absolute', left: 72, top: 72, width: 34, height: 34, borderRadius: 17, background: 'var(--ink)', color: 'var(--white)', display: 'grid', placeItems: 'center' }}>
                <Camera size={17} />
              </span>
            </button>
            <button onClick={() => fileInput.current?.click()} style={{ font: '600 14px/21px Inter, sans-serif', textDecoration: 'underline', color: 'var(--ink)' }}>
              {t('changePhoto')}
            </button>
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
          <div style={field}>
            <label htmlFor="ep-fn" style={label}>{t('firstName')}</label>
            <input
              id="ep-fn"
              autoComplete="given-name"
              value={firstName}
              onChange={(p) => setFirstName(p.target.value)}
              aria-invalid={tried && !firstName.trim()}
              style={{ ...input, ...(tried && !firstName.trim() ? { borderColor: 'var(--orange)' } : null) }}
            />
            {tried && !firstName.trim() && (
              <p role="alert" style={{ ...hint, color: 'var(--orange)', fontWeight: 600 }}>{t('firstNameRequired')}</p>
            )}
          </div>
          <div style={field}>
            <label htmlFor="ep-ln" style={label}>{t('lastName')}</label>
            <input id="ep-ln" autoComplete="family-name" value={lastName} onChange={(p) => setLastName(p.target.value)} style={input} />
            <p style={hint}>{t('onlyFirstName')}</p>
          </div>
          <div style={field}>
            <label htmlFor="ep-bio" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={label}>{t('bioLabel')}</span>
              <span style={hint}>{t('optional')}</span>
            </label>
            <textarea
              id="ep-bio"
              rows={3}
              maxLength={160}
              placeholder={t('bioPh')}
              value={bio}
              onChange={(ev) => setBio(ev.target.value)}
              style={{ ...box, minHeight: 96, font: '400 16px/22px Inter, sans-serif', resize: 'none' }}
            />
          </div>
          <div style={field}>
            <div id="ep-pr" style={label}>{t('pronouns')}</div>
            <div role="radiogroup" aria-labelledby="ep-pr" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {pron.map((o) => (
                <button key={o.key} role="radio" aria-checked={o.on} onClick={o.pick} style={chip(o.on)}>
                  {o.on && <Check size={16} strokeWidth={2.5} />}
                  {o.label}
                </button>
              ))}
            </div>
            {customPronouns && (
              <>
                <label className="sr-only" htmlFor="ep-own">{t('pronOwnLabel')}</label>
                <input
                  id="ep-own"
                  style={input}
                  maxLength={20}
                  placeholder={t('pronOwnPlaceholder')}
                  value={pronouns}
                  onChange={(p) => setPronouns(p.target.value)}
                  autoFocus
                />
              </>
            )}
            <p style={hint}>{t('pronounsHint')}</p>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '16px 20px 34px', background: 'var(--white)' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={save}>
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </Screen>
  )
}
export function usePronounLabel() {
  const { t } = useI18n()
  return (a) => (a === 'he/him' ? t('pronHe') : a === 'she/her' ? t('pronShe') : a === 'they/them' ? t('pronThey') : a)
}
