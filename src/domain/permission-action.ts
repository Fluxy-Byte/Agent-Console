/// Espelho de Agent-Api/src/domain/enums/permission-action.ts — mudar um lado
/// exige mudar o outro manualmente (não há geração de tipos compartilhada
/// entre os repositórios).
export enum PermissionAction {
  AGENTS_VIEW = "AGENTS_VIEW",
  AGENTS_WRITE = "AGENTS_WRITE",
  WABAS_VIEW = "WABAS_VIEW",
  WABAS_WRITE = "WABAS_WRITE",
  SERVICE_ISLANDS_VIEW = "SERVICE_ISLANDS_VIEW",
  SERVICE_ISLANDS_WRITE = "SERVICE_ISLANDS_WRITE",
  QUEUES_VIEW = "QUEUES_VIEW",
  QUEUES_WRITE = "QUEUES_WRITE",
  CONTACTS_VIEW = "CONTACTS_VIEW",
  CONTACTS_WRITE = "CONTACTS_WRITE",
  CAMPAIGNS_VIEW = "CAMPAIGNS_VIEW",
  CAMPAIGNS_WRITE = "CAMPAIGNS_WRITE",
  ACCESS_VIEW = "ACCESS_VIEW",
  ACCESS_WRITE = "ACCESS_WRITE",
  COMPANIES_MANAGE_OWN = "COMPANIES_MANAGE_OWN",
  COMPANIES_MANAGE_ALL = "COMPANIES_MANAGE_ALL",
}

export type MemberRole = "GERENTE" | "SUPERVISOR" | "ATENDENTE";

export const PERMISSION_MATRIX: Record<MemberRole, PermissionAction[]> = {
  ATENDENTE: [PermissionAction.CONTACTS_VIEW],
  SUPERVISOR: [
    PermissionAction.CONTACTS_VIEW,
    PermissionAction.CONTACTS_WRITE,
    PermissionAction.QUEUES_VIEW,
    PermissionAction.QUEUES_WRITE,
    PermissionAction.CAMPAIGNS_VIEW,
    PermissionAction.CAMPAIGNS_WRITE,
  ],
  GERENTE: [
    PermissionAction.AGENTS_VIEW,
    PermissionAction.AGENTS_WRITE,
    PermissionAction.WABAS_VIEW,
    PermissionAction.WABAS_WRITE,
    PermissionAction.SERVICE_ISLANDS_VIEW,
    PermissionAction.SERVICE_ISLANDS_WRITE,
    PermissionAction.QUEUES_VIEW,
    PermissionAction.QUEUES_WRITE,
    PermissionAction.CONTACTS_VIEW,
    PermissionAction.CONTACTS_WRITE,
    PermissionAction.CAMPAIGNS_VIEW,
    PermissionAction.CAMPAIGNS_WRITE,
    PermissionAction.ACCESS_VIEW,
    PermissionAction.ACCESS_WRITE,
    PermissionAction.COMPANIES_MANAGE_OWN,
  ],
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  GERENTE: "Gerente",
  SUPERVISOR: "Supervisor",
  ATENDENTE: "Atendente",
};
