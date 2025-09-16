<template>
  <div>
    <p>处理认证回调中...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { handleAuthCallback } from "@/utils/oidc";

const router = useRouter();

onMounted(async () => {
  const user = await handleAuthCallback();
  if (user) {
    // 认证成功，重定向到首页
    router.push("/");
  } else {
    // 认证失败，重定向到登录页
    router.push("/login");
  }
});
</script>
