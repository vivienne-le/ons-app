import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BadgeCheck, Check, ChevronRight, Globe, Heart, LoaderCircle, Send, Share2, Users, X } from 'lucide-react'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { Avatar, AvatarStack, Img } from '../components/Img'
import { ShareSheet } from '../components/ShareSheet'
import { BackButton, Screen, Sheet, WhenWhere } from '../components/UI'
import { beenTo, byId, organisations } from '../data/events'
import { goingPeople, orgOfEvent, profileLink } from '../data/people'
import { useI18n } from '../i18n/index'
import { useApp } from '../state/AppState'
const attended = (eventId) => beenTo.some((b) => b.eventId === eventId)
export function EventScreen() {
  const { id = '' } = useParams()
  const raw = byId(id)
  const nav = useNavigate()
  const app = useApp()
  const { t, ev, langName, lang, commentIn, canTranslate, dayLong, full } = useI18n()
  const e = raw && ev(raw)
  const [mode, setMode] = useState('original')
  const [showAll, setShowAll] = useState(false)
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [signupsOpen, setSignupsOpen] = useState(false)
  const [whoGoingOpen, setWhoGoingOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const commentInput = useRef(null)
  const scroller = useRef(null)
  const [params] = useSearchParams()
  useEffect(() => {
    setMode('original')
    setShowAll(false)
    params.get('c') === '1'
      ? window.setTimeout(() => {
          document.getElementById('comments')?.scrollIntoView({
            behavior: 'smooth',
          })
          commentInput.current?.focus({
            preventScroll: true,
          })
        }, 350)
      : scroller.current?.scrollTo(0, 0)
  }, [id])
  const myComments = app.myComments[id] ?? []
  const allComments = useMemo(
    () =>
      e
        ? [
            ...e.comments.map((comment) => ({
              ...comment,
              replies: [
                ...(comment.replies ?? []),
                ...myComments.filter((myComment) => myComment.replyTo === comment.id),
              ],
            })),
            ...myComments.filter((myComment) => !myComment.replyTo),
          ]
        : [],
    [e, myComments],
  )
  if (!e)
    return (
      <Screen>
        <div className="pad safe-top">
          <BackButton />
          <h1
            className="h2"
            style={{
              marginTop: 20,
            }}
          >
            {t('notExist')}
          </h1>
        </div>
      </Screen>
    )
  const isMine =
    app.user.role === 'host' &&
    !!organisations.find((organisation) => organisation.name === app.user.org)?.events.includes(e.id)
  const joined = app.joined.includes(e.id)
  const saved = app.saved.includes(e.id)
  const going = app.goingCount(e.id)
  const people = goingPeople(raw)
  const org = orgOfEvent(e.id)
  const spotsLeft = Math.max(0, e.capacity - going)
  const totalComments = allComments.reduce((T, J) => {
    return T + 1 + (J.replies?.length ?? 0)
  }, 0)
  const flatComments = allComments.flatMap((allComment) => [allComment, ...(allComment.replies ?? [])])
  const translatableCount = flatComments.filter(canTranslate).length
  const foreignLangs = [...new Set(flatComments.filter(canTranslate).map((flatComment) => flatComment.lang))]
    .map(langName)
    .join(', ')
  const myLangName = langName(lang)
  const visibleComments = showAll ? allComments : allComments.slice(0, 2)
  const translate = () => {
    setMode('translating')
    window.setTimeout(() => setMode('translated'), 950)
  }
  const share = () => setSharing(true)
  const send = () => {
    const T = draft.trim()
    T &&
      (app.addComment(e.id, replyTo ? `@${replyTo.name} ${T}` : T, replyTo?.id),
      setDraft(''),
      setReplyTo(null),
      setShowAll(true),
      app.showToast(t(replyTo ? 'replyPosted' : 'commentPosted')))
  }
  const renderComment = (T, J = false) => {
    const m = mode === 'translated' && canTranslate(T)
    const Ql = T.author.id === 'me'
    return (
      <div
        key={T.id}
        className="row"
        style={{
          alignItems: 'flex-start',
          gap: 10,
          marginLeft: J ? 36 : 0,
          marginTop: J ? 12 : 18,
        }}
      >
        <button
          aria-label={t('viewProfile', {
            name: T.author.name,
          })}
          style={{
            flex: 'none',
            borderRadius: '50%',
          }}
          onClick={() => {
            const n = profileLink(T.author.id)
            n && nav(n)
          }}
        >
          {Ql && app.user.photo ? (
            <img
              src={app.user.photo}
              alt=""
              style={{
                width: J ? 30 : 40,
                height: J ? 30 : 40,
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <Avatar name={T.author.name} img={T.author.avatar} size={J ? 30 : 40} />
          )}
        </button>
        <div
          style={{
            flex: 1,
          }}
        >
          <div
            className="row"
            style={{
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                fontSize: 15,
                fontWeight: 700,
              }}
              onClick={() => {
                const n = profileLink(T.author.id)
                n && nav(n)
              }}
            >
              {Ql ? `${T.author.name} ${t('youSuffix')}` : T.author.name}
            </button>
            {T.isHost && <span className="tag host">{t('hostBadge')}</span>}
            <span className="tiny">{T.ago}</span>
            {m && (
              <span className="tag">
                <Globe size={11} /> {t('translatedTag')}
              </span>
            )}
          </div>
          <p
            lang={m ? lang : T.lang}
            dir="auto"
            style={{
              margin: '3px 0 0',
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            {m ? commentIn(T) : T.text}
          </p>
          {!J && (
            <button
              className="tiny"
              style={{
                fontWeight: 600,
                marginTop: 6,
              }}
              onClick={() => {
                setReplyTo({
                  id: T.id,
                  name: T.author.name,
                })
                commentInput.current?.focus()
              }}
            >
              {t('reply')}
            </button>
          )}
          {T.replies?.map((n) => renderComment(n, true))}
        </div>
      </div>
    )
  }
  return (
    <Screen>
      <div
        className="scroll"
        ref={scroller}
        style={{
          paddingBottom: 130,
        }}
      >
        <div
          style={{
            position: 'relative',
          }}
        >
          {e.hero || e.photo ? (
            <Img
              name={e.hero}
              photo={e.photo}
              alt={e.title}
              accent={e.accent}
              icon={e.icon}
              style={{
                width: '100%',
                height: 260,
              }}
            />
          ) : (
            <div
              style={{
                height: 230,
                background: `var(--${e.accent})`,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Flower color="rgba(255,255,255,.5)" size={150}>
                <Icon name={e.icon} size={56} />
              </Flower>
            </div>
          )}
          <div
            className="row"
            style={{
              position: 'absolute',
              top: 'max(52px, env(safe-area-inset-top))',
              left: 20,
              right: 20,
              justifyContent: 'space-between',
            }}
          >
            <BackButton variant="white" to={attended(e.id) ? '/plans?tab=been' : undefined} />
            <div
              className="row"
              style={{
                gap: 8,
              }}
            >
              <button className="icon-btn white" aria-label={t('share')} onClick={share}>
                <Share2 size={18} />
              </button>
              <button
                className="icon-btn white"
                aria-label={t(saved ? 'unsave' : 'save')}
                aria-pressed={saved}
                onClick={() => {
                  const T = app.toggleSave(e.id)
                  app.showToast(t(T ? 'savedToPlans' : 'removedSaved'))
                }}
              >
                <Heart
                  key={String(saved)}
                  className={saved ? 'pop' : ''}
                  size={19}
                  fill={saved ? 'var(--ink)' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
        <div
          className="pad"
          style={{
            background: 'var(--white)',
            borderRadius: '28px 28px 0 0',
            marginTop: -28,
            position: 'relative',
            paddingTop: 24,
          }}
        >
          <h1 className="h1">{e.title}</h1>
          <div
            className="row"
            style={{
              marginTop: 10,
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <button
              className="row"
              style={{
                gap: 8,
                textAlign: 'start',
              }}
              onClick={() => {
                const T = profileLink(e.host.id)
                T && nav(T)
              }}
              aria-label={t('viewProfile', {
                name: e.host.name,
              })}
            >
              <Avatar name={e.host.name} img={e.host.avatar} size={30} />
              <span
                style={{
                  fontSize: 15,
                  color: 'var(--muted)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  textDecorationColor: 'var(--grey-2)',
                }}
              >
                {t('hostedByRole', {
                  name: e.host.name,
                  role: e.host.role,
                })}
              </span>
            </button>
          </div>
          <p
            className="body"
            style={{
              marginTop: 12,
            }}
          >
            {e.desc}
          </p>
          <div
            style={{
              marginTop: 18,
            }}
          >
            <WhenWhere
              date={e.date}
              time={e.time}
              place={e.place}
              area={e.area}
              onMap={() => nav(`/event/${e.id}/map`)}
            />
          </div>
          <button
            onClick={() => setWhoGoingOpen(true)}
            className="row"
            style={{
              marginTop: 14,
              width: '100%',
              justifyContent: 'space-between',
              background: 'var(--grey)',
              borderRadius: 16,
              padding: '10px 14px',
            }}
          >
            <AvatarStack
              ids={people.slice(0, 4).map((person) => person.avatar ?? person.id)}
              label={t('nGoing', {
                n: going,
              })}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {t('seeWhosGoing')}
              {' →'}
            </span>
          </button>
          <p
            className="small"
            style={{
              marginTop: 12,
            }}
          >
            {e.tags.map((tag) => `#${tag}`).join(' · ')}
          </p>
          <h2
            className="h2"
            style={{
              margin: '28px 0 14px',
            }}
          >
            {t('whatYoullDo')}
          </h2>
          <div
            className="stack"
            style={{
              gap: 14,
              position: 'relative',
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 25,
                top: 30,
                bottom: 30,
                borderLeft: '2px dotted #CFCDC7',
              }}
            />
            {e.steps.map((step) => (
              <div
                key={step.title}
                className="row"
                style={{
                  position: 'relative',
                }}
              >
                <Flower accent={step.accent} size={52}>
                  <Icon name={step.icon} size={20} />
                </Flower>
                <div
                  style={{
                    flex: 1,
                    background: `var(--${step.accent})`,
                    borderRadius: 18,
                    padding: '10px 14px',
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 16,
                    }}
                  >
                    {step.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--muted-2)',
                    }}
                  >
                    {step.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {e.transit && (
            <>
              <h2
                className="h2"
                style={{
                  margin: '28px 0 6px',
                }}
              >
                {t('gettingThere')}
              </h2>
              {e.transit.map((T) => (
                <div
                  key={T.stop}
                  className="row"
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--grey-2)',
                  }}
                >
                  <span
                    className="eyebrow"
                    style={{
                      width: 52,
                    }}
                  >
                    {T.mode === 'TRAM' ? t('tram') : t('bus')}
                  </span>
                  <div>
                    <div
                      className="row"
                      style={{
                        gap: 4,
                      }}
                    >
                      {T.lines.map((line) => (
                        <span
                          key={line}
                          style={{
                            minWidth: 26,
                            height: 26,
                            padding: '0 6px',
                            borderRadius: 7,
                            display: 'grid',
                            placeItems: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: 13,
                            background: T.mode === 'TRAM' ? '#4B4FC4' : 'var(--orange)',
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: 4,
                      }}
                    >
                      <strong>{T.stop}</strong>{' '}
                      <span className="tiny">
                        {'· '}
                        {t('walkM', {
                          m: T.walk.replace(' walk', ''),
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          <h2
            className="h2"
            style={{
              margin: '28px 0 6px',
            }}
          >
            {t('goodToKnow')}
          </h2>
          {e.good.map((T) => (
            <div
              key={T.title}
              className="row"
              style={{
                padding: '12px 0',
                borderBottom: '1px solid var(--grey-2)',
              }}
            >
              <span
                className="icon-btn"
                style={{
                  width: 40,
                  height: 40,
                }}
              >
                <Icon name={T.icon} size={18} />
              </span>
              <span>
                <strong
                  style={{
                    display: 'block',
                    fontSize: 16,
                  }}
                >
                  {T.title}
                </strong>
                <span className="small">{T.sub}</span>
              </span>
            </div>
          ))}
          <h2
            className="h2"
            id="comments"
            style={{
              margin: '30px 0 12px',
            }}
          >
            {t('comments')}{' '}
            <span
              style={{
                color: 'var(--muted)',
              }}
            >
              {totalComments}
            </span>
          </h2>
          <form
            className="row"
            onSubmit={(T) => {
              T.preventDefault()
              send()
            }}
          >
            {app.user.photo ? (
              <img
                src={app.user.photo}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar name={app.user.firstName || 'Me'} img="ruben" size={40} />
            )}
            <label
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'var(--grey)',
                borderRadius: 999,
                height: 44,
                padding: '0 6px 0 16px',
              }}
            >
              <span className="sr-only">{t('addComment')}</span>
              <input
                ref={commentInput}
                value={draft}
                onChange={(T) => setDraft(T.target.value)}
                placeholder={
                  replyTo
                    ? t('replyTo', {
                        name: replyTo.name,
                      })
                    : t('addComment')
                }
                style={{
                  flex: 1,
                  border: 0,
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 15,
                  minWidth: 0,
                }}
              />
              {draft.trim() && (
                <button
                  type="submit"
                  className="icon-btn dark"
                  style={{
                    width: 34,
                    height: 34,
                  }}
                  aria-label={t('post')}
                >
                  <Send size={15} className="flip-rtl" />
                </button>
              )}
            </label>
          </form>
          {replyTo && (
            <div
              className="row tiny"
              style={{
                marginTop: 8,
                marginInlineStart: 52,
                gap: 6,
              }}
            >
              {t('replyingTo')}{' '}
              <strong
                style={{
                  color: 'var(--ink)',
                }}
              >
                {replyTo.name}
              </strong>
              <button aria-label={t('cancelReply')} onClick={() => setReplyTo(null)}>
                <X size={14} />
              </button>
            </div>
          )}
          {translatableCount > 0 &&
            (mode === 'original' ? (
              <div className="row" style={{ marginTop: 14, gap: 12, background: 'var(--grey)', borderRadius: 16, padding: '12px 14px' }}>
                <Globe size={20} aria-hidden />
                <span style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{t('someInLang', { lang: foreignLangs })}</strong>
                  <span style={{ fontSize: 13 }}>{t('nOfTotalComments', { n: translatableCount, total: totalComments })}</span>
                </span>
                <button className="link" onClick={translate}>
                  {t('translateBtn')}
                </button>
              </div>
            ) : mode === 'translating' ? (
              <div className="row" role="status" style={{ marginTop: 14, gap: 12, background: 'var(--turq)', borderRadius: 16, padding: '12px 14px' }}>
                <Globe size={20} className="spin" aria-hidden />
                <span style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{t('translatingTo', { lang: myLangName })}</strong>
                  <span style={{ fontSize: 13 }}>{t('translatingMeta', { n: translatableCount, total: totalComments })}</span>
                </span>
              </div>
            ) : (
              <p role="status" className="small" style={{ marginTop: 14, fontSize: 14 }}>
                <Globe size={14} aria-hidden style={{ verticalAlign: -2 }} /> {t('translatedTo', { lang: myLangName })}
                {'  ·  '}
                <button className="link" style={{ fontSize: 14 }} onClick={() => setMode('original')}>
                  {t('showOriginal')}
                </button>
              </p>
            ))}
          {totalComments === 0 && (
            <p
              className="small"
              style={{
                marginTop: 16,
              }}
            >
              {t('noQuestions', {
                host: e.host.name,
              })}
            </p>
          )}
          {visibleComments.map((visibleComment) => renderComment(visibleComment))}
          {allComments.length > 2 && (
            <button
              className="tiny"
              style={{
                fontWeight: 600,
                marginTop: 18,
              }}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? t('showFewer')
                : t('viewMore', {
                    n: allComments.length - 2,
                  })}
            </button>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--white)',
          boxShadow: '0 -4px 16px rgba(0,0,0,.08)',
          padding: '12px 20px max(24px, env(safe-area-inset-bottom))',
          zIndex: 20,
        }}
      >
        {isMine ? (
          <div
            className="row"
            style={{
              background: 'var(--turq)',
              borderRadius: 999,
              padding: '8px 8px 8px 12px',
            }}
          >
            <BadgeCheck size={22} />
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
                {t('hostingThis')}
              </strong>
              <span
                style={{
                  fontSize: 13,
                }}
              >
                {t('signedUpOf', {
                  n: going,
                  cap: e.capacity,
                  org: app.user.org,
                })}
              </span>
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setSignupsOpen(true)}>
              <Users size={16} /> {t('signups')}
            </button>
          </div>
        ) : joined ? (
          <div
            className="row"
            style={{
              background: 'var(--ink)',
              color: 'var(--white)',
              borderRadius: 999,
              padding: '8px 8px 8px 10px',
            }}
          >
            <span
              className="icon-btn lime"
              style={{
                width: 40,
                height: 40,
                color: 'var(--ink)',
              }}
            >
              <Check size={20} />
            </span>
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
                {t('alreadyJoined')}
              </strong>
              <span
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                }}
              >
                {t('seeYou', {
                  when: e.date - 13 <= 6 ? dayLong(e.date) : full(e.date),
                  n: going,
                })}
              </span>
            </span>
            <button
              onClick={() => setConfirmCancel(true)}
              style={{
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'underline',
                padding: '0 10px',
              }}
            >
              {t('cancel')}
            </button>
          </div>
        ) : (
          <div
            className="row"
            style={{
              justifyContent: 'space-between',
            }}
          >
            <span>
              <strong
                style={{
                  fontSize: 20,
                  display: 'block',
                }}
              >
                {e.price === 'Free' ? t('free') : e.price}
              </strong>
              <span className="tiny">
                {t('goingLeft', {
                  going,
                  left: spotsLeft,
                })}
              </span>
            </span>
            <button
              className="btn btn-primary"
              style={{
                width: 200,
              }}
              onClick={() => {
                app.join(e.id)
                nav(`/event/${e.id}/joined`)
              }}
            >
              {t('imGoing')}
            </button>
          </div>
        )}
      </div>
      <Sheet
        open={signupsOpen}
        onClose={() => setSignupsOpen(false)}
        title={t('going', {
          n: going,
        })}
      >
        <p className="small">{t('onlyYouSee')}</p>
        <div
          className="stack"
          style={{
            marginTop: 14,
            gap: 4,
          }}
        >
          {[
            'Aya',
            'Joris',
            'Kemal',
            'Marta',
            'Rosa',
            'Sven',
            'Tariq',
            'Yara',
            'Lotte',
            'Sara',
            'Mo',
            'Lisa',
            'Diego',
            'Christian',
            'Anna',
            'Fatima',
            'Henk',
            'Iris',
            'Daan',
            'Noor',
          ]
            .slice(0, going)
            .map((T, J) => (
              <div
                key={T}
                className="row"
                style={{
                  padding: '8px 0',
                  borderBottom: '1px solid var(--grey-2)',
                }}
              >
                <Avatar name={T} size={34} />
                <span
                  style={{
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  {T}
                </span>
                <span className="tiny">
                  {J < 2
                    ? t('newLabel')
                    : t('timesBefore', {
                        n: (J % 4) + 1,
                      })}
                </span>
              </div>
            ))}
        </div>
        <button
          className="btn btn-primary"
          style={{
            marginTop: 18,
          }}
          onClick={() => {
            setSignupsOpen(false)
            app.showToast(
              t('reminderSent', {
                n: going,
              }),
            )
          }}
        >
          {t('sendReminder')}
        </button>
      </Sheet>
      <ShareSheet open={sharing} onClose={() => setSharing(false)} e={e} />
      <Sheet open={whoGoingOpen} onClose={() => setWhoGoingOpen(false)}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 className="h2">{t('whosGoing')}</h2>
          <span className="eyebrow">{t('nGoing', { n: going })}</span>
        </div>
        <div className="stack" style={{ gap: 0 }}>
          {[
            { ...e.host, badge: 'host' },
            ...people.filter((person) => person.id !== e.host.id),
            ...(app.joined.includes(e.id) ? [{ id: 'me', name: app.user.firstName || t('friend'), avatar: 'ruben', badge: 'you' }] : []),
          ].map((person) => {
            const link = person.id !== 'me' && profileLink(person.id)
            return (
              <button
                key={person.id}
                className="row"
                style={{ padding: '10px 0', gap: 12, textAlign: 'start', borderBottom: '1px solid var(--grey-2)', width: '100%' }}
                disabled={!link}
                onClick={() => link && nav(link)}
                aria-label={t('viewProfile', { name: person.name })}
              >
                <Avatar name={person.name} img={person.avatar} size={44} />
                <strong style={{ fontSize: 16, fontWeight: 600 }}>{person.name}</strong>
                {person.badge === 'host' && (
                  <span className="tag" style={{ background: 'var(--green)', color: 'var(--white)', fontSize: 12, padding: '3px 8px' }}>
                    {t('host')}
                  </span>
                )}
                {person.badge === 'you' && (
                  <span className="tag" style={{ fontSize: 12, padding: '3px 8px' }}>
                    {t('you')}
                  </span>
                )}
                <span style={{ flex: 1 }} />
                {link && <ChevronRight size={18} className="flip-rtl" aria-hidden />}
              </button>
            )
          })}
        </div>
      </Sheet>
      <Sheet open={confirmCancel} onClose={() => setConfirmCancel(false)} title={t('cancelTitle')}>
        <p className="body">
          {t('cancelText', {
            host: e.host.name,
          })}
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
              app.leave(e.id)
              setConfirmCancel(false)
              app.showToast(t('noLongerGoing'), {
                label: t('undo'),
                run: () => app.join(e.id),
              })
            }}
          >
            {t('yesCancel')}
          </button>
          <button className="btn btn-soft" onClick={() => setConfirmCancel(false)}>
            {t('keepSpot')}
          </button>
        </div>
      </Sheet>
    </Screen>
  )
}
