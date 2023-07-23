<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import LocalHeader from '@/containers/LocalHeader.vue';
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
  <Header @navigate="onNavigate"></Header>
  <LocalHeader></LocalHeader>
</template>
