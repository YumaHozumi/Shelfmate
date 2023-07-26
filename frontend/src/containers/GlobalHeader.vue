<script setup lang="ts">
import SiteTitle from '@/basic/SiteTitle.vue'
import NavItem from '@/components/Sidebar/NavItem.vue'
import LoginButton from '@/basic/LoginButton.vue'
import { ref } from 'vue'

interface Emits {
  (event: 'navigate', name: string): void
}

const emit = defineEmits<Emits>()

const drawer = ref(false)

//ログインボタンが押された
const onClickLoginButton = (): void => {
  emit('navigate', "Login");
}

//サイトのロゴが押された
const onClickSiteLogo = (): void => {
  emit("navigate", "AppTop");
}
</script>

<template>
  <v-app-bar color="green" flat>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <SiteTitle @click="onClickSiteLogo"></SiteTitle>

    <LoginButton @clickLoginButton="onClickLoginButton"></LoginButton>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" color="green" temporary>
    <v-list nav density="compact" class="list">
      <NavItem title="本棚" icon="mdi-bookshelf"></NavItem>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.list {
  margin-left: -8px;
  margin-top: 25px;
}
</style>
