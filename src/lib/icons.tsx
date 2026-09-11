// Camada de compatibilidade Lucide → Lineicons.
//
// O app inteiro trocou de biblioteca de ícones (lucide-react → lineicons-react)
// a pedido do usuário. Em vez de editar cada uso individual nos ~40 arquivos
// que importavam ícones, esse módulo reexporta o ícone equivalente do
// lineicons-react com o MESMO NOME que o ícone tinha no lucide-react — os
// arquivos consumidores só trocam o import de "lucide-react" pra "@/lib/icons",
// sem tocar em nenhum uso (`<Bot className="size-5" />` continua funcionando
// igual).
//
// Cada ícone já sai com a classe "li-icon" aplicada — ver a regra
// `.li-icon path { fill: currentColor }` em src/index.css: diferente do
// Lucide, os SVGs do lineicons-react vêm com a cor do path fixa (não usam
// currentColor), então sem essa classe o ícone ignoraria completamente
// classes de cor como text-primary/text-destructive.
//
// Limitações do plano gratuito do lineicons-react (só ~600 ícones, sem o
// catálogo pago completo): alguns conceitos não têm equivalente exato e
// usam o ícone mais próximo disponível — destacado abaixo em cada caso.
import type { ComponentType, SVGProps } from "react";
import {
  AngleDoubleLeft,
  AngleDoubleRight,
  ArrowLeft as LiArrowLeft,
  ArrowRight as LiArrowRight,
  BarChart4,
  Bolt2,
  Buildings1,
  Bulb2,
  Bulb4,
  CalendarDays,
  ChatBubble2,
  Check as LiCheck,
  CheckCircle1,
  CheckSquare2,
  ChevronDown as LiChevronDown,
  ChevronUp,
  Clipboard,
  Comment1Text,
  Download1,
  Enter,
  Envelope1,
  Exit,
  Eye as LiEye,
  FileMultiple,
  Gauge1,
  Headphone1,
  Hourglass as LiHourglass,
  IdCard as LiIdCard,
  Info,
  Key1,
  LabelDollar2,
  LocationArrowRight,
  Locked1,
  Megaphone1,
  MenuMeatballs2,
  Message2,
  Message3Text,
  Minus as LiMinus,
  MinusCircle,
  Notebook1,
  Pencil1,
  Phone as LiPhone,
  Plug1,
  Plus as LiPlus,
  RefreshCircle1Clockwise,
  Search1,
  ServiceBell1,
  Shield2Check,
  SignalApp,
  SignsPost2,
  SlidersHorizontalSquare2,
  Spinner3,
  StarFat,
  Stopwatch,
  TargetUser,
  Telephone3,
  Ticket1,
  Trash3,
  Upload1,
  User4,
  UserMultiple4,
  VectorNodes6,
  Wallet1,
  Webhooks,
  Xmark,
  XmarkCircle,
} from "lineicons-react";
import { cn } from "./utils";

export type IconProps = SVGProps<SVGSVGElement> & { title?: string; titleId?: string };
/// Substitui o `LucideIcon` (tipo) usado antes pra tipar props `icon: ...`.
export type IconComponent = ComponentType<IconProps>;

function wrap(Icon: IconComponent): IconComponent {
  return function WrappedIcon({ className, ...props }: IconProps) {
    return <Icon className={cn("li-icon", className)} {...props} />;
  };
}

