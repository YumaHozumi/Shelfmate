<script setup lang="ts">
import StepItem from "@/components/ProgressBar/StepItem.vue";
import { ref } from "vue";

const steps = ref(["STEP1", "STEP2", "STEP3"])
const currentStep = ref(1);
</script>

<template>
    <v-container>
        <StepItem v-for="(step, index) in steps" :key="index" :label="step"
        :class="{current: index+1 === currentStep}"></StepItem>
    </v-container>
</template>

