import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/layout/app-shell";
import { BusinessDetailPage } from "@/pages/business/business-detail-page";
import { BusinessListPage } from "@/pages/business/business-list-page";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password-page";
import { ResetPasswordPage } from "@/pages/auth/reset-password-page";
import { SignInPage } from "@/pages/auth/signin-page";
import { SignUpPage } from "@/pages/auth/signup-page";
import { AgentDetailPage } from "@/pages/agents/agent-detail-page";
import { AgentsListPage } from "@/pages/agents/agents-list-page";
import { CampaignDetailPage } from "@/pages/campaigns/campaign-detail-page";
import { CampaignNewPage } from "@/pages/campaigns/campaign-new-page";
import { CampaignsListPage } from "@/pages/campaigns/campaigns-list-page";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { HomePage } from "@/pages/home/home-page";
import { ServiceIslandDetailPage } from "@/pages/service-islands/service-island-detail-page";
import { ServiceIslandQueueDetailPage } from "@/pages/service-islands/service-island-queue-detail-page";
import { ServiceIslandsListPage } from "@/pages/service-islands/service-islands-list-page";
import { TargetDetailPage } from "@/pages/targets/target-detail-page";
import { TargetsListPage } from "@/pages/targets/targets-list-page";
import { WhatsappChannelDetailPage } from "@/pages/whatsapp-channels/whatsapp-channel-detail-page";
import { WhatsappChannelsListPage } from "@/pages/whatsapp-channels/whatsapp-channels-list-page";
import { RedirectIfBootstrapped, RequireActiveCompany, RequireAuth } from "@/routes/require-auth";
import { useBootstrapSession } from "@/hooks/use-bootstrap-session";

export function App() {
  const { ready } = useBootstrapSession();

  if (!ready) {
    return <div className="bg-dot-grid min-h-screen" />;
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <CookieConsentBanner />
      <Routes>
        <Route
          path="/signin"
          element={
            <RedirectIfBootstrapped>
              <SignInPage />
            </RedirectIfBootstrapped>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfBootstrapped>
              <SignUpPage />
            </RedirectIfBootstrapped>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectIfBootstrapped>
              <ForgotPasswordPage />
            </RedirectIfBootstrapped>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePage />} />

        <Route element={<RequireAuth />}>
          <Route path="/business" element={<BusinessListPage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />

          <Route element={<RequireActiveCompany />}>
            <Route element={<AppShell />}>
              <Route path="/targets" element={<TargetsListPage />} />
              <Route path="/targets/:id" element={<TargetDetailPage />} />
              <Route path="/campaigns" element={<CampaignsListPage />} />
              <Route path="/campaigns/new" element={<CampaignNewPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/agents" element={<AgentsListPage />} />
              <Route path="/agents/new" element={<AgentDetailPage />} />
              <Route path="/agents/:id" element={<AgentDetailPage />} />
              <Route path="/wc" element={<WhatsappChannelsListPage />} />
              <Route path="/wc/:id" element={<WhatsappChannelDetailPage />} />
              <Route path="/service-island" element={<ServiceIslandsListPage />} />
              <Route path="/service-island/:id" element={<ServiceIslandDetailPage />} />
              <Route path="/service-island/:islandId/queue/:queueId" element={<ServiceIslandQueueDetailPage />} />
              <Route path="/access" element={<BusinessDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
