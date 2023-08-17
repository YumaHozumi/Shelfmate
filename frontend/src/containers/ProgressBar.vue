<script setup lang="ts">
import StepItem from '@/components/ProgressBar/StepItem.vue'
import StepLabel from '@/components/ProgressBar/StepLabel.vue'
import { ref } from 'vue'

interface Props {
  currentStep: number
}
defineProps<Props>()

const steps = ref(['STEP1', 'STEP2'])
const texts = ref(['メールアドレス入力', '確認メールの確認'])
</script>

<template>
  <v-container>
    <StepItem
      v-for="(step, index) in steps"
      :key="index"
      :label="step"
      :class="{ current: index === currentStep }"
      :itemCount="steps.length"
    ></StepItem>
    <StepLabel
      v-for="(text, index) in texts"
      :key="index"
      :label="text"
      :class="{ current: index === currentStep }"
      :itemCount="steps.length"
    ></StepLabel>
  </v-container>
</template>
