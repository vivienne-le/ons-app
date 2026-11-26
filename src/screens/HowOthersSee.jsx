// "How others see you": a preview of your profile as neighbours in your groups see it (Figma: New ver › How others see you).
import { Eye, Footprints } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BadgeRow, useStats, badges } from '../components/Badges'
import { Flower } from '../components/Flower'
import { InterestChip } from '../components/InterestChip'
import { Avatar } from '../components/Img'
import { BackButton, NavBar, Screen } from '../components/UI'
import { beenTo, byId } from '../data/events'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'

export function HowOthersSee() {
  const nav = useNavigate()
  const { user } = useApp()
  const { t, ev, interest } = useI18n()
  const stats = useStats()
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || '?'
  const interests = user.interests.length ? user.interests : ['Cooking', 'Cycling', 'Football']
  const shared = beenTo[0] && byId(beenTo[0].eventId)
  const sharedEvent = shared && ev(shared)
  const earned = badges
    .filter((b) => stats[b.stat] >= b.goal)
    .map((b) => b.id)
    .slice(0, 3)

  return (
    <Screen>
      <div className="scroll pad safe-top with-nav">
        <div className="row" style={{ gap: 12 }}>
          <BackButton to="/profile" />
          <h1 className="h2" style={{ fontSize: 28 }}>
            {t('howOthersSee')}
          </h1>
        </div>

        <div
          className="row"
          style={{ marginTop: 14, background: 'var(--turq)', borderRadius: 16, padding: '14px 16px', gap: 10 }}
        >
          <Eye size={20} aria-hidden />
          <span style={{ flex: 1, fontSize: 14 }}>{t('onlyGroupsSee')}</span>
          <button
            onClick={() => nav('/profile?section=settings')}
            style={{ fontSize: 14, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            {t('changeLabel')}
          </button>
        </div>

        <section
          aria-label={t('previewProfile')}
          style={{ marginTop: 20, background: 'var(--grey)', borderRadius: 20, overflow: 'hidden' }}
        >
          <div
            className="row"
            style={{
              position: 'relative',
              background: 'var(--lime)',
              padding: '28px 14px 22px',
              gap: 12,
              overflow: 'hidden',
            }}
          >
            <Flower color="#E8F46A" size={190} style={{ position: 'absolute', insetInlineEnd: -50, top: -80 }} />
            <span style={{ position: 'relative', borderRadius: '50%', boxShadow: '0 0 0 3px var(--white)' }}>
              {user.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <Avatar name={name} size={70} />
              )}
            </span>
            <span style={{ position: 'relative', minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: 40, fontWeight: 500, lineHeight: 1.1 }}>
                {user.firstName || '?'}
                {user.pronouns && (
                  <span style={{ fontSize: 15, fontWeight: 400, marginInlineStart: 8 }}>({user.pronouns})</span>
                )}
              </strong>
              <span style={{ fontSize: 14 }}>{t('memberLine', { area: user.area || 'Middelland' })}</span>
            </span>
          </div>

          <div style={{ padding: '14px 12px 16px' }}>
            {user.bio && <p style={{ fontSize: 14, margin: '0 0 12px' }}>{user.bio}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {interests.map((id, i) => (
                <InterestChip key={id} id={id} index={i} background="var(--white)" />
              ))}
            </div>
            {user.showBadges && earned.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <BadgeRow ids={earned} />
              </div>
            )}
            {sharedEvent && (
              <>
                <hr style={{ border: 0, borderTop: '1px solid var(--grey-2)', margin: '14px 0 12px' }} />
                <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                  <Flower accent="orange" size={36}>
                    <Footprints size={15} color="var(--white)" aria-hidden />
                  </Flower>
                  <span>
                    <strong style={{ display: 'block', fontSize: 15 }}>
                      {t('bothJoined', { title: sharedEvent.title, place: sharedEvent.place })}
                    </strong>
                    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{t('onlyWentToo')}</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 12 }}>{t('neverShow')}</p>
      </div>
      <NavBar />
    </Screen>
  )
}
