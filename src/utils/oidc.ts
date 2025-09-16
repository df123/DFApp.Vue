import { UserManager, type User } from "oidc-client-ts";
import { oidcConfig } from "@/config/oidc";

// 初始化认证管理器
export function initAuthManager(): UserManager {
  return new UserManager(oidcConfig);
}

// 启动认证流程
export async function startAuthentication(): Promise<void> {
  const userManager = initAuthManager();
  await userManager.signinRedirect();
}

// 处理认证回调
export async function handleAuthCallback(): Promise<User | null> {
  const userManager = initAuthManager();
  try {
    const user = await userManager.signinRedirectCallback();
    return user;
  } catch (error) {
    console.error("认证回调处理失败:", error);
    return null;
  }
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User | null> {
  const userManager = initAuthManager();
  return await userManager.getUser();
}

// 静默刷新令牌
export async function silentRenew(): Promise<User | null> {
  const userManager = initAuthManager();
  try {
    return await userManager.signinSilent();
  } catch (error) {
    console.error("静默刷新失败:", error);
    return null;
  }
}

// 登出
export async function logout(): Promise<void> {
  const userManager = initAuthManager();
  await userManager.signoutRedirect();
}

// 检查认证状态
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && !user.expired;
}
