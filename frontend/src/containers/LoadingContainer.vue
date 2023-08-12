<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    isLoading: boolean
}

defineProps<Props>();
// ローディングフラグ
</script>

<template>
    <div class="loading" v-if="isLoading">
        <v-progress-circular
        indeterminate
        :size="100"
        color="green"
        ></v-progress-circular>
    </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>