<script setup lang="ts">
interface Props {
  text: string
  name: string
}

defineProps<Props>()
</script>

<template>
  <RouterLink :to="{ name: name }">{{ text }}</RouterLink>
</template>
