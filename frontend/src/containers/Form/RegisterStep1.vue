<script setup lang="ts">
import SubmitButton from "@/basic//Login/SubmitButton.vue";

const submitButton = (): void => {
    console.log("submit");
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
                <div class="label mb-3">メールアドレス</div>
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

.label {
    font-weight: bold;
    color: #333;
    margin-left: 12px;

    &::before {
        content: "";
        position: absolute;
        margin-left: -12px;
        margin-top: -1px;
        width: 6px;
        height: 22px;
        background: #dedede;
    }
}
</style>