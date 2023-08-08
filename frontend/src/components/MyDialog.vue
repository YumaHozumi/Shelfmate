<script setup lang="ts">
import { ref } from "vue";

const dialog = ref(false);

interface Props {
    btnText: string,
    isShow: Boolean,
}

defineProps<Props>();

interface Emits {
    (event: "onCreateButton"): void
}

const emit = defineEmits<Emits>();

const inputText = ref("");

const onCreateButton = (): void => {
    emit("onCreateButton");
}
</script>

<template>
    <v-dialog v-model="dialog" max-width="400px" transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="button register" v-show="isShow">
                <v-icon>mdi-bookshelf</v-icon>
                {{ btnText }}
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <v-icon>mdi-pen-plus</v-icon>
                本棚の名前
            </v-card-title>
            <v-card-text>
            <v-text-field v-model="inputText"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
            <v-btn color="green" @click="onCreateButton">作成</v-btn>
            <v-btn color="green" @click="dialog = false">閉じる</v-btn>
            </v-card-actions>
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
</style>

