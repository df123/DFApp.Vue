<template>
  <div style="display: none">静默刷新中...</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { UserManager } from "oidc-client-ts";
import { oidcConfig } from "@/config/oidc";

onMounted(async () => {
  console.log("静默回调页面加载完成");

  try {
    // 创建新的 UserManager 实例
    const userManager = new UserManager(oidcConfig);

    // 处理静默回调
    const user = await userManager.signinSilentCallback();
    console.log("静默回调处理成功:", user);

    // signinSilentCallback 返回 void，所以我们需要通过 getUser 获取用户信息
    const currentUser = await userManager.getUser();
    console.log("获取当前用户信息:", currentUser);

    if (!currentUser) {
      // 静默刷新失败，发送消息给父窗口
      console.warn("静默刷新返回空用户");
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "silent-renew-failed",
            reason: "no-user-returned"
          },
          window.location.origin
        );
      }
    } else {
      // 静默刷新成功，发送消息给父窗口
      console.log("静默刷新成功，发送用户信息给父窗口");
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "silent-renew-success",
            user: {
              access_token: currentUser.access_token,
              expires_at: currentUser.expires_at,
              token_type: currentUser.token_type,
              scope: currentUser.scope,
              profile: currentUser.profile
            }
          },
          window.location.origin
        );
      }
    }
  } catch (error) {
    console.error("静默回调处理失败:", error);
    // 发送错误消息给父窗口
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "silent-renew-failed",
          error: error instanceof Error ? error.message : "unknown-error"
        },
        window.location.origin
      );
    }
  } finally {
    // 无论成功失败，都关闭窗口
    console.log("静默回调处理完成，关闭窗口");
    // 延迟关闭窗口，确保消息已发送
    setTimeout(() => {
      window.close();
    }, 100);
  }
});
</script>
