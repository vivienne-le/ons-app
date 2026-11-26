/** The ons app logo (three neighbours together). File: public/logo-ons.svg */
export function OnsLogo({ width = 120 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo-ons.svg`}
      width={width}
      height={width * (300 / 313)}
      alt="ons"
      style={{
        display: 'block',
        // stronger warm shadow so the pastel logo and wordmark stand out on light backgrounds
        filter: 'drop-shadow(0 1px 1.5px rgba(58, 48, 43, 0.45)) drop-shadow(0 4px 10px rgba(58, 48, 43, 0.3))',
      }}
    />
  )
}
