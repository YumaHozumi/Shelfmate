<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <v-list-item>
    <v-list-item-title class="item">{{ $props.label }}</v-list-item-title>
  </v-list-item>
</template>

<style scoped lang="scss">
.item {
  font-weight: bolder;
}
</style>
