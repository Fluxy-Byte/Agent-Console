import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { refreshSessionState } from "@/hooks/use-bootstrap-session";
import { signUp } from "@/lib/auth-client";
import { useAppDispatch } from "@/store/hooks";

export function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await signUp.email({ name, email, password });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message ?? "Não foi possível criar a conta.");
      return;
    }

    // O signUp acabou de criar uma sessão nova (cookie) — a store ainda não
    // sabe disso (o bootstrap na raiz do app só roda uma vez, no load inicial),
    // então precisamos atualizá-la aqui antes de navegar, senão os guards de
    // rota (RequireAuth/RequireActiveCompany) mandam de volta pro /signin.
    await refreshSessionState(dispatch);
    setLoading(false);
    navigate("/business", { replace: true });
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Criar conta</CardTitle>
          <CardDescription>Comece a configurar seus agentes de IA no WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" required placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-muted-foreground text-xs">Mínimo de 8 caracteres.</span>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-2" size="lg">
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </form>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Já tem conta?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
