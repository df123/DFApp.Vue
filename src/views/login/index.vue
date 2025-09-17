<script setup lang="ts">
import Motion from "./utils/motion";
import { startAuthentication } from "@/utils/oidc";
import { message } from "@/utils/message";
import { ref, toRaw, onMounted, onUnmounted } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import { bg, avatar, illustration } from "./utils/static";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";

defineOptions({
  name: "Login"
});

const authAttempted = ref(false);
const authTimeout = ref<number | null>(null);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

onMounted(() => {
  authTimeout.value = window.setTimeout(() => {
    if (authAttempted.value) return;
    authAttempted.value = true;
    startAuthentication()
      .catch(() => {
        message("登录失败", { type: "error" });
      })
      .finally(() => {
        authTimeout.value = null;
      });
  }, 500);
});

onUnmounted(() => {
  if (authTimeout.value) {
    clearTimeout(authTimeout.value);
    authTimeout.value = null;
  }
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
