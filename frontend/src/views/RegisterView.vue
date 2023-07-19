<script setup lang="ts">
import Header from '@/containers/Header.vue'
import ProgressBar from '@/containers/ProgressBar.vue';
import RegisterStep1 from '@/containers/Form/RegisterStep1.vue';
import router from '@/router'

const onNavigate = (name: string): void => {
  router.push({name: name});
}
</script>

<template>
    <Header @navigate="onNavigate"></Header>
    <v-sheet width="500" class="mx-auto form px-10 py-3">
        <ProgressBar></ProgressBar>
        <RegisterStep1></RegisterStep1>
    </v-sheet>
</template>

<style scoped lang="scss">
.form {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
</style>