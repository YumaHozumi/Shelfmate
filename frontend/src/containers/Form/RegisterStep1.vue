<script setup lang="ts">
import SubmitButton from "@/basic//Login/SubmitButton.vue";
import Label from "@/basic/Label.vue";

interface Emits {
    (event: "submitButton"): void;
}

const emit = defineEmits<Emits>();

const submitButton = (): void => {
    emit("submitButton");
};
</script>

<template>
    <v-form>
        <v-row class="mx-1">
            <v-col cols="12" class="pb-2">
                <p>ユーザIDとして登録するメールアドレスを入力してください。</p>
            </v-col>
            <v-col cols="12" class="pt-0">
                <p>入力したメールアドレスに確認コードを送信します。</p>
            </v-col>
        </v-row>
        <v-row class="mx-1">
            <v-col cols="12">
                <Label text="メールアドレス" class="mb-3"></Label>
                <input type="text" class="input-form ps-2">
            </v-col>
            <v-col cols="12">
                <SubmitButton @submitButton="submitButton" text="確認コードを送信する"
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