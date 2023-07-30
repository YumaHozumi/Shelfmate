<script setup lang="ts">
import LocalHeaderButton from '@/components/LocalHeaderButton.vue';
</script>

<template>
    <v-app-bar color="white" elevation="0" height="33" class="header-border">
        
        <LocalHeaderButton text="hoge"></LocalHeaderButton>
        <LocalHeaderButton text="hogeaaaaaaaaaaaaaaaaaa"></LocalHeaderButton>
        <LocalHeaderButton text="hoge"></LocalHeaderButton>
         
    </v-app-bar>

</template>

<style scoped lang="scss">
.header-border {
    border-top: 1px solid rgb(209, 209, 209);
    border-bottom: 1px solid rgb(209, 209, 209);
}
</style>