import { UserManager, type UserManagerSettings } from "oidc-client-ts";

export const userManagerSettings: UserManagerSettings = {
  authority: import.meta.env.VITE_AUTH_AUTHORITY || "",
  client_id: import.meta.env.VITE_OAUTH_CLIENT_ID || "",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/signout-callback-oidc`,
  response_type: "code",
  scope: "openid profile email roles DFApp offline_access",
  automaticSilentRenew: true,
  client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET || "",
  loadUserInfo: true
};

export const userManager = new UserManager(userManagerSettings);
