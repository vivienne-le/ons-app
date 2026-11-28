import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Camera,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Lock,
  MessageSquare,
  Phone,
  MapPin as PinIcon,
  User,
} from 'lucide-react'
import { Flower } from '../../components/Flower'
import { OnsLogo } from '../../components/OnsLogo'
import { BackButton, Progress, Screen, Sheet } from '../../components/UI'
import { ProfileCard } from '../HowOthersSee'
import { byId, interestOptions, languages } from '../../data/events'
import { useI18n } from '../../i18n/index'
import { useApp } from '../../state/AppState'
export const bubblePlaces = [
  {
    bg: 'var(--pink)',
    x: 46,
    y: 187,
    r: 8,
  },
  {
    bg: 'var(--turq)',
    x: 282,
    y: 187,
    r: -6,
  },
  {
    bg: 'var(--orange)',
    x: 29,
    y: 319,
    r: 4,
  },
  {
    bg: 'var(--lav)',
    x: 260,
    y: 345,
    r: -8,
    light: true,
  },
]
export function Welcome() {
  const nav = useNavigate()
  const { t } = useI18n()
  const { user, setUser } = useApp()
  const [langOpen, setLangOpen] = useState(false)
  const bubbles = t('bubbles').split('|')
  return (
    <Screen lime>
      <div
        className="scroll"
        style={{
          position: 'relative',
        }}
      >
        <div
          className="welcome-art"
          style={{
            position: 'relative',
            height: 'clamp(380px, 56vh, 470px)',
          }}
        >
          {/* Logo stays centred; the clover sits 4px higher so the logo looks centred in it */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% - 95px)',
              top: '41%',
              width: 190,
              height: 190,
              animation: 'float 4.6s ease-in-out 0.9s infinite alternate',
            }}
          >
            <Flower
              gradient={['#F4EFFF', '#DCD0FF']}
              size={190}
              style={{
                position: 'absolute',
                left: 0,
                top: -4,
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <OnsLogo width={118} />
            </span>
          </div>
          <button
            onClick={() => setLangOpen(true)}
            className="row"
            aria-label={t('chooseLanguage')}
            style={{
              position: 'absolute',
              top: 'max(52px, env(safe-area-inset-top))',
              insetInlineEnd: 20,
              gap: 6,
              background: 'var(--ink)',
              color: 'var(--white)',
              borderRadius: 999,
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: 14,
              zIndex: 2,
            }}
          >
            <Globe size={16} /> {languages.find((language) => language.id === user.language)?.name ?? 'English'}
          </button>
          {bubblePlaces.map((bubblePlace, f) => (
            <span
              key={f}
              aria-hidden
              style={{
                position: 'absolute',
                left: `${(bubblePlace.x / 402) * 100}%`,
                top: `${(bubblePlace.y / 470) * 100}%`,
                transform: `rotate(${bubblePlace.r}deg)`,
                background: bubblePlace.bg,
                color: bubblePlace.light ? 'var(--white)' : 'var(--ink)',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                padding: '8px 16px',
                borderRadius: bubblePlace.light ? '22px 22px 22px 4px' : '22px 22px 4px 22px',
                boxShadow: '0 8px 9px rgba(32,30,31,.1)',
                animation: `float 4s ease-in-out ${f * 0.4}s infinite alternate`,
              }}
            >
              {bubbles[f]}
            </span>
          ))}
        </div>
        <div
          className="pad"
          style={{
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 34, lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: '#000' }}>{t('welcomeTitle')}</h1>
          <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: '24px', color: '#000' }}>
            {t('welcomeSub')}
          </p>
        </div>
      </div>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          onClick={() => {
            // a new account starts with nothing picked
            setUser({ interests: [] })
            nav('/signup/role')
          }}
        >
          {t('getStarted')}
        </button>
        <button
          onClick={() => nav('/signup/role?login=1')}
          style={{
            fontSize: 14,
            lineHeight: '21px',
            padding: 0,
          }}
        >
          {t('haveAccount')}
        </button>
      </div>
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title={t('chooseLanguage')}>
        <div
          className="stack"
          style={{
            gap: 8,
          }}
        >
          {languages.map((language) => (
            <button
              key={language.id}
              className="card"
              onClick={() => {
                setUser({
                  language: language.id,
                })
                setLangOpen(false)
              }}
              style={{
                padding: '12px 16px',
                textAlign: 'start',
                background: user.language === language.id ? 'var(--lime)' : 'var(--grey)',
              }}
            >
              <strong>{language.name}</strong>
            </button>
          ))}
        </div>
      </Sheet>
      <style>{'@keyframes float { from { translate: 0 0 } to { translate: 0 -8px } }'}</style>
    </Screen>
  )
}
export function StepHeader({ eyebrow, title, sub, step: a }) {
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <BackButton />
        {a && <Progress step={a} />}
      </div>
      <div className="eyebrow" style={{ marginTop: 12 }}>
        {eyebrow}
      </div>
      <h1 style={{ marginTop: 8, fontSize: 34, lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 0 }}>{title}</h1>
      {sub && <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: '21px', color: 'var(--muted)' }}>{sub}</p>}
    </>
  )
}
export const countryCodes = ['+31', '+32', '+49', '+90', '+48', '+380', '+212', '+44']
export function PhoneStep() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const isLogin = params.get('login') === '1'
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const [useEmail, setUseEmail] = useState(false)
  const [countryCode, setCountryCode] = useState('+31')
  const [phone, setPhone] = useState(user.phone.replace(/^\+\d+\s?/, ''))
  const [email, setEmail] = useState(user.email)
  const [helpOpen, setHelpOpen] = useState(false)
  const digits = phone.replace(/\D/g, '')
  const valid = useEmail ? /\S+@\S+\.\S+/.test(email) : digits.length >= 9
  const submit = () => {
    valid &&
      (setUser(
        useEmail
          ? {
              email,
              phone: '',
              role: 'guest',
            }
          : {
              phone: `${countryCode} ${phone.trim()}`,
              email: '',
              role: 'guest',
            },
      ),
      nav(`/signup/code${isLogin ? '?login=1' : ''}`))
  }
  return (
    <Screen>
      <form
        className="scroll pad safe-top"
        onSubmit={(o) => {
          o.preventDefault()
          submit()
        }}
        id="phone-form"
      >
        <StepHeader
          eyebrow={t(isLogin ? 'logIn' : 'createAccount')}
          title={t(useEmail ? 'emailTitle' : 'phoneTitle')}
          sub={t(useEmail ? 'emailSub' : 'phoneSub')}
        />
        <label className="eyebrow" style={{ marginTop: 28, display: 'block', marginBottom: 8, color: 'var(--ink)' }} htmlFor="contact">
          {t(useEmail ? 'emailLabel' : 'phoneLabel')}
        </label>
        {useEmail ? (
          <input
            id="contact"
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(o) => setEmail(o.target.value)}
            autoFocus
          />
        ) : (
          <div
            className="row"
            style={{
              gap: 6,
            }}
          >
            <label className="sr-only" htmlFor="cc">
              {t('countryCode')}
            </label>
            <div
              style={{
                position: 'relative',
              }}
            >
              <select
                id="cc"
                value={countryCode}
                onChange={(o) => setCountryCode(o.target.value)}
                className="field"
                style={{
                  width: 77,
                  appearance: 'none',
                  padding: '0 0 0 13px',
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: '-0.02em',
                  background: 'var(--grey)',
                  borderColor: 'transparent',
                }}
              >
                {countryCodes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 21,
                  pointerEvents: 'none',
                }}
              />
            </div>
            <input
              id="contact"
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="6 12 34 56 78"
              style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', background: 'var(--white)', borderColor: 'var(--ink)' }}
              value={phone}
              onChange={(o) => setPhone(o.target.value)}
              autoFocus
            />
          </div>
        )}
        <button
          type="button"
          className="link"
          style={{
            display: 'block',
            marginTop: 8,
            fontSize: 14,
            lineHeight: '21px',
            color: '#000',
          }}
          onClick={() => setUseEmail((o) => !o)}
        >
          {t(useEmail ? 'usePhone' : 'useEmail')}
        </button>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="card"
          style={{
            background: 'var(--lime)',
            width: '100%',
            textAlign: 'start',
            padding: '15px 26px 15px 16px',
            marginTop: 28,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            borderRadius: 20,
          }}
        >
          <span
            className="icon-btn dark"
            style={{
              width: 36,
              height: 36,
              flex: 'none',
            }}
          >
            <MessageSquare size={16} />
          </span>
          <span style={{ display: 'grid', gap: 4, fontSize: 14, lineHeight: '21px', color: 'var(--ink)' }}>
            <span>{t('needHand')}</span>
            <span>
              {t('needHandText')}
            </span>
          </span>
        </button>
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="phone-form" disabled={!valid}>
          {t('sendCode')}
        </button>
      </div>
      <Sheet open={helpOpen} onClose={() => setHelpOpen(false)} title={t('helpTitle')}>
        <div className="stack">
          <p className="body">{t('helpText')}</p>
          <div className="row">
            <PinIcon size={20} />
            <span>Middellandstraat 1, Rotterdam</span>
          </div>
          <div className="row">
            <Clock size={20} />
            <span>{t('helpHours')}</span>
          </div>
          <a
            className="btn btn-primary"
            href="tel:+31104770000"
            style={{
              textDecoration: 'none',
              marginTop: 8,
            }}
          >
            <Phone size={18} /> {t('callCvd')}
          </a>
          <button className="btn btn-soft" onClick={() => setHelpOpen(false)}>
            {t('gotIt')}
          </button>
        </div>
      </Sheet>
    </Screen>
  )
}
export function CodeStep() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const isLogin = params.get('login') === '1'
  const isHost = params.get('host') === '1'
  const { user, showToast, finishOnboarding } = useApp()
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [filled, setFilled] = useState(false)
  const inputRef = useRef(null)
  const autoFilled = useRef(false)
  const sentTo = isHost ? user.workEmail : user.email && !user.phone ? user.email : user.phone || '+31 6 12 34 56 78'
  useEffect(() => {
    const k = window.setTimeout(() => {
      if (autoFilled.current) return
      const l = '481516'
      let m = 0
      const n = window.setInterval(() => {
        m++
        setCode(l.slice(0, m))
        m >= 6 && (window.clearInterval(n), setFilled(true))
      }, 110)
    }, 1600)
    return () => window.clearTimeout(k)
  }, [])
  const finish = () => {
    isLogin
      ? (finishOnboarding(),
        nav('/home', {
          replace: true,
        }))
      : nav(isHost ? '/signup/host-profile' : '/signup/language')
  }
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={isHost ? `${t('host')} · ${t(isLogin ? 'logIn' : 'createAccount')}` : t(isLogin ? 'logIn' : 'createAccount')}
          title={t('codeTitle')}
        />
        <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: '21px', color: 'var(--muted)' }}>
          {isHost || (user.email && !user.phone) ? t('sentEmail') : t('sentText')}{' '}
          <strong
            style={{
              color: 'var(--ink)',
            }}
          >
            {sentTo}
          </strong>
        </p>
        <label className="eyebrow" style={{ marginTop: 28, marginBottom: 8, display: 'block', color: 'var(--ink)' }} htmlFor="otp">
          {t('codeLabel')}
        </label>
        <div
          style={{
            position: 'relative',
          }}
          onClick={() => {
            return inputRef.current?.focus()
          }}
        >
          <input
            id="otp"
            ref={inputRef}
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            onChange={(k) => {
              autoFilled.current = true
              setCode(k.target.value.replace(/\D/g, '').slice(0, 6))
            }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 55px)',
              gap: 6,
            }}
            aria-hidden
          >
            {Array.from(
              {
                length: 6,
              },
              (k, l) => {
                const m = l < code.length
                const n = l === code.length
                return (
                  <div
                    key={l}
                    style={{
                      height: 75,
                      borderRadius: 20,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 34,
                      letterSpacing: '-0.02em',
                      fontWeight: 600,
                      background: m ? 'var(--lime)' : n ? 'var(--white)' : 'var(--grey)',
                      boxShadow: n ? 'inset 0 0 0 2px var(--ink)' : 'none',
                      transition: 'background .15s',
                    }}
                  >
                    {code[l] ??
                      (n ? (
                        <span
                          style={{
                            width: 2,
                            height: 30,
                            background: 'var(--ink)',
                            animation: 'blink 1s steps(1) infinite',
                          }}
                        />
                      ) : (
                        ''
                      ))}
                  </div>
                )
              },
            )}
          </div>
        </div>
        {filled && (
          <p
            className="tiny"
            style={{
              marginTop: 10,
              color: 'var(--green)',
              fontWeight: 600,
            }}
          >
            {isHost || (user.email && !user.phone) ? t('filledEmail') : t('filledMessages')}
          </p>
        )}
        <p style={{ marginTop: 28, fontSize: 14, lineHeight: '21px', color: 'var(--muted)', marginBottom: 0 }}>
          {t('didntGet')}{' '}
          <button
            className="link"
            style={{
              marginLeft: 8,
              color: 'var(--ink)',
              fontSize: 14,
            }}
            onClick={() => {
              autoFilled.current = true
              setCode('')
              setFilled(false)
              showToast(
                t('newCodeSent', {
                  to: sentTo,
                }),
              )
            }}
          >
            {t('sendAgain')}
          </button>
        </p>
        <button
          className="link"
          style={{
            display: 'block',
            marginTop: 11,
            fontSize: 14,
            color: 'var(--ink)',
          }}
          onClick={() => nav(-1)}
        >
          {isHost || (user.email && !user.phone) ? t('changeEmail') : t('changeNumber')}
        </button>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" disabled={code.length < 6} onClick={finish}>
          {t('continue')}
        </button>
      </div>
      <style>{'@keyframes blink { 50% { opacity: 0 } }'}</style>
    </Screen>
  )
}
export function LanguageStep() {
  const nav = useNavigate()
  const { user, setUser } = useApp()
  const { t, langName } = useI18n()
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={t('stepOf', {
            n: 1,
            total: 5,
          })}
          step={1}
          title={t('langTitle')}
          sub={t('langSub')}
        />
        <div
          role="radiogroup"
          aria-label={t('appLanguage')}
          className="stack"
          style={{
            marginTop: 28,
            gap: 8,
          }}
        >
          {languages.map((language) => {
            const b = user.language === language.id
            return (
              <button
                key={language.id}
                role="radio"
                aria-checked={b}
                onClick={() =>
                  setUser({
                    language: language.id,
                  })
                }
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 18px',
                  textAlign: 'start',
                  background: b ? 'var(--lime)' : 'var(--grey)',
                  transition: 'background .15s',
                }}
              >
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 17,
                    }}
                  >
                    {language.name}
                  </strong>
                  <span style={{ fontSize: 14, lineHeight: '21px', color: b ? 'var(--ink)' : 'var(--muted)' }}>{langName(language.id)}</span>
                </span>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: b ? 'var(--ink)' : 'transparent',
                    boxShadow: b ? 'none' : 'inset 0 0 0 1.5px #C9C7C0',
                  }}
                >
                  {b && <Check size={15} color="white" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/signup/photo')}>
          {t('next')}
        </button>
      </div>
    </Screen>
  )
}
export function resizePhoto(file) {
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
export function PhotoStep() {
  const nav = useNavigate()
  const { user, setUser, showToast } = useApp()
  const { t } = useI18n()
  const photoInput = useRef(null)
  const pickPhoto = async (d) => {
    if (d)
      try {
        setUser({
          photo: await resizePhoto(d),
        })
        showToast(t('lookingGood'))
      } catch {
        showToast(t('photoFailed'))
      }
  }
  // a photo is required: neighbours and hosts need to recognise each other
  const ready = !!user.photo && !!user.firstName.trim()
  return (
    <Screen>
      <form
        id="name-form"
        className="scroll pad safe-top"
        onSubmit={(a) => {
          a.preventDefault()
          ready && nav('/signup/area')
        }}
      >
        <StepHeader
          eyebrow={t('stepOf', {
            n: 2,
            total: 5,
          })}
          step={2}
          title={t('nameTitle')}
          sub={t('namePhotoSub')}
        />
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            margin: '21px 0 32px',
          }}
        >
          <button
            type="button"
            onClick={() => photoInput.current?.click()}
            aria-label={t('choosePhoto')}
            style={{
              position: 'relative',
            }}
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt={t('yourPhoto')}
                style={{
                  width: 144,
                  height: 144,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <span
                style={{
                  width: 144,
                  height: 144,
                  borderRadius: '50%',
                  background: 'var(--lime)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <User size={52} strokeWidth={2} />
              </span>
            )}
            <span
              className="icon-btn dark"
              style={{
                position: 'absolute',
                left: 106,
                top: 106,
                width: 40,
                height: 40,
              }}
            >
              <Camera size={20} />
            </span>
          </button>
        </div>
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(d) => pickPhoto(d.target.files?.[0])}
        />
        <label className="eyebrow label" htmlFor="fn">
          {t('firstName')}
        </label>
        <input
          id="fn"
          className="field"
          style={user.firstName ? { background: 'var(--white)', borderColor: 'var(--ink)' } : undefined}
          autoComplete="given-name"
          value={user.firstName}
          onChange={(a) =>
            setUser({
              firstName: a.target.value,
            })
          }
        />
        <p style={{ marginTop: 8, fontSize: 12, lineHeight: '18px', color: 'var(--muted)' }}>
          {t('lastNameHidden')}
        </p>
      </form>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          type="submit"
          form="name-form"
          disabled={!ready}
        >
          {user.photo ? t('next') : t('addPhotoFirst')}
        </button>
      </div>
    </Screen>
  )
}
export const areaCity = {
  Middelland: 'Rotterdam West',
  'Nieuwe Westen': 'Rotterdam West',
  'Oude Westen': 'Rotterdam Centrum',
  Delfshaven: 'Rotterdam West',
  Cool: 'Rotterdam Centrum',
  Spangen: 'Rotterdam West',
}
export function AreaStep() {
  const nav = useNavigate()
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const options = [...Object.keys(areaCity), 'else']
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={t('stepOf', {
            n: 3,
            total: 5,
          })}
          step={3}
          title={t('areaTitle')}
          sub={t('areaSub')}
        />
        <div
          role="radiogroup"
          aria-label={t('neighbourhood')}
          className="stack"
          style={{
            marginTop: 28,
            gap: 8,
          }}
        >
          {options.map((area) => {
            const b = area === 'else' ? !areaCity[user.area] : user.area === area
            return (
              <button
                key={area}
                role="radio"
                aria-checked={b}
                onClick={() =>
                  setUser({
                    area: area === 'else' ? 'Rotterdam' : area,
                  })
                }
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 18px',
                  textAlign: 'start',
                  background: b ? 'var(--lime)' : 'var(--grey)',
                  transition: 'background .15s',
                }}
              >
                <PinIcon size={18} aria-hidden style={{ flex: "none", marginInlineEnd: 12 }} />
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 17,
                      lineHeight: '22px',
                      fontWeight: 600,
                    }}
                  >
                    {area === 'else' ? t('areaElse') : area}
                  </strong>
                  <span style={{ fontSize: 14, lineHeight: '21px', color: b ? 'var(--ink)' : 'var(--muted)' }}>
                    {area === 'else' ? t('pickOnMap') : areaCity[area]}
                  </span>
                </span>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: b ? 'var(--ink)' : 'transparent',
                    boxShadow: b ? 'none' : 'inset 0 0 0 1.5px #C9C7C0',
                  }}
                >
                  {b && <Check size={15} color="white" />}
                </span>
              </button>
            )
          })}
        </div>
        <p style={{ marginTop: 16, fontSize: 12, lineHeight: '18px', color: 'var(--muted)' }}>
          {t('areaPrivate')}
        </p>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/signup/about')}>
          {t('next')}
        </button>
      </div>
    </Screen>
  )
}
export const areas = ['Middelland', 'Nieuwe Westen', 'Oude Westen', 'Delfshaven', 'Cool', 'Spangen']
export function AboutStep() {
  const nav = useNavigate()
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const genders = [
    ['Man', t('genderMan')],
    ['Woman', t('genderWoman')],
    ['Non-binary', t('genderNonBinary')],
    ['Prefer not to say', t('genderNone')],
  ]
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={t('stepOf', {
            n: 4,
            total: 5,
          })}
          step={4}
          title={t('aboutTitle')}
          sub={t('aboutSub')}
        />
        <label
          className="eyebrow label"
          style={{
            marginTop: 28,
          }}
          htmlFor="age"
        >
          {t('age')}
        </label>
        <input
          id="age"
          className="field"
          inputMode="numeric"
          style={{
            width: 96,
          }}
          value={user.age}
          onChange={(b) =>
            setUser({
              age: b.target.value.replace(/\D/g, '').slice(0, 3),
            })
          }
        />
        <div
          className="eyebrow label"
          style={{
            marginTop: 24,
          }}
          id="g-l"
        >
          {t('gender')}
        </div>
        <div
          role="radiogroup"
          aria-labelledby="g-l"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {genders.map(([b, c]) => (
            <button
              key={b}
              role="radio"
              aria-checked={user.gender === b}
              className={`chip ${user.gender === b ? 'on' : ''}`}
              onClick={() =>
                setUser({
                  gender: b,
                })
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/signup/interests')}>
          {t('next')}
        </button>
      </div>
    </Screen>
  )
}
export const interestAccents = ['lime', 'pink', 'turq', 'lav', 'orange']
export function InterestsStep() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const isEdit = params.get('edit') === '1'
  const { user, setUser, showToast } = useApp()
  const { t, interest } = useI18n()
  const [custom, setCustom] = useState('')
  const presetIds = interestOptions.map((interestOption) => interestOption.id)
  const customInterests = user.interests.filter((j) => !presetIds.includes(j))
  const toggle = (j) =>
    setUser({
      interests: user.interests.includes(j) ? user.interests.filter((k) => k !== j) : [...user.interests, j],
    })
  const addCustom = () => {
    const j = custom.trim().replace(/\s+/g, ' ').slice(0, 24)
    if (!j) return
    const k = [...presetIds, ...customInterests].find(
      (m) => m.toLowerCase() === j.toLowerCase() || interest(m).toLowerCase() === j.toLowerCase(),
    )
    const l = k ?? j.charAt(0).toUpperCase() + j.slice(1)
    user.interests.includes(l) ||
      setUser({
        interests: [...user.interests, l],
      })
    showToast(
      k && user.interests.includes(k)
        ? t('alreadyPicked', {
            name: interest(k),
          })
        : t('added', {
            name: interest(l),
          }),
    )
    setCustom('')
  }
  const count = user.interests.length
  const chips = [
    ...interestOptions.map((interestOption) => ({
      id: interestOption.id,
      accent: interestOption.accent,
    })),
    ...customInterests.map((customInterest, k) => ({
      id: customInterest,
      accent: interestAccents[k % interestAccents.length],
    })),
  ]
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={
            isEdit
              ? t('yourInterests')
              : t('stepOf', {
                  n: 5,
                  total: 5,
                })
          }
          step={isEdit ? undefined : 5}
          title={t('interestsTitle')}
          sub={t('interestsSub')}
        />
        {/* Clovers in a honeycomb that scrolls sideways: 3 in a column, then 2 a bit lower */}
        {(() => {
          const slots = []
          let col = 0
          let row = 0
          for (let k = 0; k < chips.length; k++) {
            const odd = col % 2 === 1
            slots.push({ x: col * 80.5, y: (odd ? 66 : 7) + row * 118 })
            row++
            if (row === (odd ? 2 : 3)) {
              row = 0
              col++
            }
          }
          const width = (slots.length ? slots[slots.length - 1].x : 0) + 105 + 20
          return (
            <div
              role="group"
              aria-label={t('interestsTitle')}
              className="scroll-x"
              style={{ overflowX: 'auto', overflowY: 'hidden', margin: '49px calc(-1 * var(--pad)) 0', height: 360 }}
            >
              <div style={{ position: 'relative', width, height: 360 }}>
                {chips.map((chip, k) => {
                  const on = user.interests.includes(chip.id)
                  const label = interest(chip.id)
                  return (
                    <button
                      key={chip.id}
                      aria-pressed={on}
                      onClick={() => toggle(chip.id)}
                      style={{
                        position: 'absolute',
                        left: slots[k].x,
                        top: slots[k].y,
                        width: 105,
                        height: 105,
                        filter: on ? 'drop-shadow(0 4px 2px rgba(0,0,0,.25))' : undefined,
                        zIndex: on ? 2 : 1,
                      }}
                      className={on ? 'pop' : ''}
                    >
                      <Flower accent={chip.accent} color={on ? undefined : 'var(--grey)'} size={105}>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: label.length > 9 ? 15 : 17,
                            lineHeight: label.length > 9 ? '20px' : '22px',
                            letterSpacing: '-0.01em',
                            maxWidth: 92,
                            textAlign: 'center',
                            color: on && chip.accent === 'lav' ? 'var(--white)' : 'var(--ink)',
                          }}
                        >
                          {label}
                        </span>
                      </Flower>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}
        {customInterests.length > 0 && (
          <p
            className="tiny"
            style={{
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            {t('removeOwnHint')}
          </p>
        )}
      </div>
      <div className="bottom-cta">
        {isEdit ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              showToast(t('interestsSaved'))
              nav('/profile')
            }}
          >
            {t('savePicked', {
              n: count,
            })}
          </button>
        ) : (
          <>
          <button className="link" onClick={() => nav('/signup/preview')} style={{ justifySelf: 'center', marginBottom: 4 }}>
            {t('skipForNow')}
          </button>
          <button
            className="btn btn-primary"
            disabled={count < 3}
            onClick={() => nav('/signup/preview')}
          >
            {count > 0 ? t('nextPicked', { n: count }) : t('next')}
          </button>
          </>
        )}
      </div>
    </Screen>
  )
}
export function PreviewStep() {
  const nav = useNavigate()
  const { user } = useApp()
  const { t } = useI18n()
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader eyebrow={t('almostDone')} step={5} title={t('previewCardTitle')} sub={t('previewCardSub')} />
        <ProfileCard
          subline={t('newNeighbour', {
            area: user.area || 'Middelland',
          })}
        />
        <div
          className="card row"
          style={{
            marginTop: 12,
            padding: 16,
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <Lock size={20} aria-hidden style={{ flex: 'none' }} />
          <span style={{ display: 'grid', gap: 2 }}>
            <strong style={{ display: 'block', fontSize: 15, lineHeight: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>{t('neverShownTitle')}</strong>
            <span style={{ fontSize: 12, lineHeight: '18px', color: 'var(--muted)' }}>{t('neverShownSub')}</span>
          </span>
        </div>
      </div>
      <div className="bottom-cta">
        <button className="link" onClick={() => nav('/signup/interests')} style={{ justifySelf: 'center', marginBottom: 4 }}>
          {t('editMyCard')}
        </button>
        <button className="btn btn-primary" onClick={() => nav('/signup/done')}>
          {t('looksGood')}
        </button>
      </div>
    </Screen>
  )
}
export function DoneStep() {
  const nav = useNavigate()
  const { user, finishOnboarding, goingCount } = useApp()
  const { t, ev, wd } = useI18n()
  const suggestedIds = ['bowling-monday', 'pool-tournament', 'football-beer'].map((c) => ev(byId(c)))
  const finish = (c, state) => {
    finishOnboarding()
    nav(c, {
      replace: true,
      state,
    })
  }
  return (
    <Screen className="">
      <div
        className="screen"
        style={{
          background: 'var(--pink)',
        }}
      >
        <div
          className="scroll pad safe-top"
          style={{
            position: 'relative',
          }}
        >
          <Flower accent="lime" size={215} style={{ position: 'absolute', left: 226, top: 30, transform: 'rotate(12deg)' }} />
          <div
            className="eyebrow"
            style={{
              color: '#3B223D',
              marginTop: 56,
              position: 'relative',
            }}
          >
            {t('allSet')}
          </div>
          <h1
            style={{
              fontSize: 44,
              lineHeight: '48px',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              margin: '8px 0 0',
              position: 'relative',
            }}
          >
            {t('youreIn', {
              name: user.firstName || t('friend'),
            })}
          </h1>
          <p style={{ fontSize: 16, lineHeight: '24px', margin: '16px 0 0', color: 'rgba(32,30,31,.8)', position: 'relative' }}>
            {t('onThisWeek')}
          </p>
          <div
            className="stack"
            style={{
              marginTop: 28,
              gap: 12,
            }}
          >
            {suggestedIds.map((suggestedId) => (
              <div
                key={suggestedId.id}
                className="card"
                style={{
                  background: `var(--${suggestedId.id === 'pool-tournament' ? 'turq' : suggestedId.id === 'football-beer' ? 'lav' : 'lime'})`,
                  padding: '14px 16px',
                  color: suggestedId.id === 'football-beer' ? 'var(--white)' : 'var(--ink)',
                  textAlign: 'start',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <span className="eyebrow" style={{ color: suggestedId.id === 'football-beer' ? '#D5D9F5' : '#5C5D20' }}>
                    {wd(suggestedId.date)}
                    {' · '}
                    {suggestedId.start}
                  </span>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 20,
                      lineHeight: '24px',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      marginTop: 2,
                    }}
                  >
                    {suggestedId.title}
                  </strong>
                </span>
                {suggestedId.id !== 'football-beer' && (
                <span
                  style={{
                    background: '#000',
                    color: suggestedId.id === 'bowling-monday' ? 'var(--lime)' : 'var(--turq)',
                    height: 27,
                    padding: '0 12px',
                    borderRadius: 30,
                    fontSize: 12,
                    lineHeight: '27px',
                    fontWeight: 600,
                  }}
                >
                  {suggestedId.id === 'bowling-monday'
                    ? t('free')
                    : t('going', {
                        n: goingCount(suggestedId.id),
                      })}
                </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-cta">
          <button className="btn btn-primary" onClick={() => finish('/home')}>
            {t('exploreEvents')}
          </button>
          <button className="btn btn-secondary" style={{ border: '1.5px solid #000' }} onClick={() => finish('/home', { invitePing: true })}>
            {t('goHome')}
          </button>
        </div>
      </div>
    </Screen>
  )
}
