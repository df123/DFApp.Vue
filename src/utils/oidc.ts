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
  const maxRetries = 3;
  const retryDelay = 2000; // 2秒重试延迟

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`静默刷新尝试 ${attempt}/${maxRetries}`);

      // 使用 Promise.race 实现超时控制
      const user = await Promise.race([
        userManager.signinSilent(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("静默刷新超时")), 10000)
        )
      ]);

      if (user) {
        console.log("静默刷新成功");
        return user;
      } else {
        throw new Error("静默刷新返回空用户");
      }
    } catch (error) {
      console.error(`静默刷新失败 (尝试 ${attempt}/${maxRetries}):`, error);

      // 如果是最后一次尝试，直接返回失败
      if (attempt === maxRetries) {
        console.warn("静默刷新已达最大重试次数，可能需要重新登录");
        return null;
      }

      // 如果不是最后一次尝试，等待后重试
      console.log(`${retryDelay}ms 后重试静默刷新...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  return null;
}

// 声明全局变量类型
declare global {
  interface Window {
    _silentRenewListenerAdded?: boolean;
  }
}

// 设置消息监听器处理静默刷新结果
export function setupSilentRenewMessageListener(): void {
  // 避免重复添加监听器
  if (window._silentRenewListenerAdded) {
    return;
  }

  window.addEventListener("message", event => {
    // 验证消息来源
    if (event.origin !== window.location.origin) {
      return;
    }

    const { type, user, error, reason } = event.data;

    if (type === "silent-renew-success") {
      console.log("静默刷新成功，收到用户信息:", user);
      // 这里可以添加刷新成功后的处理逻辑
      // 例如：更新用户状态、触发事件等
    } else if (type === "silent-renew-failed") {
      console.warn("静默刷新失败:", reason || error);
      // 这里可以添加刷新失败后的处理逻辑
      // 例如：重定向到登录页、显示错误提示等
    }
  });

  window._silentRenewListenerAdded = true;
}

// 使用 iframe 进行静默刷新
export async function silentRenewWithIframe(): Promise<User | null> {
  return new Promise(resolve => {
    // 设置消息监听器
    setupSilentRenewMessageListener();

    // 创建隐藏的 iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `${window.location.origin}/auth/silent-callback`;

    // 设置超时
    const timeout = setTimeout(() => {
      console.warn("静默刷新 iframe 超时");
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      resolve(null);
    }, 15000); // 15秒超时

    // 监听消息
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, user } = event.data;

      if (type === "silent-renew-success") {
        clearTimeout(timeout);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        window.removeEventListener("message", messageHandler);
        resolve(user);
      } else if (type === "silent-renew-failed") {
        clearTimeout(timeout);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        window.removeEventListener("message", messageHandler);
        resolve(null);
      }
    };

    window.addEventListener("message", messageHandler);

    // 添加 iframe 到页面
    document.body.appendChild(iframe);
  });
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
