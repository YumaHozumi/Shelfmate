<script setup lang="ts">
import Header from '@/containers/Header.vue'
import router from '@/router'

const onClickLoginButton = (): void => {
  router.push({ name: 'Login' })
}

const onClickSiteLogo = (): void => {
  router.push({ name: 'AppTop' })
  console.log("tes")
}
</script>

<template>
  <Header @onClickLoginButton="onClickLoginButton" @onClickSiteLogo="onClickSiteLogo"></Header>
  <p>test</p>
</template>
