<script setup lang="ts">
import LoginForm from "@/containers/Form/LoginForm.vue";
import Header from "@/containers/GlobalHeader.vue";
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
  <Header @navigate="onNavigate"></Header>
  <LoginForm @navigate="onNavigate"></LoginForm>
</template>
