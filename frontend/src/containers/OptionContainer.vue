<script setup lang="ts">
import Menu from '@/components/Menu.vue';
</script>

<template>
    <v-app-bar height="35" flat class="transparency">
        <v-toolbar-title class="small">件数</v-toolbar-title>
        <Menu></Menu>

    </v-app-bar>
</template>

<style scoped lang="scss">
.small {
    font-size: 14px;
}

.transparency {
    background-color: white;
}
</style>