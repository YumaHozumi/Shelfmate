<script setup lang="ts">
interface Props {
    text: string;
}

defineProps<Props>();
</script>

<template>
    <v-btn>{{ text }}</v-btn>
</template>