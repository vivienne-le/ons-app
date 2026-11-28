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
  const { t, ev } = useI18n()
  const stats = useStats()
  const shared = beenTo[0] && byId(beenTo[0].eventId)
  const sharedEvent = shared && ev(shared)
  const earned = badges
    .filter((badge) => stats[badge.stat] >= badge.goal)
    .map((badge) => badge.id)
    .slice(0, 3)
  return (
    <Screen>
      <div className="scroll pad safe-top with-nav">
        <div
          className="row"
          style={{
            gap: 12,
          }}
        >
          <BackButton to="/profile" />
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {t('howOthersSee')}
          </h1>
        </div>

        <div
          className="row"
          style={{
            marginTop: 12,
            background: 'var(--turq)',
            borderRadius: 16,
            minHeight: 52,
            padding: '0 16px',
            gap: 10,
          }}
        >
          <Eye size={22} aria-hidden />
          <span
            style={{
              flex: 1,
              fontSize: 14,
            }}
          >
            {t('onlyGroupsSee')}
          </span>
          <button
            onClick={() => nav('/settings')}
            style={{
              color: '#000',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {t('changeLabel')}
          </button>
        </div>

        <ProfileCard
          subline={t('memberLine', {
            area: user.area || 'Middelland',
          })}
          sharedEvent={sharedEvent}
        />

        <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--muted)', marginTop: 12 }}>
          {t('neverShow')}
        </p>
      </div>
      <NavBar />
    </Screen>
  )
}
export function ProfileCard({ subline, sharedEvent, earned }) {
  const { user } = useApp()
  const { t } = useI18n()
  const name = user.firstName || '?'
  const interests = [...(user.interests.length ? user.interests : ['Cooking', 'Cycling', 'Football', 'Games', 'Running'])].sort()
  return (
    <section
      aria-label={t('previewProfile')}
      style={{
        marginTop: 23,
        background: 'var(--white)',
        border: '1px solid rgba(115,115,115,.12)',
        boxShadow: '0 1px 2px rgba(0,0,0,.05)',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', background: 'var(--lime)', height: 125, overflow: 'hidden' }}>
        <Flower color="#E8F46A" size={180} style={{ position: 'absolute', left: 220, top: -64, transform: 'rotate(15deg)' }} />
        <span style={{ position: 'absolute', left: 12, top: 30, borderRadius: '50%', display: 'flex' }}>
          {user.photo ? (
            <img src={user.photo} alt="" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <Avatar name={name} img="ruben" size={70} />
          )}
        </span>
        <span style={{ position: 'absolute', left: 94, top: 28, right: 8, display: 'grid', gap: 4 }}>
          <strong style={{ display: 'block', fontSize: 44, fontWeight: 500, lineHeight: '48px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            {name}
            {user.pronouns && <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: 0, marginInlineStart: 8 }}>{user.pronouns}</span>}
          </strong>
          <span style={{ fontSize: 14, lineHeight: '21px' }}>{subline}</span>
        </span>
      </div>
      <div style={{ padding: '12px 11px 20px' }}>
        {user.bio && <p style={{ fontSize: 14, lineHeight: '21px', margin: '0 0 12px', color: '#000' }}>{user.bio}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: '10px 9px' }}>
          {interests.map((interest, i) => (
            <InterestChip key={interest} id={interest} index={i} />
          ))}
        </div>
        {user.showBadges && earned?.length > 0 && (
          <div
            style={{
              marginTop: 14,
            }}
          >
            <BadgeRow ids={earned} />
          </div>
        )}
        {sharedEvent && (
          <>
            <hr
              style={{
                border: 0,
                borderTop: '1px solid var(--grey-2)',
                margin: '14px 0 12px',
              }}
            />
            <div
              className="row"
              style={{
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <Flower accent="turq" size={36}>
                <Footprints size={15} aria-hidden />
              </Flower>
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 15,
                  }}
                >
                  {t('bothJoined', {
                    title: sharedEvent.title,
                    place: sharedEvent.place,
                  })}
                </strong>
                <span
                  style={{
                    fontSize: 14,
                    color: 'var(--muted)',
                  }}
                >
                  {t('onlyWentToo')}
                </span>
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
