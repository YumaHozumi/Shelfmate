<script setup lang="ts">
import SubmitButton from "@/basic//Login/SubmitButton.vue";
import Label from "@/basic/Label.vue";
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail, EmailAuthProvider} from "firebase/auth";

interface Emits {
    (event: "submitButton"): void;
}

const emit = defineEmits<Emits>();

const auth = getAuth();

const email = ref("");
const password = ref("");

const submitButton = async () => {
    const providers = await fetchSignInMethodsForEmail(auth, email.value)
    if(providers.findIndex(p => p === EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
        console.log("すでに登録されています")
        return;
    }

    let cred;
    try {
        cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    } catch(e) {
        console.log(e);
        return; // exit function if error occurs
    }

    try {
        const actionCodeSettings = {
            url: 'http://localhost:5173/login', // replace this with the URL of your top page
            handleCodeInApp: true,
        };
        await sendEmailVerification(cred.user, actionCodeSettings);
        emit("submitButton");
    } catch(e) {
        console.log(e);
    }
};

</script>

<template>
    <v-form>
        <v-row class="mx-1">
            <v-col cols="12" class="pb-2">
                <p>ユーザIDとして登録するメールアドレスを入力してください。</p>
            </v-col>
            <v-col cols="12" class="pt-0">
                <p>入力したメールアドレスに確認メールを送信します。</p>
            </v-col>
        </v-row>
        <v-row class="mx-1">
            <v-col cols="12">
                <Label text="メールアドレス" class="mb-3"></Label>
                <input type="text" class="input-form ps-2 py-1" v-model="email">
            </v-col>
            <v-col cols="12" class="mt-3">
                <Label text="パスワード" class="mb-3"></Label>
                <input type="password" class="input-form ps-2 py-1" v-model="password">
            </v-col>
            <v-col cols="12" class="mb-3">
                <SubmitButton @submitButton="submitButton" text="アカウントを作成する"
                color="red"></SubmitButton>
            </v-col>
        </v-row>
    </v-form>
</template>

<style scoped lang="scss">
.input-form {
    background-color: white;
    border: 1px solid rgb(206, 205, 205);
    width: 100%;
}
</style>