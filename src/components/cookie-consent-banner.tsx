import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "fluxy-cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function respond(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="bg-card border-border mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-xl border p-4 shadow-lg sm:flex-row sm:items-center">
        <Cookie className="text-primary size-6 shrink-0" />
        <p className="text-muted-foreground flex-1 text-sm">
          Usamos cookies para melhorar sua navegação e a experiência na plataforma, de acordo com a nossa política de
          privacidade e a LGPD.
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => respond("rejected")}>
            Recusar
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" onClick={() => respond("accepted")}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
