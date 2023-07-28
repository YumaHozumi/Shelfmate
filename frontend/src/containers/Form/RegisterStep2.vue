<script setup lang="ts">
import { ref } from 'vue';
import SubmitButton from '@/basic/Login/SubmitButton.vue';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

interface Emits {
    (event: "back"): void;
    (event: "navigate", name: string): void;
}

const emit = defineEmits<Emits>();

const address = ref(auth.currentUser?.email);

const back = (): void => {
    emit("back");
}

const submitButton = (): void => {
    emit("navigate", "Login");
};
</script>

<template>
    <v-form>
        <v-row class="mx-4">
            <v-col cols="12" class="pa-0 mt-3">
                <p>確認メールを下記メールアドレスに送信しました。</p>
            </v-col>
            <v-col cols="12" class="confirm-code mt-3">
                <p>{{ address }}</p>
            </v-col>
            <v-col cols="12" class="pa-0 mt-3">
                <p>確認メールを開いた後に、ログインしてください。</p>
            </v-col>
            <v-col cols="12" class="pa-0 mt-4">
                <SubmitButton @submitButton="submitButton" text="ログイン画面を開く" color="red"></SubmitButton>
            </v-col>
            <v-col cols="12" class="pa-0 mt-4 mb-6">
                <v-btn color="blue" @click="back">
                    <v-icon>mdi-arrow-left-bold</v-icon>
                    戻る
                </v-btn>
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

.confirm-code {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #F5F5F5;
    word-wrap: break-word;
    line-height: 24px;
}

.back {
    color: aqua;
}
</style>