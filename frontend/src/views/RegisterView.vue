<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import ProgressBar from '@/containers/ProgressBar.vue';
import RegisterStep1 from '@/containers/Form/RegisterStep1.vue';
import RegisterStep2 from '@/containers/Form/RegisterStep2.vue';
import RegisterStep3 from '@/containers/Form/RegisterStep3.vue';
import router from '@/router'
import { ref } from 'vue';

const onNavigate = (name: string): void => {
  router.push({name: name});
}

// コンポーネントを変更するためのインデックス
const currentCompIndex = ref(0);

const switchComp = (): void => {
  currentCompIndex.value++;
}

const back = (): void => {
  currentCompIndex.value--;
}
</script>

<template>
    <Header @navigate="onNavigate"></Header>
    <v-sheet width="500" class="mx-auto form px-10 py-3">
        <ProgressBar :currentStep="currentCompIndex"></ProgressBar>
        <RegisterStep1 v-if="currentCompIndex == 0" @submitButton="switchComp"></RegisterStep1>
        <RegisterStep2 v-if="currentCompIndex == 1" @back="back" @submitButton="switchComp"></RegisterStep2>
        <RegisterStep3 v-if="currentCompIndex == 2"></RegisterStep3>
    </v-sheet>
</template>

<style scoped lang="scss">
.form {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
</style>