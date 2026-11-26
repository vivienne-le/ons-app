// Interest pill with a coloured flower icon (Figma: Profile › Interests).
import {
  Bike,
  Car,
  CircleDot,
  Coffee,
  CookingPot,
  Crown,
  Dumbbell,
  Fish,
  Footprints,
  Gamepad2,
  Music,
  Spade,
  Sprout,
  Star,
  Target,
  Volleyball,
  Wrench,
} from 'lucide-react'
import { Flower } from './Flower'
import { interestOptions } from '../data/events'
import { useI18n } from '../i18n/index'

export const interestIcons = {
  Football: Volleyball,
  Cycling: Bike,
  Fishing: Fish,
  Cooking: CookingPot,
  Darts: Target,
  Pool: CircleDot,
  Walking: Footprints,
  Gardening: Sprout,
  'DIY & repairs': Wrench,
  'Card games': Spade,
  Games: Gamepad2,
  Chess: Crown,
  Fitness: Dumbbell,
  Music: Music,
  'Cars & motors': Car,
  'Coffee & a chat': Coffee,
}
const fallbackAccents = ['lime', 'pink', 'turq', 'lav', 'orange']

/** `index` picks a colour for custom interests; `background` is the pill colour. */
export function InterestChip({ id, index = 0, background = 'var(--grey)' }) {
  const { interest } = useI18n()
  const opt = interestOptions.find((o) => o.id === id)
  const Icon = interestIcons[id] ?? Star
  const accent = opt?.accent ?? fallbackAccents[index % fallbackAccents.length]
  return (
    <span
      className="row"
      style={{ gap: 8, background, borderRadius: 30, padding: '5px 16px 5px 6px', fontSize: 16, fontWeight: 500 }}
    >
      <Flower accent={accent} size={34} style={{ color: accent === 'orange' ? '#fff' : undefined }}>
        <Icon size={15} aria-hidden />
      </Flower>
      {interest(id)}
    </span>
  )
}
