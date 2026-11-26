import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Camera,
  Check,
  ChevronDown,
  Clock,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  Phone,
  MapPin as PinIcon,
  User,
} from 'lucide-react'
import { Flower } from '../../components/Flower'
import { Avatar } from '../../components/Img'
import { OnsLogo } from '../../components/OnsLogo'
import { BackButton, Progress, Screen, Sheet } from '../../components/UI'
import { byId, interestOptions, languages } from '../../data/events'
import { useI18n } from '../../i18n/index'
import { useApp } from '../../state/AppState'
export const bubblePlaces = [
  {
    bg: 'var(--pink)',
    x: 40,
    y: 150,
    r: -8,
  },
  {
    bg: 'var(--turq)',
    x: 258,
    y: 118,
    r: 6,
  },
  {
    bg: 'var(--orange)',
    x: 20,
    y: 238,
    r: -4,
  },
  {
    bg: '#5560D8',
    x: 292,
    y: 256,
    r: 8,
    light: true,
  },
  {
    bg: 'var(--white)',
    x: 256,
    y: 388,
    r: -6,
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
              top: '37%',
              width: 190,
              height: 190,
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
              background: 'var(--white)',
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
                fontWeight: 600,
                fontSize: 15,
                padding: '10px 14px',
                borderRadius: 14,
                boxShadow: '0 4px 14px rgba(0,0,0,.08)',
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
          <h1
            className="h1"
            style={{
              fontSize: 30,
            }}
          >
            {t('welcomeTitle')}
          </h1>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 15,
            }}
          >
            {t('welcomeSub')}
          </p>
        </div>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/signup/role')}>
          {t('getStarted')}
        </button>
        <button
          onClick={() => nav('/signup/role?login=1')}
          style={{
            fontSize: 14,
            padding: 6,
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
      <div
        className="row"
        style={{
          justifyContent: 'space-between',
        }}
      >
        <BackButton />
        {a && <Progress step={a} />}
      </div>
      <div
        className="eyebrow"
        style={{
          marginTop: 24,
        }}
      >
        {eyebrow}
      </div>
      <h1
        className="h1"
        style={{
          marginTop: 8,
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {sub}
        </p>
      )}
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
          eyebrow={`${t('guest')} · ${t(isLogin ? 'logIn' : 'createAccount')}`}
          title={t(useEmail ? 'emailTitle' : 'phoneTitle')}
          sub={t(useEmail ? 'emailSub' : 'phoneSub')}
        />
        <label
          className="eyebrow label"
          style={{
            marginTop: 28,
          }}
          htmlFor="contact"
        >
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
              gap: 8,
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
                  width: 84,
                  appearance: 'none',
                  paddingRight: 26,
                  fontWeight: 600,
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
                  top: 20,
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
            marginTop: 14,
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
            padding: 16,
            marginTop: 28,
            display: 'flex',
            gap: 12,
          }}
        >
          <span
            className="icon-btn dark"
            style={{
              width: 32,
              height: 32,
            }}
          >
            <MessageSquare size={15} />
          </span>
          <span>
            <strong
              style={{
                display: 'block',
                fontSize: 16,
              }}
            >
              {t('needHand')}
            </strong>
            <span
              style={{
                fontSize: 14,
                color: 'var(--muted-2)',
              }}
            >
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
          eyebrow={`${t(isHost ? 'host' : 'guest')} · ${t(isLogin ? 'logIn' : 'createAccount')}`}
          title={t('codeTitle')}
        />
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {isHost || (user.email && !user.phone) ? t('sentEmail') : t('sentText')}{' '}
          <strong
            style={{
              color: 'var(--ink)',
            }}
          >
            {sentTo}
          </strong>
        </p>
        <label
          className="eyebrow label"
          style={{
            marginTop: 28,
          }}
          htmlFor="otp"
        >
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
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 8,
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
                      height: 72,
                      borderRadius: 18,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 30,
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
        <p
          className="small"
          style={{
            marginTop: 22,
          }}
        >
          {t('didntGet')}{' '}
          <button
            className="link"
            style={{
              marginLeft: 8,
              color: 'var(--ink)',
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
            marginTop: 16,
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
            marginTop: 24,
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
                  <span className="tiny">{langName(language.id)}</span>
                </span>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: b ? 'var(--ink)' : 'transparent',
                    boxShadow: b ? 'none' : 'inset 0 0 0 1.5px #BDBBB6',
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
  const fileInput = useRef(null)
  const cameraInput = useRef(null)
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
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <StepHeader
          eyebrow={t('stepOf', {
            n: 2,
            total: 5,
          })}
          step={2}
          title={t('photoTitle')}
          sub={t('photoSub')}
        />
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            margin: '40px 0 32px',
          }}
        >
          <button
            onClick={() => {
              return cameraInput.current?.click()
            }}
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
                  width: 176,
                  height: 176,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  width: 176,
                  height: 176,
                  borderRadius: '50%',
                  background: 'var(--lime)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <User size={56} strokeWidth={1.6} />
              </span>
            )}
            <span
              className="icon-btn dark"
              style={{
                position: 'absolute',
                right: 4,
                bottom: 8,
                width: 48,
                height: 48,
              }}
            >
              <Camera size={20} />
            </span>
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <button
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              height: 52,
            }}
            onClick={() => {
              return fileInput.current?.click()
            }}
          >
            <Camera size={18} /> {t('takePhoto')}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              height: 52,
            }}
            onClick={() => {
              return cameraInput.current?.click()
            }}
          >
            <ImageIcon size={18} /> {t('choosePhoto')}
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="user"
          hidden
          onChange={(d) => {
            return pickPhoto(d.target.files?.[0])
          }}
        />
        <input
          ref={cameraInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(d) => {
            return pickPhoto(d.target.files?.[0])
          }}
        />
      </div>
      <div className="bottom-cta">
        <button className={`btn ${user.photo ? 'btn-primary' : 'btn-soft'}`} onClick={() => nav('/signup/name')}>
          {user.photo ? t('next') : t('skipForNow')}
        </button>
      </div>
    </Screen>
  )
}
export function NameStep() {
  const nav = useNavigate()
  const { user, setUser } = useApp()
  const { t, ev } = useI18n()
  return (
    <Screen>
      <form
        id="name-form"
        className="scroll pad safe-top"
        onSubmit={(a) => {
          a.preventDefault()
          user.firstName.trim() && nav('/signup/about')
        }}
      >
        <StepHeader
          eyebrow={t('stepOf', {
            n: 3,
            total: 5,
          })}
          step={3}
          title={t('nameTitle')}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 28,
          }}
        >
          <div>
            <label className="eyebrow label" htmlFor="fn">
              {t('firstName')}
            </label>
            <input
              id="fn"
              className="field"
              autoComplete="given-name"
              value={user.firstName}
              onChange={(a) =>
                setUser({
                  firstName: a.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="eyebrow label" htmlFor="ln">
              {t('lastName')}
            </label>
            <input
              id="ln"
              className="field"
              autoComplete="family-name"
              value={user.lastName}
              onChange={(a) =>
                setUser({
                  lastName: a.target.value,
                })
              }
            />
          </div>
        </div>
        <p
          className="tiny"
          style={{
            marginTop: 10,
          }}
        >
          {t('onlyFirstName')}
        </p>
        <div
          className="card"
          style={{
            background: 'var(--pink)',
            padding: 16,
            marginTop: 36,
          }}
        >
          <div
            className="eyebrow"
            style={{
              color: 'var(--ink)',
              marginBottom: 12,
            }}
          >
            {t('howOthersSee')}
          </div>
          <div className="row">
            {user.photo ? (
              <img
                src={user.photo}
                alt=""
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar name={user.firstName || '?'} img="ruben" size={48} />
            )}
            <div>
              <strong
                style={{
                  fontSize: 17,
                }}
              >
                {user.firstName.trim() || t('yourName')}
              </strong>
              <div
                style={{
                  fontSize: 14,
                }}
              >
                {t('goingToEvent', {
                  event: ev(byId('bowling-monday')).title,
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="name-form" disabled={!user.firstName.trim()}>
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
            width: 100,
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
        <label
          className="eyebrow label"
          style={{
            marginTop: 24,
          }}
          htmlFor="area"
        >
          {t('neighbourhood')}
        </label>
        <div
          style={{
            position: 'relative',
          }}
        >
          <PinIcon
            size={20}
            style={{
              position: 'absolute',
              left: 16,
              top: 18,
              pointerEvents: 'none',
            }}
          />
          <select
            id="area"
            className="field"
            value={user.area}
            onChange={(b) =>
              setUser({
                area: b.target.value,
              })
            }
            style={{
              appearance: 'none',
              paddingLeft: 46,
              fontWeight: 600,
              background: 'var(--white)',
              borderColor: 'var(--ink)',
            }}
          >
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
          <ChevronDown
            size={18}
            style={{
              position: 'absolute',
              right: 16,
              top: 19,
              pointerEvents: 'none',
            }}
          />
        </div>
        <p
          className="tiny"
          style={{
            marginTop: 8,
            paddingLeft: 4,
          }}
        >
          Rotterdam
        </p>
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
        <form
          className="row"
          style={{
            marginTop: 20,
          }}
          onSubmit={(j) => {
            j.preventDefault()
            addCustom()
          }}
        >
          <label htmlFor="own" className="sr-only">
            {t('addOwn')}
          </label>
          <input
            id="own"
            className="field"
            style={{
              fontSize: 16,
            }}
            placeholder={t('addOwnPlaceholder')}
            maxLength={24}
            value={custom}
            onChange={(j) => setCustom(j.target.value)}
            enterKeyHint="done"
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{
              height: 56,
              flex: 'none',
            }}
            disabled={!custom.trim()}
          >
            {t('add')}
          </button>
        </form>
        {/* Flowers in 3 rows that scroll sideways; every other column sits a bit lower */}
        <div
          role="group"
          aria-label={t('interestsTitle')}
          className="scroll-x"
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(3, auto)',
            gridAutoColumns: 104,
            gap: '4px 8px',
            overflowX: 'auto',
            margin: '20px calc(-1 * var(--pad)) 0',
            padding: '0 var(--pad) 34px',
            scrollSnapType: 'x proximity',
            scrollPaddingInline: 'var(--pad)',
          }}
        >
          {chips.map((chip, k) => {
            const l = user.interests.includes(chip.id)
            return (
              <button
                key={chip.id}
                aria-pressed={l}
                onClick={() => toggle(chip.id)}
                style={{
                  position: 'relative',
                  top: Math.floor(k / 3) % 2 === 1 ? 30 : 0,
                  scrollSnapAlign: 'start',
                }}
                className={l ? 'pop' : ''}
              >
                <Flower accent={chip.accent} color={l ? undefined : 'var(--grey)'} size={104}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: 1.15,
                      maxWidth: 80,
                      textAlign: 'center',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {interest(chip.id)}
                  </span>
                </Flower>
              </button>
            )
          })}
        </div>
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
          <button className={`btn ${count ? 'btn-primary' : 'btn-soft'}`} onClick={() => nav('/signup/done')}>
            {count
              ? t('nextPicked', {
                  n: count,
                })
              : t('skipForNow')}
          </button>
        )}
      </div>
    </Screen>
  )
}
export function DoneStep() {
  const nav = useNavigate()
  const { user, finishOnboarding, goingCount } = useApp()
  const { t, ev, wd } = useI18n()
  const suggestedIds = ['bowling-monday', 'pool-tournament', 'football-beer'].map((c) => ev(byId(c)))
  const finish = (c) => {
    finishOnboarding()
    nav(c, {
      replace: true,
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
          <Flower
            accent="lime"
            size={180}
            style={{
              position: 'absolute',
              right: -40,
              top: -30,
            }}
          />
          <div
            className="eyebrow"
            style={{
              color: 'var(--ink)',
              marginTop: 36,
              position: 'relative',
            }}
          >
            {t('allSet')}
          </div>
          <h1
            className="h-display"
            style={{
              fontSize: 40,
              marginTop: 8,
              position: 'relative',
            }}
          >
            {t('youreIn', {
              name: user.firstName || t('friend'),
            })}
          </h1>
          <p
            style={{
              fontSize: 16,
              marginTop: 12,
            }}
          >
            {t('onThisWeek')}
          </p>
          <div
            className="stack"
            style={{
              marginTop: 28,
              gap: 10,
            }}
          >
            {suggestedIds.map((suggestedId) => (
              <button
                key={suggestedId.id}
                onClick={() => finish(`/event/${suggestedId.id}`)}
                className="card"
                style={{
                  background: `var(--${suggestedId.id === 'pool-tournament' ? 'turq' : suggestedId.id === 'football-beer' ? 'lav' : 'lime'})`,
                  padding: '14px 16px',
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
                  <span
                    className="eyebrow"
                    style={{
                      color: 'var(--ink)',
                    }}
                  >
                    {wd(suggestedId.date)}
                    {' · '}
                    {suggestedId.start}
                  </span>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 22,
                      marginTop: 4,
                    }}
                  >
                    {suggestedId.title}
                  </strong>
                </span>
                <span
                  className="tag"
                  style={{
                    background: 'var(--ink)',
                    color: 'var(--white)',
                    padding: '6px 10px',
                  }}
                >
                  {suggestedId.id === 'bowling-monday'
                    ? t('free')
                    : t('going', {
                        n: goingCount(suggestedId.id),
                      })}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="bottom-cta">
          <button className="btn btn-primary" onClick={() => finish('/search')}>
            {t('exploreEvents')}
          </button>
          <button className="btn btn-secondary" onClick={() => finish('/home')}>
            {t('goHome')}
          </button>
        </div>
      </div>
    </Screen>
  )
}
