<script setup lang="ts">
import Header from '@/containers/Header.vue'
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
  <Header @navigate="onNavigate"></Header>
</template>
