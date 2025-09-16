<template>
  <div style="display: none">静默刷新中...</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { silentRenew } from "@/utils/oidc";

onMounted(async () => {
  await silentRenew();
  window.close();
});
</script>
