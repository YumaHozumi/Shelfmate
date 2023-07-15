<script setup lang="ts">
interface Emits {
  (event: 'clickLoginButton'): void
}

const emit = defineEmits<Emits>()

const clickLoginButton = (): void => {
  emit('clickLoginButton')
}
</script>

<template>
  <v-btn @click="clickLoginButton">
    <v-icon>mdi-login</v-icon>
    ログイン
  </v-btn>
</template>
