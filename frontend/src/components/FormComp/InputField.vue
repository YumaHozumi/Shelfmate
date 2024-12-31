<script setup lang="ts">
import { computed, watch, defineProps, defineEmits } from 'vue';

interface Props {
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  width?: string;
  errorMessage?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'error', isValid: boolean): void;
}>();

const hasError = computed(() => {
  return props.errorMessage !== '';
});

// hasErrorの値が変わるたびにerrorイベントを発火
watch(hasError, (flag) => {
  emit('error', !flag);
});
</script>

<template>
  <div class="input-field" :style="{ width: props.width }">
    <label class="input-label">{{ props.label }}</label>
    <input
      :type="props.type"
      :value="props.value"
      :placeholder="props.placeholder"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      class="input-control"
      :class="{ 'input-error': hasError }"
    >
    <span v-if="hasError" class="error-message">{{ props.errorMessage }}</span>
  </div>
</template>

<style scoped>
.input-field {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.input-control {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.input-error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>