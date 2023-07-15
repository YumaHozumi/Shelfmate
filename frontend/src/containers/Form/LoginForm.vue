<script setup lang="ts">
import SubmitButton from "@/basic/SubmitButton.vue";

const submitButton = (): void => {
    console.log("submit");
};
</script>

<template>
    <v-container>
        <v-sheet width="450" class="mx-auto px-6 py-6 form">
            <v-form>
                 <v-row>
                    <v-col cols="12" class="pb-0">
                        <p>ログインIDとパスワードを入力してください</p>
                    </v-col>
                    <v-col cols="12">
                        <input type="text" class="input-form ps-2">
                    </v-col>
                    <v-col cols="12">
                        <input type="password" class="input-form ps-2">
                    </v-col>
                    <v-col cols="12">
                        <SubmitButton @submitButton="submitButton"></SubmitButton>
                    </v-col>
                </v-row>
            </v-form>
        </v-sheet>
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