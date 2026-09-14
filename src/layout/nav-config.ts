import { BarChart3, BrainCircuit, Headset, KeyRound, Megaphone, Network, UserGroup } from "lucide-react";
import { PermissionAction } from "@/domain/permission-action";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof BrainCircuit;
  action: PermissionAction;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operações",
    items: [
      { label: "Contatos", to: "/targets", icon: UserGroup, action: PermissionAction.CONTACTS_VIEW },
      { label: "Campanhas", to: "/campaigns", icon: Megaphone, action: PermissionAction.CAMPAIGNS_VIEW },
      { label: "Métricas", to: "/reports", icon: BarChart3, action: PermissionAction.REPORTS_VIEW },
    ],
  },
  {
    label: "Configurações para WhatsApp",
    items: [
      { label: "Agentes de IA", to: "/agents", icon: BrainCircuit, action: PermissionAction.AGENTS_VIEW },
      { label: "Redes Sociais", to: "/wc", icon: Network, action: PermissionAction.WABAS_VIEW },
      { label: "Ilhas de Atendimento", to: "/service-island", icon: Headset, action: PermissionAction.SERVICE_ISLANDS_VIEW },
    ],
  },
  {
    label: "Configurações",
    items: [{ label: "Acessos", to: "/access", icon: KeyRound, action: PermissionAction.ACCESS_VIEW }],
  },
];
