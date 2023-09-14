<script setup lang="ts">
interface Props {
  page: number
}

defineProps<Props>()

interface Emits {
  (event: 'moreBtnClick'): void
}

const emit = defineEmits<Emits>()

const moreBtnClick = (): void => {
  emit('moreBtnClick')
}
</script>

<template>
  <div class="text-center">
    <v-btn class="more-view" color="green" :disabled="page === 4" @click="moreBtnClick"
      >もっと見る</v-btn
    >
  </div>
</template>

<style lang="scss" scoped>
.more-view {
  width: 20%;
  font-weight: bold;
  font-size: 13px;
}
</style>
