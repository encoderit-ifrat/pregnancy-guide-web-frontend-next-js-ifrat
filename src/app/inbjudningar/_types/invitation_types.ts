export type InvitationTemplate =
  | string
  | "scandinavian_minimal"
  | "baby_pink"
  | "neutral_beige"
  | "elegant_lavender"
  | "custom";

export type InvitationStatus = "draft" | "scheduled" | "sent";

export type DeliveryOption = "email" | "share_link" | "download_card";

export type RsvpStatus = "pending" | "viewed" | "accepted" | "declined";

export interface InvitationStatistics {
  total_sent: number;
  viewed: number;
  accepted: number;
  declined: number;
  pending: number;
}

export interface InvitationGuest {
  _id: string;
  invitation: string;
  name: string;
  email: string;
  rsvp_status: RsvpStatus;
  token: string;
  viewed_at: string | null;
  responded_at: string | null;
}

export interface EventInvitation {
  _id: string;
  host: string;
  title: string;
  subtitle: string | null;
  message: string | null;
  rsvp_rate?: number | string;
  event_date: string | null;
  event_time: string | null;
  reply_by: string | null;
  location: string | null;
  template: InvitationTemplate;
  cover_image: string | null;
  wishlist: string | null;
  status: InvitationStatus;
  scheduled_at: string | null;
  delivery_options: DeliveryOption[];
  share_token: string;
  sent_at: string | null;
  createdAt?: string;
}

export interface EventInvitationListItem extends EventInvitation {
  wishlist_attached: boolean;
  statistics: InvitationStatistics;
  rsvp_rate: number;
}

export interface EventInvitationDetail extends EventInvitation {
  guests: InvitationGuest[];
  statistics: InvitationStatistics;
}

export interface InvitationTemplateMeta {
  _id: InvitationTemplate;
  name: string;
  preview_url: string;
  slug: string;
  description: string;
}

export type Recipient = {
  name: string;
  email: string;
};

export type CreateInvitationPayload = {
  title: string;
  subtitle?: string;
  message?: string;
  event_date?: string;
  event_time?: string;
  reply_by?: string;
  location?: string;
  template?: InvitationTemplate;
  cover_image?: string;
  wishlist?: string;
  delivery_options?: DeliveryOption[];
  recipients?: Recipient[];
  status?: InvitationStatus;
};

export interface PublicInvitationView {
  invitation: {
    _id: string;
    title: string;
    subtitle: string | null;
    message: string | null;
    event_date: string | null;
    event_time: string | null;
    reply_by: string | null;
    location: string | null;
    template: InvitationTemplate;
    cover_image: string | null;
    has_wishlist: boolean;
  };
  guest: { name: string; rsvp_status: RsvpStatus; token: string } | null;
}
