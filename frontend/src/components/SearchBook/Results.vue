<script setup lang="ts">
import SearchResult from '@/components/SearchBook/SearchResult.vue'
import type { BookItem } from '@/interface'

interface Props {
  items: BookItem[]
  registeredBooks: BookItem[]
}

defineProps<Props>()

interface Emits {
  (event: 'registerBook', book: BookItem): void
}

const emit = defineEmits<Emits>()

const registerBook = (book: BookItem): void => {
  emit('registerBook', book)
}
</script>

<template>
  <SearchResult
    v-for="item in items"
    :key="item.bookId"
    :book="item"
    @registerBook="registerBook"
    :isRegistered="registeredBooks.some((b) => b.bookId === item.bookId)"
  ></SearchResult>
</template>
