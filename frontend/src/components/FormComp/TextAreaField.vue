<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  label: string;
  value?: string;
  placeholder?: string;
  width?: string;
  errorMessage?: string;
  required?: boolean;
  rows?: number;
  cols?: number;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  rows: 4, // デフォルトの行数
  cols: 50, // デフォルトの列数（幅）
});

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'error', isValid: boolean): void;
}>();

const hasError = computed(() => {
  // errorMessageがpropsに渡されていないときはエラーがないと判断
  if (!props.errorMessage) {
    return false;
  }
  return props.errorMessage !== '';
});

// hasErrorの値が変わるたびにerrorイベントを発火
watch(hasError, (flag) => {
  emit('error', !flag);
});
</script>

<template>
  <div class="textarea-field" :style="{ width: props.width }">
    <label class="textarea-label">
      {{ props.label }}
      <span v-if="props.required" class="required-asterisk">*</span>
    </label>
    <textarea
      :value="props.value"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :cols="props.cols"
      @input="emit('update:value', ($event.target as HTMLTextAreaElement).value)"
      class="textarea-control"
      :class="{ 'textarea-error': hasError }"
    ></textarea>
    <span v-if="hasError" class="error-message">{{ props.errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
.textarea-field {
  margin-bottom: 1rem;
}

.textarea-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;

  .required-asterisk {
    color: red;
    margin-left: 0.25rem;
  }
}

.textarea-control {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
  resize: vertical; /* 縦方向のリサイズを許可 */
}

.textarea-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.textarea-error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>