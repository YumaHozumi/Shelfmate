<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import ProgressBar from '@/containers/ProgressBar.vue'
import RegisterStep1 from '@/containers/Form/RegisterStep1.vue'
import RegisterStep2 from '@/containers/Form/RegisterStep2.vue'
import router from '@/router'
import { ref, provide } from 'vue'
import GoogleButton from '@/basic/Login/GoogleButton.vue'
import { FirebaseError } from 'firebase/app'
import ErrorMessage from '@/basic/ErrorMessage.vue'
import { firebaseErrorMessage } from '@/function'
import { onInitBookshelf } from '@/function'
import { googleLogin, handleLogin } from '@/auth'
import LoadingContainer from '@/containers/LoadingContainer.vue'

const onNavigate = (name: string): void => {
  router.push({ name: name })
}

const errorMessage = ref('')

// コンポーネントを変更するためのインデックス
const currentCompIndex = ref(0)

const switchComp = (): void => {
  errorMessage.value = ''
  currentCompIndex.value++
}

const back = (): void => {
  errorMessage.value = ''
  currentCompIndex.value--
}

// ロード中かの判定用フラグを追加
const isRegisterPageLoading = ref(false)

const clickGoogleButton = async () => {
  errorMessage.value = ''

  try {
    isRegisterPageLoading.value = true
    await handleLogin(googleLogin, onInitBookshelf, () => {
      onNavigate('AppTop')
    })
  } catch (e) {
    if (e instanceof FirebaseError) {
      errorMessage.value = firebaseErrorMessage(e)
    }
  }

  isRegisterPageLoading.value = false
}

const updateLoading = (flag: boolean): void => {
  isRegisterPageLoading.value = flag
}
</script>

<template>
  <LoadingContainer v-if="isRegisterPageLoading" :isLoading="isRegisterPageLoading"></LoadingContainer>
  <!-- NOTE: v-showにしないと，ローディング中，
   下のコード部分が一切レンダリングされない．
   ロード中はupdateLoading関数がよばれないため，
   永遠にロード画面が切り替わらなくなる．-->
  <div v-show="!isRegisterPageLoading">
    <Header @navigate="onNavigate"></Header>
    <v-sheet width="500" class="mx-auto form px-10 py-3 mt-5 no-radius-bottom">
      <ProgressBar :currentStep="currentCompIndex"></ProgressBar>
      <ErrorMessage :errorMessage="errorMessage" class="mx-4"></ErrorMessage>
      <RegisterStep1
        v-if="currentCompIndex == 0"
        @submitButton="switchComp"
        @updateLoading="updateLoading"
      ></RegisterStep1>
      <RegisterStep2
        v-if="currentCompIndex == 1"
        @back="back"
        @navigate="onNavigate"
      ></RegisterStep2>
    </v-sheet>
    <v-sheet width="500" class="mx-auto form px-14 pt-3 pb-5 no-radius-top">
      <v-row>
        <v-col cols="12">
          <p>他サービスで新規登録</p>
        </v-col>
        <v-col cols="12">
          <GoogleButton
            text="Googleで新規登録する"
            @clickGoogleButton="clickGoogleButton"
          ></GoogleButton>
        </v-col>
      </v-row>
    </v-sheet>
  </div>

</template>

<style scoped lang="scss">
.form {
  border: 1px solid #e0e0e0;
  border-radius: 4px;

  &.no-radius-bottom {
    border: 1px solid #e0e0e0;
    border-radius: 4px 4px 0 0;
  }

  &.no-radius-top {
    border: 1px solid #e0e0e0;
    border-radius: 0 0 4px 4px;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
