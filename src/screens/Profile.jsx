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
import { BadgeIcon, StickerSheet, badges, useStats } from '../components/Badges'
import { usePronounLabel } from '../components/EditProfile'
import { Flower } from '../components/Flower'
import { Avatar } from '../components/Img'
import { OrgLogo } from '../components/OrgLogo'
import { BackButton, NavBar, Screen, Sheet, Switch } from '../components/UI'
import { languages, organisations } from '../data/events'
import { profiles } from '../data/people'
import { useI18n } from '../i18n/index'
import { InterestChip } from '../components/InterestChip'
import { useApp } from '../state/AppState'
function HostPromo() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)', borderRadius: 20, height: 232 }}>
      <Flower accent="pink" size={120} style={{ position: 'absolute', left: 262, top: -36, transform: 'rotate(36deg)' }} />
      <div style={{ position: 'absolute', left: 20, top: 22, width: 196, display: 'grid', gap: 12 }}>
        <div className="eyebrow" style={{ color: 'var(--lime)' }}>
          {t('becomeHostEyebrow')}
        </div>
        <h2 style={{ color: 'var(--white)', margin: 0, fontSize: 24, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.02em' }}>{t('somethingToShare')}</h2>
        <p style={{ fontSize: 14, lineHeight: '21px', margin: 0, color: 'var(--grey)', width: 230 }}>{t('somethingToShareSub')}</p>
      </div>
      <button
        onClick={() => nav('/post/start')}
        style={{ position: 'absolute', left: 20, top: 164, width: 152, height: 40, borderRadius: 30, background: 'var(--lime)', color: '#000', fontSize: 14, lineHeight: '21px', fontWeight: 600 }}
      >
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
  const interests = user.interests.length ? user.interests : ['Cooking', 'Cycling', 'Football', 'Games', 'Running']
  const earned = badges.filter((b) => stats[b.stat] >= b.goal)
  const [openSticker, setOpenSticker] = useState(null)
  const section = (title, right) => (
    <div className="row" style={{ gap: 8, justifyContent: 'space-between' }}>
      <h2 style={{ flex: 1, margin: 0, fontSize: 24, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: '#000' }}>{title}</h2>
      {right}
    </div>
  )
  return (
    <Screen>
      <div className="scroll with-nav">
        <div style={{ background: 'var(--lime)', borderRadius: '0 0 40px 40px', height: 333, position: 'relative', overflow: 'hidden' }}>
          <Flower color="#E7F269" size={182} style={{ position: 'absolute', left: 254, top: 38, transform: 'rotate(14deg)' }} />
          <div className="eyebrow" style={{ color: 'var(--ink)', position: 'absolute', left: 20, top: 71 }}>
            {t('profile')}
          </div>
          <button
            aria-label={t('editProfile')}
            onClick={() => nav('/profile/edit')}
            style={{ position: 'absolute', right: 73, top: 62, width: 44, height: 44, borderRadius: 22, background: 'var(--white)', display: 'grid', placeItems: 'center' }}
          >
            <Pencil size={20} />
          </button>
          <button
            aria-label={t('settings')}
            onClick={() => nav('/settings')}
            style={{ position: 'absolute', right: 21, top: 62, width: 44, height: 44, borderRadius: 22, background: 'var(--white)', display: 'grid', placeItems: 'center' }}
          >
            <Settings size={20} />
          </button>
          <span style={{ position: 'absolute', left: 20, top: 117 }}>
            {user.photo ? (
              <img src={user.photo} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <Avatar name={user.firstName || 'R'} img="ruben" size={90} />
            )}
          </span>
          <div style={{ position: 'absolute', left: 122, top: 126, right: 16, display: 'grid', gap: 4 }}>
            <p style={{ margin: 0, fontSize: 44, lineHeight: '48px', fontWeight: 500, letterSpacing: '-0.03em', color: '#000', whiteSpace: 'nowrap' }}>
              {user.firstName || t('you2')}
              {user.pronouns && (
                <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: 0, color: 'rgba(32,30,31,.6)' }}> {pronounLabel(user.pronouns)}</span>
              )}
            </p>
            {user.role === 'host' ? (
              <span className="row" style={{ gap: 6 }}>
                <span className="tag host">
                  <BadgeCheck size={12} /> {t('hostBadge')}
                </span>
                <span style={{ fontSize: 14 }}>{user.verifiedBy ? t('verifiedBy', { org: user.org }) : user.org}</span>
              </span>
            ) : (
              <span style={{ fontSize: 14, lineHeight: '21px' }}>{t('memberLineProfile', { area: user.area || 'Middelland' })}</span>
            )}
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, top: 228, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <button
              onClick={() => nav('/plans?tab=been')}
              style={{ height: 78, borderRadius: 20, background: 'var(--ink)', color: 'var(--white)', padding: '13px 16px', textAlign: 'start', display: 'grid', alignContent: 'start', gap: 4 }}
            >
              <strong style={{ fontSize: 24, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--lime)' }}>{stats.attended}</strong>
              <span style={{ fontSize: 14, lineHeight: '21px' }}>{t('activitiesJoined')}</span>
            </button>
            <button
              onClick={() => nav('/profile/preview')}
              style={{ height: 78, borderRadius: 20, background: 'var(--white)', padding: '15px 16px', textAlign: 'start', display: 'grid', alignContent: 'start', gap: 6 }}
            >
              <Eye size={22} aria-hidden />
              <span style={{ fontSize: 14, lineHeight: '21px', color: '#000' }}>{t('howOthersSee')}</span>
            </button>
          </div>
        </div>
        <div style={{ padding: '24px 20px 0', display: 'grid', gap: 24 }}>
          <button
            className="row"
            onClick={() => nav('/connections')}
            style={{ width: '100%', minHeight: 52, padding: '10px 12px 10px 16px', borderRadius: 20, background: 'var(--grey)', textAlign: 'start', gap: 12 }}
          >
            <strong style={{ flex: 1, fontSize: 16, lineHeight: '24px', fontWeight: 600, letterSpacing: '-0.01em' }}>{t('followingTab')}</strong>
            <span style={{ fontSize: 14, lineHeight: '21px', color: 'var(--muted)' }}>{t('nHosts', { n: app.following.length })}</span>
            <span style={{ display: 'flex' }}>
              {app.following.slice(0, 3).map((f, i) => {
                const [kind, id] = f.split(':')
                const p = kind === 'person' ? profiles[id] : organisations.find((o) => o.id === id)
                return (
                  p && (
                    <span key={f} style={{ marginInlineStart: i ? -10 : 0, borderRadius: '50%', boxShadow: '0 0 0 2px var(--grey)', display: 'flex', background: 'var(--white)' }}>
                      {kind === 'person' ? <Avatar name={p.name} img={p.avatar} size={24} /> : <OrgLogo org={p} size={24} />}
                    </span>
                  )
                )
              })}
            </span>
            <ChevronRight size={18} className="flip-rtl" />
          </button>
          <div style={{ display: 'grid', gap: 8 }}>
            {section(t('aboutMe'))}
            {user.bio ? (
              <p style={{ margin: 0, background: 'var(--grey)', borderRadius: 20, padding: '15px', minHeight: 72, fontSize: 14, lineHeight: '21px', color: '#000' }}>{user.bio}</p>
            ) : (
              <button
                onClick={() => nav('/profile/edit')}
                style={{ background: 'var(--grey)', borderRadius: 20, padding: 15, minHeight: 72, textAlign: 'start', fontSize: 14, color: 'var(--muted)' }}
              >
                + {t('addBio')}
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gap: 13 }}>
            {section(
              t('interests'),
              <button className="link" onClick={() => nav('/signup/interests?edit=1')} style={{ color: '#000' }}>
                {t('edit')}
              </button>,
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '10px 9px' }}>
              {interests.map((interest, i) => (
                <InterestChip key={interest} id={interest} index={i} />
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--muted)', margin: '-4px 0 0' }}>{t('interestsHint')}</p>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {section(
              t('badgesTitle'),
              <>
                <span className="eyebrow">{t('nOfM', { n: earned.length, m: badges.length })}</span>
                <button className="link" style={{ fontSize: 14, color: 'var(--ink)' }} onClick={() => nav('/stickers')}>
                  {t('seeAll')}
                </button>
              </>,
            )}
            <div className="row" style={{ justifyContent: 'space-between', background: 'var(--grey)', borderRadius: 20, padding: '14px 12px' }}>
              {earned.slice(0, 4).map((b) => (
                <button key={b.id} onClick={() => setOpenSticker(b)} style={{ position: 'relative', width: 60, height: 70 }} aria-label={t(`badge_${b.id}`)}>
                  <BadgeIcon b={b} earned size={60} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 52,
                      left: 27,
                      transform: 'translateX(-50%)',
                      background: 'var(--ink)',
                      color: 'var(--white)',
                      borderRadius: 999,
                      padding: '2px 7px',
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      lineHeight: '14px',
                      fontWeight: 500,
                    }}
                  >
                    {stats[b.stat]}
                  </span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--muted)', margin: 0 }}>{t('stickersSub')}</p>
          </div>
          {user.role !== 'host' && <HostPromo />}
        </div>
      </div>
      <StickerSheet b={openSticker} stats={stats} onClose={() => setOpenSticker(null)} />
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
