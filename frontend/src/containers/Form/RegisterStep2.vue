<script setup lang="ts">
import { ref } from 'vue';
import SubmitButton from '@/basic/Login/SubmitButton.vue';

const address = ref("test@test");

const submitButton = (): void => {
    console.log("hoge");
};
</script>

<template>
    <v-form>
        <v-row class="mx-4">
            <v-col cols="12" class="pa-0 mt-3">
                <p>確認コードを下記メールアドレスに送信しました。</p>
            </v-col>
            <v-col cols="12" class="confirm-code mt-3">
                <p>{{ address }}</p>
            </v-col>
            <v-col cols="12" class="pa-0 mt-3">
                <p>確認コードを入力し、「次へ」を押してください。</p>
            </v-col>
            <v-col cols="12" class="pa-0 mt-3">
                <input type="text" class="input-form ps-2 pa-1">
            </v-col>
            <v-col cols="12" class="pa-0 mt-4 mb-8">
                <SubmitButton @submitbutton="submitButton" text="次へ" color="red"></SubmitButton>
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
</style>