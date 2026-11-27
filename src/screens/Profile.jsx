import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BadgeCheck, ChevronRight, Globe, LogOut, Mail, Pencil, Repeat, RotateCcw } from 'lucide-react'
import { BadgeSection, useStats } from '../components/Badges'
import { EditProfile, usePronounLabel } from '../components/EditProfile'
import { Flower } from '../components/Flower'
import { Avatar } from '../components/Img'
import { OrgLogo } from '../components/OrgLogo'
import { NavBar, Screen, Sheet, Switch } from '../components/UI'
import { languages, organisations } from '../data/events'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { BecomeHostCard } from './BecomeHost'
import { InterestChip } from '../components/InterestChip'
import { useApp } from '../state/AppState'
export function Profile() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const app = useApp()
  const { t } = useI18n()
  const { user } = app
  const [prefs, setPrefs] = useState({
    showJoined: true,
    reminders: true,
    news: true,
    suggestions: true,
  })
  const [langOpen, setLangOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const pronounLabel = usePronounLabel()
  const [confirm, setConfirm] = useState(null)
  const settingsRef = useRef(null)
  useEffect(() => {
    const f = params.get('section')
    f === 'settings' &&
      settingsRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
  }, [params])
  const togglePref = (f, S) => (N) => {
    setPrefs((E) => ({
      ...E,
      [f]: N,
    }))
    app.showToast(
      t(N ? 'settingOn' : 'settingOff', {
        label: S,
      }),
    )
  }
  const stats = useStats()
  const interests = user.interests.length ? user.interests : ['Football', 'Cycling', 'Darts']
  return (
    <Screen>
      <div className="scroll with-nav">
        <div
          style={{
            background: 'var(--lime)',
            borderRadius: '0 0 40px 40px',
            padding: '56px var(--pad) 24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Flower
            color="#E7F269"
            size={200}
            style={{
              position: 'absolute',
              right: -50,
              top: -40,
            }}
          />
          <div
            className="row"
            style={{
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div
              className="eyebrow"
              style={{
                color: 'var(--ink)',
              }}
            >
              {t('profile')}
            </div>
            <button
              className="btn btn-sm"
              onClick={() => setEditing(true)}
              style={{
                background: 'var(--white)',
                height: 40,
              }}
            >
              <Pencil size={16} /> {t('editProfile')}
            </button>
          </div>
          <div
            className="row"
            style={{
              marginTop: 16,
              position: 'relative',
              gap: 16,
            }}
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt=""
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar name={user.firstName || 'R'} img="ruben" size={90} />
            )}
            <div>
              <h1 className="h1">
                {user.firstName || t('you2')}
                {user.pronouns && (
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: 'var(--muted-2)',
                      marginInlineStart: 8,
                    }}
                  >
                    ({pronounLabel(user.pronouns)})
                  </span>
                )}
              </h1>
              {user.role === 'host' ? (
                <span
                  className="row"
                  style={{
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <span className="tag host">
                    <BadgeCheck size={12} /> {t('hostBadge')}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {user.verifiedBy
                      ? t('verifiedBy', {
                          org: user.org,
                        })
                      : `${user.org}${user.jobTitle ? ` · ${user.jobTitle}` : ''}`}
                  </span>
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 14,
                  }}
                >
                  {t('guestLine', {
                    area: user.area,
                  })}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 20,
              position: 'relative',
            }}
          >
            <button
              className="card"
              onClick={() => nav('/plans?tab=been')}
              style={{
                background: 'var(--ink)',
                color: 'var(--white)',
                padding: 14,
                textAlign: 'start',
              }}
            >
              <strong
                style={{
                  fontSize: 26,
                  display: 'block',
                }}
              >
                {stats.attended}
              </strong>
              <span
                style={{
                  fontSize: 13,
                }}
              >
                {t('activitiesJoined')}
              </span>
            </button>
            <button
              className="card"
              onClick={() => nav('/profile/preview')}
              style={{
                background: 'var(--white)',
                padding: 14,
                textAlign: 'start',
              }}
            >
              <strong
                style={{
                  fontSize: 15,
                  display: 'block',
                }}
              >
                {t('howOthersSee')}
              </strong>
              <span className="tiny">{t('howOthersSub')}</span>
            </button>
          </div>
        </div>
        <div className="pad">
          <button
            className="card row"
            onClick={() => nav('/connections')}
            style={{
              width: '100%',
              padding: '12px 14px 12px 18px',
              marginTop: 24,
              textAlign: 'start',
              minHeight: 52,
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: 16,
              }}
            >
              {t('followingTab')}
            </span>
            <span className="tiny">
              {t('nHosts', {
                n: app.following.length,
              })}
            </span>
            <span
              style={{
                display: 'flex',
              }}
            >
              {app.following.slice(0, 3).map((f, S) => {
                const [kind, id] = f.split(':')
                const p = kind === 'person' ? profiles[id] : organisations.find((o) => o.id === id)
                return (
                  p && (
                    <span
                      key={f}
                      style={{
                        marginInlineStart: S ? -8 : 0,
                      }}
                    >
                      {kind === 'person' ? (
                        <Avatar name={p.name} img={p.avatar} size={26} ring />
                      ) : (
                        <OrgLogo org={p} size={26} background="var(--turq)" />
                      )}
                    </span>
                  )
                )
              })}
            </span>
            <ChevronRight size={18} className="flip-rtl" />
          </button>
          <BecomeHostCard placement="top" />
          <div className="section-head">
            <h2 className="h2">{t('aboutMe')}</h2>
            <button className="link" onClick={() => setEditing(true)}>
              {t('edit')}
            </button>
          </div>
          {user.bio ? (
            <p
              className="card"
              style={{
                padding: '12px 14px',
                fontSize: 15,
                margin: 0,
              }}
            >
              {user.bio}
            </p>
          ) : (
            <button
              className="card"
              onClick={() => setEditing(true)}
              style={{
                width: '100%',
                padding: '12px 14px',
                textAlign: 'start',
                fontSize: 15,
                color: 'var(--muted)',
              }}
            >
              + {t('addBio')}
            </button>
          )}
          <div className="section-head">
            <h2 className="h2">{t('interests')}</h2>
            <button className="link" onClick={() => nav('/signup/interests?edit=1')}>
              {t('edit')}
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {interests.map((interest, i) => (
              <InterestChip key={interest} id={interest} index={i} />
            ))}
          </div>
          <p
            style={{
              fontSize: 15,
              color: 'var(--muted)',
              margin: '12px 0 0',
            }}
          >
            {t('interestsHint')}
          </p>
          <BadgeSection />
          <section ref={settingsRef}>
            <div className="section-head">
              <h2 className="h2">{t('settings')}</h2>
            </div>
            <button
              className="row"
              style={{
                width: '100%',
                padding: '14px 0',
                borderBottom: '1px solid var(--grey-2)',
              }}
              onClick={() => setLangOpen(true)}
            >
              <Globe size={20} />
              <span
                style={{
                  flex: 1,
                  textAlign: 'start',
                  fontWeight: 600,
                }}
              >
                {t('appLanguage')}
              </span>
              <span className="tiny">{languages.find((language) => language.id === user.language)?.name}</span>
              <ChevronRight size={18} className="flip-rtl" />
            </button>
            {[
              ['showJoined', t('showJoined'), t('showJoinedSub')],
              ['reminders', t('reminders'), t('remindersSub')],
              ['suggestions', t('weekly'), t('weeklySub')],
              ['news', t('news'), t('newsSub')],
            ].map(([f, S, N]) => (
              <div
                key={f}
                className="row"
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--grey-2)',
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
                      fontSize: 16,
                    }}
                  >
                    {S}
                  </strong>
                  <span className="tiny">{N}</span>
                </span>
                <Switch on={prefs[f]} onChange={togglePref(f, S)} label={S} />
              </div>
            ))}
            <div
              className="row"
              style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--grey-2)',
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
                    fontSize: 16,
                  }}
                >
                  {t('showBadgesSetting')}
                </strong>
                <span className="tiny">{t('showBadgesSub')}</span>
              </span>
              <Switch
                on={user.showBadges}
                onChange={(f) => {
                  app.setUser({
                    showBadges: f,
                  })
                  app.showToast(
                    t(f ? 'settingOn' : 'settingOff', {
                      label: t('showBadgesSetting'),
                    }),
                  )
                }}
                label={t('showBadgesSetting')}
              />
            </div>
            <div
              className="row"
              style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--grey-2)',
              }}
            >
              <Mail size={20} />
              <span
                style={{
                  flex: 1,
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    fontSize: 16,
                  }}
                >
                  {user.role === 'host' ? t('workEmail') : user.phone ? t('phoneNumber') : t('emailLabel')}
                </strong>
                <span className="tiny" dir="ltr">
                  {user.role === 'host' ? user.workEmail : user.phone || user.email || t('notAdded')}
                </span>
              </span>
            </div>
            <button
              className="row"
              style={{
                width: '100%',
                padding: '14px 0',
                borderBottom: '1px solid var(--grey-2)',
              }}
              onClick={() => setConfirm('switch')}
            >
              <Repeat size={20} />
              <span
                style={{
                  flex: 1,
                  textAlign: 'start',
                  fontWeight: 600,
                }}
              >
                {user.role === 'host' ? t('switchToGuest') : t('switchToHost')}
              </span>
              <ChevronRight size={18} className="flip-rtl" />
            </button>
            <button
              className="row"
              style={{
                width: '100%',
                padding: '16px 0',
                color: 'var(--orange)',
                fontWeight: 600,
              }}
              onClick={() => setConfirm('logout')}
            >
              <LogOut size={20} className="flip-rtl" /> {t('logOut')}
            </button>
            <button
              className="row"
              style={{
                width: '100%',
                padding: '4px 0 16px',
                color: 'var(--muted)',
                fontSize: 14,
              }}
              onClick={() => setConfirm('reset')}
            >
              <RotateCcw size={16} /> {t('resetDemo')}
            </button>
          </section>
          <BecomeHostCard placement="bottom" />
        </div>
      </div>
      <NavBar />
      <EditProfile open={editing} onClose={() => setEditing(false)} />
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title={t('appLanguage')}>
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
                app.setUser({
                  language: language.id,
                })
                setLangOpen(false)
                app.showToast(
                  t('languageSet', {
                    lang: language.name,
                  }),
                )
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
      <Sheet
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={
          confirm === 'reset'
            ? t('resetTitle')
            : confirm === 'switch'
              ? user.role === 'host'
                ? t('switchTitleGuest')
                : t('switchTitleHost')
              : t('logOutTitle')
        }
      >
        <p className="body">
          {confirm === 'reset'
            ? t('resetText')
            : confirm === 'switch'
              ? user.role === 'host'
                ? t('switchTextGuest')
                : t('switchTextHost')
              : user.role === 'host'
                ? t('logOutTextHost')
                : t('logOutTextGuest')}
        </p>
        <div
          className="stack"
          style={{
            marginTop: 20,
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => {
              confirm === 'reset'
                ? (app.reset(),
                  nav('/', {
                    replace: true,
                  }))
                : confirm === 'switch'
                  ? (app.setUser({
                      role: user.role === 'host' ? 'guest' : 'host',
                    }),
                    app.logout(),
                    nav(user.role === 'host' ? '/signup/phone?login=1' : '/signup/host?login=1', {
                      replace: true,
                    }))
                  : (app.logout(),
                    nav('/', {
                      replace: true,
                    }))
              setConfirm(null)
            }}
          >
            {t(confirm === 'reset' ? 'resetEverything' : confirm === 'switch' ? 'switchAccount' : 'logOut')}
          </button>
          <button className="btn btn-soft" onClick={() => setConfirm(null)}>
            {t('cancel')}
          </button>
        </div>
      </Sheet>
    </Screen>
  )
}
