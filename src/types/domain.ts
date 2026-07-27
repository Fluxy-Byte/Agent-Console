import type { MemberRole } from "../domain/permission-action";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: string | null;
}

export interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: MemberRole;
  createdAt: string;
  user: { id: string; name: string; email: string; image: string | null };
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  isActive: boolean;
  welcomeMessage: string;
  welcomeEnabled: boolean;
  processingMessage: string;
  transferMessage: string;
  unsupportedFormatMessage: string;
  outOfHoursMessage: string;
  outOfHoursEnabled: boolean;
  closingMessage: string;
  closingEnabled: boolean;
  errorMessage: string;
  errorEnabled: boolean;
  defaultQueueId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappChannel {
  id: string;
  organizationId: string;
  agentId: string;
  phoneNumberId: string;
  displayNumber: string;
  wabaId: string;
  createdAt: string;
  updatedAt: string;
  serviceIsland?: ServiceIsland | null;
  agent?: Agent;
}

export interface ServiceIsland {
  id: string;
  organizationId: string;
  whatsappChannelId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  whatsappChannel?: WhatsappChannel;
  queues?: Queue[];
}

export interface QueueMember {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
}

export interface Queue {
  id: string;
  serviceIslandId: string;
  name: string;
  isActive: boolean;
  businessHoursEnabled: boolean;
  businessHoursStart: string | null;
  businessHoursEnd: string | null;
  businessDays: number[];
  createdAt: string;
  updatedAt: string;
  members: QueueMember[];
}

export type TargetStatus = "AI" | "HUMAN" | "FINISHED";

export interface TicketSummary {
  id: string;
  ticketNumber: number;
  status: "WAITING" | "IN_PROGRESS" | "CLOSED";
  queue: { name: string; serviceIsland: { id: string; name: string } };
  assignedUser: { id: string; name: string; email: string } | null;
  createdAt: string;
  closedAt: string | null;
}

export interface Target {
  id: string;
  organizationId: string;
  whatsappChannelId: string;
  waId: string;
  name: string | null;
  email: string | null;
  metadata: Record<string, unknown> | null;
  status: TargetStatus;
  firstInteractionAt: string;
  lastInteractionAt: string | null;
  whatsappChannel?: WhatsappChannel & { agent: Agent };
  tickets?: TicketSummary[];
}

export interface IslandTicket {
  id: string;
  ticketNumber: number;
  status: "WAITING" | "IN_PROGRESS" | "CLOSED";
  target: { id: string; name: string | null; waId: string };
  queue: { id: string; name: string };
  assignedUser: { id: string; name: string; email: string } | null;
  createdAt: string;
  closedAt: string | null;
}

export interface TargetListResult {
  items: Target[];
  total: number;
  page: number;
  pageSize: number;
}

export type MessageType = "TEXT" | "AUDIO" | "IMAGE" | "DOCUMENT" | "STICKER";

export interface MessageDocument {
  _id: string;
  direction: "INBOUND" | "OUTBOUND";
  senderType: "CUSTOMER" | "AGENT_AI" | "ATTENDANT" | "SYSTEM";
  messageType: MessageType;
  text?: string;
  mediaUrl?: string;
  createdAt: string;
}
