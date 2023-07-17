<script setup lang="ts">
interface Emits {
    (event: "submitButton"): void;
}

const emit = defineEmits<Emits>();

const submitButton = (): void => {
    emit("submitButton");
}

interface Props {
    text: string;
}

defineProps<Props>();
</script>

<template>
    <v-btn color="blue" class="submitButton" width="100%" @click="submitButton">
        {{ text }}
    </v-btn>
</template>

<style scoped>
.submitButton {
    font-weight: bolder;
}
</style>