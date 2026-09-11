import { Bot, Contact, KeyRound, Megaphone, MessageCircleMore, Network } from "lucide-react";
import { PermissionAction } from "@/domain/permission-action";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof Bot;
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
      { label: "Contatos", to: "/targets", icon: Contact, action: PermissionAction.CONTACTS_VIEW },
      { label: "Campanhas", to: "/campaigns", icon: Megaphone, action: PermissionAction.CAMPAIGNS_VIEW },
    ],
  },
  {
    label: "Configurações para WhatsApp",
    items: [
      { label: "Agentes", to: "/agents", icon: Bot, action: PermissionAction.AGENTS_VIEW },
      { label: "WhatsApp Channel", to: "/wc", icon: MessageCircleMore, action: PermissionAction.WABAS_VIEW },
      { label: "Ilhas de Atendimento", to: "/service-island", icon: Network, action: PermissionAction.SERVICE_ISLANDS_VIEW },
    ],
  },
  {
    label: "Configurações",
    items: [{ label: "Acessos", to: "/access", icon: KeyRound, action: PermissionAction.ACCESS_VIEW }],
  },
];
