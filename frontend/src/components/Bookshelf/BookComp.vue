<script setup lang="ts">
import type { Series, BookItem } from '@/interface'
import Books from '@/components/Bookshelf/Books.vue'
import Book from '@/components/Bookshelf/Book.vue'
import FullDialog from '@/components/FullDialog.vue'
import BookDialog from '@/components/Bookshelf/BookDialog.vue'
import { ref, watch } from 'vue'

interface Props {
  item: Series | BookItem
  selectBookshelfId: string
  isEdit: boolean
}

const props = defineProps<Props>()

interface Emits {
  (event: "clickBook", item: Series | BookItem): void
}

const emit = defineEmits<Emits>();

const clickBook = (): void => {
  emit("clickBook", props.item);
}

const isSeries = (input: Series | BookItem): input is Series => {
  return (input as Series).counter !== undefined
}

const isSelected = ref(false);

const handleClick = () => {
  if(props.isEdit) {
    isSelected.value = !isSelected.value;
    clickBook();
  }
};

//editモードがfalseになったらselectは外す
watch(() => props.isEdit, (newVal) => {
  if (!newVal) {
    isSelected.value = false;
  }
});

</script>

<template>
  <FullDialog v-if="isSeries(item)" :series="item" :selectBookshelfId="selectBookshelfId" :isEdit="isEdit">
    <span class="books" :class="{ selected: isSelected }" @click="handleClick">
      <Books :series="item" :class="{dark: isEdit}"></Books>
      <v-badge color="blue" overlap class="book-badge" :class="{dark: isEdit}">
        <template v-slot:badge>
          <span class="count">{{ item.counter }}冊</span>
        </template>
      </v-badge>
      <v-icon class="check" v-show="isSelected">mdi-check</v-icon>
    </span>
  </FullDialog>

  <BookDialog v-else :book="item" :isEdit="isEdit">
    <span :class="{ editable: isEdit, selected: isSelected }" @click="handleClick">
      <Book :book="item" :class="{dark: isEdit}"></Book>
      <v-icon class="check" v-show="isSelected">mdi-check</v-icon>
    </span>
  </BookDialog>
</template>

<style scoped lang="scss">
.books {
  position: relative;
}

.selected {
  position: relative;

  .dark {
    filter: brightness(0.7);
  }
}

.check {
  position: absolute;
  left: 20%;
  top: 2%;
  color: white;
  background-color: orange;
  border-radius: 50%;
  padding: 15px;
  border: 3px solid white;
  
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
