import React from 'react';
import { KrathongDesign } from '../types/krathong';
import { CANDLE_OPTIONS, FLOWER_OPTIONS, GLOW_OPTIONS } from '../data/krathongCatalog';

interface KrathongArtworkProps {
  design: KrathongDesign;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animateFlame?: boolean;
  showWaterRipple?: boolean;
  isHighlighted?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<KrathongArtworkProps['size']>, string> = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-44 h-44',
  xl: 'w-64 h-64 sm:w-72 sm:h-72',
};

export const KrathongArtwork: React.FC<KrathongArtworkProps> = ({
  design,
  size = 'lg',
  animateFlame = true,
  showWaterRipple = true,
  isHighlighted = false,
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const flower = FLOWER_OPTIONS.find((f) => f.id === design.flowerId) || FLOWER_OPTIONS[0];
  const candle = CANDLE_OPTIONS.find((c) => c.id === design.candleId) || CANDLE_OPTIONS[0];
  const glow = GLOW_OPTIONS.find((g) => g.id === design.glowColor) || GLOW_OPTIONS[0];

  const renderBase = () => {
    switch (design.baseId) {
      case 'lotus-pink':
        return (
          <g>
            {[-52, -32, -12, 12, 32, 52].map((angle, i) => (
              <ellipse
                key={i}
                cx={100 + angle * 0.72}
                cy={138 - Math.abs(angle) * 0.14}
                rx={16}
                ry={25}
                transform={`rotate(${angle * 0.55} ${100 + angle * 0.72} ${138})`}
                fill={`url(#lotusGrad-${uid})`}
                stroke="#FBCFE8"
                strokeWidth="0.9"
              />
            ))}
            {[-28, 0, 28].map((angle, i) => (
              <path
                key={`front-${i}`}
                d={`M ${100 + angle - 16} 144 Q ${100 + angle} 110 ${100 + angle + 16} 144 Q ${100 + angle} 156 ${100 + angle - 16} 144 Z`}
                fill="#F472B6"
                stroke="#FCE7F3"
                strokeWidth="1"
              />
            ))}
            <ellipse cx="100" cy="144" rx="46" ry="12" fill="#9D174D" opacity="0.65" />
          </g>
        );

      case 'lotus-white':
        return (
          <g>
            {[-52, -32, -12, 12, 32, 52].map((angle, i) => (
              <ellipse
                key={i}
                cx={100 + angle * 0.72}
                cy={138 - Math.abs(angle) * 0.14}
                rx={16}
                ry={25}
                transform={`rotate(${angle * 0.55} ${100 + angle * 0.72} ${138})`}
                fill={`url(#whiteLotusGrad-${uid})`}
                stroke="#FDE68A"
                strokeWidth="0.9"
              />
            ))}
            {[-28, 0, 28].map((angle, i) => (
              <path
                key={`wfront-${i}`}
                d={`M ${100 + angle - 16} 144 Q ${100 + angle} 110 ${100 + angle + 16} 144 Q ${100 + angle} 156 ${100 + angle - 16} 144 Z`}
                fill="#F8FAFC"
                stroke="#FCD34D"
                strokeWidth="1"
              />
            ))}
            <ellipse cx="100" cy="144" rx="46" ry="12" fill="#E2E8F0" opacity="0.85" />
          </g>
        );

      case 'golden-swan':
        return (
          <g>
            {/* Swan boat hull */}
            <path
              d="M 46 135 Q 100 162 154 134 L 146 148 Q 100 168 54 148 Z"
              fill={`url(#goldGrad-${uid})`}
              stroke="#FEF08A"
              strokeWidth="1.2"
            />
            {/* Graceful Golden Swan Neck & Head on Left */}
            <path
              d="M 52 138 C 36 122, 38 92, 54 84 C 61 81, 68 85, 65 91 C 61 93, 55 92, 52 96 C 46 105, 51 124, 64 136 Z"
              fill={`url(#goldGrad-${uid})`}
              stroke="#FEF08A"
              strokeWidth="1.1"
            />
            <polygon points="64,86 73,88 65,91" fill="#F97316" />
            <circle cx="58" cy="87" r="1.4" fill="#0F172A" />
            {/* Gilded Wing Feathers */}
            <path
              d="M 72 134 Q 105 112 146 125 Q 134 146 72 142 Z"
              fill="#D97706"
              stroke="#FDE68A"
              strokeWidth="1.1"
            />
            <path d="M 88 134 Q 112 122 138 129" stroke="#FEF08A" strokeWidth="1" fill="none" />
            {/* Tail plume */}
            <path
              d="M 148 134 Q 168 116 172 98 Q 160 116 154 138 Z"
              fill={`url(#goldGrad-${uid})`}
              stroke="#FEF08A"
              strokeWidth="0.9"
            />
          </g>
        );

      case 'naga-boat':
        return (
          <g>
            {/* Emerald Naga Boat Hull */}
            <path
              d="M 46 136 Q 100 160 154 136 L 148 148 Q 100 166 52 148 Z"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1.2"
            />
            {/* Naga Head & Golden Crest on Right */}
            <path
              d="M 146 138 C 162 122, 166 96, 152 84 C 145 78, 138 86, 144 92 C 150 96, 152 115, 138 134 Z"
              fill="#10B981"
              stroke="#FCD34D"
              strokeWidth="1.2"
            />
            <path
              d="M 152 84 L 156 71 L 161 81 L 167 74 L 163 87 Z"
              fill="#FBBF24"
              stroke="#FEF08A"
              strokeWidth="0.7"
            />
            <circle cx="147" cy="87" r="1.5" fill="#FDE047" />
            {/* Naga Tail on Left */}
            <path
              d="M 52 136 Q 36 118 35 100 Q 43 114 56 134 Z"
              fill="#059669"
              stroke="#FCD34D"
              strokeWidth="1"
            />
            {/* Scale patterns */}
            {[-28, -14, 0, 14, 28].map((dx, i) => (
              <path
                key={i}
                d={`M ${100 + dx - 7} 142 Q ${100 + dx} 135 ${100 + dx + 7} 142`}
                fill="none"
                stroke="#FDE047"
                strokeWidth="1"
                opacity="0.7"
              />
            ))}
          </g>
        );

      case 'royal-crown':
        return (
          <g>
            {/* Lower royal gold rim */}
            <ellipse cx="100" cy="146" rx="58" ry="14" fill="#78350F" stroke="#FBBF24" strokeWidth="1.4" />
            {/* Tier 1 */}
            {[-46, -30, -15, 0, 15, 30, 46].map((dx, i) => (
              <path
                key={`t1-${i}`}
                d={`M ${100 + dx - 11} 144 L ${100 + dx} 118 L ${100 + dx + 11} 144 Z`}
                fill="#065F46"
                stroke="#FCD34D"
                strokeWidth="1.1"
              />
            ))}
            {/* Tier 2 gilded */}
            {[-32, -16, 0, 16, 32].map((dx, i) => (
              <path
                key={`t2-${i}`}
                d={`M ${100 + dx - 9} 136 L ${100 + dx} 110 L ${100 + dx + 9} 136 Z`}
                fill={`url(#goldGrad-${uid})`}
                stroke="#FEF08A"
                strokeWidth="1"
              />
            ))}
            <ellipse cx="100" cy="138" rx="46" ry="10" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
          </g>
        );

      case 'corn-husk':
        return (
          <g>
            <ellipse cx="100" cy="144" rx="54" ry="14" fill="#A16207" stroke="#FDE047" strokeWidth="1" />
            {[-44, -29, -14, 0, 14, 29, 44].map((dx, i) => (
              <path
                key={i}
                d={`M ${100 + dx - 11} 142 Q ${100 + dx} 105 ${100 + dx + 11} 142 Z`}
                fill={`url(#cornGrad-${uid})`}
                stroke="#FEF08A"
                strokeWidth="0.9"
              />
            ))}
            <ellipse cx="100" cy="136" rx="45" ry="11" fill="#CA8A04" stroke="#FEF08A" strokeWidth="0.9" />
          </g>
        );

      case 'coconut-shell':
        return (
          <g>
            <path
              d="M 48 128 C 52 162, 148 162, 152 128 Z"
              fill={`url(#cocoGrad-${uid})`}
              stroke="#D97706"
              strokeWidth="1.2"
            />
            <ellipse
              cx="100"
              cy="128"
              rx="52"
              ry="14"
              fill="#78350F"
              stroke="#F59E0B"
              strokeWidth="1.3"
            />
            {[-36, -18, 0, 18, 36].map((dx, idx) => (
              <circle key={idx} cx={100 + dx} cy={135 - Math.abs(dx) * 0.08} r="2.2" fill="#FDE68A" opacity="0.7" />
            ))}
          </g>
        );

      case 'bread-turtle':
        return (
          <g>
            <ellipse cx="52" cy="140" rx="14" ry="7" transform="rotate(-20 52 140)" fill="#B45309" />
            <ellipse cx="148" cy="140" rx="14" ry="7" transform="rotate(20 148 140)" fill="#B45309" />
            <circle cx="155" cy="126" r="11" fill="#D97706" stroke="#FDE68A" strokeWidth="0.9" />
            <circle cx="159" cy="124" r="2" fill="#1E293B" />
            <circle cx="159.7" cy="123.3" r="0.7" fill="#FFFFFF" />
            <ellipse
              cx="100"
              cy="135"
              rx="50"
              ry="20"
              fill={`url(#breadGrad-${uid})`}
              stroke="#FCD34D"
              strokeWidth="1.2"
            />
            <path
              d="M 68 134 Q 100 124 132 134 M 80 124 L 84 146 M 120 124 L 116 146"
              stroke="#92400E"
              strokeWidth="1.5"
              fill="none"
              opacity="0.55"
            />
          </g>
        );

      case 'bread-fish':
        return (
          <g>
            {/* Fish Tail */}
            <path
              d="M 52 135 L 30 116 L 36 135 L 30 154 Z"
              fill="#EA580C"
              stroke="#FED7AA"
              strokeWidth="1"
            />
            {/* Fish Bread Body */}
            <ellipse
              cx="102"
              cy="135"
              rx="52"
              ry="21"
              fill={`url(#koiGrad-${uid})`}
              stroke="#FED7AA"
              strokeWidth="1.2"
            />
            {/* Koi spots */}
            <ellipse cx="82" cy="133" rx="12" ry="7" fill="#DC2626" opacity="0.65" />
            <ellipse cx="122" cy="136" rx="10" ry="6" fill="#FFFFFF" opacity="0.7" />
            {/* Fish Eye & Smile */}
            <circle cx="142" cy="131" r="2.6" fill="#0F172A" />
            <circle cx="142.8" cy="130.2" r="0.9" fill="#FFFFFF" />
            <path d="M 145 140 Q 150 142 153 138" stroke="#7C2D12" strokeWidth="1.4" fill="none" />
          </g>
        );

      case 'crystal-ice':
        return (
          <g>
            {[-48, -26, 0, 26, 48].map((dx, i) => (
              <polygon
                key={i}
                points={`${100 + dx},108 ${100 + dx - 16},142 ${100 + dx},152 ${100 + dx + 16},142`}
                fill={`url(#iceGrad-${uid})`}
                stroke="#E0F2FE"
                strokeWidth="1"
                opacity="0.9"
              />
            ))}
            <ellipse
              cx="100"
              cy="136"
              rx="52"
              ry="14"
              fill="#7DD3FC"
              fillOpacity="0.32"
              stroke="#BAE6FD"
              strokeWidth="1.2"
            />
          </g>
        );

      case 'rainbow-tier': {
        const colors = ['#EF4444', '#F97316', '#FACC15', '#22C55E', '#3B82F6', '#A855F7', '#EC4899'];
        return (
          <g>
            <ellipse cx="100" cy="144" rx="56" ry="15" fill="#1E1B4B" stroke="#FBBF24" strokeWidth="1" />
            {colors.map((c, idx) => {
              const offset = (idx - 3) * 15;
              return (
                <path
                  key={idx}
                  d={`M ${100 + offset - 10} 142 L ${100 + offset} 112 L ${100 + offset + 10} 142 Z`}
                  fill={c}
                  stroke="#FFFFFF"
                  strokeWidth="0.7"
                  opacity="0.92"
                />
              );
            })}
            <ellipse cx="100" cy="138" rx="46" ry="11" fill="#312E81" stroke="#FDE047" strokeWidth="1" />
          </g>
        );
      }

      case 'banana-leaf':
      default:
        return (
          <g>
            <ellipse cx="100" cy="143" rx="54" ry="14" fill="#14532D" stroke="#4ADE80" strokeWidth="1" />
            {[-46, -30, -15, 0, 15, 30, 46].map((dx, i) => (
              <g key={i}>
                <path
                  d={`M ${100 + dx - 12} 140 L ${100 + dx} 110 L ${100 + dx + 12} 140 Z`}
                  fill={`url(#leafGrad-${uid})`}
                  stroke="#86EFAC"
                  strokeWidth="0.9"
                />
                <path
                  d={`M ${100 + dx - 6} 140 L ${100 + dx} 121 L ${100 + dx + 6} 140 Z`}
                  fill="#15803D"
                  opacity="0.75"
                />
              </g>
            ))}
            <ellipse cx="100" cy="136" rx="46" ry="11" fill="#166534" stroke="#4ADE80" strokeWidth="1" />
          </g>
        );
    }
  };

  const renderFlowers = () => {
    const positions = [
      { x: 64, y: 132, s: 0.9 },
      { x: 82, y: 127, s: 1 },
      { x: 100, y: 125, s: 1.08 },
      { x: 118, y: 127, s: 1 },
      { x: 136, y: 132, s: 0.9 },
    ];

    return (
      <g>
        {positions.map((pos, idx) => (
          <g
            key={idx}
            transform={`translate(${pos.x}, ${pos.y}) scale(${pos.s})`}
          >
            {design.flowerId === 'jasmine' ? (
              <>
                {[0, 60, 120, 180, 240, 300].map((rot) => (
                  <ellipse
                    key={rot}
                    cx="0"
                    cy="-6"
                    rx="3.2"
                    ry="5.8"
                    transform={`rotate(${rot})`}
                    fill="#FFFFFF"
                    stroke="#A7F3D0"
                    strokeWidth="0.6"
                  />
                ))}
                <circle cx="0" cy="0" r="3" fill="#FDE047" />
              </>
            ) : design.flowerId === 'orchid' || design.flowerId === 'sakura' ? (
              <>
                {[0, 72, 144, 216, 288].map((rot) => (
                  <ellipse
                    key={rot}
                    cx="0"
                    cy="-6.5"
                    rx="4"
                    ry="6.5"
                    transform={`rotate(${rot})`}
                    fill={flower.petalColor}
                    stroke={flower.accentColor}
                    strokeWidth="0.6"
                  />
                ))}
                <circle cx="0" cy="0" r="3.2" fill="#FDE047" />
              </>
            ) : design.flowerId === 'sunflower' ? (
              <>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
                  <ellipse
                    key={rot}
                    cx="0"
                    cy="-7"
                    rx="2.3"
                    ry="5.5"
                    transform={`rotate(${rot})`}
                    fill="#FACC15"
                  />
                ))}
                <circle cx="0" cy="0" r="4.8" fill="#78350F" stroke="#B45309" strokeWidth="0.8" />
              </>
            ) : design.flowerId === 'champa' ? (
              <>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
                  <ellipse
                    key={rot}
                    cx="0"
                    cy="-6"
                    rx="2.6"
                    ry="6"
                    transform={`rotate(${rot})`}
                    fill={flower.accentColor}
                    stroke={flower.petalColor}
                    strokeWidth="0.6"
                  />
                ))}
                <circle cx="0" cy="0" r="3" fill="#EA580C" />
              </>
            ) : (
              <>
                <circle cx="0" cy="0" r="9.5" fill={flower.petalColor} />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
                  <circle
                    key={rot}
                    cx={Math.cos((rot * Math.PI) / 180) * 5.2}
                    cy={Math.sin((rot * Math.PI) / 180) * 5.2}
                    r="3.2"
                    fill={flower.accentColor}
                    opacity="0.88"
                  />
                ))}
                <circle cx="0" cy="0" r="3.2" fill="#FEF08A" />
              </>
            )}
          </g>
        ))}
      </g>
    );
  };

  const renderOrnaments = () => {
    switch (design.ornamentId) {
      case 'lucky-coins':
        return (
          <g>
            {[-18, 0, 18].map((dx, i) => (
              <g key={i} transform={`translate(${100 + dx}, ${139 - (i === 1 ? -2 : 0)})`}>
                <circle cx="0" cy="0" r="6" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1" />
                <circle cx="0" cy="0" r="3.2" fill="none" stroke="#B45309" strokeWidth="0.8" />
              </g>
            ))}
            <line x1="94" y1="125" x2="87" y2="75" stroke="#D97706" strokeWidth="1.6" />
            <line x1="106" y1="125" x2="113" y2="75" stroke="#D97706" strokeWidth="1.6" />
            <circle cx="87" cy="74" r="2" fill="#FB7185" />
            <circle cx="113" cy="74" r="2" fill="#FB7185" />
          </g>
        );

      case 'sparkler':
        return (
          <g>
            <line x1="118" y1="126" x2="132" y2="76" stroke="#CBD5E1" strokeWidth="1.8" />
            <g className={animateFlame ? 'animate-flame-flicker' : ''}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <line
                  key={ang}
                  x1="132"
                  y1="76"
                  x2={132 + Math.cos((ang * Math.PI) / 180) * 11}
                  y2={76 + Math.sin((ang * Math.PI) / 180) * 11}
                  stroke="#FDE047"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="132" cy="76" r="3" fill="#FFFFFF" />
            </g>
            <line x1="92" y1="125" x2="88" y2="78" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="88" cy="77" r="1.8" fill="#F87171" />
          </g>
        );

      case 'mini-lantern':
        return (
          <g>
            <path d="M 74 128 Q 74 82 100 72" fill="none" stroke="#D97706" strokeWidth="1.8" />
            <rect x="65" y="92" width="14" height="18" rx="4" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
            <line x1="72" y1="92" x2="72" y2="110" stroke="#B45309" strokeWidth="0.9" />
            <line x1="72" y1="110" x2="72" y2="116" stroke="#F43F5E" strokeWidth="1.5" />
            <line x1="108" y1="125" x2="114" y2="78" stroke="#92400E" strokeWidth="1.5" />
            <circle cx="114" cy="77" r="1.8" fill="#FB7185" />
          </g>
        );

      case 'paper-umbrella':
        return (
          <g>
            {/* Lanna paper umbrella */}
            <line x1="76" y1="128" x2="64" y2="78" stroke="#92400E" strokeWidth="1.8" />
            <path
              d="M 44 88 Q 64 65 86 78 Q 68 85 44 88 Z"
              fill="#F43F5E"
              stroke="#FEF08A"
              strokeWidth="1"
            />
            <circle cx="64" cy="73" r="2.2" fill="#FDE047" />
            {/* Incense */}
            <line x1="106" y1="125" x2="113" y2="78" stroke="#92400E" strokeWidth="1.5" />
            <circle cx="113" cy="77" r="1.8" fill="#FB7185" />
          </g>
        );

      case 'gold-leaf':
        return (
          <g>
            {/* Baisri golden spires on left & right */}
            <path d="M 72 128 L 78 86 L 86 128 Z" fill={`url(#goldGrad-${uid})`} stroke="#FEF08A" strokeWidth="0.9" />
            <path d="M 114 128 L 122 86 L 128 128 Z" fill={`url(#goldGrad-${uid})`} stroke="#FEF08A" strokeWidth="0.9" />
            <circle cx="78" cy="84" r="2.2" fill="#FFFFFF" />
            <circle cx="122" cy="84" r="2.2" fill="#FFFFFF" />
            {/* Incense */}
            <line x1="94" y1="124" x2="90" y2="73" stroke="#B45309" strokeWidth="1.5" />
            <line x1="106" y1="124" x2="110" y2="73" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="90" cy="72" r="1.8" fill="#FB7185" />
            <circle cx="110" cy="72" r="1.8" fill="#FB7185" />
          </g>
        );

      case 'incense-garland':
      default:
        return (
          <g>
            <line x1="93" y1="124" x2="87" y2="70" stroke="#B45309" strokeWidth="1.7" />
            <line x1="100" y1="124" x2="100" y2="66" stroke="#B45309" strokeWidth="1.7" />
            <line x1="107" y1="124" x2="113" y2="70" stroke="#B45309" strokeWidth="1.7" />
            <circle cx="87" cy="69" r="2" fill="#FB7185" />
            <circle cx="100" cy="65" r="2" fill="#FB7185" />
            <circle cx="113" cy="69" r="2" fill="#FB7185" />
            <path
              d="M 74 134 Q 100 152 126 134"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4.2"
              strokeDasharray="1 5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="144" r="3.5" fill="#F43F5E" />
          </g>
        );
    }
  };

  const renderSingleFlame = (cx: number, cy: number) => (
    <g className={animateFlame ? 'animate-flame-flicker' : ''}>
      <circle cx={cx} cy={cy - 7} r="16" fill={`url(#flameAura-${uid})`} />
      <path
        d={`M ${cx} ${cy - 22} C ${cx + 7} ${cy - 13}, ${cx + 7} ${cy - 1}, ${cx} ${cy + 1} C ${cx - 7} ${cy - 1}, ${cx - 7} ${cy - 13}, ${cx} ${cy - 22} Z`}
        fill="#F97316"
      />
      <path
        d={`M ${cx} ${cy - 17} C ${cx + 4} ${cy - 11}, ${cx + 4} ${cy - 3}, ${cx} ${cy - 1} C ${cx - 4} ${cy - 3}, ${cx - 4} ${cy - 11}, ${cx} ${cy - 17} Z`}
        fill={candle.flameTint}
      />
      <ellipse cx={cx} cy={cy - 6} rx="1.8" ry="3.4" fill="#FFFFFF" />
    </g>
  );

  const renderCandle = () => {
    if (design.candleId === 'twin-love') {
      return (
        <g>
          <rect x="89" y="92" width="7" height="32" rx="3" fill="#FBBF24" stroke="#FEF3C7" strokeWidth="0.7" />
          <rect x="104" y="92" width="7" height="32" rx="3" fill="#FB7185" stroke="#FCE7F3" strokeWidth="0.7" />
          <line x1="92.5" y1="92" x2="92.5" y2="87" stroke="#1E293B" strokeWidth="1.3" />
          <line x1="107.5" y1="92" x2="107.5" y2="87" stroke="#1E293B" strokeWidth="1.3" />
          {renderSingleFlame(92.5, 86)}
          {renderSingleFlame(107.5, 86)}
        </g>
      );
    }

    return (
      <g>
        {design.candleId === 'lotus-candle' ? (
          <g>
            <path
              d="M 91 124 Q 88 106 100 100 Q 112 106 109 124 Z"
              fill={candle.waxColor}
              stroke="#FBCFE8"
              strokeWidth="1"
            />
            <rect x="97.5" y="92" width="5" height="10" rx="2" fill="#FCE7F3" />
          </g>
        ) : design.candleId === 'twisted-thai' ? (
          <g>
            <rect x="95.5" y="88" width="9" height="36" rx="3" fill={candle.waxColor} />
            <path
              d="M 95.5 96 L 104.5 101 M 95.5 106 L 104.5 111 M 95.5 116 L 104.5 121"
              stroke="#FEF08A"
              strokeWidth="1.8"
            />
          </g>
        ) : (
          <rect
            x="96"
            y="88"
            width="8"
            height="36"
            rx="3"
            fill={candle.waxColor}
            stroke="#FEF3C7"
            strokeWidth="0.7"
          />
        )}

        <line x1="100" y1="88" x2="100" y2="83" stroke="#1E293B" strokeWidth="1.5" />
        {renderSingleFlame(100, 83)}
      </g>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_CLASSES[size]} ${className}`}
    >
      {isHighlighted && (
        <div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 28px 6px ${glow.hex}66`,
          }}
        />
      )}

      {showWaterRipple && (
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <ellipse
            cx="100"
            cy="150"
            rx="66"
            ry="18"
            fill="none"
            stroke={glow.hex}
            strokeWidth="1.5"
            opacity="0.4"
            className="animate-ripple-expand"
            style={{ transformOrigin: '100px 150px' }}
          />
          <ellipse
            cx="100"
            cy="150"
            rx="54"
            ry="13"
            fill={glow.hex}
            opacity="0.14"
          />
        </svg>
      )}

      <svg
        viewBox="0 0 200 185"
        className="w-full h-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)]"
        role="img"
        aria-label="กระทงตกแต่ง"
      >
        <defs>
          <linearGradient id={`leafGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id={`lotusGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
          <linearGradient id={`whiteLotusGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id={`goldGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id={`cornGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id={`cocoGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id={`breadGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id={`koiGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id={`iceGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <radialGradient id={`flameAura-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glow.hex} stopOpacity="0.6" />
            <stop offset="100%" stopColor={glow.hex} stopOpacity="0" />
          </radialGradient>
        </defs>

        {renderOrnaments()}
        {renderCandle()}
        {renderBase()}
        {renderFlowers()}
      </svg>
    </div>
  );
};
