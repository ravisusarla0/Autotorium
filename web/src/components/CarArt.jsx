import { useId } from 'react'

// Hand-drawn side-profile silhouettes keep the showcase self-contained — the
// schema's image_url files are not present in the repository.
const SHAPES = {
  Coupe: {
    body: 'M58 168 C58 146 76 132 108 126 L168 116 C196 84 246 66 302 66 C356 66 404 84 442 112 L520 128 C560 135 584 148 588 168 C589 176 582 181 572 181 L76 181 C62 181 57 176 58 168 Z',
    greenhouse: 'M196 114 C222 86 262 74 304 74 C344 74 380 90 410 114 Z',
    pillars: ['M306 75 L306 113', 'M352 77 L352 111'],
    highlight: 'M96 150 C180 138 300 132 470 146',
    vent: 'M126 140 L168 133',
    wheels: [
      [180, 174, 38],
      [470, 174, 38],
    ],
  },
  Sedan: {
    body: 'M54 168 C56 146 74 132 108 126 L176 116 C200 88 240 72 288 72 L388 72 C432 72 468 92 494 116 L548 128 C580 136 592 150 592 168 C592 176 586 181 576 181 L72 181 C60 181 53 176 54 168 Z',
    greenhouse: 'M196 112 C218 88 252 78 292 78 L382 78 C416 78 444 94 462 112 Z',
    pillars: ['M300 78 L300 111', 'M382 78 L382 111'],
    highlight: 'M94 150 C180 138 300 132 478 146',
    vent: 'M128 140 L170 133',
    wheels: [
      [174, 174, 38],
      [490, 174, 38],
    ],
  },
  Hatchback: {
    body: 'M56 168 C56 146 74 132 106 126 L164 116 C190 84 232 66 280 64 L424 64 C458 64 486 82 506 112 L548 126 C580 134 592 150 592 168 C592 176 586 181 576 181 L74 181 C62 181 55 176 56 168 Z',
    greenhouse: 'M188 112 C210 84 246 72 282 72 L412 72 C444 72 466 88 482 112 Z',
    pillars: ['M298 72 L298 112', 'M394 72 L394 112'],
    highlight: 'M94 150 C180 138 300 134 480 148',
    vent: 'M126 140 L166 133',
    wheels: [
      [178, 174, 38],
      [482, 174, 38],
    ],
  },
  Supercar: {
    body: 'M44 174 C48 158 66 148 98 144 L176 132 C226 104 292 92 352 96 L462 112 L548 132 C582 140 598 152 600 170 C600 178 592 182 580 182 L62 182 C48 182 42 180 44 174 Z',
    greenhouse: 'M236 130 C270 110 316 104 356 108 L414 122 Z',
    pillars: ['M320 106 L320 128'],
    highlight: 'M84 154 C190 138 360 132 548 152',
    vent: 'M176 148 L224 140',
    wheels: [
      [156, 176, 38],
      [496, 176, 38],
    ],
  },
  Roadster: {
    body: 'M56 170 C56 148 74 134 106 126 L170 114 C232 94 330 90 398 104 L520 128 C562 136 584 150 588 170 C589 177 582 182 572 182 L74 182 C62 182 55 177 56 170 Z',
    greenhouse: 'M224 112 L266 82 L302 86 L272 116 Z',
    pillars: ['M266 82 L258 112'],
    highlight: 'M94 152 C190 138 320 132 470 148',
    vent: 'M128 140 L168 133',
    wheels: [
      [180, 175, 38],
      [470, 175, 38],
    ],
  },
}

const FALLBACK = SHAPES.Coupe

export default function CarArt({ type = 'Coupe', className = '', glow = true }) {
  const uid = useId().replace(/[:]/g, '')
  const shape = SHAPES[type] ?? FALLBACK
  const bodyId = `car-body-${uid}`
  const lineId = `car-line-${uid}`
  const glowId = `car-glow-${uid}`

  return (
    <svg
      className={`car-art ${className}`.trim()}
      viewBox="0 0 640 240"
      role="img"
      aria-label={`${type} silhouette`}
      focusable="false"
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4B4B52" />
          <stop offset="42%" stopColor="#2A2A2F" />
          <stop offset="100%" stopColor="#0C0C0E" />
        </linearGradient>
        <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.05" />
          <stop offset="45%" stopColor="#60A5FA" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.38" />
          <stop offset="70%" stopColor="#2563EB" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <ellipse cx="322" cy="212" rx="292" ry="26" fill={`url(#${glowId})`} />}

      <path d={shape.body} fill={`url(#${bodyId})`} stroke="#52525B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={shape.greenhouse} fill="#0E0E10" stroke="#52525B" strokeWidth="1.2" strokeLinejoin="round" />

      {shape.pillars.map((pillar) => (
        <path key={pillar} d={pillar} stroke="#3F3F46" strokeWidth="1.2" />
      ))}

      <path d={shape.highlight} fill="none" stroke={`url(#${lineId})`} strokeWidth="2.4" strokeLinecap="round" />
      <path d={shape.vent} fill="none" stroke="#3F3F46" strokeWidth="1.6" strokeLinecap="round" />

      {/* headlight sweep */}
      <path
        d={type === 'Supercar' ? 'M580 150 L596 158' : 'M568 144 L584 152'}
        stroke="#93C5FD"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />

      {shape.wheels.map(([cx, cy, r]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={r} fill="#08080A" stroke="#3F3F46" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke="#52525B" strokeWidth="1.3" />
          <circle cx={cx} cy={cy} r={r * 0.2} fill="#27272A" stroke="#71717A" strokeWidth="1.2" />
          {[0, 1, 2, 3, 4].map((spoke) => {
            const angle = ((spoke * 72 - 90) * Math.PI) / 180
            return (
              <line
                key={spoke}
                x1={cx + Math.cos(angle) * r * 0.22}
                y1={cy + Math.sin(angle) * r * 0.22}
                x2={cx + Math.cos(angle) * r * 0.58}
                y2={cy + Math.sin(angle) * r * 0.58}
                stroke="#3F3F46"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            )
          })}
        </g>
      ))}
    </svg>
  )
}
