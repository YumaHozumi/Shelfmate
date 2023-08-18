<script setup lang="ts">
import { firestore, getCurrentUser } from '@/config/firebase'
import { type BookItem, type Series } from '@/interface'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import BookListItem from '@/components/BookListItem.vue'

interface Props {
  series: Series
  selectBookshelfId: string
}

const prop = defineProps<Props>()

const dialog = ref(false)
const bookList = ref<BookItem[]>([])

const count = ref(0);

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
      snapshot.forEach((book) => {
        bookList.value.push(book.data() as BookItem)
      })
    })
  }
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
</style>
