import type { MemberRole } from "../domain/permission-action";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: string | null;
  hasApiAccessToken: boolean;
}

export interface InvitationMember {
  id: string;
  organizationId: string;
  code: string;
  email: string;
  role: MemberRole;
  finish: boolean;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
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
  blockedMessage: string;
  outOfHoursMessage: string;
  outOfHoursEnabled: boolean;
  closingMessage: string;
  closingEnabled: boolean;
  errorMessage: string;
  errorEnabled: boolean;
  defaultQueueId: string | null;
  personality: string | null;
  ragEnabled: boolean;
  ragChunkSize: number | null;
  /// 6 primeiros chars do token decifrado, só pra confirmação visual — nunca
  /// o token completo. null quando nenhum token está configurado.
  openaiTokenPreview: string | null;
  geminiTokenPreview: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RagDocumentStatus = "PROCESSING" | "READY" | "FAILED";

export interface RagDocument {
  id: string;
  agentId: string;
  fileName: string;
  categories: string[];
  chunkSize: number;
  status: RagDocumentStatus;
  chunkCount: number | null;
  errorMessage: string | null;
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
  hasMetaAccessToken: boolean;
  createdAt: string;
  updatedAt: string;
  serviceIsland?: ServiceIsland | null;
  agent?: Agent;
}

export interface WhatsappChannelStatus {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
  status?: string;
  quality_rating?: string;
  name_status?: string;
  code_verification_status?: string;
  messaging_limit_tier?: string;
  throughput?: { level?: string };
}

export interface MonthlyConversations {
  year: number;
  months: { month: number; count: number }[];
}

export interface MonthlyMessageVolume {
  year: number;
  months: { month: number; sent: number; received: number }[];
}

export interface TicketCloseTag {
  id: string;
  serviceIslandId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceIsland {
  id: string;
  organizationId: string;
  whatsappChannelId: string;
  name: string;
  requireCloseTag: boolean;
  allowActiveDispatch: boolean;
  createdAt: string;
  updatedAt: string;
  whatsappChannel?: WhatsappChannel;
  queues?: Queue[];
  closeTags?: TicketCloseTag[];
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
  // Só vem preenchido em endpoints que fazem include explícito dos membros
  // (ex: GET /api/service-islands/:id) — tratar sempre como potencialmente
  // ausente.
  members?: QueueMember[];
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
  blockedAgentIds: string[];
  whatsappChannel?: WhatsappChannel & { agent: Agent };
  tickets?: TicketSummary[];
}

export type TicketCloseReason = "RESOLVED" | "TRANSFERRED_QUEUE" | "TRANSFERRED_AGENT" | "SESSION_EXPIRED" | "ABANDONED";

export interface IslandTicket {
  id: string;
  ticketNumber: number;
  status: "WAITING" | "IN_PROGRESS" | "CLOSED";
  closeReason: TicketCloseReason | null;
  target: { id: string; name: string | null; waId: string };
  queue: { id: string; name: string };
  assignedUser: { id: string; name: string; email: string } | null;
  closeTag: { id: string; name: string } | null;
  createdAt: string;
  assignedAt: string | null;
  closedAt: string | null;
  waitDurationMs: number | null;
  handlingDurationMs: number | null;
}

export interface IslandTicketListResult {
  items: IslandTicket[];
  total: number;
  page: number;
  pageSize: number;
}

export interface QueueListResult {
  items: Queue[];
  total: number;
  page: number;
  pageSize: number;
}

export interface QueueStats {
  total: number;
  active: number;
  inactive: number;
}

export interface TicketCloseTagListResult {
  items: TicketCloseTag[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AttendantSummary {
  userId: string;
  name: string;
  email: string;
  queueName: string;
  status: "ONLINE" | "PAUSED" | "OFFLINE";
  statusUpdatedAt: string | null;
  ticketCount: number;
}

export interface IslandMonitoring {
  queues: { queueId: string; queueName: string; waitingCount: number; inProgressCount: number }[];
  attendants: { online: number; paused: number; offline: number; total: number; list: AttendantSummary[] };
  waitingTickets: IslandTicket[];
  inProgressTickets: IslandTicket[];
}

export interface TicketHistoryStats {
  total: number;
  concluded: number;
  canceled: number;
  inProgress: number;
}

export interface TicketDetail {
  id: string;
  ticketNumber: number;
  status: "WAITING" | "IN_PROGRESS" | "CLOSED";
  closeReason: TicketCloseReason | null;
  target: { id: string; name: string | null; waId: string; email: string | null; metadata: Record<string, unknown> | null };
  queue: { id: string; name: string };
  assignedUser: { id: string; name: string; email: string } | null;
  closeTag: { id: string; name: string } | null;
  createdAt: string;
  assignedAt: string | null;
  closedAt: string | null;
  waitDurationMs: number | null;
  handlingDurationMs: number | null;
  messagingSession: { id: string; lastCustomerMessageAt: string };
  history: MessageDocument[];
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
  senderType: "CUSTOMER" | "AGENT_AI" | "ATTENDANT" | "SYSTEM" | "CAMPAIGN";
  messageType: MessageType;
  text?: string;
  mediaUrl?: string;
  campaignId?: string;
  templateName?: string;
  createdAt: string;
}

export type TemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

export interface TemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: string;
  text?: string;
  buttons?: { type: string; text: string }[];
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: string;
  components: TemplateComponent[];
  variableCount: { header: number; body: number };
}

export type CampaignStatus = "PROCESSING" | "COMPLETED";
export type CampaignDispatchType = "CSV" | "MANUAL";

export interface CampaignListItem {
  id: string;
  name: string;
  category: TemplateCategory | null;
  templateName: string;
  status: CampaignStatus;
  dispatchType: CampaignDispatchType;
  expectedContacts: number;
  totalContacts: number;
  totalSent: number;
  totalFailures: number;
  whatsappChannelId: string;
  whatsappChannelDisplayNumber: string;
  agentId: string;
  agentName: string;
  createdByName: string | null;
  createdByEmail: string | null;
  sentAt: string;
}

export interface CampaignTargetItem {
  id: string;
  targetId: string;
  targetName: string | null;
  targetPhone: string | null;
  status: string;
  messageId: string | null;
  variables: { header?: { text: string }[]; body?: { text: string }[]; button?: { text: string }[] } | null;
  createdAt: string;
}

export interface CampaignStats {
  totalCampaigns: number;
  completedCampaigns: number;
  totalMessagesSent: number;
  totalFailures: number;
  uniqueContacts: number;
}

export interface CampaignFilterOptions {
  templates: string[];
}

export interface TargetStats {
  total: number;
  active: number;
  interactionsToday: number;
  lastInteractionAt: string | null;
  primaryAgentName: string | null;
}

export interface CampaignDetail extends CampaignListItem {
  targets: CampaignTargetItem[];
}

export interface CampaignListResult {
  items: CampaignListItem[];
  total: number;
  page: number;
  pageSize: number;
}
