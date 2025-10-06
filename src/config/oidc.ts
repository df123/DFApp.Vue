import { UserManager } from "oidc-client-ts";

// 临时定义 OidcConfig 接口，稍后移到 types/auth.ts
export interface OidcConfig {
  authority: string;
  client_id: string;
  redirect_uri: string;
  post_logout_redirect_uri: string;
  response_type: string;
  scope: string;
  automaticSilentRenew: boolean;
  silent_redirect_uri: string;
  client_secret: string;
}

export const oidcConfig: OidcConfig = {
  authority: import.meta.env.VITE_AUTH_AUTHORITY || "",
  client_id: import.meta.env.VITE_OAUTH_CLIENT_ID || "",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/signout-callback-oidc`,
  response_type: "code",
  scope: "openid profile email roles DFApp",
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/auth/silent-callback`,
  client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET || ""
};

export const userManager = new UserManager(oidcConfig);
