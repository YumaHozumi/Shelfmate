<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="label">{{ text }}</div>
</template>

<style scoped lang="scss">
.label {
  font-weight: bold;
  color: #333;
  margin-left: 12px;

  &::before {
    content: '';
    position: absolute;
    margin-left: -12px;
    margin-top: -1px;
    width: 6px;
    height: 22px;
    background: #dedede;
  }
}
</style>
