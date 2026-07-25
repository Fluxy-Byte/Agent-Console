import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [organizationClient(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
