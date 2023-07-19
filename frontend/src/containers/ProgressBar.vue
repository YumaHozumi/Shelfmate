<script setup lang="ts">
import StepItem from "@/components/ProgressBar/StepItem.vue";
import StepLabel from "@/components/ProgressBar/StepLabel.vue";
import { ref } from "vue";

interface Props {
    currentStep: number;
}
defineProps<Props>();

const steps = ref(["STEP1", "STEP2", "STEP3"])
const texts = ref(["メールアドレス入力", "確認コードの入力", "情報の入力"])

</script>

<template>
    <v-container>
        <StepItem v-for="(step, index) in steps" :key="index" :label="step"
        :class="{current: index === currentStep}"></StepItem>
        <StepLabel v-for="(text, index) in texts" :key="index" :label="text"
        :class="{current: index === currentStep}"></StepLabel>
    </v-container>
</template>

