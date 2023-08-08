<script setup lang="ts">
import LoginForm from "@/containers/Form/LoginForm.vue";
import Header from "@/containers/GlobalHeader.vue";
import router from '@/router'
import { onMounted, ref } from "vue";
import  {getRedirectResult } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

const onNavigate = (name: string): void => {
  router.push({name: name});
}

// レンダリングフラグを追加
const isRendered = ref(false);

onMounted(async () => {
    try {
      const result = await getRedirectResult(firebaseAuth);
      if (result?.user) {
        // ユーザーは正常に認証されました
        //const user = result.user;
        // userを使用して何かしらの処理を行います
        onNavigate("AppTop");
      }
    } catch (error) {
      console.error(error);
    }
    // リダイレクト処理が終わったらレンダリングを許可
    isRendered.value = true;
})
</script>

<template>
  <div class="loading" v-if="!isRendered">
    <v-progress-circular
        indeterminate
        :size="100"
        color="green"
    ></v-progress-circular>
  </div>
  <div v-if="isRendered">
    <Header @navigate="onNavigate"></Header>
    <LoginForm @navigate="onNavigate"></LoginForm>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>