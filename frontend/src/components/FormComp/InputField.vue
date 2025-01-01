<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits, onMounted } from 'vue';
import type { ValidationRule } from '@/interface';

interface Props {
  label: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  width?: string;
  rules: ValidationRule[];
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  rules: () => [],
  value: '',
  type: 'text',
  placeholder: '',
  width: '100%',
});

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'error', isValid: boolean): void;
}>();

const errorMessage = ref<string>("");

const validate = () => {
  // 必須チェック
  if (props.required && !props.value) {
    errorMessage.value = 'この項目は必須です';
    return;
  }

  // ルールによるバリデーション
  for (const rule of props.rules) {
    if (!rule.validate(props.value)) {
      errorMessage.value = rule.message;
      return;
    }
  }

  errorMessage.value = '';
};
// エラーがあるかどうかのフラグ
const hasError = computed(() => errorMessage.value.length > 0);

watch(() => props.value, validate);
// hasErrorの値が変わるたびにerrorイベントを発火
watch(hasError, (flag) => {
  emit('error', flag);
});

onMounted(() => {
  validate();
});
</script>

<template>
  <div class="input-field" :style="{ width: props.width }">
    <label class="input-label">
      {{ props.label }}
      <span v-if="props.required" class="required-asterisk">*</span>
    </label>
    <input
      :type="props.type"
      :value="props.value"
      :placeholder="props.placeholder"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
      class="input-control"
      :class="{ 'input-error': hasError }"
    >
    <span v-if="hasError" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
.input-field {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;

  .required-asterisk {
    color: red;
    margin-left: 0.25rem;
  }
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