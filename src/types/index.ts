export type BoxStatus = 'recruiting' | 'full' | 'opening' | 'completed' | 'cancelled';
export type RuleType = 'hidden-first' | 'average' | 'rotation';
export type DeliveryType = 'self' | 'proxy' | 'delivery';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  hiddenCount: number;
}

export interface SeriesStyle {
  id: string;
  name: string;
  image: string;
  isHidden: boolean;
  rarity: 'common' | 'rare' | 'hidden';
}

export interface Series {
  id: string;
  name: string;
  cover: string;
  price: number;
  boxCount: number;
  hiddenName: string;
  hiddenImage: string;
  styles: SeriesStyle[];
  brand: string;
}

export interface BoxMember {
  userId: string;
  nickname: string;
  avatar: string;
  slotNumber: number;
  budget: number;
  isCreator: boolean;
  status: 'pending' | 'paid' | 'confirmed';
  joinedAt: Date;
  deliveryType?: DeliveryType;
}

export interface Box {
  id: string;
  seriesId: string;
  seriesName: string;
  seriesCover: string;
  seriesBrand: string;
  city: string;
  district: string;
  mall: string;
  storeName: string;
  meetTime: Date;
  totalSlots: number;
  joinedSlots: number;
  status: BoxStatus;
  ruleType: RuleType;
  ruleDescription: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  pricePerSlot: number;
  totalPrice: number;
  createdAt: Date;
  expireAt: Date;
  members: BoxMember[];
}

export interface ResultStyle {
  styleId: string;
  styleName: string;
  styleImage: string;
  isHidden: boolean;
  rarity: 'common' | 'rare' | 'hidden';
  slotNumber: number;
}

export interface Assignment {
  userId: string;
  nickname: string;
  avatar: string;
  slotNumber: number;
  styles: ResultStyle[];
}

export interface BoxResult {
  boxId: string;
  styles: ResultStyle[];
  assignments: Assignment[];
  revealedAt: Date;
}

export interface ChatMessage {
  id: string;
  boxId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: Date;
}

export interface GotStyle {
  name: string;
  image: string;
  isHidden: boolean;
  rarity: 'common' | 'rare' | 'hidden';
}

export interface HistoryRecord {
  id: string;
  boxId: string;
  seriesName: string;
  seriesCover: string;
  date: Date;
  mall: string;
  gotStyles: GotStyle[];
  totalSpent: number;
  hasHidden: boolean;
  ruleType: RuleType;
}

export interface CityOption {
  name: string;
  districts: DistrictOption[];
}

export interface DistrictOption {
  name: string;
  malls: MallOption[];
}

export interface MallOption {
  name: string;
  stores: string[];
}

export interface CreateBoxForm {
  city: string;
  district: string;
  mall: string;
  storeName: string;
  seriesId: string;
  meetTime: Date | null;
  ruleType: RuleType;
  totalSlots: number;
  pricePerSlot: number;
}
