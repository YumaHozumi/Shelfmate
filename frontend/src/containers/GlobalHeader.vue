<script setup lang="ts">
import SiteTitle from '@/basic/SiteTitle.vue'
import LoginButton from '@/basic/LoginButton.vue'
import { ref, watchEffect } from 'vue'
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth'
import MyDialog from '@/components/MyDialog.vue'
import { getCurrentUser, firebaseAuth, firestore } from '@/config/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { onUnmounted } from 'vue'

interface Emits {
  (event: 'navigate', name: string): void
}

const emit = defineEmits<Emits>()

//ログインボタンが押された
const onClickLoginButton = (): void => {
  emit('navigate', 'Login')
}

//サイトのロゴが押された
const onClickSiteLogo = (): void => {
  emit('navigate', 'AppTop')
}

const onClickRegisterButton = (): void => {
  emit('navigate', 'Register')
}

const isShow = ref(true);

let unsubscribe: Unsubscribe

watchEffect(() => {
  // watchEffect内で非同期処理を監視
  unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    if (user && user?.emailVerified) {
      console.log('ログイン済み');
      isShow.value = false;
    } else {
      console.log('ログインしてない');
      isShow.value = true;
    }
  });
});

onUnmounted(() => {
  unsubscribe();
})

const onClickAddButton = (): void => {
  emit('navigate', 'Search')
}

const onCreateButton = async (shelf_name: string) => {
  const user = await getCurrentUser()
  const bookShelfCollection = collection(firestore, 'users', user.uid, 'bookshelves')
  await addDoc(bookShelfCollection, { shelf_name: shelf_name })
}
</script>

<template>
  <v-app-bar color="white" flat class="header-border">
    <SiteTitle @click="onClickSiteLogo" class="green"></SiteTitle>
    <LoginButton @clickLoginButton="onClickLoginButton" v-show="isShow"></LoginButton>
    <v-btn class="button register ml-3" @click="onClickRegisterButton" v-show="isShow">
      <v-icon>mdi-account-plus-outline</v-icon>
      新規登録
    </v-btn>
    <MyDialog
      color="green"
      btnText="本棚を作成"
      @onCreateButton="onCreateButton"
      :isShow="!isShow"
    />
    <v-btn v-if="!isShow" class="button register ml-3" @click="onClickAddButton" ref="input">
      <v-icon>mdi-book-plus-outline</v-icon>
      本を追加
    </v-btn>
  </v-app-bar>
</template>

<style scoped lang="scss">
.green {
  color: #4caf50;
}
.list {
  margin-left: -8px;
  margin-top: 25px;
}

.button {
  font-weight: bold;
  font-size: 14px;
  &.register {
    border: 2px solid #4caf50;
    background-color: #4caf50;
    color: white;
  }
}

.header-border {
  border-bottom: 1px solid rgb(209, 209, 209);
}
</style>
