<script setup lang="ts">
import { ref } from 'vue';
import InputField from '@/components/FormComp/InputField.vue';
import type { BookItem } from '@/interface';
import { Timestamp } from 'firebase/firestore';


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



</script>

<template>
    <InputField
        v-model:value="book.title"
        label="Title"
        placeholder="Enter title"
        type="text"
    ></InputField>
    <InputField
        v-model:value="book.author"
        label="Author"
        placeholder="Enter author"
        type="text">
    </InputField>
    <InputField
        v-model:value="book.detail"
        label="Detail"
        placeholder="Enter detail"
        type="text"
    >
    </InputField>
    <InputField
        v-model:value="book.orderNumber"
        label="Order Number"
        placeholder="Enter order number"
        type="number"
    >
    </InputField>
</template>