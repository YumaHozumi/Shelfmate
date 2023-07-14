<script setup lang="ts">
import Logo from '@/basic/Logo.vue';
import SiteTitle from '@/basic/SiteTitle.vue';
import { ref } from 'vue';

const drawer = ref(false);
</script>

<template>
    <v-app-bar color="green">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <Logo></Logo>
        <SiteTitle></SiteTitle>
    </v-app-bar>

</template>