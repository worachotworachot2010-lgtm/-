import {
  BaseId,
  CandleId,
  FlowerId,
  GlowColor,
  KrathongDesign,
  OrnamentId,
  PierId,
  WishCategory,
} from '../types/krathong';

export interface BaseOption {
  id: BaseId;
  name: string;
  material: string;
  ecoNote: string;
  meaning: string;
}

export interface FlowerOption {
  id: FlowerId;
  name: string;
  meaning: string;
  petalColor: string;
  accentColor: string;
}

export interface CandleOption {
  id: CandleId;
  name: string;
  styleNote: string;
  waxColor: string;
  flameTint: string;
}

export interface OrnamentOption {
  id: OrnamentId;
  name: string;
  meaning: string;
}

export interface GlowOption {
  id: GlowColor;
  name: string;
  hex: string;
  ringClass: string;
}

export interface WishCategoryOption {
  id: WishCategory;
  name: string;
  blessingHint: string;
}

export interface PierOption {
  id: PierId;
  name: string;
  province: string;
}

export const KRATHONG_LIFESPAN_MS = 24 * 60 * 60 * 1000;

export const KRATHONG_BASES: BaseOption[] = [
  {
    id: 'banana-leaf',
    name: 'กระทงใบตองกลีบผกา',
    material: 'หยวกกล้วยและใบตองสด',
    ecoNote: 'ย่อยสลายตามธรรมชาติ',
    meaning: 'คลาสสิกวิถีไทย ประณีตด้วยกลีบใบตองพับซ้อนสมดุล สื่อถึงความสงบร่มเย็น',
  },
  {
    id: 'lotus-pink',
    name: 'กระทงดอกบัวหลวง',
    material: 'กลีบบัวสัตตบงกช',
    ecoNote: 'เป็นมิตรต่อสายน้ำ',
    meaning: 'สัญลักษณ์แห่งความบริสุทธิ์ สติปัญญา และความเจริญงอกงามทางจิตใจ',
  },
  {
    id: 'lotus-white',
    name: 'กระทงดอกบัวขาวบริสุทธิ์',
    material: 'กลีบบัวขาวขลิบทอง',
    ecoNote: 'ย่อยสลายตามธรรมชาติ',
    meaning: 'จิตใจที่ผ่องแผ้ว สงบเย็น และปราศจากความทุกข์กังวล',
  },
  {
    id: 'golden-swan',
    name: 'กระทงหงส์ทองสุวรรณหงส์',
    material: 'กาบกล้วยแกะสลักลายทอง',
    ecoNote: 'งานหัตถศิลป์ไทย',
    meaning: 'สง่างามดั่งเรือพระที่นั่งสุวรรณหงส์ เสริมบารมีและความสำเร็จอันสูงส่ง',
  },
  {
    id: 'naga-boat',
    name: 'กระทงเรือพญานาค',
    material: 'ใบตองและกาบกล้วยมรกต',
    ecoNote: 'บูชาพญานาคราชแห่งสายน้ำ',
    meaning: 'ขอพรความอุดมสมบูรณ์ ความร่มเย็นเป็นสุข และโชคลาภจากลุ่มน้ำ',
  },
  {
    id: 'royal-crown',
    name: 'กระทงทรงฉัตรมงคล',
    material: 'ใบตองซ้อนสามชั้นขลิบทอง',
    ecoNote: 'ย่อยสลายตามธรรมชาติ',
    meaning: 'ความเป็นสิริมงคล ความร่มเย็น และเกียรติยศในหน้าที่การงาน',
  },
  {
    id: 'coconut-shell',
    name: 'กระทงกะลามะพร้าว',
    material: 'กะลามะพร้าวขัดเงา',
    ecoNote: 'นำวัสดุเหลือใช้มาสร้างคุณค่า',
    meaning: 'ความเรียบง่าย มั่นคง แข็งแกร่ง และประคองแสงเทียนได้ยาวนาน',
  },
  {
    id: 'corn-husk',
    name: 'กระทงเปลือกข้าวโพดทอง',
    material: 'เปลือกข้าวโพดอบแห้ง',
    ecoNote: 'วัสดุธรรมชาติรักษ์โลก',
    meaning: 'สื่อถึงความอุดมสมบูรณ์ของพืชพันธุ์ธัญญาหารและความอบอุ่น',
  },
  {
    id: 'bread-turtle',
    name: 'กระทงขนมปังน้องเต่า',
    material: 'ขนมปังอบธรรมชาติ',
    ecoNote: 'เป็นอาหารปลาในแม่น้ำ',
    meaning: 'สื่อถึงการให้อภัย ความเมตตา และอายุยืนยาวดั่งเต่ามงคล',
  },
  {
    id: 'bread-fish',
    name: 'กระทงขนมปังปลาคาร์ปมงคล',
    material: 'ขนมปังธัญพืชปั้นมือ',
    ecoNote: 'เป็นอาหารปลาในสายน้ำ',
    meaning: 'สัญลักษณ์แห่งความมั่งคั่ง ความพากเพียร และความคล่องตัวในชีวิต',
  },
  {
    id: 'crystal-ice',
    name: 'กระทงน้ำแข็งใสคริสตัล',
    material: 'น้ำแข็งแกะสลักบริสุทธิ์',
    ecoNote: 'ละลายกลับสู่สายน้ำ 100%',
    meaning: 'ความใสกระจ่าง ปล่อยวางเรื่องขุ่นมัว ให้ไหลละลายไปกับสายน้ำคงคา',
  },
  {
    id: 'rainbow-tier',
    name: 'กระทงกาบกล้วยเจ็ดสี',
    material: 'กาบกล้วยย้อมสีธรรมชาติ',
    ecoNote: 'ย่อยสลายได้หมดจด',
    meaning: 'สีสันแห่งการเฉลิมฉลอง ความหวังใหม่ และความสดใสตลอดปี',
  },
];

