export type AppStep = 'start' | 'select' | 'decorate' | 'wish' | 'river';

export type BaseId =
  | 'banana-leaf'
  | 'lotus-pink'
  | 'coconut-shell'
  | 'bread-turtle'
  | 'crystal-ice'
  | 'rainbow-tier'
  | 'golden-swan'
  | 'naga-boat'
  | 'corn-husk'
  | 'lotus-white'
  | 'royal-crown'
  | 'bread-fish';

export type FlowerId =
  | 'marigold'
  | 'rose'
  | 'jasmine'
  | 'orchid'
  | 'amaranth'
  | 'sunflower'
  | 'sakura'
  | 'champa';

export type CandleId =
  | 'classic-gold'
  | 'lotus-candle'
  | 'twisted-thai'
  | 'moonbeam'
  | 'emerald-wax'
  | 'twin-love';

export type OrnamentId =
  | 'incense-garland'
  | 'lucky-coins'
  | 'sparkler'
  | 'mini-lantern'
  | 'paper-umbrella'
  | 'gold-leaf';

export type GlowColor = 'amber' | 'emerald' | 'rose' | 'sky' | 'violet' | 'coral';

export type WishCategory = 'career' | 'love' | 'health' | 'fortune' | 'apology';

export type PierId = 'chaophraya' | 'rama8' | 'ping' | 'mekong';

export interface KrathongDesign {
  baseId: BaseId;
  flowerId: FlowerId;
  candleId: CandleId;
  ornamentId: OrnamentId;
  glowColor: GlowColor;
}

export interface KrathongRecord {
  id: string;
  authorId: string;
  senderName: string;
  wish: string;
  category: WishCategory;
  pier: PierId;
  baseId: BaseId;
  flowerId: FlowerId;
  candleId: CandleId;
  ornamentId: OrnamentId;
  glowColor: GlowColor;
  laneY: number;
  startOffset: number;
  driftSpeed: number;
  blessingsCount: number;
  visibility: 'public';
  createdAtMs: number;
}
