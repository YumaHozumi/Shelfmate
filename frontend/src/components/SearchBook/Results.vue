<script setup lang="ts">
import SearchResult from "@/components/SearchBook/SearchResult.vue"
import { ref } from "vue";
import type { BookItem } from "@/interface.ts"

interface Props {
    items: BookItem[]
}

defineProps<Props>();
</script>

<template>
    <SearchResult v-for="item in items" :key="item.isbn" :title="item.title" :image="item.image_url"></SearchResult>
</template>