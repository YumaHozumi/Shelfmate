<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

defineProps<Props>()
</script>

<template>
  <v-list-item class="item">
    <v-list-item :prepend-icon="icon" :title="title"></v-list-item>
  </v-list-item>
</template>

<style scoped lang="scss">
.item {
  font-weight: bolder;
  cursor: pointer;

  transition: background-color 0.3s ease; // 0.3秒かけて背景色を変更します。必要に応じて時間を調整してください。

  &:hover {
    background-color: rgba(0, 0, 0, 0.1); // ホバー時に背景を薄暗くする。適宜調整してください。
  }
}
</style>
