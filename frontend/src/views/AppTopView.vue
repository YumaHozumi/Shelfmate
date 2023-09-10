<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import LocalHeader from '@/containers/LocalHeader.vue'
import BookshelfContainer from '@/containers/BookshelfContainer.vue'
import OptionContainer from '@/containers/OptionContainer.vue'
import router from '@/router'
import { ref } from 'vue'
import { implementBookShelf, type BookShelf, type BookItem, type Series, Action } from '@/interface'
import { firestore, getCurrentUser } from '@/config/firebase'
import { collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore'

const onNavigate = (name: string): void => {
  router.push({ name: name })
}

const clickLocalHeaderBtn = (bookshelf: BookShelf): void => {
  selectedBookshelf.value = bookshelf
}

const num = ref(0);

const getCount = (count: number): void => {
  num.value = count;
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

initializeSelectedBookshelf() // 関数を呼び出し、selectedBookshelfを初期化
const isEdit = ref(false);

const clickBtn = (editMode: boolean) => {
  isEdit.value = editMode;
}

const listBookItem = ref<BookItem[]>([])
const listSeries = ref<Series[]>([]);

const clearList = () => {
  listBookItem.value.length = 0;
  listSeries.value.length = 0;
}

const clickBookItem = (item: BookItem, action: Action) => {
  if (action === Action.UPDATE) {
    // アイテムがまだリストに存在しない場合にのみ、アイテムをリストに追加します
    if (!listBookItem.value.some(existingItem => existingItem.bookId === item.bookId)) {
      listBookItem.value.push(item);
    }
  } else if (action === Action.DELETE) {
    // 指定した bookId を持つアイテムをリストから削除します
    listBookItem.value = listBookItem.value.filter(existingItem => existingItem.bookId !== item.bookId);
  }
}

const clickSeries = (item: Series, action: Action) => {
  if (action === Action.UPDATE) {
    // アイテムがまだリストに存在しない場合にのみ、アイテムをリストに追加します
    if (!listSeries.value.some(existingItem => existingItem.seriesId === item.seriesId)) {
      listSeries.value.push(item);
    }
  } else if (action === Action.DELETE) {
    // 指定した seriesId を持つアイテムをリストから削除します
    listSeries.value = listSeries.value.filter(existingItem => existingItem.seriesId !== item.seriesId);
  }
}


const deleteBook = async () => {
  console.log(selectedBookshelf.value)
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not found');
    }

    const uid = user.uid;
    
    // listBookItemの各アイテムを削除
    for (const item of listBookItem.value) {
      const bookDocRef = doc(firestore, 'users', uid, 'bookshelves', selectedBookshelf.value?.doc_id || '', 'books', item.bookId);
      await deleteDoc(bookDocRef);
    }
    
    // listSeriesの各シリーズ下の全てのbooksを削除
    for (const series of listSeries.value) {
      if (!series.seriesId) continue;

      const seriesBooksQuery = query(
        collection(firestore, 'users', uid, 'bookshelves', selectedBookshelf.value?.doc_id || '', 'series', series.seriesId, 'books')
      );
      
      const seriesBooksSnapshot = await getDocs(seriesBooksQuery);
      for (const doc of seriesBooksSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
    }
  } catch (e) {
    console.error('Error deleting books:', e);
  }
}
</script>

<template>
  <Header @navigate="onNavigate"></Header>
  <LocalHeader @clickLocalHeaderBtn="clickLocalHeaderBtn"></LocalHeader>
  <OptionContainer :count="num" @clickBtn="clickBtn"></OptionContainer>
  <BookshelfContainer
    :selectedBookshelf="selectedBookshelf"
    v-if="selectedBookshelf"
    @count="getCount"
    @clearList="clearList"
    @clickBookItem="clickBookItem"
    @clickSeries="clickSeries"
    :isEdit="isEdit"
  ></BookshelfContainer>
  <v-footer fixed dark class="footer" v-show="isEdit">
    <v-col class="text-center">
      <v-btn color="red" class="btn" @click="deleteBook">削除する</v-btn>
    </v-col>
  </v-footer>
</template>


<style scoped lang="scss">.footer {
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