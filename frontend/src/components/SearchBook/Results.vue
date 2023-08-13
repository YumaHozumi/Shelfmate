<script setup lang="ts">
import SearchResult from "@/components/SearchBook/SearchResult.vue"
import { ref } from "vue";
import type { BookItem } from "@/interface.ts"

interface Props {
    items: BookItem[]
}

defineProps<Props>();

interface Emits {
  (event: "registerBook", book: BookItem): void;
}

const emit = defineEmits<Emits>();

const registerBook = (book: BookItem): void => {
    emit("registerBook", book);
}
</script>

<template>
    <SearchResult v-for="item in items" :key="item.bookId" :book="item" @registerBook="registerBook"></SearchResult>
</template>