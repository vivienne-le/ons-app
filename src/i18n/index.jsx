import { useCallback, useEffect, useMemo } from 'react'
import { ar } from './ar'
import { en } from './en'
import { nl } from './nl'
import { pl } from './pl'
import { tr } from './tr'
import { uk } from './uk'
import { useApp } from '../state/AppState'
export const langs = {
  en: {
    ui: en,
    content: null,
  },
  nl,
  tr,
  pl,
  ar,
  uk,
}
export const locales = {
  en: 'en-GB',
  nl: 'nl-NL',
  tr: 'tr-TR',
  pl: 'pl-PL',
  ar: 'ar-u-nu-latn',
  uk: 'uk-UA',
}
export const isLang = (x) => x in langs
export function fill(text, vars) {
  return vars ? text.replace(/\{(\w+)\}/g, (c, d) => String(vars[d] ?? `{${d}}`)) : text
}
export function useI18n() {
  const { user } = useApp()
  const lang = isLang(user.language) ? user.language : 'en'
  const pack = langs[lang]
  const content = pack.content
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])
  const translate = useCallback((d, g) => fill(pack.ui[d] ?? en[d], g), [pack])
  return useMemo(() => {
    const g = (P) => new Date(2026, 11, P)
    const h = (P) =>
      new Intl.DateTimeFormat(locales[lang], {
        weekday: 'short',
      })
        .format(g(P))
        .replace('.', '')
    const i = () =>
      new Intl.DateTimeFormat(locales[lang], {
        month: 'short',
      })
        .format(g(1))
        .replace('.', '')
    const j = (P) =>
      new Intl.DateTimeFormat(locales[lang], {
        weekday: 'long',
      }).format(g(P))
    const k = (P) =>
      new Intl.DateTimeFormat(locales[lang], {
        day: 'numeric',
        month: 'short',
      })
        .format(g(P))
        .replace('.', '')
    const l = (P) => `${h(P)} ${k(P)}`
    const m = {
      Oct: 9,
      Nov: 10,
      Dec: 11,
    }
    const n = (P) => {
      const [d, B] = P.split(' ')
      return new Intl.DateTimeFormat(locales[lang], {
        day: 'numeric',
        month: 'short',
      })
        .format(new Date(2026, m[B] ?? 11, +d))
        .replace('.', '')
    }
    const o = new Intl.DisplayNames([locales[lang]], {
      type: 'language',
    })
    const p = (P) => {
      const d = o.of(P) ?? P
      return d.charAt(0).toLocaleUpperCase(locales[lang]) + d.slice(1)
    }
    const q = (P) => (content == null ? undefined : content.tags[P]) ?? P
    const r = (P) => {
      const t = content == null ? undefined : content.events[P.id]
      const B =
        P.host.role === 'CVD'
          ? ((content == null ? undefined : content.roles.cvd) ?? 'CVD')
          : ((content == null ? undefined : content.roles.neighbourhoodHost) ?? P.host.role)
      return {
        ...P,
        title: (t == null ? undefined : t.title) ?? P.title,
        short: (t == null ? undefined : t.short) ?? P.short,
        desc: (t == null ? undefined : t.desc) ?? P.desc,
        steps: P.steps.map((F, d) => {
          return {
            ...F,
            title: (t == null ? undefined : t.steps[d])?.[0] ?? F.title,
            sub: (t == null ? undefined : t.steps[d])?.[1] ?? F.sub,
          }
        }),
        good: P.good.map((F, d) => {
          return {
            ...F,
            title: (t == null ? undefined : t.good[d])?.[0] ?? F.title,
            sub: (t == null ? undefined : t.good[d])?.[1] ?? F.sub,
          }
        }),
        tags: P.tags.map(q),
        host: {
          ...P.host,
          role: B,
        },
        walk: (() => {
          const F = P.walk.match(/^(.+?) · (\d+) min/)
          return F
            ? fill(pack.ui.walk ?? en.walk, {
                d: F[1],
                min: F[2],
              })
            : P.walk
        })(),
      }
    }
    const s = (P) =>
      P.lang === lang
        ? P.text
        : lang === 'en'
          ? (P.en ?? P.text)
          : ((content == null ? undefined : content.comments[P.id]) ?? P.text)
    return {
      t: translate,
      lang,
      dir,
      wd: h,
      mon: i,
      dayLong: j,
      dateShort: k,
      full: l,
      dm: n,
      langName: p,
      ev: r,
      commentIn: s,
      canTranslate: (P) => P.lang !== lang && s(P) !== P.text,
      update: (P, d) => ({
        ...d,
        ...((content == null ? undefined : content.updates[P]) ?? {}),
      }),
      invite: (P, d) => (content == null ? undefined : content.invites[P]) ?? d,
      why: (P, d) => (content == null ? undefined : content.why[P]) ?? d,
      beenTo: (P) => (content == null ? undefined : content.beenTo[P]) ?? P,
      interest: (P) => (content == null ? undefined : content.interests[P]) ?? P,
      tag: q,
    }
  }, [translate, lang, dir, content, pack])
}
