import { P, events, organisations } from './events'
export const neighbour = (id, name, area, since, interests) => ({
  id,
  name,
  avatar: id,
  area,
  since,
  interests,
})
export const profiles = {
  noon: {
    ...P.noon,
    area: 'Middelland',
    since: 2019,
    interests: ['Cooking', 'Coffee & a chat', 'Walking'],
  },
  sam: {
    ...P.sam,
    area: 'Nieuwe Westen',
    since: 2021,
    interests: ['Pool', 'Darts', 'Football'],
  },
  thijs: {
    ...P.thijs,
    area: 'Middelland',
    since: 2018,
    interests: ['Fitness', 'Cycling', 'Walking'],
  },
  mo: {
    ...P.mo,
    area: 'Oude Westen',
    since: 2020,
    interests: ['Cars & motors', 'Chess', 'Football'],
  },
  anna: {
    ...P.anna,
    area: 'Middelland',
    since: 2022,
    interests: ['Gardening', 'Music', 'Cooking'],
  },
  lisa: {
    ...P.lisa,
    area: 'Delfshaven',
    since: 2023,
    interests: ['Card games', 'Walking'],
  },
  diego: {
    ...P.diego,
    area: 'Middelland',
    since: 2024,
    interests: ['Football', 'Fitness'],
  },
  christian: {
    ...P.christian,
    area: 'Cool',
    since: 2022,
    interests: ['DIY & repairs', 'Fishing'],
  },
  sara: {
    ...P.sara,
    area: 'Middelland',
    since: 2025,
    interests: ['Cooking', 'Music'],
  },
  g1: neighbour('g1', 'Aya', 'Middelland', 2023, ['Cooking', 'Walking']),
  g2: neighbour('g2', 'Joris', 'Nieuwe Westen', 2017, ['Darts', 'Football']),
  g3: neighbour('g3', 'Kemal', 'Middelland', 2021, ['Chess', 'Coffee & a chat']),
  g4: neighbour('g4', 'Marta', 'Oude Westen', 2024, ['Gardening', 'Card games']),
  g5: neighbour('g5', 'Rosa', 'Middelland', 2019, ['Music', 'Walking']),
  g6: neighbour('g6', 'Sven', 'Delfshaven', 2020, ['Cycling', 'DIY & repairs']),
  g7: neighbour('g7', 'Tariq', 'Spangen', 2022, ['Football', 'Fitness']),
  g8: neighbour('g8', 'Yara', 'Middelland', 2025, ['Cooking', 'Card games']),
  g9: neighbour('g9', 'Lotte', 'Cool', 2018, ['Walking', 'Gardening']),
}
export const orgForPerson = {
  cvd: 'cvd',
}
export const profileLink = (id) =>
  id === 'me' ? '/profile' : orgForPerson[id] ? `/org/${orgForPerson[id]}` : profiles[id] ? `/person/${id}` : null
export const hostedBy = (personId) => events.filter((event) => event.host.id === personId)
export const orgOfEvent = (eventId) => organisations.find((organisation) => organisation.events.includes(eventId))
export const orgsOfHost = (personId) => [
  ...new Set(
    hostedBy(personId)
      .map((b) => orgOfEvent(b.id))
      .filter(Boolean),
  ),
]
export function goingPeople(event) {
  const candidates = Object.keys(profiles).filter((e) => e !== event.host.id)
  const start = events.indexOf(event) * 3
  const picked = [
    ...event.goingAvatars,
    ...Array.from(
      {
        length: 5,
      },
      (e, f) => candidates[(start + f) % candidates.length],
    ),
  ]
  return [...new Set(picked)]
    .filter((e) => profiles[e])
    .slice(0, Math.max(3, Math.min(8, event.going)))
    .map((e) => profiles[e])
}
export const eventsOf = (personId) =>
  events.filter(
    (event) =>
      goingPeople(event).some((c) => c.id === personId) ||
      event.comments.some((comment) => {
        return comment.author.id === personId || comment.replies?.some((e) => e.author.id === personId)
      }),
  )
export const orgInfo = {
  cvd: {
    kind: 'community',
    followers: 214,
    area: 'Middelland',
  },
  zorgvrijstaat: {
    kind: 'care',
    followers: 96,
    area: 'Middelland',
  },
  buurtatelier: {
    kind: 'creative',
    followers: 58,
    area: 'Nieuwe Westen',
  },
  sportfondsen: {
    kind: 'sport',
    followers: 131,
    area: 'Oostervant',
  },
  buurthuis: {
    kind: 'community',
    followers: 172,
    area: 'Middelland',
  },
}
