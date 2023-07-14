<script setup lang="ts">
import Logo from '@/basic/Logo.vue';
import SiteTitle from '@/basic/SiteTitle.vue';
import NavItem from '@/components/nav-items/NavItem.vue';
import LoginButton from '@/basic/LoginButton.vue';
import { ref } from 'vue';

const drawer = ref(false);
</script>

<template>
    <v-app-bar color="green">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <Logo></Logo>
        <SiteTitle></SiteTitle>

        <LoginButton></LoginButton>
    </v-app-bar>

    <v-navigation-drawer
    v-model="drawer"
        absolute
        temporary
    >
        <v-list nav dense>
            <NavItem label="ログアウト"></NavItem>

        </v-list>
    </v-navigation-drawer>

</template>