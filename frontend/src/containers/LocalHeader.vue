<script setup lang="ts">
import LocalHeaderButton from '@/components/LocalHeaderButton.vue';
</script>

<template>
    <v-app-bar color="green" elevation="0" class="fix">
        <LocalHeaderButton text="hoge" class="custom-button"></LocalHeaderButton>
        <LocalHeaderButton text="hogeaaaaaaaaaaaaaaaaaa" class="custom-button"></LocalHeaderButton>
        <LocalHeaderButton text="hoge" class="custom-button"></LocalHeaderButton>
         
    </v-app-bar>

</template>

<style scoped lang="scss">
.fix {
    height: 33px;

    .custom-button {
        margin-bottom: 35px;
    }
}
</style>
