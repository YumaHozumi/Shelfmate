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
  <v-btn @click="clickLoginButton" class="btn">
    <v-icon>mdi-login</v-icon>
    ログイン
  </v-btn>
</template>

<style scoped lang="scss">
.btn {
    background-color: #fff;
    color: green;
    font-weight: bold;
    font-size: 16px;
}
</style>