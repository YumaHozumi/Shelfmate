<script setup lang="ts">
import { firestore, getCurrentUser } from '@/config/firebase'
import { type BookItem, type Series } from '@/interface'
import { CollectionReference, QuerySnapshot, collection, deleteDoc, doc, getDocs, query, where, orderBy, updateDoc } from 'firebase/firestore'
import { ref } from 'vue'
import BookListItem from '@/components/BookListItem.vue'
import {
  sort,
  decrementCounter,
  fetchSeries
} from '@/function'
import Menu from '@/components/Menu.vue'
import { watch } from 'vue'
import type { User } from 'firebase/auth'

interface Props {
  series: Series
  selectBookshelfId: string
  isEdit: boolean
}

const prop = defineProps<Props>()

const dialog = ref(false)
const editMode = ref(false)
const bookList = ref<BookItem[]>([])

const clickEdit = () => {
  editMode.value = true
  selectedBooks.value.length = 0 //初期化
}

const clickCancel = () => {
  editMode.value = false
  selectedBooks.value.length = 0 //初期化
}

const getBooks = async () => {
  const user = await getCurrentUser()
  if (prop.isEdit) return
  if (!prop.series.seriesId) return;

  let books: QuerySnapshot<BookItem> = await fetchSeries(user, prop.selectBookshelfId, prop.series.seriesId);
  pushBooks(books);
  bookList.value = sort(bookList.value, menu[0]);
}

const pushBooks = (books: QuerySnapshot<BookItem>) => {
  bookList.value.length = 0;
  console.log("pushBooks");
  books.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data() as BookItem;
    bookList.value.push(data);
  })
}

const menu = ['発売日が新しい順', '発売日が古い順', '巻数順(降順)', '巻数順(昇順)']

const selectMenu = (index: number): void => {
  bookList.value = sort(bookList.value, menu[index])
}

// 選択された本を追跡するための ref 変数を作成
const selectedBooks = ref<BookItem[]>([])

watch(dialog, (newVal) => {
  if (!newVal) selectedBooks.value.length = 0
})

const deleteBooks = async () => {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error('User not found')
    }

    const seriesId: string = prop.series.seriesId ?? '';
    for (const book of selectedBooks.value) {
      //選択した本を削除
      
      await deleteBookItemFromBooksDB(book, user, prop.selectBookshelfId, seriesId);

      await deleteBookItemFromAllBooksDB(book, user, prop.selectBookshelfId, seriesId);
    }

    //本棚に表示する表紙の変更があったら変更
    await updateSeriesPic(user, prop.selectBookshelfId, seriesId);

    selectedBooks.value.length = 0
    await getBooks()
  } catch (e) {
    console.error('Error deleting books:', e)
  }
}

const bookItemCollection = (user: User, selectBookshelfId: string, seriesId: string): CollectionReference<BookItem> => {
  return collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        selectBookshelfId,
        'series',
        seriesId,
        'books'
  ) as CollectionReference<BookItem>
}

const deleteBookItemFromBooksDB = async (book: BookItem, user: User, selectBookshelfId: string, seriesId: string) => {
  const seriesBooksQuery = query(
    bookItemCollection(user, selectBookshelfId, seriesId),
    where('bookId', '==', book.bookId)
  )
  const querySnapshot = await getDocs(seriesBooksQuery)

  if (querySnapshot.empty) return;

  const docFirst = querySnapshot.docs[0]
  await deleteDoc(docFirst.ref)
  
  //本棚の件数減少させる
  const bookshelvesRef = collection(firestore, 'users', user.uid, 'bookshelves')
  const seriesRef = doc(
    bookshelvesRef,
    prop.selectBookshelfId,
    'series',
    prop.series.seriesId ?? ''
  )

  await decrementCounter(seriesRef)

}

const updateSeriesPic = async (user: User, selectBookshelfId: string, seriesId: string) => {
  const sortedQuery = query(
    bookItemCollection(user, selectBookshelfId, seriesId),
    orderBy("orderNumber", "desc")
  );

  const querySnapShot = await getDocs(sortedQuery);

  if(querySnapShot.empty) return;

  const updatePicItem = querySnapShot.docs[0].data() as BookItem;

  const seriesDoc = doc(firestore, 'users', user.uid, 'bookshelves', selectBookshelfId, 'series',seriesId);

  if (updatePicItem.image_url === undefined) return

  await updateDoc(seriesDoc,
    {'pic': updatePicItem.image_url}
  )
}

const deleteBookItemFromAllBooksDB = async (book: BookItem, user: User, selectBookshelfId: string, seriesId: string) => {
   //allBooksのDBの変更処理
   const seriesAllBooksQuery = query(
      collection(firestore, 'users', user.uid, 'bookshelves', prop.selectBookshelfId, 'allBooks'),
      where('bookId', '==', book.bookId)
    )
    
    const querySnapShot = await getDocs(seriesAllBooksQuery)

    if (querySnapShot.empty) return;

    const allBookDocFirst = querySnapShot.docs[0]
    await deleteDoc(allBookDocFirst.ref)

    if (prop.series.counter > 0) return;

    console.log("149Line " + seriesId)
    // 本が0冊になったら
    const seriesDocRef = doc(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      prop.selectBookshelfId,
      'series',
      seriesId
    )
    await deleteDoc(seriesDocRef)
  }
</script>

<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    :disabled="isEdit"
  >
    <template v-slot:activator="{ props }">
      <div v-bind="props" @click="getBooks">
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

      <div class="actions-bar">
        <p class="text-count">件数: {{ series.counter }}件</p>

        <div class="right-group">
          <div class="edit-btn-group">
            <button @click="clickCancel" v-if="editMode" class="edit-btn">キャンセル</button>
            <button color="blue" @click="clickEdit" v-else class="edit-btn">編集</button>
          </div>

          <div class="menu-container">
            <Menu :items="menu" icon="mdi-sort" class="menu" @selectItem="selectMenu"></Menu>
          </div>
        </div>
      </div>
      <v-list>
        <v-list-item v-for="book in bookList" :key="book.bookId">
          <v-row>
            <v-col :cols="editMode ? 1 : 0" class="checkbox-column">
              <v-checkbox
                v-model="selectedBooks"
                :value="book"
                class="checkbox"
                v-show="editMode"
              ></v-checkbox>
            </v-col>
            <v-col :cols="editMode ? 11 : 12">
              <BookListItem :book="book"></BookListItem>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
    <v-footer fixed dark class="footer" v-show="editMode">
      <v-col class="text-center">
        <v-btn color="red" class="btn" @click="deleteBooks">削除する</v-btn>
      </v-col>
    </v-footer>
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

.checkbox {
  margin-left: 50%;
}

.checkbox-column {
  display: flex;
  align-items: center;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1%;
  padding: 0.4% 0;

  .text-count {
    margin: 0;
  }

  .right-group {
    display: flex;
    align-items: center;

    .edit-btn-group {
      display: flex;
      align-items: center;

      .edit-btn {
        min-width: 60px; // 適切な最小幅を設定して、文字が折り返さないようにする
        margin-left: 16px; // 余白を調整
        white-space: nowrap; // 文字の折り返しを防ぐ
        color: #2196f3;
      }
    }

    .menu-container {
      display: flex;
      align-items: center;
      margin-left: 4px; // 余白を調整

      .menu {
        background-color: white;
      }
    }
  }
}

.menu-container {
  display: flex;
  justify-content: flex-end;
  margin-right: 2%;

  .menu {
    background-color: white;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 1.4%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.3);
  .btn {
    font-size: 14px;
    font-weight: bolder;
  }
}
</style>
