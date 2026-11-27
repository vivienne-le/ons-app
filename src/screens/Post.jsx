import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, Check, CircleHelp, Clock, Heart, ListChecks, Lock, MapPin as PinIcon, Minus, Plus, Search as SearchIcon, Trash2, X } from 'lucide-react'
import { Flower } from '../components/Flower'
import { Icon } from '../components/Icon'
import { Avatar } from '../components/Img'
import { BackButton, Progress, Screen, WhenWhere } from '../components/UI'
import { useI18n } from '../i18n/index'
import { TODAY } from './Home'
import { catKey } from './Search'
import { useApp } from '../state/AppState'
export function StepLayout({ step: a, title, sub, children, canNext, next }) {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <Screen>
      <form
        id="post-form"
        className="scroll pad safe-top"
        style={{
          paddingBottom: 24,
        }}
        onSubmit={(b) => {
          b.preventDefault()
          canNext && nav(next)
        }}
      >
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
          }}
        >
          <BackButton to={a === 1 ? '/home' : undefined} />
          <Progress step={a} total={4} />
        </div>
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
          }}
        >
          {t('stepOf', {
            n: a,
            total: 4,
          })}
        </div>
        <h1
          className="h1"
          style={{
            marginTop: 8,
          }}
        >
          {title}
        </h1>
        <p
          className="small"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          {sub}
        </p>
        <div
          style={{
            marginTop: 24,
          }}
          className="stack"
        >
          {children}
        </div>
      </form>
      <div className="bottom-cta">
        <button className="btn btn-primary" type="submit" form="post-form" disabled={!canNext}>
          {t('next')}
        </button>
      </div>
    </Screen>
  )
}
export function FieldLabel({ htmlFor: a, children, aside }) {
  return (
    <div
      className="row"
      style={{
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <label className="eyebrow" htmlFor={a}>
        {children}
      </label>
      {aside && <span className="tiny">{aside}</span>}
    </div>
  )
}
export const postCategories = ['Sport', 'Food', 'Social', 'Creative', 'Outdoors']
export function PostWhat() {
  const { draft, setDraft } = useApp()
  const { t } = useI18n()
  const fileInput = useRef(null)
  const pickPhoto = (c) => {
    if (!c) return
    const d = new FileReader()
    d.onload = () =>
      setDraft({
        photo: String(d.result),
      })
    d.readAsDataURL(c)
  }
  return (
    <StepLayout
      step={1}
      title={t('postWhatTitle')}
      sub={t('postWhatSub')}
      canNext={!!draft.title.trim()}
      next="/post/when"
    >
      <div>
        <FieldLabel htmlFor="p-title">{t('activityName')}</FieldLabel>
        <input
          id="p-title"
          className="field"
          maxLength={40}
          placeholder={t('activityNamePh')}
          value={draft.title}
          onChange={(c) =>
            setDraft({
              title: c.target.value,
            })
          }
        />
      </div>
      <div>
        <FieldLabel>{t('type')}</FieldLabel>
        <div
          className="row"
          style={{
            flexWrap: 'wrap',
            gap: 8,
          }}
          role="radiogroup"
          aria-label={t('type')}
        >
          {postCategories.map((postCategory) => (
            <button
              key={postCategory}
              type="button"
              role="radio"
              aria-checked={draft.category === postCategory}
              className={`chip ${draft.category === postCategory ? 'on' : ''}`}
              onClick={() =>
                setDraft({
                  category: postCategory,
                })
              }
            >
              {t(catKey[postCategory])}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="p-desc" aside={`${draft.desc.length}/120`}>
          {t('shortDesc')}
        </FieldLabel>
        <textarea
          id="p-desc"
          className="field"
          rows={3}
          maxLength={120}
          placeholder={t('shortDescPh')}
          value={draft.desc}
          onChange={(c) =>
            setDraft({
              desc: c.target.value,
            })
          }
          style={{
            height: 'auto',
            padding: '14px 16px',
            fontSize: 16,
            lineHeight: 1.4,
            resize: 'none',
          }}
        />
      </div>
      <div>
        <FieldLabel>{t('photoLabel')}</FieldLabel>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(c) => {
            return pickPhoto(c.target.files?.[0])
          }}
        />
        {draft.photo ? (
          <div
            style={{
              position: 'relative',
            }}
          >
            <img
              src={draft.photo}
              alt=""
              style={{
                width: '100%',
                height: 170,
                objectFit: 'cover',
                borderRadius: 20,
              }}
            />
            <div
              className="row"
              style={{
                position: 'absolute',
                bottom: 10,
                insetInlineEnd: 10,
                gap: 8,
              }}
            >
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: 'var(--white)',
                }}
                onClick={() => {
                  return fileInput.current?.click()
                }}
              >
                <Camera size={16} /> {t('changePhoto')}
              </button>
              <button
                type="button"
                className="icon-btn white"
                aria-label={t('removePhoto')}
                onClick={() =>
                  setDraft({
                    photo: '',
                  })
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              return fileInput.current?.click()
            }}
            style={{
              width: '100%',
              height: 130,
              borderRadius: 20,
              border: '2px dashed var(--grey-2)',
              display: 'grid',
              placeItems: 'center',
              alignContent: 'center',
              gap: 6,
              color: 'var(--muted)',
            }}
          >
            <Camera size={24} aria-hidden />{' '}
            <span
              style={{
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              {t('addPhoto')}
            </span>
          </button>
        )}
        <p
          className="tiny"
          style={{
            marginTop: 8,
          }}
        >
          {t('photoHint')}
        </p>
      </div>
    </StepLayout>
  )
}
export const times = Array.from(
  {
    length: 30,
  },
  (a, b) => `${String(7 + Math.floor(b / 2)).padStart(2, '0')}:${b % 2 ? '30' : '00'}`,
)
export const repeats = [
  {
    id: 'once',
    k: 'repOnce',
  },
  {
    id: 'weekly',
    k: 'repWeekly',
  },
  {
    id: 'biweekly',
    k: 'repBiweekly',
  },
  {
    id: 'monthly',
    k: 'repMonthly',
  },
]
export function PostWhen() {
  const { draft, setDraft } = useApp()
  const { t, dayLong, dateShort, wd } = useI18n()
  const leadingBlanks = (new Date(2026, 11, 1).getDay() + 6) % 7
  const monthTitle = new Intl.DateTimeFormat(document.documentElement.lang || 'en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(2026, 11, 1))
  const repeatHint =
    draft.repeat === 'weekly'
      ? 'repHintWeekly'
      : draft.repeat === 'biweekly'
        ? 'repHintBiweekly'
        : draft.repeat === 'monthly'
          ? 'repHintMonthly'
          : null
  const endOk = draft.noEnd || draft.end > draft.start
  return (
    <StepLayout step={2} title={t('postWhenTitle')} sub={t('postWhenSub')} canNext={endOk} next="/post/where">
      <div>
        <FieldLabel aside={dateShort(draft.date)}>{t('dateLabel')}</FieldLabel>
        <div
          className="card"
          style={{
            padding: 14,
          }}
        >
          <strong
            style={{
              display: 'block',
              marginBottom: 10,
              textTransform: 'capitalize',
            }}
          >
            {monthTitle}
          </strong>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              textAlign: 'center',
            }}
          >
            {Array.from(
              {
                length: 7,
              },
              (e, f) => (
                <span
                  key={f}
                  className="tiny"
                  aria-hidden
                  style={{
                    fontSize: 11,
                  }}
                >
                  {wd(7 + f)}
                </span>
              ),
            )}
            {Array.from(
              {
                length: leadingBlanks,
              },
              (e, f) => (
                <span key={`e${f}`} />
              ),
            )}
            {Array.from(
              {
                length: 31,
              },
              (e, f) => {
                const g = f + 1
                const h = g < TODAY
                const i = draft.date === g
                return (
                  <button
                    key={g}
                    type="button"
                    disabled={h}
                    aria-pressed={i}
                    aria-label={`${dayLong(g)} ${dateShort(g)}`}
                    onClick={() =>
                      setDraft({
                        date: g,
                      })
                    }
                    style={{
                      height: 38,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: i ? 600 : 400,
                      background: i ? 'var(--ink)' : g === TODAY ? 'var(--white)' : 'transparent',
                      color: i ? 'var(--white)' : h ? '#BDBBB6' : 'var(--ink)',
                    }}
                  >
                    {g}
                  </button>
                )
              },
            )}
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>{t('timeLabel')}</FieldLabel>
        <div
          className="row"
          style={{
            gap: 10,
          }}
        >
          <select
            className="field"
            aria-label={t('startTime')}
            value={draft.start}
            onChange={(e) => {
              const f = e.target.value
              setDraft({
                start: f,
                end: draft.end > f ? draft.end : times[Math.min(times.indexOf(f) + 2, times.length - 1)],
              })
            }}
          >
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
          {!draft.noEnd && (
            <>
              <span className="small">{t('toLabel')}</span>
              <select
                className="field"
                aria-label={t('endTime')}
                value={draft.end}
                onChange={(e) =>
                  setDraft({
                    end: e.target.value,
                  })
                }
                aria-invalid={!endOk}
              >
                {times
                  .filter((time) => time > draft.start)
                  .map((time) => (
                    <option key={time}>{time}</option>
                  ))}
              </select>
            </>
          )}
        </div>
        <label
          className="row"
          style={{
            marginTop: 10,
            gap: 10,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={draft.noEnd}
            onChange={(e) =>
              setDraft({
                noEnd: e.target.checked,
              })
            }
            style={{
              width: 20,
              height: 20,
              accentColor: 'var(--ink)',
            }}
          />
          {t('noEndTime')}
        </label>
      </div>
      <div>
        <FieldLabel>{t('repeat')}</FieldLabel>
        <div
          className="row"
          style={{
            flexWrap: 'wrap',
            gap: 8,
          }}
          role="radiogroup"
          aria-label={t('repeat')}
        >
          {repeats.map((repeat) => (
            <button
              key={repeat.id}
              type="button"
              role="radio"
              aria-checked={draft.repeat === repeat.id}
              className={`chip ${draft.repeat === repeat.id ? 'on' : ''}`}
              onClick={() =>
                setDraft({
                  repeat: repeat.id,
                })
              }
            >
              {t(repeat.k)}
            </button>
          ))}
        </div>
        {repeatHint && (
          <p
            className="tiny"
            style={{
              marginTop: 8,
            }}
          >
            {t(repeatHint, {
              day: dayLong(draft.date),
              date: dateShort(draft.date),
            })}
          </p>
        )}
      </div>
      <div
        className="card row"
        style={{
          padding: '12px 14px',
          justifyContent: 'space-between',
        }}
      >
        <span>
          <strong
            style={{
              display: 'block',
            }}
          >
            {t('maxPeople')}
          </strong>
          <span className="tiny">{t('inclYou')}</span>
        </span>
        <span
          className="row"
          style={{
            gap: 14,
          }}
        >
          <button
            type="button"
            className="icon-btn white"
            aria-label={t('fewer')}
            disabled={draft.capacity <= 2}
            onClick={() =>
              setDraft({
                capacity: draft.capacity - 1,
              })
            }
          >
            <Minus size={18} />
          </button>
          <strong
            style={{
              fontSize: 22,
              minWidth: 28,
              textAlign: 'center',
            }}
            aria-live="polite"
          >
            {draft.capacity}
          </strong>
          <button
            type="button"
            className="icon-btn white"
            aria-label={t('more')}
            disabled={draft.capacity >= 50}
            onClick={() =>
              setDraft({
                capacity: draft.capacity + 1,
              })
            }
          >
            <Plus size={18} />
          </button>
        </span>
      </div>
    </StepLayout>
  )
}
export const places = [
  {
    name: 'CVD Middelland',
    kind: 'kindCommunity',
    m: 350,
    icon: 'home',
  },
  {
    name: 'Huize Middelland',
    kind: 'kindCommunity',
    m: 400,
    icon: 'home',
  },
  {
    name: 'Café De Ster',
    kind: 'kindCafe',
    m: 250,
    icon: 'cup',
  },
  {
    name: 'Heemraadsplein',
    kind: 'kindSquare',
    m: 300,
    icon: 'pin',
  },
  {
    name: 'Buurthuis Middelland',
    kind: 'kindCommunity',
    m: 500,
    icon: 'home',
  },
  {
    name: 'Het Park',
    kind: 'kindPark',
    m: 600,
    icon: 'walk',
  },
]
export function PostWhere() {
  const { draft, setDraft } = useApp()
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const results = places.filter(
    (place) =>
      place.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      t(place.kind).toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <StepLayout
      step={3}
      title={t('postWhereTitle')}
      sub={t('postWhereSub')}
      canNext={!!draft.place}
      next="/post/details"
    >
      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--grey)',
            borderRadius: 20,
            height: 56,
            padding: '0 16px',
          }}
        >
          <SearchIcon size={20} aria-hidden />
          <input
            type="search"
            aria-label={t('placeSearchPh')}
            placeholder={t('placeSearchPh')}
            value={query}
            onChange={(d) => setQuery(d.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 0,
              outline: 'none',
              fontSize: 16,
              minWidth: 0,
            }}
          />
        </label>
        <p
          className="tiny"
          style={{
            marginTop: 8,
          }}
        >
          {t('publicOnly')}
        </p>
      </div>
      <div>
        <div
          className="eyebrow"
          style={{
            marginBottom: 6,
          }}
        >
          {t('suggestedNear')}
        </div>
        {results.length === 0 && (
          <p
            className="small"
            style={{
              padding: '12px 0',
            }}
          >
            {t('noPlaces')}
          </p>
        )}
        <div role="radiogroup" aria-label={t('suggestedNear')}>
          {results.map((result) => {
            const e = draft.place === result.name
            return (
              <button
                key={result.name}
                type="button"
                role="radio"
                aria-checked={e}
                onClick={() =>
                  setDraft({
                    place: result.name,
                  })
                }
                className="row"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginTop: 6,
                  borderRadius: 18,
                  textAlign: 'start',
                  background: e ? 'var(--lime)' : 'transparent',
                  boxShadow: e ? 'inset 0 0 0 2px var(--ink)' : 'inset 0 0 0 1px var(--grey-2)',
                }}
              >
                <span
                  className="icon-btn"
                  style={{
                    width: 40,
                    height: 40,
                    background: e ? 'var(--white)' : undefined,
                  }}
                >
                  <Icon name={result.icon} size={18} />
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
                    {result.name}
                  </strong>
                  <span
                    className="tiny"
                    style={{
                      color: 'var(--muted-2)',
                    }}
                  >
                    {t(result.kind)}
                    {' · '}
                    {result.m}
                    {' m'}
                  </span>
                </span>
                {e && <Check size={20} aria-hidden />}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="p-meet" aside={t('optionalTag')}>
          {t('meetingPoint')}
        </FieldLabel>
        <input
          id="p-meet"
          className="field"
          style={{
            fontSize: 16,
          }}
          placeholder={t('meetingPh')}
          value={draft.meet}
          onChange={(d) =>
            setDraft({
              meet: d.target.value,
            })
          }
        />
      </div>
    </StepLayout>
  )
}
export const goodOpts = ['gNoExp', 'gSlow', 'gChanging', 'gTravel', 'gStepFree']
export const stepAccents = ['lime', 'pink', 'turq', 'lav']
export function PostDetails() {
  const { draft, setDraft } = useApp()
  const { t } = useI18n()
  const [ownText, setOwnText] = useState('')
  const [writingOwn, setWritingOwn] = useState(false)
  const steps = draft.steps
  const updateStep = (k, l) =>
    setDraft({
      steps: steps.map((step, n) =>
        n === k
          ? {
              ...step,
              ...l,
            }
          : step,
      ),
    })
  const toggleGood = (k) =>
    setDraft({
      good: draft.good.includes(k)
        ? draft.good.filter((l) => l !== k)
        : draft.good.length < 4
          ? [...draft.good, k]
          : draft.good,
    })
  const addOwn = () => {
    const k = ownText.trim()
    k &&
      !draft.good.includes(k) &&
      draft.good.length < 4 &&
      setDraft({
        good: [...draft.good, k],
      })
    setOwnText('')
    setWritingOwn(false)
  }
  const customGood = draft.good.filter((k) => !goodOpts.includes(k))
  const canContinue = steps.some((step) => step.text.trim()) && (draft.cost === 'free' || !!draft.amount.trim())
  return (
    <StepLayout
      step={4}
      title={t('postDetailsTitle')}
      sub={t('postDetailsSub')}
      canNext={canContinue}
      next="/post/preview"
    >
      <div>
        <FieldLabel aside={t('atLeastOne')}>{t('whatYoullDo')}</FieldLabel>
        <div
          className="stack"
          style={{
            gap: 8,
          }}
        >
          {steps.map((step, l) => (
            <div
              key={l}
              style={{
                background: `var(--${stepAccents[l % 4]})`,
                borderRadius: 18,
                padding: '8px 8px 8px 12px',
              }}
            >
              <div
                className="row"
                style={{
                  gap: 8,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    color: 'var(--white)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    flex: 'none',
                  }}
                >
                  {l + 1}
                </span>
                <input
                  aria-label={`${t('stepPh')} ${l + 1}`}
                  placeholder={t('stepPh')}
                  value={step.text}
                  onChange={(m) =>
                    updateStep(l, {
                      text: m.target.value,
                    })
                  }
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'none',
                    border: 0,
                    outline: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    height: 36,
                  }}
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn white"
                    style={{
                      width: 34,
                      height: 34,
                    }}
                    aria-label={t('removeStep', {
                      n: l + 1,
                    })}
                    onClick={() =>
                      setDraft({
                        steps: steps.filter((m, n) => n !== l),
                      })
                    }
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {l > 0 && (
                <label
                  className="row tiny"
                  style={{
                    gap: 6,
                    marginTop: 4,
                    marginInlineStart: 34,
                    color: 'var(--ink)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={step.optional}
                    onChange={(m) =>
                      updateStep(l, {
                        optional: m.target.checked,
                      })
                    }
                  />{' '}
                  {t('optionalTag')}
                  {' · '}
                  {t('joinIfYouLike')}
                </label>
              )}
            </div>
          ))}
          {steps.length < 6 && (
            <button
              type="button"
              className="btn btn-sm btn-soft"
              style={{
                width: '100%',
              }}
              onClick={() =>
                setDraft({
                  steps: [
                    ...steps,
                    {
                      text: '',
                      optional: false,
                    },
                  ],
                })
              }
            >
              <Plus size={16} /> {t('addStep')}
            </button>
          )}
        </div>
      </div>
      <div>
        <FieldLabel
          aside={t('chosenOf', {
            n: draft.good.length,
          })}
        >
          {t('goodToKnow')}
        </FieldLabel>
        <p
          className="tiny"
          style={{
            marginBottom: 8,
            marginTop: -4,
          }}
        >
          {t('tapToAdd')}
        </p>
        <div
          className="row"
          style={{
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {[...goodOpts, ...customGood].map((k) => {
            const l = draft.good.includes(k)
            const m = !l && draft.good.length >= 4
            return (
              <button
                key={k}
                type="button"
                aria-pressed={l}
                disabled={m}
                className={`chip ${l ? 'on' : ''}`}
                style={{
                  opacity: m ? 0.4 : 1,
                }}
                onClick={() => toggleGood(k)}
              >
                {l ? <Check size={15} aria-hidden /> : <Plus size={15} aria-hidden />}
                {goodOpts.includes(k) ? t(k) : k}
              </button>
            )
          })}
        </div>
        {writingOwn ? (
          <div
            className="row"
            style={{
              marginTop: 8,
              gap: 8,
            }}
          >
            <input
              className="field"
              style={{
                fontSize: 16,
                height: 48,
              }}
              autoFocus
              aria-label={t('writeOwn')}
              placeholder={t('ownPh')}
              value={ownText}
              maxLength={40}
              onChange={(k) => setOwnText(k.target.value)}
              onKeyDown={(k) => {
                k.key === 'Enter' && (k.preventDefault(), addOwn())
              }}
            />
            <button type="button" className="btn btn-sm btn-primary" onClick={addOwn} disabled={!ownText.trim()}>
              {t('add')}
            </button>
          </div>
        ) : (
          draft.good.length < 4 && (
            <button
              type="button"
              className="link"
              style={{
                marginTop: 10,
              }}
              onClick={() => setWritingOwn(true)}
            >
              {'+ '}
              {t('writeOwn')}
            </button>
          )
        )}
      </div>
      <div>
        <FieldLabel>{t('costLabel')}</FieldLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
          role="radiogroup"
          aria-label={t('costLabel')}
        >
          {['free', 'small'].map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={draft.cost === k}
              className={`chip ${draft.cost === k ? 'on' : ''}`}
              style={{
                justifyContent: 'center',
                height: 48,
              }}
              onClick={() =>
                setDraft({
                  cost: k,
                })
              }
            >
              {t(k === 'free' ? 'free' : 'smallCost')}
            </button>
          ))}
        </div>
        {draft.cost === 'small' && (
          <label
            className="row"
            style={{
              marginTop: 8,
              background: 'var(--grey)',
              borderRadius: 20,
              height: 56,
              padding: '0 16px',
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 18,
              }}
            >
              €
            </span>
            <input
              inputMode="decimal"
              aria-label={t('amountLabel')}
              placeholder="2,50"
              value={draft.amount}
              onChange={(k) =>
                setDraft({
                  amount: k.target.value.replace(/[^\d.,]/g, '').slice(0, 6),
                })
              }
              style={{
                flex: 1,
                background: 'none',
                border: 0,
                outline: 'none',
                fontSize: 18,
              }}
            />
          </label>
        )}
      </div>
    </StepLayout>
  )
}
export function PostCard({ d: draft }) {
  const { user } = useApp()
  const { t } = useI18n()
  const accent = {
    Sport: 'lime',
    Food: 'pink',
    Social: 'turq',
    Creative: 'lav',
    Outdoors: 'lime',
  }[draft.category]
  const goodLabel = (c) => (goodOpts.includes(c) ? t(c) : c)
  return (
    <div>
      {draft.photo ? (
        <img
          src={draft.photo}
          alt=""
          style={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            height: 180,
            background: `var(--${accent})`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Flower color="rgba(255,255,255,.5)" size={120}>
            <Icon name="star" size={44} />
          </Flower>
        </div>
      )}
      <div
        className="pad"
        style={{
          background: 'var(--white)',
          borderRadius: '28px 28px 0 0',
          marginTop: -24,
          position: 'relative',
          paddingTop: 22,
        }}
      >
        <span
          className="chip"
          style={{
            height: 28,
            fontSize: 13,
            padding: '0 12px',
          }}
        >
          {t(catKey[draft.category])}
        </span>
        <h2
          className="h1"
          style={{
            marginTop: 10,
          }}
        >
          {draft.title}
        </h2>
        <div
          className="row"
          style={{
            marginTop: 10,
            gap: 8,
          }}
        >
          {user.photo ? (
            <img
              src={user.photo}
              alt=""
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Avatar name={user.firstName || '?'} size={30} />
          )}
          <span
            style={{
              fontSize: 15,
              color: 'var(--muted)',
            }}
          >
            {t('hostedByYou')}
            {user.org ? ` · ${user.org}` : ''}
          </span>
        </div>
        {draft.desc && (
          <p
            className="body"
            style={{
              marginTop: 12,
            }}
          >
            {draft.desc}
          </p>
        )}
        <div
          style={{
            marginTop: 16,
          }}
        >
          <WhenWhere
            date={draft.date}
            time={
              draft.noEnd
                ? t('fromTime', {
                    time: draft.start,
                  })
                : `${draft.start}–${draft.end}`
            }
            place={draft.place}
            area={draft.meet || 'Middelland'}
          />
        </div>
        <p
          className="small"
          style={{
            marginTop: 10,
          }}
        >
          {draft.repeat !== 'once' && (
            <>
              {t(repeats.find((repeat) => repeat.id === draft.repeat).k)}
              {' · '}
            </>
          )}
          {t('maxPeople')}
          {': '}
          {draft.capacity}
          {' · '}
          {draft.cost === 'free' ? t('free') : `€ ${draft.amount}`}
        </p>
        <h3
          className="h2"
          style={{
            margin: '24px 0 12px',
          }}
        >
          {t('whatYoullDo')}
        </h3>
        <div
          className="stack"
          style={{
            gap: 10,
          }}
        >
          {draft.steps
            .filter((step) => step.text.trim())
            .map((step, e) => (
              <div
                key={e}
                className="row"
                style={{
                  background: `var(--${stepAccents[e % 4]})`,
                  borderRadius: 18,
                  padding: '10px 14px',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    color: 'var(--white)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    flex: 'none',
                  }}
                >
                  {e + 1}
                </span>
                <strong
                  style={{
                    flex: 1,
                    fontSize: 16,
                  }}
                >
                  {step.text}
                </strong>
                {step.optional && (
                  <span
                    className="tiny"
                    style={{
                      background: 'var(--white)',
                      borderRadius: 999,
                      padding: '2px 8px',
                      color: 'var(--ink)',
                    }}
                  >
                    {t('optionalTag')}
                  </span>
                )}
              </div>
            ))}
        </div>
        {draft.good.length > 0 && (
          <>
            <h3
              className="h2"
              style={{
                margin: '24px 0 6px',
              }}
            >
              {t('goodToKnow')}
            </h3>
            {draft.good.map((c) => (
              <div
                key={c}
                className="row"
                style={{
                  padding: '10px 0',
                  borderBottom: '1px solid var(--grey-2)',
                }}
              >
                <span
                  className="icon-btn"
                  style={{
                    width: 36,
                    height: 36,
                  }}
                >
                  <Check size={16} />
                </span>
                <strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  {goodLabel(c)}
                </strong>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
export function PostPreview() {
  const nav = useNavigate()
  const { draft, submitDraft } = useApp()
  const { t } = useI18n()
  return (
    <Screen>
      <div
        className="pad safe-top row"
        style={{
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <BackButton />
        <div>
          <h1 className="h2">{t('previewTitle')}</h1>
          <p className="tiny">{t('previewSub')}</p>
        </div>
      </div>
      <div
        className="scroll"
        style={{
          padding: '4px 16px 20px',
        }}
      >
        <div
          style={{
            borderRadius: 28,
            overflow: 'hidden',
            border: '1.5px solid var(--grey-2)',
            isolation: 'isolate',
          }}
        >
          <PostCard d={draft} />
          <div
            style={{
              height: 20,
            }}
          />
        </div>
      </div>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          onClick={() => {
            submitDraft()
            nav('/post/sent', {
              replace: true,
            })
          }}
        >
          {t('sendToCvd')}
        </button>
        <button className="btn btn-secondary" onClick={() => nav('/post')}>
          {t('editLabel')}
        </button>
      </div>
    </Screen>
  )
}
export function PostSent() {
  const nav = useNavigate()
  const { posts } = useApp()
  const { t } = useI18n()
  const post = posts[0]
  const nextSteps = ['sent1', 'sent2', 'sent3']
  return (
    <Screen lime>
      <div
        className="scroll pad safe-top"
        style={{
          display: 'grid',
          alignContent: 'start',
        }}
      >
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            marginTop: 30,
          }}
          className="pop"
        >
          <Flower color="var(--white)" size={150}>
            <Check size={56} />
          </Flower>
        </div>
        <h1
          className="h1"
          style={{
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          {t('sentTitle')}
        </h1>
        <p
          className="body"
          style={{
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {t('sentSub')}
        </p>
        {post && (
          <div
            className="card"
            style={{
              background: 'var(--white)',
              padding: 14,
              marginTop: 22,
            }}
          >
            <span className="eyebrow">{t('inReview')}</span>
            <strong
              style={{
                display: 'block',
                fontSize: 18,
                marginTop: 4,
              }}
            >
              {post.title}
            </strong>
          </div>
        )}
        <div
          className="eyebrow"
          style={{
            marginTop: 24,
            color: 'var(--ink)',
          }}
        >
          {t('sentNext')}
        </div>
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '10px 0 0',
            display: 'grid',
            gap: 10,
          }}
        >
          {nextSteps.map((nextStep, d) => (
            <li
              key={nextStep}
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
                  background: d === 0 ? 'var(--ink)' : 'var(--white)',
                  color: d === 0 ? 'var(--white)' : 'var(--ink)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {d + 1}
              </span>
              <span
                style={{
                  fontSize: 16,
                }}
              >
                {t(nextStep)}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="bottom-cta">
        <button
          className="btn btn-primary"
          onClick={() =>
            nav('/home', {
              replace: true,
            })
          }
        >
          {t('backHome')}
        </button>
      </div>
    </Screen>
  )
}
export function MyPost() {
  const { id } = useParams()
  const { posts } = useApp()
  const { t } = useI18n()
  const post = useMemo(() => posts.find((b) => b.id === id), [posts, id])
  return post ? (
    <Screen>
      <div
        className="scroll"
        style={{
          paddingBottom: 40,
        }}
      >
        <div
          className="pad safe-top row"
          style={{
            justifyContent: 'space-between',
            paddingBottom: 12,
          }}
        >
          <BackButton to="/home" />
          <span
            className="chip"
            style={{
              background: 'var(--orange)',
              color: 'var(--white)',
              height: 32,
              fontWeight: 600,
            }}
          >
            {t('inReview')}
          </span>
        </div>
        <PostCard d={post} />
      </div>
    </Screen>
  ) : (
    <Screen>
      <div className="pad safe-top">
        <BackButton to="/home" />
      </div>
    </Screen>
  )
}
// "Before you host": the house rules, shown before the host flow starts
const hostRules = [
  { key: 'rulePublic', Icon: PinIcon, accent: 'lime' },
  { key: 'rulePlan', Icon: ListChecks, accent: 'turq' },
  { key: 'ruleWelcome', Icon: Heart, accent: 'pink' },
  { key: 'ruleOnTime', Icon: Clock, accent: 'orange' },
  { key: 'rulePrivacy', Icon: Lock, accent: 'lav' },
  { key: 'ruleHelp', Icon: CircleHelp, color: 'var(--grey)' },
]
export function PostStart() {
  const nav = useNavigate()
  const { t } = useI18n()
  return (
    <Screen>
      <div className="scroll" style={{ paddingBottom: 24 }}>
        <div
          style={{
            background: 'var(--ink)',
            color: 'var(--white)',
            borderRadius: '0 0 36px 36px',
            padding: 'max(48px, env(safe-area-inset-top)) var(--pad) 26px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Flower accent="pink" size={150} style={{ position: 'absolute', right: -30, top: -30 }} />
          <Flower accent="lime" size={70} style={{ position: 'absolute', right: 60, top: 100 }} />
          <BackButton variant="white" />
          <div className="eyebrow" style={{ color: 'var(--lime)', marginTop: 18, position: 'relative' }}>
            {t('becomeHostEyebrow')}
          </div>
          <h1 className="h-display" style={{ fontSize: 40, color: 'var(--white)', marginTop: 6, position: 'relative', maxWidth: 220 }}>
            {t('beforeYouHost')}
          </h1>
          <p style={{ fontSize: 15, marginTop: 8, opacity: 0.85, maxWidth: 260, position: 'relative' }}>{t('beforeYouHostSub')}</p>
        </div>
        <div className="pad" style={{ marginTop: 10 }}>
          {hostRules.map(({ key, Icon: RIcon, accent, color }, i) => (
            <div
              key={key}
              className="row"
              style={{ gap: 14, padding: '14px 0', alignItems: 'flex-start', borderBottom: i < hostRules.length - 1 ? '1px solid var(--grey-2)' : 0 }}
            >
              <Flower accent={accent} color={color} size={40}>
                <RIcon size={17} />
              </Flower>
              <span>
                <strong style={{ display: 'block', fontSize: 16, fontWeight: 600 }}>{t(key)}</strong>
                <span className="small" style={{ fontSize: 14 }}>
                  {t(`${key}Sub`)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-cta">
        <button className="btn btn-primary" onClick={() => nav('/post')}>
          {t('gotItStart')}
        </button>
      </div>
    </Screen>
  )
}
