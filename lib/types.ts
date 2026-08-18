// Core type definitions for the local marketplace

export type UUID = string;
export type ISODate = string;

// User profile
export interface Profile {
  id: UUID;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location_state: string | null;
  location_lga: string | null;
  latitude: number | null;
  longitude: number | null;
  bio: string | null;
  preferred_language: LanguageCode;
  is_seller: boolean;
  is_admin: boolean;
  stripe_account_id: string | null;
  created_at: ISODate;
}

// Languages supported
export type LanguageCode = 'en' | 'pcm' | 'yo' | 'ha' | 'ig';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

// Categories
export interface Category {
  id: UUID;
  name: Record<LanguageCode, string>;
  slug: string;
  parent_id: UUID | null;
  icon: string;
  sort_order: number;
  children?: Category[];
}

// Listings
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'expired';

export interface Listing {
  id: UUID;
  user_id: UUID;
  category_id: UUID;
  title: string;
  title_i18n: Record<LanguageCode, string> | null;
  description: string;
  description_i18n: Record<LanguageCode, string> | null;
  price: number | null;
  price_negotiable: boolean;
  currency: string;
  images: string[];
  location_state: string | null;
  location_lga: string | null;
  location_address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  admin_note: string | null;
  views_count: number;
  is_featured: boolean;
  expires_at: ISODate | null;
  created_at: ISODate;
  updated_at: ISODate;
  // Joined data
  profile?: Profile;
  category?: Category;
}

// Conversations & Messages
export interface Conversation {
  id: UUID;
  listing_id: UUID | null;
  buyer_id: UUID;
  seller_id: UUID;
  last_message_at: ISODate | null;
  created_at: ISODate;
  listing?: Listing;
  buyer?: Profile;
  seller?: Profile;
  unread_count?: number;
}

export interface Message {
  id: UUID;
  conversation_id: UUID;
  sender_id: UUID;
  content: string;
  is_read: boolean;
  created_at: ISODate;
  sender?: Profile;
}

// Transactions
export type TransactionStatus =
  | 'pending'
  | 'escrow'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded';

export interface Transaction {
  id: UUID;
  listing_id: UUID | null;
  buyer_id: UUID;
  seller_id: UUID;
  amount: number;
  commission_amount: number;
  stripe_payment_intent: string | null;
  stripe_transfer_id: string | null;
  status: TransactionStatus;
  created_at: ISODate;
  listing?: Listing;
  buyer?: Profile;
  seller?: Profile;
}

// Reviews
export interface Review {
  id: UUID;
  reviewer_id: UUID;
  reviewed_id: UUID;
  transaction_id: UUID;
  rating: number; // 1-5
  comment: string | null;
  created_at: ISODate;
  reviewer?: Profile;
}

// Reports
export type ReportStatus = 'open' | 'reviewed' | 'resolved';

export interface Report {
  id: UUID;
  reporter_id: UUID;
  listing_id: UUID | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  admin_id: UUID | null;
  created_at: ISODate;
  listing?: Listing;
  reporter?: Profile;
}

// Translations
export interface Translation {
  id: UUID;
  language_code: LanguageCode;
  key: string;
  value: string;
}

// Search filters
export interface SearchFilters {
  query?: string;
  category?: string;
  state?: string;
  lga?: string;
  minPrice?: number;
  maxPrice?: number;
  negotiable?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'nearest';
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

// Nigerian States
export interface NigerianState {
  name: string;
  code: string;
  lgAs: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
