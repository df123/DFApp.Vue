<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import { setupSilentRenewMessageListener } from "@/utils/oidc";
import zhCn from "element-plus/es/locale/lang/zh-cn";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  setup() {
    onMounted(() => {
      // 初始化静默刷新消息监听器
      setupSilentRenewMessageListener();
    });
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
