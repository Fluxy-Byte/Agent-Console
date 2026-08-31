import { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Check, Copy, KeyRound, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ApiError } from "@/lib/api";
import { useCan } from "@/hooks/use-can";
import { PermissionAction, ROLE_LABELS, type MemberRole } from "@/domain/permission-action";
import { useAppSelector } from "@/store/hooks";
import type { Company, InvitationMember, Member } from "@/types/domain";

const ROLE_OPTIONS: MemberRole[] = ["GERENTE", "SUPERVISOR", "ATENDENTE"];

export function BusinessDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const can = useCan();
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  // Sem :id na rota (tela "Acessos" do menu lateral, /access) = gerencia a
  // empresa ativa. Com :id (vindo da lista de empresas) = gerencia a empresa
  // informada, mesmo que não seja a ativa (ex: administrador navegando).
  const activeCompanyId = useAppSelector((s) => s.activeCompany?.id);
  const id = paramId ?? activeCompanyId;
  const { data: company, mutate: mutateCompany } = useSWR<Company>(id ? `/api/companies/${id}` : null);
  const { data: members, mutate } = useSWR<Member[]>(id ? `/api/companies/${id}/members` : null);
  const { data: inviteCodes, mutate: mutateInviteCodes } = useSWR<InvitationMember[]>(
    id ? `/api/companies/${id}/invite-codes` : null,
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [generatingToken, setGeneratingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [inviteRole, setInviteRole] = useState<MemberRole>("ATENDENTE");
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<InvitationMember | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const canWrite = can(PermissionAction.ACCESS_WRITE);

  async function handleRoleChange(memberId: string, role: MemberRole) {
    setError(null);
    setSavingId(memberId);
    try {
      await api.put(`/api/companies/${id}/members/${memberId}`, { role });
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar o tipo de acesso.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleGenerateToken() {
    setTokenError(null);
    setGeneratingToken(true);
    try {
      const { token } = await api.post<{ token: string }>(`/api/companies/${id}/api-token`, {});
      setGeneratedToken(token);
      setCopied(false);
      await mutateCompany();
    } catch (err) {
      setTokenError(err instanceof ApiError ? err.message : "Não foi possível gerar o token.");
    } finally {
      setGeneratingToken(false);
    }
  }

  async function handleCopyToken() {
    if (!generatedToken) return;
    await navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    toast.success("Token copiado.");
  }

  async function handleGenerateCode() {
    setCodeError(null);
    setGeneratingCode(true);
    try {
      const invitation = await api.post<InvitationMember>(`/api/companies/${id}/invite-codes`, { role: inviteRole });
      setGeneratedCode(invitation);
      setCodeCopied(false);
      await mutateInviteCodes();
    } catch (err) {
      setCodeError(err instanceof ApiError ? err.message : "Não foi possível gerar o código.");
    } finally {
      setGeneratingCode(false);
    }
  }

  async function handleCopyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setCodeCopied(true);
    toast.success("Código copiado.");
  }

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Sem :id (rota /access, vinda do menu lateral) = trilha fixa "Acessos".
            Com :id (vindo da lista de empresas em /business) essa página não
            faz parte do fluxo com sidebar, então não mostramos breadcrumb. */}
        {!paramId && <PageBreadcrumb items={[{ label: "Acessos" }]} />}

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            {company?.name ?? "Empresa"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">CNPJ {company?.cnpj}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acessos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {error && <p className="text-destructive text-sm">{error}</p>}
            {members?.map((member) => (
              <div
                key={member.id}
                className="border-border flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {member.user.name} {member.userId === currentUserId && <Badge variant="secondary">Você</Badge>}
                  </p>
                  <p className="text-muted-foreground text-xs">{member.user.email}</p>
                </div>

                {canWrite ? (
                  <Select
                    value={member.role}
                    disabled={savingId === member.id}
                    onValueChange={(value) => handleRoleChange(member.id, value as MemberRole)}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{ROLE_LABELS[member.role]}</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {canWrite && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acesso à API externa</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm">
                Token usado por sistemas de terceiros para consultar canais/templates e disparar campanhas desta
                empresa via API (Fluxy Agents).
              </p>
              <div className="flex items-center justify-between gap-3">
                <Badge variant={company?.hasApiAccessToken ? "default" : "outline"}>
                  {company?.hasApiAccessToken ? "Token configurado" : "Nenhum token gerado"}
                </Badge>
                <Button variant="outline" size="sm" disabled={generatingToken} onClick={handleGenerateToken}>
                  <KeyRound className="size-4" />
                  {generatingToken ? "Gerando…" : "Gerar novo token"}
                </Button>
              </div>
              {tokenError && <p className="text-destructive text-sm">{tokenError}</p>}
            </CardContent>
          </Card>
        )}

        {canWrite && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Código de convite</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">
                Gere um código para compartilhar com quem você quer convidar. A pessoa digita esse código na tela de
                cadastro e entra direto nesta empresa, já com o papel escolhido abaixo.
              </p>
              <div className="flex items-center gap-2">
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                  <SelectTrigger size="sm" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" disabled={generatingCode} onClick={handleGenerateCode}>
                  <Ticket className="size-4" />
                  {generatingCode ? "Gerando…" : "Gerar código"}
                </Button>
              </div>
              {codeError && <p className="text-destructive text-sm">{codeError}</p>}

              {inviteCodes && inviteCodes.length > 0 && (
                <div className="flex flex-col gap-2">
                  {inviteCodes.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="border-border flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <code className="bg-muted rounded-md px-2 py-1 text-sm font-medium tracking-wider">
                          {invitation.code}
                        </code>
                        <div className="min-w-0">
                          <p className="text-xs font-medium">{ROLE_LABELS[invitation.role]}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {invitation.finish ? "Ainda não utilizado" : `Usado por ${invitation.user?.name ?? "—"}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invitation.finish ? "default" : "outline"}>
                          {invitation.finish ? "Ativo" : "Usado"}
                        </Badge>
                        {invitation.finish && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyCode(invitation.code)}
                          >
                            <Copy className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(generatedToken)} onOpenChange={(open) => !open && setGeneratedToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token gerado</DialogTitle>
            <DialogDescription>
              Copie e guarde este token agora — por segurança, ele não será exibido novamente. Qualquer token
              anterior desta empresa deixou de funcionar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <code className="bg-muted flex-1 overflow-x-auto rounded-md px-3 py-2 text-xs break-all">
              {generatedToken}
            </code>
            <Button type="button" variant="outline" size="icon" onClick={handleCopyToken}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(generatedCode)} onOpenChange={(open) => !open && setGeneratedCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código gerado</DialogTitle>
            <DialogDescription>
              Envie este código para a pessoa convidada digitar na tela de cadastro. Papel: {" "}
              {generatedCode && ROLE_LABELS[generatedCode.role]}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <code className="bg-muted flex-1 rounded-md px-3 py-2 text-center text-lg font-semibold tracking-[0.3em]">
              {generatedCode?.code}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => generatedCode && handleCopyCode(generatedCode.code)}
            >
              {codeCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
