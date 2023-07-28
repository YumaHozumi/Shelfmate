<script setup lang="ts">
interface Props {
    errorMessage: string;
}

defineProps<Props>();
</script>

<template>
    <div v-if="errorMessage" class="error">
        {{ errorMessage }}
    </div>
</template>

<style scoped>
.error {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}
</style>
