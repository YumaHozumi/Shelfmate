<script setup lang="ts">
import { ref, watch, reactive, computed} from 'vue';
import InputField from '@/components/FormComp/InputField.vue';
import type { BookItem, SelectSeriesItem } from '@/interface';
import { Timestamp } from 'firebase/firestore';
import DropdownMenu from '@/components/DropdownMenu.vue'
import TextAreaField from '@/components/FormComp/TextAreaField.vue'
import { createTextLengthRule, textNumberRule, positiveNumberRule } from '@/validation';

const book = ref<BookItem>({
  bookId: '',
  isbn: 0,
  title: '',
  imageURL: '',
  author: '',
  detail: '',
  public_date: Timestamp.now(),
  seriesId: '',
  orderNumber: 0
});

const selectedRadio = ref<string>('one');
const seriesList = ref<SelectSeriesItem[]>([])

const selectedSeriesId = ref<string>('')

const textLengthRule = createTextLengthRule(100);


// エラー状態の管理
const hasError = reactive<Record<string, boolean>>({
  title: true,      // 必須項目
  author: false,    // 任意項目
  detail: false,    // 任意項目
  orderNumber: false // シリーズ選択時のみ必須
});

// フォーム全体の有効性確認
const isFormValid = computed(() => {
  return Object.values(hasError).every((v) => !v);
});

const updateErrorState = (field: string, isValid: boolean) => {
  hasError[field] = isValid;
};

// ラジオボタンの変更監視
watch(() => selectedRadio.value, (newValue) => {
  if (newValue === 'series') {
    // シリーズ選択時は巻番号の入力状態をチェック
    hasError.orderNumber = !book.value.orderNumber;
  } else {
    // 単体選択時は巻番号のエラーをクリア
    hasError.orderNumber = false;
  }
});

// 送信処理
const submit = async () => {
  if (!isFormValid.value) {
    console.error('フォームにエラーがあります');
    return;
  }
};

const detailErrorMessage = ref('');

watch(
  () => book.value.detail,
  (newVal) => {
    if (newVal.length > 1000) {
      detailErrorMessage.value = '1000文字以内で入力してください。';
    } else {
      detailErrorMessage.value = '';
    }
  }
);

</script>

<template>
    <p>{{ hasError }}</p>
    <p>{{ isFormValid ? 'Form is valid' : 'Form is invalid' }}</p>
    <div class="my-form">
        <InputField
            v-model:value="book.title"
            label="書籍名"
            placeholder="吾輩は猫である"
            type="text"
            :required="true"
            :rules="[textLengthRule]"
            @error="(isValid) => updateErrorState('title', isValid)"
        ></InputField>
        <InputField
            v-model:value="book.author"
            label="著者"
            placeholder="夏目漱石"
            type="text"
            :rules="[textLengthRule]"
            @error="(isValid) => updateErrorState('author', isValid)"
        >
        </InputField>
        <TextAreaField
            v-model:value="book.detail"
            label="詳細"
            placeholder="本の詳細"
            :error-message="detailErrorMessage"
            @error="(isValid) => updateErrorState('detail', isValid)"
        >
        </TextAreaField>
        <v-radio-group v-model="selectedRadio">
            <v-radio label="単体で登録" value="one"></v-radio>
            <v-radio label="シリーズもので登録" value="series"></v-radio>
        </v-radio-group>

        <InputField
            v-if="selectedRadio === 'series'"
            v-model:value="book.orderNumber"
            label="巻の番号"
            placeholder="Enter order number"
            type="number"
            :required="true"
            :rules="[textNumberRule, textLengthRule, positiveNumberRule]"
            @error="(isValid) => updateErrorState('orderNumber', isValid)"
        >
        </InputField>

        <DropdownMenu
            :seriesList="seriesList"
            :isDisabled="selectedRadio === 'one'"
            v-model:selected-series-id="selectedSeriesId"
            class="dropdown"
        ></DropdownMenu>

        <v-btn color="primary" @click="submit" :disabled="!isFormValid" class="mt-5">登録</v-btn>
    </div>
    
</template>

<style scoped lang="scss">
.my-form {
    width: 80%;
    margin: 0 auto;
    
    @media (min-width: 1024px) {
        width: 50%;
    }
}
</style>