<script setup lang="ts">
import type { BookItem } from '@/interface.ts'

interface Props {
  book: BookItem
}
//デフォルト値設定
defineProps<Props>()
</script>

<template>
  <div class="book-item">
    <img class="book-cover" :src="book.image_url" alt="Book Cover" />
    <div class="book-info">
      <h2 class="book-title">{{ book.title }}</h2>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-detail">{{ book.detail }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.book-item {
  position: relative; // Added
  display: flex;
  flex-direction: row;
  border: 1px solid #ccc;
  padding: 10px;

  .book-cover {
    width: 128px;
    height: 201px;
    object-fit: cover; // 全体が見えるようにフィットさせる
  }

  .book-info {
    padding-left: 10px;
    flex: 1;

    .book-title {
      font-size: 18px;
      font-weight: bold;
    }

    .book-author {
      font-size: 14px;
    }

    .book-detail {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
