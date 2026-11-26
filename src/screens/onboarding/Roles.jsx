import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Camera,
  Check,
  ChevronDown,
  Search as SearchIcon,
  User,
  Users,
} from 'lucide-react'
import { Flower } from '../../components/Flower'
import { BackButton, Screen } from '../../components/UI'
import { organisations, personalDomains } from '../../data/events'
import { useI18n } from '../../i18n/index'
import { useApp } from '../../state/AppState'
export function RoleStep() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const isLogin = params.get('login') === '1'
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const [role, setRole] = useState(user.role)
  const loginQuery = isLogin ? '?login=1' : ''
  const options = [
    {
      id: 'guest',
      title: t('guest'),
      text: t('guestText'),
      Icon: User,
      accent: 'lime',
    },
    {
      id: 'host',
      title: t('host'),
      text: t('hostText'),
      Icon: Briefcase,
      accent: 'turq',
    },
  ]
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <BackButton />
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
          }}
        >
          {t(isLogin ? 'logIn' : 'createAccount')}
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 8,
          }}
        >
          {t('roleTitle')}
        </h1>
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {t('roleSub')}
        </p>
        <div
          role="radiogroup"
          aria-label={t('accountType')}
          className="stack"
          style={{
            marginTop: 24,
          }}
        >
          {options.map(({ id, title, text, Icon, accent: f }) => {
            const g = role === id
            return (
              <button
                key={id}
                role="radio"
                aria-checked={g}
                onClick={() => setRole(id)}
                className="card"
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  padding: 18,
                  textAlign: 'start',
                  background: g ? `var(--${f})` : 'var(--grey)',
                  boxShadow: g ? 'inset 0 0 0 2px var(--ink)' : 'none',
                  transition: 'background .15s',
                }}
              >
                <Flower accent={f} color={g ? 'var(--white)' : undefined} size={52}>
                  <Icon size={22} />
                </Flower>
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 20,
                    }}
                  >
                    {title}
                  </strong>
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--muted-2)',
                      lineHeight: 1.45,
                    }}
                  >
                    {text}
                  </span>
                </span>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                    background: g ? 'var(--ink)' : 'transparent',
                    boxShadow: g ? 'none' : 'inset 0 0 0 1.5px #BDBBB6',
                  }}
                >
                  {g && <Check size={15} color="white" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          onClick={() => {
            setUser({
              role,
            })
            nav(role === 'host' ? `/signup/host${loginQuery}` : `/signup/phone${loginQuery}`)
          }}
        >
          {t(role === 'host' ? 'continueHost' : 'continueGuest')}
        </button>
      </div>
    </Screen>
  )
}
export function HostLoginStep() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const isLogin = params.get('login') === '1'
  const { user, setUser } = useApp()
  const { t } = useI18n()
  const [org, setOrg] = useState(user.org)
  const [otherOrg, setOtherOrg] = useState('')
  const [email, setEmail] = useState(user.workEmail)
  const [listOpen, setListOpen] = useState(!user.org)
  const [orgQuery, setOrgQuery] = useState('')
  const [tried, setTried] = useState(false)
  const orgInfo = organisations.find((organisation) => organisation.name === org)
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPersonal = personalDomains.includes(domain)
  const orgName = org === 'Other' ? otherOrg.trim() : org
  const emailError = validEmail
    ? isPersonal
      ? t('emailPersonal')
      : orgInfo && !domain.endsWith(orgInfo.domain)
        ? t('emailWrongOrg', {
            org: orgInfo.name,
            domain: orgInfo.domain,
          })
        : ''
    : t('emailInvalid')
  const canContinue = !!orgName && !emailError
  const orgResults = organisations.filter((organisation) =>
    organisation.name.toLowerCase().includes(orgQuery.toLowerCase()),
  )
  const submit = () => {
    setTried(true)
    canContinue &&
      (setUser({
        org: orgName,
        workEmail: email.trim(),
        email: email.trim(),
        phone: '',
      }),
      nav(`/signup/code?host=1${isLogin ? '&login=1' : ''}`))
  }
  return (
    <Screen>
      <form
        id="host-form"
        className="scroll pad safe-top"
        onSubmit={(F) => {
          F.preventDefault()
          submit()
        }}
      >
        <BackButton />
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
          }}
        >
          {t('host')}
          {' · '}
          {t(isLogin ? 'logIn' : 'createAccount')}
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 8,
          }}
        >
          {t('hostSignInTitle')}
        </h1>
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {t('hostSignInSub')}
        </p>
        <div
          className="eyebrow label"
          style={{
            marginTop: 26,
          }}
          id="org-l"
        >
          {t('organisation')}
        </div>
        {!listOpen && org ? (
          <button
            type="button"
            onClick={() => setListOpen(true)}
            aria-labelledby="org-l"
            className="field"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--white)',
              borderColor: 'var(--ink)',
              textAlign: 'start',
              fontWeight: 600,
              fontSize: 17,
            }}
          >
            <Building2 size={20} />{' '}
            <span
              style={{
                flex: 1,
              }}
            >
              {org}
            </span>{' '}
            <ChevronDown size={18} />
          </button>
        ) : (
          <div
            className="card"
            style={{
              padding: 8,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--white)',
                borderRadius: 14,
                padding: '0 12px',
                height: 46,
              }}
            >
              <SearchIcon size={18} aria-hidden />
              <span className="sr-only">{t('searchOrg')}</span>
              <input
                value={orgQuery}
                onChange={(F) => setOrgQuery(F.target.value)}
                placeholder={t('searchOrg')}
                style={{
                  flex: 1,
                  border: 0,
                  outline: 'none',
                  fontSize: 16,
                  minWidth: 0,
                }}
              />
            </label>
            <div
              role="listbox"
              aria-labelledby="org-l"
              style={{
                marginTop: 6,
              }}
            >
              {[...orgResults.map((orgResult) => orgResult.name), 'Other'].map((F) => (
                <button
                  key={F}
                  type="button"
                  role="option"
                  aria-selected={org === F}
                  onClick={() => {
                    setOrg(F)
                    setListOpen(F === 'Other')
                    F !== 'Other' && setOrgQuery('')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '11px 10px',
                    borderRadius: 12,
                    textAlign: 'start',
                    fontSize: 16,
                    background: org === F ? 'var(--lime)' : 'transparent',
                  }}
                >
                  <Building2 size={18} />{' '}
                  <span
                    style={{
                      flex: 1,
                    }}
                  >
                    {F === 'Other' ? t('orgNotListed') : F}
                  </span>
                  {org === F && <Check size={16} />}
                </button>
              ))}
            </div>
            {org === 'Other' && (
              <input
                className="field"
                style={{
                  marginTop: 8,
                  fontSize: 16,
                }}
                placeholder={t('orgName')}
                value={otherOrg}
                onChange={(F) => setOtherOrg(F.target.value)}
                aria-label={t('orgName')}
              />
            )}
          </div>
        )}
        <label
          className="eyebrow label"
          style={{
            marginTop: 22,
          }}
          htmlFor="work"
        >
          {t('workEmail')}
        </label>
        <input
          id="work"
          className="field"
          type="email"
          inputMode="email"
          autoComplete="work email"
          placeholder={orgInfo ? `name@${orgInfo.domain}` : 'name@organisation.nl'}
          value={email}
          onChange={(F) => setEmail(F.target.value)}
          onBlur={() => setTried(true)}
          aria-invalid={tried && !!emailError}
          aria-describedby="work-hint"
          style={
            tried && emailError
              ? {
                  borderColor: 'var(--orange)',
                }
              : undefined
          }
        />
        <p
          id="work-hint"
          className="tiny"
          style={{
            marginTop: 8,
            color: tried && emailError ? 'var(--orange)' : undefined,
            fontWeight: tried && emailError ? 600 : 400,
          }}
        >
          {tried && emailError
            ? emailError
            : orgInfo
              ? t('emailHintOrg', {
                  org: orgInfo.name,
                  domain: orgInfo.domain,
                })
              : t('emailHintGeneric')}
        </p>
        {org === 'Other' && (
          <p
            className="tiny"
            style={{
              marginTop: 4,
            }}
          >
            {t('cvdChecksOrg')}
          </p>
        )}
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="host-form" disabled={!orgName || !email}>
          {t('sendCode')}
        </button>
      </div>
    </Screen>
  )
}
export function resizeHostPhoto(file) {
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
export function HostProfileStep() {
  const nav = useNavigate()
  const { user, setUser, showToast } = useApp()
  const { t } = useI18n()
  const fileInput = useRef(null)
  const hasName = user.firstName.trim().length > 0
  return (
    <Screen>
      <form
        id="hp-form"
        className="scroll pad safe-top"
        onSubmit={(c) => {
          c.preventDefault()
          hasName && nav('/signup/host-done')
        }}
      >
        <BackButton />
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
          }}
        >
          {t('host')}
          {' · '}
          {user.org}
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 8,
          }}
        >
          {t('hostProfileTitle')}
        </h1>
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {t('hostProfileSub')}
        </p>
        <div
          className="row"
          style={{
            marginTop: 24,
            gap: 16,
          }}
        >
          <button
            type="button"
            onClick={() => {
              return fileInput.current?.click()
            }}
            aria-label={t('addPhoto')}
            style={{
              position: 'relative',
            }}
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt=""
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--turq)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <User size={30} />
              </span>
            )}
            <span
              className="icon-btn dark"
              style={{
                position: 'absolute',
                right: -4,
                bottom: -2,
                width: 32,
                height: 32,
              }}
            >
              <Camera size={15} />
            </span>
          </button>
          <span>
            <strong
              style={{
                display: 'block',
                fontSize: 16,
              }}
            >
              {t('profilePhoto')}
            </strong>
            <span className="tiny">{t('profilePhotoHint')}</span>
          </span>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={async (c) => {
              const d = c.target.files?.[0]
              if (d)
                try {
                  setUser({
                    photo: await resizeHostPhoto(d),
                  })
                  showToast(t('photoAdded'))
                } catch {
                  showToast(t('photoFailed'))
                }
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
            <label className="eyebrow label" htmlFor="hfn">
              {t('firstName')}
            </label>
            <input
              id="hfn"
              className="field"
              autoComplete="given-name"
              value={user.firstName}
              onChange={(c) =>
                setUser({
                  firstName: c.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="eyebrow label" htmlFor="hln">
              {t('lastName')}
            </label>
            <input
              id="hln"
              className="field"
              autoComplete="family-name"
              value={user.lastName}
              onChange={(c) =>
                setUser({
                  lastName: c.target.value,
                })
              }
            />
          </div>
        </div>
        <label
          className="eyebrow label"
          style={{
            marginTop: 18,
          }}
          htmlFor="job"
        >
          {t('yourRole')}{' '}
          <span
            style={{
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            {t('optional')}
          </span>
        </label>
        <input
          id="job"
          className="field"
          autoComplete="organization-title"
          placeholder={t('rolePlaceholder')}
          value={user.jobTitle}
          onChange={(c) =>
            setUser({
              jobTitle: c.target.value,
            })
          }
        />
        <div
          className="card"
          style={{
            background: 'var(--turq)',
            padding: 16,
            marginTop: 26,
          }}
        >
          <div
            className="eyebrow"
            style={{
              color: 'var(--ink)',
              marginBottom: 10,
            }}
          >
            {t('howGuestsSee')}
          </div>
          <div className="row">
            {user.photo ? (
              <img
                src={user.photo}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--white)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 600,
                }}
              >
                {(user.firstName || '?').slice(0, 1)}
              </span>
            )}
            <span>
              <span
                style={{
                  fontSize: 15,
                }}
              >
                {t('hostedBy', {
                  name: user.firstName.trim() || t('you2'),
                })}
              </span>
              <span
                className="row"
                style={{
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <span className="tag host">
                  <BadgeCheck size={12} /> {t('hostBadge')}
                </span>
                <span
                  style={{
                    fontSize: 13,
                  }}
                >
                  {user.org}
                  {user.jobTitle ? ` · ${user.jobTitle}` : ''}
                </span>
              </span>
            </span>
          </div>
        </div>
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="hp-form" disabled={!hasName}>
          {t('finish')}
        </button>
      </div>
    </Screen>
  )
}
export function HostDoneStep() {
  const nav = useNavigate()
  const { user, finishOnboarding } = useApp()
  const { t } = useI18n()
  const knownOrg = organisations.some((organisation) => organisation.name === user.org)
  const finish = (c) => {
    finishOnboarding()
    nav(c, {
      replace: true,
    })
  }
  return (
    <Screen>
      <div
        className="screen"
        style={{
          background: 'var(--turq)',
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
            {t('hostAccount')}
          </div>
          <h1
            className="h-display"
            style={{
              fontSize: 40,
              marginTop: 8,
              position: 'relative',
            }}
          >
            {t('welcomeHost', {
              name: user.firstName || t('host'),
            })}
          </h1>
          <p
            style={{
              fontSize: 16,
              marginTop: 12,
            }}
          >
            {t('hostingFor', {
              org: user.org,
            })}
          </p>
          <div
            className="stack"
            style={{
              marginTop: 26,
              gap: 10,
            }}
          >
            {[
              {
                Icon: BadgeCheck,
                h: t(knownOrg ? 'emailVerified' : 'cvdChecksYou'),
                s: knownOrg ? user.workEmail : t('cvdChecksYouSub'),
              },
              {
                Icon: Users,
                h: t('seeWho'),
                s: t('seeWhoSub'),
              },
              {
                Icon: Briefcase,
                h: t('guestsSeeFirst'),
                s: t('guestsSeeFirstSub'),
              },
            ].map(({ Icon, h, s }) => (
              <div
                key={h}
                className="card row"
                style={{
                  background: 'rgba(255,255,255,.75)',
                  padding: 14,
                  alignItems: 'flex-start',
                }}
              >
                <Icon
                  size={20}
                  style={{
                    flex: 'none',
                    marginTop: 2,
                  }}
                />
                <span>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 16,
                    }}
                  >
                    {h}
                  </strong>
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--muted-2)',
                    }}
                  >
                    {s}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-cta">
          <button className="btn btn-primary" onClick={() => finish('/home')}>
            {t('goHome')}
          </button>
        </div>
      </div>
    </Screen>
  )
}
