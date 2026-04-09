export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface JwtClaims {
  sub: string;
  preferred_username: string;
  email: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [clientId: string | 'account']: {
      roles: string[];
    };
  };
  scope: string;
  authorities: Permission[];
  exp: number;
}

export interface AuthUser {
  sub: string;
  preferred_username: string;
  email: string;
  authorities: Permission[];
}

export type Permission =
  | "ticket:create"
  | "ticket:read"
  | "ticket:update"
  | "ticket:comment"
  | "document:upload"
  | "document:read"
  | "document:download"
  | "notification:read";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Ticket {
  id: string;
  title: string;

  description: string;
  status: TicketStatus;
  priority: TicketPriority;

  createdAt: string;
  updatedAt: string;

  createdBy: string;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorSub: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface CreateCommentPayload {
  body: string;
}

export type DocumentKind =
  | "ATTESTATION_LOGEMENT"
  | "ATTESTATION_VIREMENT"
  | "JUSTIFICATIF"
  | "AUTRE";

export interface DocumentItem {
  id: string;
  name: string;
  kind: DocumentKind;

  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  downloadUrl: string;
}

export interface UploadDocumentPayload {
  name: string;
  kind: DocumentKind;
}

export type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  body: string;

  read: boolean;
  createdAt: string;
}

export interface MockUserProfile {
  id: string;
  label: string;
  claims: JwtClaims;
}
