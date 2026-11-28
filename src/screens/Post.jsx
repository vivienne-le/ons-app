import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Camera, Check, ChevronRight, CircleHelp, Clock, Heart, Info, Mail, ListChecks, Lock, MapPin as PinIcon, Minus, Pencil, Plus, Search as SearchIcon, Trash2, X } from 'lucide-react'
import { Flower } from '../components/Flower'
import { MonthCalendar, dayKey } from '../components/MonthCalendar'
import { CvdBadge, OrgLogo } from '../components/OrgLogo'
import { organisations } from '../data/events'
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
      <label htmlFor={a} style={{ fontSize: 15, fontWeight: 600 }}>
        {children}
      </label>
      {aside && <span className="tiny">{aside}</span>}
    </div>
  )
}
export const postCategories = ['Sport', 'Food', 'Games', 'Crafts', 'Music', 'Walks', 'Language café', 'Other']
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
              {postCategory === 'Other' ? `+ ${t(catKey[postCategory])}` : t(catKey[postCategory])}
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
  const endOk = draft.end > draft.start
  return (
    <StepLayout step={2} title={t('postWhenTitle')} sub={t('postWhenSub')} canNext={endOk} next="/post/where">
      <div>
        <FieldLabel aside={dateShort(draft.date)}>{t('dateLabel')}</FieldLabel>
        <MonthCalendar
          selected={dayKey(2026, 11, draft.date)}
          onSelect={(k) => {
            const [y, m, d] = k.split('-').map(Number)
            y === 2026 && m === 11 && setDraft({ date: d })
          }}
          isDisabled={(y, m, d) => y < 2026 || (y === 2026 && (m < 11 || (m === 11 && d < TODAY)))}
        />
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
          {(
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
            className="icon-btn dark"
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
              className="btn btn-sm"
              style={{
                width: '100%',
                height: 48,
                background: 'transparent',
                border: '1.5px dashed #BDBBB6',
                fontWeight: 400,
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
                  height: 36,
                  fontSize: 14,
                  background: l ? undefined : 'var(--white)',
                  boxShadow: l ? undefined : 'inset 0 0 0 1.5px var(--ink)',
                }}
                onClick={() => toggleGood(k)}
              >
                {l ? (
                  <Flower accent="lime" size={20}>
                    <Check size={11} aria-hidden />
                  </Flower>
                ) : (
                  <Plus size={15} aria-hidden />
                )}
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
              className="btn"
              style={{
                marginTop: 10,
                width: '100%',
                height: 48,
                background: 'transparent',
                border: '1.5px dashed #BDBBB6',
                fontWeight: 400,
                fontSize: 15,
              }}
              onClick={() => setWritingOwn(true)}
            >
              <Pencil size={15} aria-hidden /> {t('writeOwn')}
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
  const { posts, approvePost, showToast } = useApp()
  const { t } = useI18n()
  const post = posts[0]
  // demo: a few seconds later CVD approves it and the host dashboard opens by itself
  useEffect(() => {
    if (!post || post.status !== 'review') return
    const timer = setTimeout(() => {
      approvePost(post.id)
      showToast(t('cvdApproved'))
      nav(`/post/live/${post.id}`, { replace: true })
    }, 4000)
    return () => clearTimeout(timer)
  }, [post?.id])
  const cvd = organisations.find((o) => o.id === 'cvd')
  const steps = [
    { key: 'sentStepSent', sub: post ? `${post.title} · ${t('today')}` : t('today'), state: 'done' },
    { key: 'sentStepCheck', sub: t('sentStepCheckSub'), state: 'now' },
    { key: 'sentStepLive', sub: t('sentStepLiveSub'), state: 'later' },
  ]
  return (
    <Screen lime>
      <div className="scroll pad safe-top" style={{ display: 'grid', alignContent: 'start', position: 'relative' }}>
        <button
          className="icon-btn"
          style={{ position: 'absolute', top: 'max(48px, env(safe-area-inset-top))', insetInlineEnd: 'var(--pad)', background: 'rgba(255,255,255,.6)' }}
          aria-label={t('closeLabel')}
          onClick={() => nav('/home', { replace: true })}
        >
          <X size={20} />
        </button>
        <div style={{ display: 'grid', placeItems: 'center', marginTop: 40 }} className="pop">
          <CvdBadge size={140} />
        </div>
        <h1 className="h-display" style={{ textAlign: 'center', marginTop: 20, fontSize: 36 }}>
          {t('sentTitle')}
        </h1>
        <p className="body" style={{ textAlign: 'center', marginTop: 10 }}>
          {t('sentSubNew')}
        </p>
        <ol style={{ listStyle: 'none', margin: '22px 0 0', padding: 16, background: 'var(--white)', borderRadius: 20, display: 'grid', gap: 0 }}>
          {steps.map((step, i) => (
            <li key={step.key} className="row" style={{ gap: 12, alignItems: 'flex-start', position: 'relative', paddingBottom: i < steps.length - 1 ? 14 : 0 }}>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  style={{ position: 'absolute', left: 10, top: 24, bottom: 2, borderLeft: `2px ${step.state === 'done' ? 'solid' : 'dashed'} ${step.state === 'done' ? 'var(--ink)' : '#BDBBB6'}` }}
                />
              )}
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  flex: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  background: step.state === 'done' ? 'var(--ink)' : 'var(--white)',
                  color: 'var(--white)',
                  boxShadow: step.state === 'done' ? undefined : `inset 0 0 0 2px ${step.state === 'now' ? 'var(--ink)' : '#BDBBB6'}`,
                }}
              >
                {step.state === 'done' && <Check size={13} />}
                {step.state === 'now' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink)' }} />}
              </span>
              <span style={{ color: step.state === 'later' ? 'var(--muted)' : 'var(--ink)' }}>
                <strong style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{t(step.key)}</strong>
                <span className="tiny">{step.sub}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="bottom-cta">
        {post && (
          <button className="btn btn-primary" onClick={() => nav(`/post/mine/${post.id}`, { replace: true })}>
            {t('seeMyActivity')}
          </button>
        )}
        <button className={`btn ${post ? 'btn-secondary' : 'btn-primary'}`} onClick={() => nav('/home', { replace: true })}>
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
  if (post?.status === 'live') return <Navigate to={`/post/live/${post.id}`} replace />
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
// Host dashboard once CVD has approved the activity (Figma: Live (host dashboard))
export function HostLive() {
  const { id } = useParams()
  const nav = useNavigate()
  const { posts, showToast } = useApp()
  const { t, dayLong, full } = useI18n()
  const post = posts.find((b) => b.id === id)
  if (!post) return <Navigate to="/home" replace />
  const title = post.title || t('demoRunTitle')
  const day = dayLong(post.date)
  const when = post.repeat === 'once' ? full(post.date) : t('everyDay', { day: day.charAt(0).toUpperCase() + day.slice(1) })
  const time = post.noEnd ? post.start : `${post.start} – ${post.end}`
  const place = post.place || 'Het Park'
  const going = 9
  const mono = { font: "500 10px/13px 'Roboto Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' }
  const actions = [
    { Icon: Mail, title: t('answerQuestions'), sub: t('answerQuestionsSub'), badge: t('nNew', { n: 1 }), toast: 'answerQuestionsToast' },
    { Icon: Pencil, title: t('editActivity'), sub: t('editActivitySub'), toast: 'editActivityToast' },
    { Icon: Clock, title: t('skipWeek'), sub: t('skipWeekSub'), toast: 'skipWeekToast' },
    { Icon: X, title: t('cancelActivity'), sub: t('cancelActivitySub'), danger: true, toast: 'cancelActivityToast' },
  ]
  return (
    <Screen>
      <div className="scroll" style={{ background: 'var(--white)', paddingBottom: 40 }}>
        <div style={{ background: 'var(--ink)', borderRadius: '0 0 32px 32px', height: 330, position: 'relative', color: 'var(--white)' }}>
          <span style={{ position: 'absolute', left: 20, top: 62 }}>
            <BackButton variant="white" to="/home" />
          </span>
          <span style={{ position: 'absolute', right: 20, top: 70, display: 'flex', alignItems: 'center', gap: 4, background: '#3F9B5F', borderRadius: 100, padding: '4px 12px 4px 8px', font: '600 13px/17px Inter, sans-serif', letterSpacing: '-0.01em' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--white)' }} />
            {t('liveBadge')}
          </span>
          <div style={{ position: 'absolute', left: 20, right: 20, top: 118 }}>
            <div style={{ font: "500 12px/16px 'Roboto Mono', monospace", letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--lime)' }}>{t('youreHosting')}</div>
            <h1 style={{ margin: '8px 0 0', font: '600 28px/34px Inter, sans-serif', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
            <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: '18px' }}>
              {when} · {time} · {place}
            </p>
          </div>
          <div style={{ position: 'absolute', left: 20, right: 20, top: 218, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, color: 'var(--ink)' }}>
            {[
              [`${t('nextLabel')} · ${full(post.date)}`, t('nGoing', { n: going }), t('spotsLeft', { n: Math.max(0, (post.capacity || 12) - going) }), 'var(--lime)'],
              [t('commentsLabel'), '4', t('questionsToAnswer', { n: 1 }), 'var(--pink)'],
            ].map(([eyebrow, big, sub, bg]) => (
              <div key={eyebrow} style={{ background: bg, borderRadius: 20, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={mono}>{eyebrow}</span>
                <strong style={{ font: '600 24px/28px Inter, sans-serif', letterSpacing: '-0.02em' }}>{big}</strong>
                <span style={{ fontSize: 12, lineHeight: '18px' }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 24, color: 'var(--ink)' }}>
            <h2 style={{ margin: 0, font: '600 20px/24px Inter, sans-serif', letterSpacing: '-0.02em' }}>{t('whosComing')}</h2>
            <button style={{ font: '600 13px/17px Inter, sans-serif', textDecoration: 'underline', color: 'var(--ink)' }} onClick={() => showToast(t('whosComingToast'))}>
              {t('seeAll')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <span style={{ display: 'flex' }}>
              {['mo', 'sara', 'lisa', 'diego', 'christian'].map((p, i) => (
                <img key={p} src={`${import.meta.env.BASE_URL}img/${p}.jpg`} alt="" style={{ width: 32, height: 32, borderRadius: 16, border: '2px solid var(--white)', objectFit: 'cover', marginInlineEnd: i < 4 ? -8 : 0 }} />
              ))}
            </span>
            <span style={{ fontSize: 12, lineHeight: '18px', color: '#737373' }}>{t('goingNames', { a: 'Mo', b: 'Sara', n: going - 2 })}</span>
          </div>
          <div style={{ background: '#F1F0EC', borderRadius: 20, padding: '4px 16px', marginTop: 24 }}>
            {actions.map((a, i) => (
              <button
                key={a.title}
                onClick={() => showToast(t(a.toast))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 0', textAlign: 'start', borderBottom: i < actions.length - 1 ? '1px solid #E2E0DA' : 0 }}
              >
                <span style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--white)', display: 'grid', placeItems: 'center', flex: 'none', color: a.danger ? '#E85D2A' : 'var(--ink)' }}>
                  <a.Icon size={20} />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ font: '600 15px/20px Inter, sans-serif', letterSpacing: '-0.01em', color: a.danger ? '#E85D2A' : 'var(--ink)' }}>{a.title}</strong>
                  <span style={{ fontSize: 12, lineHeight: '18px', color: '#737373' }}>{a.sub}</span>
                </span>
                {a.badge && <span style={{ background: '#E85D2A', color: 'var(--white)', borderRadius: 100, padding: '2px 8px', font: '600 12px/18px Inter, sans-serif' }}>{a.badge}</span>}
                {!a.danger && <ChevronRight size={20} className="flip-rtl" color="#737373" />}
              </button>
            ))}
          </div>
          <p style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '20px 0 0', fontSize: 12, lineHeight: '18px', color: '#737373' }}>
            <Info size={16} style={{ flex: 'none', marginTop: 1 }} aria-hidden />
            <span>
              {t('needHelpDay')} <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{t('contactCvd')}</strong>. {t('annaContact')}
            </span>
          </p>
        </div>
      </div>
    </Screen>
  )
}
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
