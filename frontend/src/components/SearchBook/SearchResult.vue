<script setup lang="ts">
import imageURL from "@/assets/no-image.png";
import { computed } from 'vue';
import type { BookItem} from "@/interface.ts";

interface Props {
    book: BookItem;
}
//デフォルト値設定
const props = defineProps<Props>();
const localImage = computed((): string => {
    let localImage = props.book.image_url;
    if(localImage === undefined) {
        localImage = imageURL;
    }
    return localImage;
})
</script>

<template>
    <div class="book-item">
      <img class="book-cover" :src="localImage" alt="Book Cover">
      <div class="book-info">
        <h2 class="book-title">{{ book.title }}</h2>
        <p class="book-author">{{ book.author }}</p>
        <p class="book-detail">{{ book.detail }}</p>
      </div>
      <div class="book-actions">
        <v-btn color="green">Add to Cart</v-btn>
      </div>
    </div>
</template>

<style scoped lang="scss">
.book-item {
  position: relative; // Added
  display: flex;
  flex-direction: row;
  max-width: 55%;
  margin: 10px auto;
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

  .book-actions {
    position: absolute; // Added
    bottom: 10px; // Added
    right: 10px; // Added
    button {
      margin-right: 10px;
    }
  }
}
</style>

  