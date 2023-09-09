<script setup lang="ts">
import type { Series, BookItem } from '@/interface'
import Books from '@/components/Bookshelf/Books.vue'
import Book from '@/components/Bookshelf/Book.vue'
import FullDialog from '@/components/FullDialog.vue'
import BookDialog from '@/components/Bookshelf/BookDialog.vue'

interface Props {
  item: Series | BookItem
  selectBookshelfId: string
  isEdit: boolean
  isSelected: boolean
}

defineProps<Props>()

const isSeries = (input: Series | BookItem): input is Series => {
  return (input as Series).counter !== undefined
}
</script>

<template>
  <FullDialog v-if="isSeries(item)" :series="item" :selectBookshelfId="selectBookshelfId">
    <span class="books" :class="{ editable: isEdit}">
      <Books :series="item"></Books>
      <v-badge color="blue" overlap class="book-badge">
        <template v-slot:badge>
          <span class="count">{{ item.counter }}冊</span>
        </template>
      </v-badge>
    </span>
  </FullDialog>

  <BookDialog v-else :book="item">
    <span :class="{ editable: isEdit}">
      <Book :book="item" ></Book>
    </span>
  </BookDialog>
</template>

<style scoped lang="scss">
.books {
  position: relative;
}

.editable {
  position: relative;
  filter: brightness(0.7);
}

.book-badge {
    position: absolute;
    right: 25%;
    top: -5%;
  
    .count {
      font-size: larger;
    }
}

.book-container {
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 60%; // widthをパーセンテージに変更
  background: #f3f3f3;
  cursor: pointer;
  overflow: hidden; //拡大時に画像がコンテナからはみ出さないようにする
  outline: 2px solid rgb(155, 155, 155);

  &.book-stack {
    box-shadow: 7px -7px 0 0 rgb(208, 208, 208), 12px -12px 0 0 rgb(163, 163, 163);
  }

  .book-image {
    max-width: 100%; //画像がコンテナをはみ出さないようにする
    transition: transform 0.2s ease-in-out;
  }

  &:hover {
    .book-image {
      transform: scale(1.05); //1.05倍に拡大
    }
  }

}
</style>
