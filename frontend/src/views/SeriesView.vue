<script setup lang="ts">
import SeriesHeader from '@/containers/SeriesHeader.vue';
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
    <SeriesHeader @navigate="onNavigate"></SeriesHeader>
</template>