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
}

export const oidcConfig: OidcConfig = {
  authority: "https://localhost:44369",
  client_id: "DFApp_Vue",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: "code",
  scope: "openid profile email roles permissions DFApp offline_access",
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/auth/silent-callback`
};

// 导出 UserManager 实例（可选，工具类中创建）
export const userManager = new UserManager(oidcConfig);
