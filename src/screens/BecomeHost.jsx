import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Building2, Check, Coffee, X } from 'lucide-react'
import { Flower } from '../components/Flower'
import { BackButton, Progress, Screen } from '../components/UI'
import { interestOptions, organisations } from '../data/events'
import { orgInfo } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
export const kindKey = {
  community: 'orgCommunity',
  care: 'orgCare',
  creative: 'orgCreative',
  sport: 'orgSport',
}
export function BecomeHostIntro() {
  const nav = useNavigate()
  const { t } = useI18n()
  const steps = [
    {
      I: Building2,
      k: 'bhStep1',
      s: 'bhStep1Sub',
      bg: 'var(--turq)',
    },
    {
      I: Coffee,
      k: 'bhStep2',
      s: 'bhStep2Sub',
      bg: 'var(--pink)',
    },
    {
      I: BadgeCheck,
      k: 'bhStep3',
      s: 'bhStep3Sub',
      bg: 'var(--lime)',
    },
  ]
  return (
    <Screen>
      <div className="scroll pad safe-top">
        <BackButton to="/profile" />
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            marginTop: 10,
          }}
        >
          <Flower color="var(--lime)" size={110}>
            <BadgeCheck size={40} />
          </Flower>
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 18,
          }}
        >
          {t('bhTitle')}
        </h1>
        <p
          className="body"
          style={{
            marginTop: 10,
          }}
        >
          {t('bhIntroSub')}
        </p>
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '22px 0 0',
            display: 'grid',
            gap: 10,
          }}
        >
          {steps.map(({ I, k, s, bg }) => (
            <li
              key={k}
              className="row"
              style={{
                background: bg,
                borderRadius: 20,
                padding: 14,
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--white)',
                  display: 'grid',
                  placeItems: 'center',
                  flex: 'none',
                }}
              >
                <I size={19} aria-hidden />
              </span>
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 17,
                  }}
                >
                  {t(k)}
                </strong>
                <span
                  style={{
                    fontSize: 14,
                  }}
                >
                  {t(s)}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p
          className="small"
          style={{
            marginTop: 16,
          }}
        >
          {t('bhSmall')}
        </p>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/become-host/org')}>
          {t('letsGo')}
        </button>
        <button className="btn btn-secondary" onClick={() => nav('/profile')}>
          {t('maybeLater')}
        </button>
      </div>
    </Screen>
  )
}
export function BecomeHostOrg() {
  const nav = useNavigate()
  const { user, setHostRequest } = useApp()
  const { t, interest } = useI18n()
  const [org, setOrg] = useState('')
  const [what, setWhat] = useState(user.interests.slice(0, 1))
  const [message, setMessage] = useState('')
  const [cohost, setCohost] = useState(true)
  const interestChoices = [...new Set([...user.interests, ...interestOptions.map((j) => j.id)])].slice(0, 10)
  return (
    <Screen>
      <form
        id="bh-form"
        className="scroll pad safe-top"
        onSubmit={(j) => {
          j.preventDefault()
          org &&
            (setHostRequest({
              org,
              what,
              message,
              cohost,
            }),
            nav('/become-host/sent', {
              replace: true,
            }))
        }}
      >
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
          }}
        >
          <BackButton />
          <Progress step={1} total={2} />
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 24,
          }}
        >
          {t('bhOrgTitle')}
        </h1>
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {t('bhOrgSub')}
        </p>
        <div
          role="radiogroup"
          aria-label={t('bhOrgTitle')}
          style={{
            marginTop: 18,
          }}
        >
          {organisations.map((j) => {
            const k = org === j.id
            return (
              <button
                key={j.id}
                type="button"
                role="radio"
                aria-checked={k}
                onClick={() => setOrg(j.id)}
                className="row"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginTop: 6,
                  borderRadius: 18,
                  textAlign: 'start',
                  background: k ? 'var(--lime)' : 'transparent',
                  boxShadow: k ? 'inset 0 0 0 2px var(--ink)' : 'inset 0 0 0 1px var(--grey-2)',
                }}
              >
                <Flower color={k ? 'var(--white)' : 'var(--turq)'} size={40}>
                  <strong
                    style={{
                      fontSize: 15,
                    }}
                  >
                    {j.name.replace(/^(Het|De) /, '').slice(0, 1)}
                  </strong>
                </Flower>
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
                    {j.name}
                  </strong>
                  <span
                    className="tiny"
                    style={{
                      color: 'var(--muted-2)',
                    }}
                  >
                    {t(kindKey[orgInfo[j.id].kind])}
                  </span>
                </span>
                {k && <Check size={20} aria-hidden />}
              </button>
            )
          })}
        </div>
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
            marginBottom: 8,
          }}
        >
          {t('bhWhat')}
        </div>
        <div
          className="row"
          style={{
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {interestChoices.map((j) => {
            const k = what.includes(j)
            return (
              <button
                key={j}
                type="button"
                aria-pressed={k}
                className={`chip ${k ? 'on' : ''}`}
                onClick={() => setWhat(k ? what.filter((l) => l !== j) : [...what, j])}
              >
                {k && <Check size={14} aria-hidden />}
                {interest(j)}
              </button>
            )
          })}
        </div>
        <label
          className="eyebrow label"
          htmlFor="bh-msg"
          style={{
            marginTop: 24,
          }}
        >
          {t('bhMsg')}{' '}
          <span
            style={{
              textTransform: 'none',
            }}
          >
            {t('optional')}
          </span>
        </label>
        <textarea
          id="bh-msg"
          className="field"
          rows={3}
          maxLength={200}
          placeholder={t('bhMsgPh')}
          value={message}
          onChange={(j) => setMessage(j.target.value)}
          style={{
            height: 'auto',
            padding: '14px 16px',
            fontSize: 16,
            lineHeight: 1.4,
            resize: 'none',
          }}
        />
        <label
          className="row"
          style={{
            marginTop: 14,
            gap: 10,
            fontSize: 15,
            cursor: 'pointer',
            paddingBottom: 20,
          }}
        >
          <input
            type="checkbox"
            checked={cohost}
            onChange={(j) => setCohost(j.target.checked)}
            style={{
              width: 20,
              height: 20,
              accentColor: 'var(--ink)',
              flex: 'none',
            }}
          />
          {t('bhCohost')}
        </label>
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="bh-form" disabled={!org}>
          {t('bhSend')}
        </button>
      </div>
    </Screen>
  )
}
export function BecomeHostSent() {
  const nav = useNavigate()
  const { hostRequest } = useApp()
  const { t } = useI18n()
  const org = organisations.find((d) => d.id === (hostRequest == null ? undefined : hostRequest.org))
  const orgName = (org == null ? undefined : org.name) ?? ''
  const nextSteps = ['bhS1', 'bhS2', 'bhS3']
  return (
    <Screen lime>
      <div className="scroll pad safe-top">
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            marginTop: 30,
          }}
          className="pop"
        >
          <Flower color="var(--white)" size={140}>
            <Check size={52} />
          </Flower>
        </div>
        <h1
          className="h1"
          style={{
            textAlign: 'center',
            marginTop: 22,
          }}
        >
          {t('bhSentTitle', {
            org: orgName,
          })}
        </h1>
        <p
          className="body"
          style={{
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {t('bhSentSub', {
            org: orgName,
          })}
        </p>
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '26px 0 0',
            display: 'grid',
            gap: 10,
          }}
        >
          {nextSteps.map((d, e) => (
            <li
              key={d}
              className="row"
              style={{
                gap: 10,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: e === 0 ? 'var(--ink)' : 'var(--white)',
                  color: e === 0 ? 'var(--white)' : 'var(--ink)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {e === 0 ? <Check size={15} /> : e + 1}
              </span>
              <span
                style={{
                  fontSize: 16,
                }}
              >
                {t(d)}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          onClick={() =>
            nav('/profile', {
              replace: true,
            })
          }
        >
          {t('gotIt')}
        </button>
      </div>
    </Screen>
  )
}
/**
 * Card on the guest's profile: invite → pending → (demo) approved.
 * The invite can be hidden with ×; it then moves to the bottom of the profile (placement="bottom").
 */
export function BecomeHostCard({ placement = 'top' }) {
  const nav = useNavigate()
  const { user, hostRequest, setHostRequest, setUser, showToast } = useApp()
  const { t } = useI18n()
  if (user.role === 'host') return null
  const moved = !!user.hostCardMoved
  if (!hostRequest && placement === (moved ? 'bottom' : 'top'))
    return (
      <div
        className="card"
        style={{
          background: 'var(--turq)',
          padding: 16,
          marginTop: 24,
          position: 'relative',
        }}
      >
        {!moved && (
          <button
            className="icon-btn white"
            aria-label={t('hideCard')}
            onClick={() => {
              setUser({ hostCardMoved: true })
              showToast(t('movedToBottom'), { label: t('undo'), run: () => setUser({ hostCardMoved: false }) })
            }}
            style={{ position: 'absolute', top: 10, insetInlineEnd: 10, width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        )}
        <div
          className="row"
          style={{
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--white)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}
          >
            <BadgeCheck size={22} aria-hidden />
          </span>
          <span style={{ paddingInlineEnd: moved ? 0 : 32 }}>
            <strong
              style={{
                display: 'block',
                fontSize: 17,
              }}
            >
              {t('bhCardTitle')}
            </strong>
            <span
              style={{
                fontSize: 14,
              }}
            >
              {t('bhCardSub')}
            </span>
          </span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          style={{
            width: '100%',
            marginTop: 12,
          }}
          onClick={() => nav('/become-host')}
        >
          {t('bhTitle')}
        </button>
      </div>
    )
  if (!hostRequest || placement !== 'top') return null
  const org = organisations.find((b) => b.id === hostRequest.org)
  return (
    <div
      className="card"
      style={{
        background: 'var(--white)',
        boxShadow: 'inset 0 0 0 2px var(--ink)',
        padding: 16,
        marginTop: 24,
      }}
    >
      <span className="eyebrow">{t('bhPending')}</span>
      <strong
        style={{
          display: 'block',
          fontSize: 17,
          marginTop: 4,
        }}
      >
        {t('bhWaiting', {
          org: org.name,
        })}
      </strong>
      <div
        className="row"
        style={{
          gap: 8,
          marginTop: 12,
        }}
      >
        <button
          className="btn btn-sm btn-soft"
          style={{
            flex: 1,
          }}
          onClick={() => {
            setHostRequest(null)
            showToast(t('bhWithdrawn'))
          }}
        >
          {t('bhWithdraw')}
        </button>
        <button
          className="btn btn-sm btn-primary"
          style={{
            flex: 1,
          }}
          onClick={() => {
            setUser({
              role: 'host',
              org: org.name,
              verifiedBy: org.id,
            })
            setHostRequest(null)
            showToast(
              t('bhApproved', {
                org: org.name,
              }),
            )
          }}
        >
          {t('bhDemoApprove', {
            org: org.name.split(' ')[0],
          })}
        </button>
      </div>
    </div>
  )
}
