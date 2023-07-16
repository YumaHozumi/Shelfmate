<script setup lang="ts">
interface Emits {
    (event: "clickGoogleLoginButton"): void;
}

const emit = defineEmits<Emits>();

const clickGoogleLoginButton = (): void => {
    emit("clickGoogleLoginButton");
}
</script>

<template>
    <v-btn class="justify-start" @click="clickGoogleLoginButton" width="100%">
        <v-avatar size="24">
            <img src="@/assets/google.png" class="button">
        </v-avatar>
        <p class="ms-2">
            Googleでログイン
        </p>
    </v-btn>
</template>

<style scoped>
.button {
    height: 100%;
    widows: 100%;
    object-fit: contain;
}
</style>