<script setup lang="ts">
import SiteTitle from '@/basic/SiteTitle.vue'
import NavItem from '@/components/Sidebar/NavItem.vue'
import LoginButton from '@/basic/LoginButton.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

const onClickRegisterButton = (): void => {
  emit("navigate", "Register");
}

const isShow = ref(true);

onAuthStateChanged(getAuth(), (user) => {
  if(user && user.emailVerified) {
    console.log("ログイン済み");
    isShow.value = false;
  }else {
    console.log("ログインしてない")
    isShow.value = true;
  }
})
</script>

<template>
  <v-app-bar color="white" flat>
    <SiteTitle @click="onClickSiteLogo" class="green"></SiteTitle>
    <LoginButton @clickLoginButton="onClickLoginButton" v-show="isShow"></LoginButton>
    <v-btn class="button register ml-3" @click="onClickRegisterButton" v-show="isShow">
      <v-icon>mdi-account-plus-outline</v-icon>
      新規登録
    </v-btn>
    <v-btn v-show="!isShow" class="button register">
      <v-icon>mdi-book-plus-outline</v-icon>
      本を追加
    </v-btn>
  </v-app-bar>
</template>

<style scoped lang="scss">

.green {
  color: #4CAF50
}
.list {
  margin-left: -8px;
  margin-top: 25px;
}

.button {
  font-weight: bold;
  font-size: 14px;
  &.register {
      border: 2px solid #4CAF50;
      background-color: #4CAF50;
      color: white;
  }

}
</style>
