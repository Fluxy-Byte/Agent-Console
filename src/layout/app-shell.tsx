import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import fluxyLogo from "@/assets/Logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCan } from "@/hooks/use-can";
import { NAV_GROUPS } from "./nav-config";
import { signOut } from "@/lib/auth-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth } from "@/store/slices/auth-slice";
import { setActiveCompany } from "@/store/slices/active-company-slice";
import { ROLE_LABELS } from "@/domain/permission-action";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const can = useCan();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const activeCompany = useAppSelector((s) => s.activeCompany);

  async function handleSignOut() {
    await signOut();
    dispatch(clearAuth());
    dispatch(setActiveCompany(null));
    window.location.href = "/signin";
  }

  // Trava a rolagem do documento enquanto o shell está montado — toda página
  // aqui dentro já rola internamente pelo <main>; sem isso, qualquer
  // conteúdo que escape do contêiner (tabela larga, popover mal posicionado
  // etc.) faz o body inteiro crescer e o menu lateral "termina" antes do fim
  // da página em vez de acompanhar o scroll.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside
        className={cn(
          "bg-sidebar-gradient border-border flex flex-col border-r transition-[width] duration-200",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <Link to="/" className="flex h-14 items-center gap-2 px-4">
          <img src={fluxyLogo} alt="Fluxy" className="size-8 shrink-0 rounded-lg" />
          {!collapsed && <span className="font-[family-name:var(--font-display)] font-semibold">Fluxy Agents</span>}
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((item) => can(item.action));
            if (items.length === 0) return null;

            return (
              <div key={group.label} className="mb-4">
                {!collapsed && (
                  <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">{group.label}</p>
                )}
                <div className="flex flex-col gap-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                        )
                      }
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-4 py-3 text-sm"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && "Recolher"}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="border-border hover:bg-accent flex items-center gap-2 border-t px-4 py-3 text-left">
              <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {activeCompany?.memberRole ? ROLE_LABELS[activeCompany.memberRole] : user?.isPlatformAdmin ? "Administrador" : ""}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>{activeCompany?.name ?? "Sem empresa ativa"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/business">Trocar empresa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="size-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
