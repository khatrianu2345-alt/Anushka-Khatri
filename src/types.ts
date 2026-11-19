export type CategorySlug =
  | 'all'
  | 'birthday'
  | 'anniversary'
  | 'custom-boxes'
  | 'same-day'
  | 'flowers'
  | 'cakes'
  | 'combos'
  | 'chocolates'
  | 'under-999';

export type GridFilterTab =
  | 'all'
  | 'bestsellers'
  | 'flowers-cakes'
  | 'personalised'
  | 'under-1000';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export type ProductBadge =
  | 'BESTSELLER'
  | 'PERSONALISE IT!'
  | '60 MIN DELIVERY'
  | 'STUDENT PICK';

export interface Product {
  id: string;
  title: string;
  shortDesc: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: ProductBadge;
  deliveryText: string;
  expressEligible: boolean;
  categories: CategorySlug[];
  occasions: string[];
  recipients: string[];
  feelings: string[];
  isBestseller: boolean;
  isPersonalizable: boolean;
  defaultBoxColorId: string;
  defaultThemeId: string;
}

export interface LocationHub {
  id: string;
  pincode: string;
  area: string;
  city: string;
  deliverySpeed: string;
  expressMinutes: number;
  isDehradun: boolean;
}

export interface BoxColorOption {
  id: string;
  name: string;
  outerHex: string;
  innerHex: string;
  lidHex: string;
  ribbonHex: string;
  textHex: string;
  accentHex: string;
}

export interface BoxThemeOption {
  id: string;
  name: string;
  description: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  shortLabel: string;
}

export interface PresetMemoryPhoto {
  id: string;
  label: string;
  caption: string;
  image: string;
}

export interface CustomBoxConfig {
  boxColorId: string;
  themeId: string;
  recipientName: string;
  messageCard: string;
  photoUrl: string | null;
  photoLabel: string;
  addOnIds: string[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  customization: CustomBoxConfig | null;
  unitPrice: number;
}

export interface DeliverySlot {
  id: 'express-60' | 'same-day' | 'midnight';
  label: string;
  sublabel: string;
  fee: number;
}

export interface OrderRecord {
  orderId: string;
  recipientName: string;
  phone: string;
  address: string;
  pincode: string;
  slot: DeliverySlot;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  placedAt: string;
}
