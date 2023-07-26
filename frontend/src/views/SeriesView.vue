<script setup lang="ts">
import SeriesHeader from '@/containers/SeriesHeader.vue';
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}

interface Props {
  id: string;
}

defineProps<Props>();
</script>

<template>
    <SeriesHeader @navigate="onNavigate"></SeriesHeader>
    <p>{{ id }}</p>
</template>