export const FLOWER_OPTIONS: FlowerOption[] = [
  {
    id: 'marigold',
    name: 'ดอกดาวเรืองมงคล',
    meaning: 'เสริมความรุ่งเรือง ก้าวหน้า และโชคลาภสีทอง',
    petalColor: '#F59E0B',
    accentColor: '#FDE047',
  },
  {
    id: 'rose',
    name: 'ดอกกุหลาบแดง',
    meaning: 'ความรักที่อบอุ่น ความเมตตา และความผูกพันมั่นคง',
    petalColor: '#E11D48',
    accentColor: '#FDA4AF',
  },
  {
    id: 'jasmine',
    name: 'ดอกมะลิซ้อนบริสุทธิ์',
    meaning: 'ความกตัญญู จิตใจผ่องใส และความรักของครอบครัว',
    petalColor: '#F8FAFC',
    accentColor: '#D1FAE5',
  },
  {
    id: 'orchid',
    name: 'กล้วยไม้ม่วงสยาม',
    meaning: 'ความสง่างาม ความสำเร็จที่ยั่งยืน และมิตรภาพ',
    petalColor: '#A855F7',
    accentColor: '#E9D5FF',
  },
  {
    id: 'amaranth',
    name: 'บานไม่รู้โรย',
    meaning: 'ความรักและมิตรภาพที่ยั่งยืนไม่เสื่อมคลาย',
    petalColor: '#C026D3',
    accentColor: '#F5D0FE',
  },
  {
    id: 'sunflower',
    name: 'ดอกทานตะวันสดใส',
    meaning: 'พลังใจที่เปี่ยมความหวัง มั่นคง และมองไปข้างหน้าเสมอ',
    petalColor: '#D97706',
    accentColor: '#FACC15',
  },
  {
    id: 'sakura',
    name: 'ดอกซากุระชมพูอ่อน',
    meaning: 'ความอ่อนโยน การเริ่มต้นใหม่ และช่วงเวลาที่งดงาม',
    petalColor: '#F472B6',
    accentColor: '#FCE7F3',
  },
  {
    id: 'champa',
    name: 'ดอกจำปาทอง',
    meaning: 'กลิ่นหอมมงคล เสริมเสน่ห์เมตตาและความเป็นสิริมงคล',
    petalColor: '#EA580C',
    accentColor: '#FDBA74',
  },
];

export const CANDLE_OPTIONS: CandleOption[] = [
  {
    id: 'classic-gold',
    name: 'เทียนขี้ผึ้งสีทอง',
    styleNote: 'ส่องสว่างนิ่งสงบแบบดั้งเดิม',
    waxColor: '#FBBF24',
    flameTint: '#FEF08A',
  },
  {
    id: 'lotus-candle',
    name: 'เทียนหอมทรงดอกบัว',
    styleNote: 'อ่อนช้อย อบอวลด้วยกลิ่นหอมยามค่ำ',
    waxColor: '#F472B6',
    flameTint: '#FDE68A',
  },
  {
    id: 'twisted-thai',
    name: 'เทียนเกลียวประดับทอง',
    styleNote: 'เกลียวประณีต เสริมสิริมงคล',
    waxColor: '#F59E0B',
    flameTint: '#FDBA74',
  },
  {
    id: 'moonbeam',
    name: 'เทียนแสงจันทร์ขาว',
    styleNote: 'ขาวบริสุทธิ์ สว่างนวลตาใต้แสงเพ็ญ',
    waxColor: '#F8FAFC',
    flameTint: '#BAE6FD',
  },
  {
    id: 'emerald-wax',
    name: 'เทียนไขมรกต',
    styleNote: 'เขียวมรกตเย็นตา เสริมความร่มเย็นเป็นสุข',
    waxColor: '#10B981',
    flameTint: '#A7F3D0',
  },
  {
    id: 'twin-love',
    name: 'เทียนคู่เคียงใจ',
    styleNote: 'เทียนคู่ส่องแสงเคียงข้างกัน อธิษฐานความรักและมิตรภาพ',
    waxColor: '#FB7185',
    flameTint: '#FDE047',
  },
];