/// Sem triângulo de alerta no plano gratuito — usa o círculo de informação.
export const AlertTriangle = wrap(Info);
export const ArrowLeft = wrap(LiArrowLeft);
export const ArrowRight = wrap(LiArrowRight);
/// Sem ícone de "selo verificado" — usa o check circular.
export const BadgeCheck = wrap(CheckCircle1);
export const BarChart3 = wrap(BarChart4);
/// Sem robô/IA no plano gratuito — lâmpada representa "inteligente".
export const Bot = wrap(Bulb2);
export const BrainCircuit = wrap(Bulb4);
export const Building2 = wrap(Buildings1);
export const Calendar = wrap(CalendarDays);
export const CalendarIcon = wrap(CalendarDays);
export const Check = wrap(LiCheck);
export const CheckCircle2 = wrap(CheckCircle1);
export const CheckIcon = wrap(LiCheck);
export const ChevronDown = wrap(LiChevronDown);
export const ChevronDownIcon = wrap(LiChevronDown);
/// Sem chevron simples pra direita no plano gratuito (só a versão circular) —
/// usa seta reta nos dois lados (ChevronLeft/ChevronRight) pra manter os
/// pares (paginação, carrossel) consistentes entre si.
export const ChevronLeft = wrap(LiArrowLeft);
export const ChevronRight = wrap(LiArrowRight);
export const ChevronUpIcon = wrap(ChevronUp);
export const ChevronsLeft = wrap(AngleDoubleLeft);
export const ChevronsRight = wrap(AngleDoubleRight);
/// Sem círculo vazio — usa o círculo com traço (estado "não concluído").
export const Circle = wrap(MinusCircle);
export const Clock = wrap(Stopwatch);
export const Contact = wrap(TargetUser);
/// Sem ícone de cookie — usa o círculo de informação.
export const Cookie = wrap(Info);
export const Copy = wrap(Clipboard);
export const Download = wrap(Download1);
export const Eye = wrap(LiEye);
/// Sem "olho riscado" no plano gratuito — reaproveita o mesmo olho (o toggle
/// de mostrar/ocultar senha perde a distinção visual entre os dois estados).
export const EyeOff = wrap(LiEye);
export const FileSpreadsheet = wrap(FileMultiple);
export const FileText = wrap(Notebook1);
export const Gauge = wrap(Gauge1);
export const Headphones = wrap(Headphone1);
export const Headset = wrap(ServiceBell1);
export const Hourglass = wrap(LiHourglass);
export const IdCard = wrap(LiIdCard);
export const KeyRound = wrap(Key1);
export const ListChecks = wrap(CheckSquare2);
export const Loader2 = wrap(Spinner3);
export const Lock = wrap(Locked1);
export const LogIn = wrap(Enter);
export const LogOut = wrap(Exit);
export const Mail = wrap(Envelope1);
export const MailCheck = wrap(Envelope1);
export const Megaphone = wrap(Megaphone1);
export const MessageCircle = wrap(ChatBubble2);
export const MessageCircleMore = wrap(Message2);
export const MessageSquare = wrap(Message3Text);
export const MessageSquareText = wrap(Comment1Text);
export const Minus = wrap(LiMinus);
/// Sem "3 pontos verticais" — usa o ícone de menu "meatballs" (mais opções).
export const MoreVertical = wrap(MenuMeatballs2);
export const Network = wrap(VectorNodes6);
export const Pencil = wrap(Pencil1);
export const Phone = wrap(LiPhone);
export const PhoneCall = wrap(Telephone3);
export const Plug = wrap(Plug1);
export const Plus = wrap(LiPlus);
/// Sem "desfazer" anti-horário — usa o refresh circular (mais próximo).
export const RotateCcw = wrap(RefreshCircle1Clockwise);
export const Search = wrap(Search1);
/// Sem avião de papel (send) no plano gratuito — usa a seta de localização.
export const Send = wrap(LocationArrowRight);
export const ShieldCheck = wrap(Shield2Check);
export const SlidersHorizontal = wrap(SlidersHorizontalSquare2);
export const Sparkles = wrap(StarFat);
/// Sem ícone de etiqueta genérico — usa a etiqueta de preço/valor.
export const Tag = wrap(LabelDollar2);
export const Ticket = wrap(Ticket1);
export const Trash2 = wrap(Trash3);
export const Upload = wrap(Upload1);
export const User = wrap(User4);
export const UserCheck = wrap(User4);
export const UserRound = wrap(User4);
export const Users = wrap(UserMultiple4);
export const UsersRound = wrap(UserMultiple4);
export const Wallet = wrap(Wallet1);
/// Sem ícone de "waypoints/rota" — usa a placa de sinalização.
export const Waypoints = wrap(SignsPost2);
export const Webhook = wrap(Webhooks);
export const Wifi = wrap(SignalApp);
export const X = wrap(Xmark);
export const XCircle = wrap(XmarkCircle);
export const Zap = wrap(Bolt2);
