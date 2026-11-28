// Interest pill with a coloured flower icon (Figma: Profile › Interests).
import {
  BookOpen,
  Clapperboard,
  HandHeart,
  Landmark,
  Languages,
  Leaf,
  Mic,
  Paintbrush,
  Palette,
  Plane,
  Scissors,
  Shirt,
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
  Music,
  'Cars & motors': Car,
  'Coffee & a chat': Coffee,
  Fashion: Shirt,
  Tennis: CircleDot,
  Languages,
  Traveling: Plane,
  Volunteering: HandHeart,
  Arts: Palette,
  Running: Footprints,
  Reading: BookOpen,
  Movies: Clapperboard,
  Museum: Landmark,
  Craft: Scissors,
  Concert: Mic,
  Dance: Music,
  Painting: Paintbrush,
  Coffee,
  Yoga: Leaf,
}
const fallbackAccents = ['lime', 'pink', 'turq', 'lav', 'orange']

/** `index` picks a colour for custom interests; `background` is the pill colour. */
export function InterestChip({ id, index = 0, background = 'var(--grey)' }) {
  const { interest } = useI18n()
  const opt = interestOptions.find((interestOption) => interestOption.id === id)
  const Icon = interestIcons[id] ?? Star
  const accent = opt?.accent ?? fallbackAccents[index % fallbackAccents.length]
  return (
    <span
      className="row"
      style={{
        gap: 8,
        background,
        borderRadius: 30,
        padding: '4px 16px 4px 8px',
        fontSize: 14,
        lineHeight: '21px',
        letterSpacing: '-0.01em',
        fontWeight: 600,
      }}
    >
      <Flower
        accent={accent}
        size={36}
        style={{
          color: accent === 'orange' ? '#fff' : undefined,
        }}
      >
        <Icon size={16} aria-hidden />
      </Flower>
      {interest(id)}
    </span>
  )
}
