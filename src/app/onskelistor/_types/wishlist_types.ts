import { Paginated } from "@/types/pagination";

export type ClaimStatus = "available" | "claimed";

export interface WishlistProgress {
  claimed: number;
  total: number;
  percentage: number;
}

export interface Wishlist {
  _id: string;
  owner: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  reply_by: string | null;
  share_token: string;
  createdAt?: string;
}

export interface WishlistListItem extends Wishlist {
  progress: WishlistProgress;
}

export interface WishlistItem {
  _id: string;
  wishlist: string;
  title: string;
  quantity: number;
  price: number;
  currency: string;
  product_url: string | null;
  description: string | null;
  category: string | null;
  image: string | null;
  claim_status: ClaimStatus;
  claimed_quantity: number;
  claimed_by?: string | null;
}

export interface WishlistDetail extends Wishlist {
  progress: WishlistProgress;
  items: Paginated<WishlistItem>;
}

export interface PublicWishlistItem {
  _id: string;
  title: string;
  quantity: number;
  price: number;
  currency: string;
  product_url: string | null;
  description: string | null;
  category: string | null;
  image: string | null;
  claim_status: ClaimStatus;
  claimed_by?: string | null;
  claim_message?: string | null;
  claimed_at?: string | null;
}

export interface PublicWishlist {
  _id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  reply_by: string | null;
  share_token: string;
  progress: WishlistProgress;
  items: PublicWishlistItem[];
}

// Member (event-invitation) view. Unlike the anonymous public list, reserved
// items also expose who reserved them and the message they left.
export interface MemberWishlistItem extends PublicWishlistItem {
  claimed_by: string | null;
  claim_message: string | null;
  claimed_at: string | null;
}

export interface MemberWishlist extends Omit<PublicWishlist, "items"> {
  items: MemberWishlistItem[];
}

export type WishlistFormValues = {
  title: string;
  description?: string;
  cover_image?: string | File;
  reply_by?: string;
};

export type WishlistItemFormValues = {
  title: string;
  quantity: number;
  price: number;
  currency?: string;
  product_url?: string;
  description?: string;
  category?: string;
  image?: string;
};
