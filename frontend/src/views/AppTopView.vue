<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import LocalHeader from '@/containers/LocalHeader.vue'
import BookshelfContainer from '@/containers/BookshelfContainer.vue'
import OptionContainer from '@/containers/OptionContainer.vue'
import router from '@/router'
import { ref } from 'vue'
import { implementBookShelf, type BookShelf, type BookItem, type Series, Action } from '@/interface'
import { firestore, getCurrentUser } from '@/config/firebase'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { type User } from 'firebase/auth';
import { onMounted } from 'vue'

const onNavigate = (name: string): void => {
  router.push({ name: name })
}

onMounted(async () => {
  await initializeSelectedBookshelf();
})

const items = ref<(Series | BookItem)[]>([])

const clickLocalHeaderBtn = (bookshelf: BookShelf): void => {
  selectedBookshelf.value = bookshelf
}

const num = ref(0)

const getCount = (count: number): void => {
  num.value = count
}

const selectedBookshelf = ref<BookShelf | undefined>()

const initializeSelectedBookshelf = async () => {
  try {
    const user = await getCurrentUser()
    const bookshelvesRef = collection(firestore, 'users', user.uid, 'bookshelves')
    const snapshot = await getDocs(bookshelvesRef)
    const firstDoc = snapshot.docs[0]
    if (firstDoc) {
      const data = firstDoc.data()
      if (implementBookShelf(data)) {
        const bookShelfData: BookShelf = { doc_id: firstDoc.id, ...data }
        selectedBookshelf.value = bookShelfData
      }
    }
  } catch (e) {
    console.log(e)
  }
}
const isEdit = ref(false)

const clickBtn = (editMode: boolean) => {
  isEdit.value = editMode
}

const listBookItem = ref<BookItem[]>([])
const listSeries = ref<Series[]>([])

const clearList = () => {
  listBookItem.value.length = 0
  listSeries.value.length = 0
}

const clickBookItem = (item: BookItem, action: Action) => {
  if (action === Action.UPDATE) {
    // アイテムがまだリストに存在しない場合にのみ、アイテムをリストに追加します
    if (!listBookItem.value.some((existingItem) => existingItem.bookId === item.bookId)) {
      listBookItem.value.push(item)
    }
  } else if (action === Action.DELETE) {
    // 指定した bookId を持つアイテムをリストから削除します
    listBookItem.value = listBookItem.value.filter(
      (existingItem) => existingItem.bookId !== item.bookId
    )
  }
}

const clickSeries = (item: Series, action: Action) => {
  if (action === Action.UPDATE) {
    // アイテムがまだリストに存在しない場合にのみ、アイテムをリストに追加します
    if (!listSeries.value.some((existingItem) => existingItem.seriesId === item.seriesId)) {
      listSeries.value.push(item)
    }
  } else if (action === Action.DELETE) {
    // 指定した seriesId を持つアイテムをリストから削除します
    listSeries.value = listSeries.value.filter(
      (existingItem) => existingItem.seriesId !== item.seriesId
    )
  }
}

const deleteBook = async () => {
  try {
    const user = await getCurrentUser()

    if (!user) throw new Error('User not found');

    const bookshelfId = selectedBookshelf.value?.doc_id || ''

    await deleteBookItems(user, bookshelfId);

    await deleteSeries(user, bookshelfId);
    
    listBookItem.value.length = 0
    listSeries.value.length = 0
  } catch (e) {
    console.error('Error deleting books:', e)
  }
}

const deleteBookItems = async (user: User, bookshelfId: string) => {
     // listBookItemの各アイテムを削除
     for (const item of listBookItem.value) {
      //books以下に格納してある本の情報を削除
      const bookCollection = collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        bookshelfId,
        'books'
      )
      const qBook = query(bookCollection, where('bookId', '==', item.bookId))
      const querySnapshotBook = await getDocs(qBook)

      if (!querySnapshotBook.empty) {
        const docFirst = querySnapshotBook.docs[0]
        await deleteDoc(docFirst.ref)
      }

      //allBooks以下に格納してある本の情報を削除
      const allBooksCollection = collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        bookshelfId,
        'allBooks'
      )
      const q = query(allBooksCollection, where('bookId', '==', item.bookId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const docFirst = querySnapshot.docs[0]
        await deleteDoc(docFirst.ref)
      }
    }
}

const deleteSeries = async (user: User, bookshelfId: string) => {
   // listSeriesの各シリーズ下の全てのbooksを削除
   for (const series of listSeries.value) {
      if (!series.seriesId) continue
      const seriesBooksQuery = query(
        collection(
          firestore,
          'users',
          user.uid,
          'bookshelves',
          bookshelfId,
          'series',
          series.seriesId,
          'books'
        )
      )

      const seriesBooksSnapshot = await getDocs(seriesBooksQuery)
      for (const docSnapshot of seriesBooksSnapshot.docs) {
        const bookData = docSnapshot.data() as BookItem

        const allBooksCollection = collection(
          firestore,
          'users',
          user.uid,
          'bookshelves',
          bookshelfId,
          'allBooks'
        )
        const q = query(allBooksCollection, where('bookId', '==', bookData.bookId))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const docFirst = querySnapshot.docs[0]
          await deleteDoc(docFirst.ref)
        }
        
        await deleteDoc(docSnapshot.ref)
      }

      // After deleting all books in the series, delete the series itself
      const seriesDocRef = doc(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        bookshelfId,
        'series',
        series.seriesId
      )
      await deleteDoc(seriesDocRef)
  }
}

const selectMenu = (selectedMenu: string): void => {
  if (selectedMenu === '作品名順') {
    items.value.sort((a, b) => {
      const titleA = 'title' in a ? a.title : a.seriesTitle
      const titleB = 'title' in b ? b.title : b.seriesTitle
      return titleA.localeCompare(titleB)
    })
  }
}

const initComp = (): void => {
  selectMenu('作品名順')
}
</script>

<template>
  <Header @navigate="onNavigate"></Header>
  <LocalHeader @clickLocalHeaderBtn="clickLocalHeaderBtn"></LocalHeader>
  <OptionContainer :count="num" @clickBtn="clickBtn" @optionClick="selectMenu"></OptionContainer>
  <BookshelfContainer
    :selectedBookshelf="selectedBookshelf"
    v-if="selectedBookshelf"
    @count="getCount"
    @clearList="clearList"
    @clickBookItem="clickBookItem"
    @clickSeries="clickSeries"
    @initComp="initComp"
    :isEdit="isEdit"
    v-model:propItems="items"
  ></BookshelfContainer>
  <v-footer fixed dark class="footer" v-show="isEdit">
    <v-col class="text-center">
      <v-btn color="red" class="btn" @click="deleteBook">削除する</v-btn>
    </v-col>
  </v-footer>
</template>

<style scoped lang="scss">
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
