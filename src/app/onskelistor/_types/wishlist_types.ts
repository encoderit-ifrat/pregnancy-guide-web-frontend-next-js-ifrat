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
  items: WishlistItem[];
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
