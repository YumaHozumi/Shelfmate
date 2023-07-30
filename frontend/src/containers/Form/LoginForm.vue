<script setup lang="ts">
import SubmitButton from "@/basic//Login/SubmitButton.vue";
import GoogleButton from "@/basic/Login/GoogleButton.vue";
import Link from "@/basic/Login/Link.vue";
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { ref, onMounted } from "vue";
import { FirebaseError } from "firebase/app";
import ErrorMessage from "@/basic/ErrorMessage.vue";
import { firebaseErrorMessage } from "@/function";

interface Emits {
    (event: "navigate", name: string): void;
}

const emit = defineEmits<Emits>();

const auth = getAuth();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const onClickLogin = () => {
    emit("navigate", "AppTop");
}

const submitButton = async () => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
        if(!cred.user.emailVerified) errorMessage.value = "メール認証が終了していません"
        else onClickLogin();
    } catch(e) {
        if(e instanceof FirebaseError){
            errorMessage.value = firebaseErrorMessage(e);
        }
    }
};

const clickGoogleButton = async () => {
    console.log("google");
    const provider = new GoogleAuthProvider();

    try {
        await signInWithRedirect(auth, provider);
    } catch (e) {
        if(e instanceof FirebaseError){
            errorMessage.value = firebaseErrorMessage(e);
        }
    }
};

onMounted(async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        // ユーザーは正常に認証されました
        const user = result.user;
        // userを使用して何かしらの処理を行います
        console.log(user);
      }
    } catch (error) {
      console.error(error);
    }
})
</script>

<template>
    <v-container>
        <v-row>
            <v-sheet width="450" class="mx-auto px-6 py-6 form mt-3">
                <v-form>
                     <v-row>
                        <v-col cols="12">
                            <ErrorMessage :errorMessage="errorMessage"></ErrorMessage>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <p>ログインIDとパスワードを入力してください</p>
                        </v-col>
                        <v-col cols="12">
                            <input type="text" class="input-form ps-2" v-model="email">
                        </v-col>
                        <v-col cols="12">
                            <input type="password" class="input-form ps-2" v-model="password">
                        </v-col>
                        <v-col cols="12">
                            <SubmitButton @submitButton="submitButton" text="ログイン"
                            color="blue"></SubmitButton>
                        </v-col>
                    </v-row>
                </v-form>
            </v-sheet>
        </v-row>
        <v-row>
            <v-sheet width="450" class="form mx-auto">
                <v-divider></v-divider>
                <v-row class="px-6 pb-6 pt-3">
                    <v-col cols="12">
                        <p>他サービスでログイン</p>
                    </v-col>
                    <v-col cols="12">
                        <GoogleButton @clickGoogleButton="clickGoogleButton" text="Googleでログイン"></GoogleButton>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-row>
        <v-row>
            <v-sheet width="450" class="mx-auto text-center pt-3">
                <Link text="アカウントをお持ちでない方はこちらから" name="Register"></Link>
            </v-sheet>
        </v-row>
    </v-container>
</template>

<style scoped lang="scss">
.form {
    background-color: #f5f5f5;

    .input-form {
        background-color: white;
        border: 1px solid grey;
        width: 100%;
    }
}
</style>