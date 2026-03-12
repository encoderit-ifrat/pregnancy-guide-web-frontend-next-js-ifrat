export interface Invitation {
  _id: string;
  inviter: string;
  email: string;
  invitation_type: string;
  status: "pending" | "accepted" | "cancelled";
  accepted_at: string | null;
  createdAt: string;
  updatedAt: string;
  token?: string;
}

export interface InvitationsResponse {
  success: boolean;
  message: string;
  data: Invitation[];
}

export interface InvitationCreateRequest {
  email: string;
  invitation_type: string;
}

export interface InvitationCreateResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    data: Invitation;
  };
}
