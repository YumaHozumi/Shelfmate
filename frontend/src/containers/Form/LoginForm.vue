<script setup lang="ts">
import SubmitButton from "@/basic//Login/SubmitButton.vue";
import GoogleLogin from "@/basic/Login/GoogleLoginButton.vue";
import NewRegisterLink from "@/basic/Login/NewRegisterLink.vue";

const submitButton = (): void => {
    console.log("submit");
};

const clickGoogleLoginButton = (): void => {
    console.log("google");
};
</script>

<template>
    <v-container>
        <v-row>
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
                        <GoogleLogin @clickGoogleLoginButton="clickGoogleLoginButton"></GoogleLogin>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-row>
        <v-row>
            <v-sheet width="450" class="mx-auto text-center pt-3">
                <NewRegisterLink></NewRegisterLink>
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