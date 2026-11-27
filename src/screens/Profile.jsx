import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Eye,
  Flag,
  Globe,
  Languages,
  Lock,
  LogOut,
  Megaphone,
  MessageSquare,
  Pencil,
  RotateCcw,
  Settings,
  Smartphone,
} from 'lucide-react'
import { StickersPreview, useStats } from '../components/Badges'
import { usePronounLabel } from '../components/EditProfile'
import { Flower } from '../components/Flower'
import { Avatar } from '../components/Img'
import { OrgLogo } from '../components/OrgLogo'
import { BackButton, NavBar, Screen, Sheet, Switch } from '../components/UI'
import { languages, organisations } from '../data/events'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { BecomeHostCard } from './BecomeHost'
import { InterestChip } from '../components/InterestChip'
import { useApp } from '../state/AppState'
function HostPromo() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--ink)',
        color: 'var(--white)',
        borderRadius: 28,
        padding: '22px 20px',
        marginTop: 28,
      }}
    >
      <Flower accent="pink" size={150} style={{ position: 'absolute', right: -40, top: -40 }} />
      <div className="eyebrow" style={{ color: 'var(--lime)', position: 'relative' }}>
        {t('becomeHostEyebrow')}
      </div>
      <h2 className="h2" style={{ color: 'var(--white)', marginTop: 10, position: 'relative', maxWidth: 220 }}>
        {t('somethingToShare')}
      </h2>
      <p style={{ fontSize: 15, marginTop: 8, opacity: 0.85, maxWidth: 230 }}>{t('somethingToShareSub')}</p>
      <button className="btn btn-sm" style={{ background: 'var(--lime)', color: 'var(--ink)', marginTop: 16 }} onClick={() => nav('/post/start')}>
        {t('hostAnActivity')}
      </button>
    </section>
  )
}
export function Profile() {
  const nav = useNavigate()
  const app = useApp()
  const { t } = useI18n()
  const { user } = app
  const pronounLabel = usePronounLabel()
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
          <Flower color="#E7F269" size={200} style={{ position: 'absolute', right: -50, top: -40 }} />
          <div className="row" style={{ justifyContent: 'space-between', position: 'relative' }}>
            <div className="eyebrow" style={{ color: 'var(--ink)' }}>
              {t('profile')}
            </div>
            <span className="row" style={{ gap: 8 }}>
              <button className="icon-btn white" style={{ width: 40, height: 40, boxShadow: 'none' }} aria-label={t('editProfile')} onClick={() => nav('/profile/edit')}>
                <Pencil size={17} />
              </button>
              <button className="icon-btn white" style={{ width: 40, height: 40, boxShadow: 'none' }} aria-label={t('settings')} onClick={() => nav('/settings')}>
                <Settings size={18} />
              </button>
            </span>
          </div>
          <div className="row" style={{ marginTop: 16, position: 'relative', gap: 16 }}>
            {user.photo ? (
              <img src={user.photo} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <Avatar name={user.firstName || 'R'} img="ruben" size={90} />
            )}
            <div>
              <h1 className="h1">
                {user.firstName || t('you2')}
                {user.pronouns && (
                  <span style={{ fontSize: 15, fontWeight: 400, marginInlineStart: 6 }}>{pronounLabel(user.pronouns)}</span>
                )}
              </h1>
              {user.role === 'host' ? (
                <span className="row" style={{ gap: 6, marginTop: 4 }}>
                  <span className="tag host">
                    <BadgeCheck size={12} /> {t('hostBadge')}
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {user.verifiedBy ? t('verifiedBy', { org: user.org }) : `${user.org}${user.jobTitle ? ` · ${user.jobTitle}` : ''}`}
                  </span>
                </span>
              ) : (
                <span style={{ fontSize: 14 }}>{t('memberLineProfile', { area: user.area || 'Middelland' })}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20, position: 'relative' }}>
            <button
              className="card"
              onClick={() => nav('/plans?tab=been')}
              style={{ background: 'var(--ink)', color: 'var(--white)', padding: 14, textAlign: 'start' }}
            >
              <strong style={{ fontSize: 26, display: 'block', color: 'var(--lime)' }}>{stats.attended}</strong>
              <span style={{ fontSize: 13 }}>{t('activitiesJoined')}</span>
            </button>
            <button
              className="card"
              onClick={() => nav('/profile/preview')}
              style={{ background: 'var(--white)', padding: 14, textAlign: 'start', display: 'grid', alignContent: 'center', gap: 6 }}
            >
              <Eye size={20} aria-hidden />
              <span style={{ fontSize: 13 }}>{t('howOthersSee')}</span>
            </button>
          </div>
        </div>
        <div className="pad">
          <button
            className="card row"
            onClick={() => nav('/connections')}
            style={{ width: '100%', padding: '10px 12px 10px 18px', marginTop: 24, textAlign: 'start', minHeight: 48 }}
          >
            <strong style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{t('followingTab')}</strong>
            <span className="tiny">{t('nHosts', { n: app.following.length })}</span>
            <span style={{ display: 'flex' }}>
              {app.following.slice(0, 3).map((f, i) => {
                const [kind, id] = f.split(':')
                const p = kind === 'person' ? profiles[id] : organisations.find((o) => o.id === id)
                return (
                  p && (
                    <span key={f} style={{ marginInlineStart: i ? -8 : 0 }}>
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
          <div className="section-head">
            <h2 className="h2">{t('aboutMe')}</h2>
          </div>
          {user.bio ? (
            <p className="card" style={{ padding: '12px 14px', fontSize: 15, margin: 0 }}>
              {user.bio}
            </p>
          ) : (
            <button
              className="card"
              onClick={() => nav('/profile/edit')}
              style={{ width: '100%', padding: '12px 14px', textAlign: 'start', fontSize: 15, color: 'var(--muted)' }}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, justifyItems: 'start' }}>
            {interests.map((interest, i) => (
              <InterestChip key={interest} id={interest} index={i} />
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '12px 0 0' }}>{t('interestsHint')}</p>
          <StickersPreview />
          {user.role !== 'host' && <HostPromo />}
          <BecomeHostCard placement="bottom" />
        </div>
      </div>
      <NavBar />
    </Screen>
  )
}
function SetGroup({ title, children }) {
  return (
    <section style={{ marginTop: 18 }}>
      <div className="eyebrow" style={{ color: 'var(--ink)', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ background: 'var(--grey)', borderRadius: 18, padding: '0 14px' }}>{children}</div>
    </section>
  )
}
function SetRow({ Icon, label, sub, value, onClick, right, last }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      className="row"
      onClick={onClick}
      style={{ width: '100%', textAlign: 'start', padding: '13px 0', gap: 12, borderBottom: last ? 0 : '1px solid var(--grey-2)', alignItems: sub ? 'flex-start' : 'center' }}
    >
      <Icon size={18} aria-hidden style={{ flex: 'none', marginTop: sub ? 2 : 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15 }}>{label}</span>
        {sub && <span className="tiny">{sub}</span>}
      </span>
      {value && <span className="tiny">{value}</span>}
      {right ?? (onClick && <ChevronRight size={18} className="flip-rtl" color="var(--muted)" />)}
    </Tag>
  )
}
export function SettingsScreen() {
  const nav = useNavigate()
  const app = useApp()
  const { t } = useI18n()
  const { user } = app
  const [prefs, setPrefs] = useState({ translate: true, showJoined: true, reminders: true, news: true, suggestions: true })
  const [langOpen, setLangOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const pref = (key, label) => (
    <Switch
      on={prefs[key]}
      label={label}
      onChange={(on) => {
        setPrefs((p) => ({ ...p, [key]: on }))
        app.showToast(t(on ? 'settingOn' : 'settingOff', { label }))
      }}
    />
  )
  const langName = languages.find((l) => l.id === user.language)?.name ?? 'English'
  const phone = user.phone ? `•••• ${user.phone.replace(/\D/g, '').slice(-4)}` : t('notAdded')
  return (
    <Screen>
      <div className="scroll pad safe-top" style={{ paddingBottom: 40 }}>
        <div className="row" style={{ gap: 12 }}>
          <BackButton />
          <h1 className="h1">{t('settings')}</h1>
        </div>
        <SetGroup title={t('setLanguage')}>
          <SetRow Icon={Globe} label={t('appLanguage')} value={langName} onClick={() => setLangOpen(true)} />
          <SetRow Icon={Languages} label={t('translateComments')} right={pref('translate', t('translateComments'))} />
          <SetRow Icon={MessageSquare} label={t('iSpeak')} value={t('iSpeakValue')} onClick={() => setLangOpen(true)} last />
        </SetGroup>
        <SetGroup title={t('setPrivacy')}>
          <SetRow Icon={Lock} label={t('whoCanSee')} value={t('groupMembers')} onClick={() => app.showToast(t('whoCanSeeToast'))} />
          <SetRow Icon={CalendarDays} label={t('showJoined')} sub={t('showJoinedSubNew')} right={pref('showJoined', t('showJoined'))} />
          <SetRow
            Icon={Award}
            label={t('showBadgesSetting')}
            sub={t('showBadgesSub')}
            last
            right={
              <Switch
                on={user.showBadges}
                label={t('showBadgesSetting')}
                onChange={(on) => {
                  app.setUser({ showBadges: on })
                  app.showToast(t(on ? 'settingOn' : 'settingOff', { label: t('showBadgesSetting') }))
                }}
              />
            }
          />
        </SetGroup>
        <SetGroup title={t('setNotifications')}>
          <SetRow Icon={Bell} label={t('reminders')} sub={t('remindersSub')} right={pref('reminders', t('reminders'))} />
          <SetRow Icon={CalendarDays} label={t('weekly')} sub={t('weeklySub')} right={pref('suggestions', t('weekly'))} />
          <SetRow Icon={Megaphone} label={t('news')} sub={t('newsSub')} right={pref('news', t('news'))} last />
        </SetGroup>
        <SetGroup title={t('setHelp')}>
          <SetRow Icon={CircleHelp} label={t('contactCvd')} onClick={() => app.showToast(t('contactCvdToast'))} />
          <SetRow Icon={BookOpen} label={t('guidelines')} onClick={() => app.showToast(t('guidelinesToast'))} />
          <SetRow Icon={Flag} label={t('reportProblem')} onClick={() => app.showToast(t('reportToast'))} last />
        </SetGroup>
        <SetGroup title={t('setAccount')}>
          <SetRow Icon={Smartphone} label={user.role === 'host' ? t('workEmail') : t('phoneNumber')} value={user.role === 'host' ? user.workEmail : phone} last />
        </SetGroup>
        <button className="row" style={{ padding: '22px 0 8px', color: 'var(--orange)', fontWeight: 600, gap: 8 }} onClick={() => setConfirm('logout')}>
          <LogOut size={18} className="flip-rtl" /> {t('logOut')}
        </button>
        <button className="tiny" style={{ display: 'block', padding: '6px 0' }} onClick={() => app.showToast(t('deleteAccountToast'))}>
          {t('deleteAccount')}
        </button>
        <button className="row tiny" style={{ gap: 6, padding: '6px 0', color: 'var(--muted)' }} onClick={() => setConfirm('reset')}>
          <RotateCcw size={14} /> {t('resetDemo')}
        </button>
      </div>
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title={t('appLanguage')}>
        <div className="stack" style={{ gap: 8 }}>
          {languages.map((language) => (
            <button
              key={language.id}
              className="card"
              onClick={() => {
                app.setUser({ language: language.id })
                setLangOpen(false)
                app.showToast(t('languageSet', { lang: language.name }))
              }}
              style={{ padding: '12px 16px', textAlign: 'start', background: user.language === language.id ? 'var(--lime)' : 'var(--grey)' }}
            >
              <strong>{language.name}</strong>
            </button>
          ))}
        </div>
      </Sheet>
      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title={confirm === 'reset' ? t('resetTitle') : t('logOutTitle')}>
        <p className="body">
          {confirm === 'reset' ? t('resetText') : user.role === 'host' ? t('logOutTextHost') : t('logOutTextGuest')}
        </p>
        <div className="stack" style={{ marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              confirm === 'reset' ? app.reset() : app.logout()
              setConfirm(null)
              nav('/', { replace: true })
            }}
          >
            {t(confirm === 'reset' ? 'resetEverything' : 'logOut')}
          </button>
          <button className="btn btn-soft" onClick={() => setConfirm(null)}>
            {t('cancel')}
          </button>
        </div>
      </Sheet>
    </Screen>
  )
}
