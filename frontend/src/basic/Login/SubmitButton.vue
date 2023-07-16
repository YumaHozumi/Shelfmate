<script setup lang="ts">
interface Emits {
    (event: "submitButton"): void;
}

const emit = defineEmits<Emits>();

const submitButton = (): void => {
    emit("submitButton");
}
</script>

<template>
    <v-btn color="blue" class="submitButton" width="100%" @click="submitButton">ログイン</v-btn>
</template>

<style scoped>
.submitButton {
    font-weight: bolder;
}
</style>