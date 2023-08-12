<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import ProgressBar from '@/containers/ProgressBar.vue';
import RegisterStep1 from '@/containers/Form/RegisterStep1.vue';
import RegisterStep2 from '@/containers/Form/RegisterStep2.vue';
import router from '@/router'
import { ref, onMounted} from 'vue';
import GoogleButton from "@/basic/Login/GoogleButton.vue";
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import ErrorMessage from "@/basic/ErrorMessage.vue";
import { firebaseErrorMessage } from "@/function";
import { firebaseAuth, getCurrentUser, firestore } from '@/config/firebase';
import LoadingContainer from "@/containers/LoadingContainer.vue";
import { collection, addDoc } from "firebase/firestore";

const onNavigate = (name: string): void => {
  router.push({name: name});
}

const errorMessage = ref("");

// コンポーネントを変更するためのインデックス
const currentCompIndex = ref(0);

const switchComp = (): void => {
  errorMessage.value = "";
  currentCompIndex.value++;
}

const back = (): void => {
  errorMessage.value = "";
  currentCompIndex.value--;
}

const clickGoogleButton = async () => {
  const provider = new GoogleAuthProvider();
  errorMessage.value = "";

  try {
      await signInWithRedirect(firebaseAuth, provider);
  } catch (e) {
      if(e instanceof FirebaseError){
          errorMessage.value = firebaseErrorMessage(e);
      }
  }
}

// レンダリングフラグを追加
const isLoading = ref(true);

const onInitBookshelf = async () => {
  const user = await getCurrentUser();
  const bookShelfCollection = collection(firestore, "users", user.uid, "bookshelves")
  await addDoc(bookShelfCollection, { shelf_name: "始まりの本棚"})
}

onMounted(async () => {
    try {
      isLoading.value = true;
      const result = await getRedirectResult(firebaseAuth);
      if (result?.user) {
        // ユーザーは正常に認証されました
        //const user = result.user;
        // userを使用して何かしらの処理を行います
        await onInitBookshelf()
        onNavigate("AppTop");
      }
    } catch (error) {
      console.error(error);
    }
    // リダイレクト処理が終わったらレンダリングを許可
    isLoading.value = false;
})

</script>

<template>
    <LoadingContainer :isLoading="isLoading"></LoadingContainer>
    <div v-if="!isLoading">
      <Header @navigate="onNavigate"></Header>
      <v-sheet width="500" class="mx-auto form px-10 py-3 mt-5 no-radius-bottom">
          <ProgressBar :currentStep="currentCompIndex"></ProgressBar>
          <ErrorMessage :errorMessage="errorMessage" class="mx-4"></ErrorMessage>
          <RegisterStep1 v-if="currentCompIndex == 0" @submitButton="switchComp"></RegisterStep1>
          <RegisterStep2 v-if="currentCompIndex == 1" @back="back" @navigate="onNavigate"></RegisterStep2>
      </v-sheet>
      <v-sheet width="500" class="mx-auto form px-14 pt-3 pb-5 no-radius-top">
          <v-row>
            <v-col cols="12">
              <p>他サービスで新規登録</p>
            </v-col>
            <v-col cols="12">
              <GoogleButton text="Googleで新規登録する" @clickGoogleButton="clickGoogleButton"></GoogleButton>
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