export const ORNAMENT_OPTIONS: OrnamentOption[] = [
  {
    id: 'incense-garland',
    name: 'ธูป 3 ดอกและพวงมาลัย',
    meaning: 'บูชาพระรัตนตรัยและขอขมาพระแม่คงคาอย่างครบถ้วน',
  },
  {
    id: 'lucky-coins',
    name: 'เหรียญสิริมงคลและพุ่มดอกไม้',
    meaning: 'เสริมโภคทรัพย์ ความอุดมสมบูรณ์ และโชคดี',
  },
  {
    id: 'sparkler',
    name: 'ไฟเย็นประกายดาว',
    meaning: 'จุดประกายความสุข ความหวัง และรอยยิ้มในคืนวันเพ็ญ',
  },
  {
    id: 'mini-lantern',
    name: 'โคมยี่เป็งจิ๋วประดับข้าง',
    meaning: 'ส่องทางสว่างให้ชีวิตราบรื่นตลอดเส้นทาง',
  },
  {
    id: 'paper-umbrella',
    name: 'ร่มกระดาษสาล้านนา',
    meaning: 'ร่มเงาแห่งความสุข ความร่มเย็น และคุ้มครองภัย',
  },
  {
    id: 'gold-leaf',
    name: 'พุ่มบายศรีทอง',
    meaning: 'งานประดิษฐ์ไทยมงคล เสริมขวัญกำลังใจและเกียรติยศ',
  },
];

export const GLOW_OPTIONS: GlowOption[] = [
  {
    id: 'amber',
    name: 'แสงเทียนสีทอง',
    hex: '#F59E0B',
    ringClass: 'ring-amber-400',
  },
  {
    id: 'emerald',
    name: 'แสงมรกตสายน้ำ',
    hex: '#10B981',
    ringClass: 'ring-emerald-400',
  },
  {
    id: 'rose',
    name: 'แสงกลีบบัวชมพู',
    hex: '#F43F5E',
    ringClass: 'ring-rose-400',
  },
  {
    id: 'sky',
    name: 'แสงจันทร์สีฟ้า',
    hex: '#38BDF8',
    ringClass: 'ring-sky-400',
  },
  {
    id: 'violet',
    name: 'แสงม่วงราตรี',
    hex: '#A855F7',
    ringClass: 'ring-purple-400',
  },
  {
    id: 'coral',
    name: 'แสงส้มอัสดง',
    hex: '#FB923C',
    ringClass: 'ring-orange-400',
  },
];

export const WISH_CATEGORIES: WishCategoryOption[] = [
  {
    id: 'apology',
    name: 'ขอขมาพระแม่คงคา',
    blessingHint: 'ขอขมาต่อสายน้ำและเริ่มต้นสิ่งใหม่อันเป็นมงคล',
  },
  {
    id: 'health',
    name: 'สุขภาพแข็งแรง',
    blessingHint: 'ขอให้ตนเองและคนที่รักมีสุขภาพกายใจสมบูรณ์',
  },
  {
    id: 'career',
    name: 'การงานและการเรียน',
    blessingHint: 'ราบรื่น ก้าวหน้า สำเร็จดังตั้งใจ',
  },
  {
    id: 'love',
    name: 'ความรักและครอบครัว',
    blessingHint: 'อบอุ่น เข้าใจ และเคียงข้างกันตลอดไป',
  },
  {
    id: 'fortune',
    name: 'โชคลาภและการเงิน',
    blessingHint: 'คล่องตัว มั่งคั่ง และพบเจอโอกาสดีๆ',
  },
];

export const PIER_OPTIONS: PierOption[] = [
  { id: 'chaophraya', name: 'ท่ามหาราช เจ้าพระยา', province: 'กรุงเทพมหานคร' },
  { id: 'rama8', name: 'สะพานพระราม 8', province: 'กรุงเทพมหานคร' },
  { id: 'ping', name: 'ริมน้ำปิง ยี่เป็ง', province: 'เชียงใหม่' },
  { id: 'mekong', name: 'ริมโขง ลานพญานาค', province: 'หนองคาย' },
];

export const WISH_TEMPLATES: string[] = [
  'ขอขมาพระแม่คงคา และขอให้ทุกข์โศกโรคภัยลอยหายไปกับสายน้ำ มีแต่ความสุขความเจริญตลอดปี',
  'ขอให้ครอบครัวและคนที่รักมีสุขภาพแข็งแรง อยู่เย็นเป็นสุข ราบรื่นในทุกเส้นทาง',
  'ขอให้การงานและการเรียนก้าวหน้า ประสบความสำเร็จ พบเจอผู้คนใจดีและกัลยาณมิตร',
  'ขอให้ความรักมั่นคง เข้าใจกันและกัน เติบโตอย่างอบอุ่นเหมือนแสงจันทร์คืนวันเพ็ญ',
];

export const DEFAULT_DESIGN: KrathongDesign = {
  baseId: 'banana-leaf',
  flowerId: 'marigold',
  candleId: 'classic-gold',
  ornamentId: 'incense-garland',
  glowColor: 'amber',
};
