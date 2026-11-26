# ons · Middelland

**ons** helps neighbours in Rotterdam Middelland find each other through small local activities: bowling on Monday, a run along the Maas, an open kitchen. It is built for CVD Rotterdam as part of our PS2 project (THUAS UX Design).

It is a mobile web app (works best on a phone, or in the phone frame on desktop) made with React and Vite. All data is demo data, saved in the browser's local storage, so nothing is sent anywhere.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## What's in the app

- **Sign up** as a guest (phone or email) or as a host (organisation + work email), in 6 languages: English, Dutch, Turkish, Polish, Arabic (right-to-left) and Ukrainian.
- **Home, Explore and Map**: activities for you, filters, and a map of Middelland with essential services first (toilets, a place to sleep, free meals…).
- **Activity page**: join, save, share, comments with translation, who's going, a shared photo album after you've been.
- **Plans**: monthly calendar, upcoming, saved and been-to.
- **Profile**: edit profile and pronouns, "How others see you", badges (rubber stamps), friends and following, your network garden, settings.
- **Hosts**: post an activity in 4 steps; guests can ask an organisation to verify them as a host.

## Where to change things

| What | File |
| --- | --- |
| Activities, organisations, people in the demo | `src/data/events.js`, `src/data/people.js` |
| Essential services on the map (placeholder data!) | `src/data/services.js` |
| Shared-album photos | `src/data/albums.js` |
| All texts / translations | `src/i18n/en.js` and `nl.js`, `tr.js`, `pl.js`, `ar.js`, `uk.js` |
| Badges and their goals | `src/components/Badges.jsx` (`badges`) |
| Colours, fonts, layout | `src/styles/global.css` |
| Logo and app icon | `public/logo-ons.svg`, `public/icon.svg`, `public/icon-*.png` |
| Screens | `src/screens/` · shared pieces in `src/components/` |

When you add a text, add the same key to every language file.

**Note:** the essential services (toilets, night shelters, meals…) are made up for the prototype. Check them with CVD before anyone relies on them.

## Deploy

The project deploys to Vercel as a static Vite site (`vercel.json` sends every path to `index.html`).

Photo credits: see `public/img/CREDITS.md`.
