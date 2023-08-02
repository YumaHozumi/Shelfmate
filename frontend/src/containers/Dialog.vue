<script setup lang="ts">
import { ref, onUpdated } from 'vue';
import axios from "axios"
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const dialog = ref(false);

const onClickAddButton = (): void => {
  axios
  .get("/api/test")
  .then(res => console.log(res))
}

const isShow = ref(true);
const isbn = ref<number>();

const input = ref<HTMLInputElement | null>(null);

const focusInput = () => {
  input.value?.focus();
}

onUpdated(() => {
  if (dialog.value) {
    setTimeout(() => {
      focusInput();
    }, 0);
  }
})

onAuthStateChanged(getAuth(), (user) => {
  if(user && user.emailVerified) {
    console.log("ログイン済み");
    isShow.value = true;
  }else {
    console.log("ログインしてない")
    isShow.value = false;
  }
})
</script>

<template>
    <v-dialog v-model="dialog" width="400px">
        <template v-slot:activator="{ props }">
            <v-btn v-show="isShow" class="button register" @click="onClickAddButton" v-bind="props" ref="input">
                <v-icon>mdi-book-plus-outline</v-icon>
                本を追加
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                ISBNで本を登録
            </v-card-title>
            <v-card-text>
                <v-container>

                    <v-row>
                        <v-col cols="12">
                            <div class="group">
                                <input type="text" class="input-form ps-2 py-1 pe-3" v-model="isbn" ref="input">
                                <button class="py-1 px-2">
                                    <v-icon>mdi-camera</v-icon>
                                </button>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.button {
  font-weight: bold;
  font-size: 14px;
  &.register {
      border: 2px solid #4CAF50;
      background-color: #4CAF50;
      color: white;
  }

}

.group {
    display: flex;
    align-items: center; /* or flex-start, flex-end, baseline, etc. */
    button {
        border: 1px solid rgb(189, 189, 189);
        transition: all 0.3s ease-in-out; // Optional: for smooth transition

        &:hover {
            background-color: rgb(232, 232, 232); // Change the background color when hovered
        }
    }
}

.input-form {
    background-color: white;
    border: 1px solid rgb(206, 205, 205);
}
</style>