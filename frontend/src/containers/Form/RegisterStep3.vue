<script setup lang="ts">
import Label from '@/basic/Label.vue';
</script>

<template>
    <v-form class="mx-1">
        <v-row class="mx-1">
            <v-col cols="12" class="pb-2 user-id">
                <p class="label mb-1">ユーザ ID</p>
                <p class="text">test@test</p>
            </v-col>
            <v-col cols="12" class="mt-3">
                <Label text="パスワード" class="mb-3"></Label>
                <input type="text" class="input-form ps-2 py-1">
            </v-col>
        </v-row>
    </v-form>
</template>

<style scoped lang="scss">
.user-id {
    .label {
        font-weight: bold;
    }
    .text {
        font-size: larger;
    }
}

.input-form {
    background-color: white;
    border: 1px solid rgb(206, 205, 205);
    width: 100%;
}
</style>