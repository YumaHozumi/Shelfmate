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
  font-weight: bold;
  font-size: 13px;
  border: 2px solid #4caf50;
  color: #4caf50;
}
</style>
