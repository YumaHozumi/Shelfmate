<script setup lang="ts">
import { ref } from 'vue';
import InputField from '@/components/FormComp/InputField.vue';
import type { BookItem, SelectSeriesItem } from '@/interface';
import { Timestamp } from 'firebase/firestore';
import DropdownMenu from '@/components/DropdownMenu.vue'

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
</script>

<template>
    <div class="my-form">
        <InputField
        v-model:value="book.title"
        label="書籍名"
        placeholder="Enter title"
        type="text"
        ></InputField>
        <InputField
            v-model:value="book.author"
            label="著者"
            placeholder="Enter author"
            type="text">
        </InputField>
        <InputField
            v-model:value="book.detail"
            label="詳細"
            placeholder="Enter detail"
            type="text"
        >
        </InputField>
        <InputField
            v-model:value="book.orderNumber"
            label="巻の番号"
            placeholder="Enter order number"
            type="number"
        >
        </InputField>

        <v-radio-group v-model="selectedRadio">
            <v-radio label="単体で登録" value="one"></v-radio>
            <v-radio label="シリーズもので登録" value="series"></v-radio>
        </v-radio-group>
        <DropdownMenu
            :seriesList="seriesList"
            :isDisabled="selectedRadio === 'one'"
            v-model:selected-series-id="selectedSeriesId"
            class="dropdown"
        ></DropdownMenu>
    </div>
    
</template>

<style scoped>
.dropdown {
    
}

.my-form {
    width: 80%;
    margin: 0 auto;
    
    @media (min-width: 1024px) {
        width: 50%;
    }
}
</style>