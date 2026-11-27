import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { byId } from '../data/events'
export const emptyDraft = () => ({
  title: '',
  desc: '',
  photo: '',
  category: 'Sport',
  date: 20,
  start: '10:00',
  end: '11:00',
  noEnd: false,
  repeat: 'once',
  capacity: 12,
  place: '',
  meet: '',
  steps: [
    {
      text: '',
      optional: false,
    },
  ],
  good: [],
  cost: 'free',
  amount: '',
})
export const defaults = {
  onboarded: false,
  user: {
    firstName: 'Ruben',
    lastName: 'Meyer',
    phone: '',
    email: '',
    language: 'en',
    photo: '',
    age: '34',
    gender: 'Man',
    area: 'Middelland',
    interests: [],
    role: 'guest',
    org: '',
    workEmail: '',
    jobTitle: '',
    pronouns: '',
    verifiedBy: '',
    showBadges: true,
    hostCardMoved: false,
    bio: 'Always on the move: football, a run or bike ride in between. I also enjoy cooking a big dinner.',
  },
  joined: ['bowling-monday', 'football-beer'],
  saved: ['bike-repair', 'retro-games', 'oliebollen'],
  invites: {},
  updatesRead: false,
  myComments: {},
  draft: emptyDraft(),
  posts: [],
  hostRequest: null,
  following: ['org:cvd', 'org:zorgvrijstaat', 'person:noon', 'person:mo'],
}
export const STORAGE_KEY = 'cvd-app-v2'
export function loadState() {
  try {
    const a = localStorage.getItem(STORAGE_KEY)
    if (a) {
      const b = JSON.parse(a)
      return {
        ...defaults,
        ...b,
        user: {
          ...defaults.user,
          ...(b.user ?? {}),
        },
        draft: {
          ...defaults.draft,
          ...(b.draft ?? {}),
        },
      }
    }
  } catch {}
  return defaults
}
export const AppContext = createContext(null)
export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      window.dispatchEvent(new Event('cvd-storage-full'))
    }
  }, [state])
  const showToast = useCallback((h, i) => {
    window.clearTimeout(toastTimer.current)
    setToast({
      id: Date.now(),
      text: h,
      action: i,
    })
    toastTimer.current = window.setTimeout(() => setToast(null), i ? 4500 : 2600)
  }, [])
  const value = useMemo(
    () => ({
      ...state,
      toast,
      showToast,
      setUser: (h) =>
        setState((i) => ({
          ...i,
          user: {
            ...i.user,
            ...h,
          },
        })),
      finishOnboarding: () =>
        setState((h) => ({
          ...h,
          onboarded: true,
        })),
      logout: () =>
        setState((h) => ({
          ...h,
          onboarded: false,
        })),
      join: (h) =>
        setState((i) => ({
          ...i,
          joined: i.joined.includes(h) ? i.joined : [...i.joined, h],
        })),
      leave: (h) =>
        setState((i) => ({
          ...i,
          joined: i.joined.filter((j) => j !== h),
        })),
      toggleSave: (h) => {
        const i = !state.saved.includes(h)
        setState((j) => ({
          ...j,
          saved: i ? [...j.saved, h] : j.saved.filter((k) => k !== h),
        }))
        return i
      },
      setInvite: (h, i) =>
        setState((j) => {
          const k = {
            ...j.invites,
          }
          i ? (k[h] = i) : delete k[h]
          return {
            ...j,
            invites: k,
          }
        }),
      markUpdatesRead: () =>
        setState((h) =>
          h.updatesRead
            ? h
            : {
                ...h,
                updatesRead: true,
              },
        ),
      addComment: (h, i, j) =>
        setState((k) => {
          const l = {
            id: `me-${Date.now()}`,
            author: {
              id: 'me',
              name: k.user.firstName || 'You',
              avatar: 'ruben',
            },
            ago: 'now',
            lang: k.user.language,
            text: i,
            replyTo: j,
          }
          return {
            ...k,
            myComments: {
              ...k.myComments,
              [h]: [...(k.myComments[h] ?? []), l],
            },
          }
        }),
      goingCount: (h) => {
        const i = byId(h)
        if (!i) return 0
        const j = defaults.joined.includes(h)
        return i.going + (state.joined.includes(h) && !j ? 1 : 0) - (!state.joined.includes(h) && j ? 1 : 0)
      },
      setDraft: (h) =>
        setState((i) => ({
          ...i,
          draft: {
            ...i.draft,
            ...h,
          },
        })),
      submitDraft: () => {
        const h = `post-${Date.now()}`
        setState((i) => ({
          ...i,
          posts: [
            {
              ...i.draft,
              id: h,
              status: 'review',
              created: Date.now(),
            },
            ...i.posts,
          ],
          draft: emptyDraft(),
        }))
        return h
      },
      setHostRequest: (h) =>
        setState((i) => ({
          ...i,
          hostRequest: h,
        })),
      toggleFollow: (h) => {
        const i = !state.following.includes(h)
        setState((j) => ({
          ...j,
          following: i ? [...j.following, h] : j.following.filter((k) => k !== h),
        }))
        return i
      },
      reset: () => {
        setState(defaults)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {}
      },
    }),
    [state, toast, showToast],
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
