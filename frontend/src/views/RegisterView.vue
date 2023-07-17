<script setup lang="ts">
import Header from '@/containers/Header.vue'
import router from '@/router'
import ProgressBar from '@/containers/ProgressBar.vue';

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
    <Header @navigate="onNavigate"></Header>
    <ProgressBar></ProgressBar>
</template>