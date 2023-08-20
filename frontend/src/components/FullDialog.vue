<script setup lang="ts">
import { firestore, getCurrentUser } from '@/config/firebase'
import { type BookItem, type Series } from '@/interface'
import { collection, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import BookListItem from '@/components/BookListItem.vue'
import { sort } from '@/function'
import Menu from '@/components/Menu.vue'

interface Props {
  series: Series
  selectBookshelfId: string
}

const prop = defineProps<Props>()

const dialog = ref(false)
const bookList = ref<BookItem[]>([])

const onClickBook = async () => {
  const user = await getCurrentUser()

  if (prop.series.seriesId) {
    const booksCollection = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      prop.selectBookshelfId,
      'series',
      prop.series.seriesId,
      'books'
    )
    await getDocs(booksCollection).then((snapshot) => {
      bookList.value.length = 0;
      snapshot.forEach((book) => {
        bookList.value.push(book.data() as BookItem)
      })
      bookList.value = sort(bookList.value, menu[0]);
    })
  }
}

const menu = ['発売日が新しい順', '発売日が古い順', "巻数順(降順)", "巻数順(昇順)"]

const selectMenu = (index: number): void => {
  bookList.value = sort(bookList.value, menu[index])
}

</script>

<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <div v-bind="props" @click="onClickBook">
        <slot></slot>
      </div>
    </template>

    <v-card>
      <v-toolbar color="green">
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title> 作品一覧 </v-toolbar-title>
      </v-toolbar>

      <p class="text-count">件数: {{ series.counter }}件</p>
      <div class="menu-container">
        <Menu :items="menu" icon="mdi-sort" class="menu" @selectItem="selectMenu"></Menu>
      </div>
      <v-list>
        <v-list-item v-for="(book, index) in bookList" :key="index">
          <BookListItem :book="book"></BookListItem>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.book-item {
  margin: 10px auto;
  width: 95%;
}

.text-count {
  margin-left: 1%;
  margin-top: 0.4%;
}

.menu-container {
  display: flex;
  justify-content: flex-end;
  margin-right: 2%;

  .menu {
    background-color: white;
  }
}
</style>
