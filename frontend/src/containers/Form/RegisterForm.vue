<script setup lang="ts">
import ProgressBar from '@/containers/ProgressBar.vue';
import SubmitButton from "@/basic//Login/SubmitButton.vue";

const submitButton = (): void => {
    console.log("submit");
};
</script>

<template>
    <v-container>
        <v-sheet width="500" class="mx-auto form px-10 py-3">
            <ProgressBar></ProgressBar>
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

        </v-sheet>
    </v-container>
</template>

<style scoped lang="scss">
.form {
    border: 1px solid #e0e0e0;
    border-radius: 4px;

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
}
</style>