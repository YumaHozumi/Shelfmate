<script setup lang="ts">
import type { BookItem, BookShelf } from '@/interface'
import { ref, watch, toRef } from 'vue'
import { onMounted } from 'vue'
import { collection, CollectionReference, getDocs, onSnapshot, QuerySnapshot} from 'firebase/firestore'
import { firebaseAuth, firestore, getCurrentUser } from '@/config/firebase'
import { type Series, isSeries, isBookItem, Action } from '@/interface'
import BookComp from '@/components/Bookshelf/BookComp.vue'
import { onAuthStateChanged, type Unsubscribe, type User } from 'firebase/auth'
import { onUnmounted } from 'vue'
import {fetchBookShelfNoSeries, fetchBookShelfSeries} from '@/function';

interface Props {
  selectedBookshelf: BookShelf | undefined
  isEdit: boolean
  propItems: (Series | BookItem)[]
}

const prop = defineProps<Props>()

interface Emits {
  (event: 'count', count: number): void
  (event: 'clickBookItem', item: BookItem, action: Action): void
  (event: 'clickSeries', series: Series, action: Action): void
  (event: 'clearList'): void
  (event: 'update:propItems', items: (Series | BookItem)[]): void
  (event: 'initComp'): void
}

const emit = defineEmits<Emits>()

const items = ref<(Series | BookItem)[]>([])

let unsubBook: Unsubscribe
let unsubSeries: Unsubscribe

const setUnsubs = (user: User, doc_id: string) => {
  unsubBook = onSnapshot(
    collection(firestore, 'users', user.uid, 'bookshelves', doc_id, 'books') as CollectionReference<BookItem>,
    {includeMetadataChanges: true},
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          const data = change.doc.data() as BookItem

          items.value = items.value.filter((item) => {
            if (isBookItem(item)) return item.bookId !== data.bookId
            return true // この行を追加
          })
          emit('count', items.value.length)
          emit('update:propItems', items.value)
        }
      })
    }
  )

  unsubSeries = onSnapshot(
    collection(firestore, 'users', user.uid, 'bookshelves', doc_id, 'series') as CollectionReference<Series>,
    {includeMetadataChanges: true},
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          const data = change.doc.data() as Series

          items.value = items.value.filter((item) => {
            if (isSeries(item)) return item.seriesId !== data.seriesId
            return true
          })
          emit('count', items.value.length)
          emit('update:propItems', items.value)
        } else if (change.type === 'modified') {
          const newData = change.doc.data() as Series // 新しいデータを取得します
          const index = items.value.findIndex(
            (item) => isSeries(item) && item.seriesId === newData.seriesId
          ) // 該当のシリーズを見つけます

          if (index !== -1) {
            items.value[index] = newData // シリーズを新しいデータで更新します
          }

          emit('count', items.value.length)
          emit('update:propItems', items.value)
        }
      })
    }
  )
}

onAuthStateChanged(firebaseAuth, (user) => {
  const doc_id = prop.selectedBookshelf?.doc_id
  if (user && doc_id) {
    setUnsubs(user, doc_id)
  }
})

onMounted(async () => {
  await getSeries()
})

onUnmounted(() => {
  unsubBook()
  unsubSeries()
})

//シリーズものじゃない本を本棚に追加
const pushBookShelfNoSeries = async (noSeriesSnapshot: QuerySnapshot<BookItem>) => {
  noSeriesSnapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data() as BookItem; // BookItemとしてデータを取得

    // isbnをstringからnumberに変換（isbnが存在する場合）
    if (data.isbn) {
      data.isbn = Number(data.isbn);
    }
    console.log(data)
    items.value.push(data); // 更新したデータを配列に追加
  });
}

//シリーズものの本を本棚に追加
const pushBookShelfSeries = async (seriesSnapshot: QuerySnapshot<Series>) => {
  seriesSnapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data() as Series;
    console.log(data)
    items.value.push(data);
  })
}

const getSeries = async () => {
  const user = await getCurrentUser()
  // 本棚のシリーズコレクションへの参照を取得
  const doc_id = prop.selectedBookshelf?.doc_id
  if(!doc_id) return;
  console.log("Now getSeries")
  let noSeriesSnapshot: QuerySnapshot<BookItem> = await fetchBookShelfNoSeries(user, doc_id);
  pushBookShelfNoSeries(noSeriesSnapshot);

  let seriesSnapshot: QuerySnapshot<Series> = await fetchBookShelfSeries(user, doc_id);
  pushBookShelfSeries(seriesSnapshot);

  emit('count', items.value.length)
  emit('update:propItems', items.value)
  emit('initComp')
  
}
const selectedBookshelf = toRef(prop, 'selectedBookshelf')

watch(selectedBookshelf, async (newVal, oldVal) => {
  if (oldVal) {
    // 古いリスナーを解除
    unsubBook()
    unsubSeries()
  }

  items.value.length = 0
  emit('update:propItems', items.value)
  await getSeries()

  if (newVal && newVal.doc_id) {
    // 新しいリスナーを設定
    await setupRealtimeUpdates(newVal.doc_id)
  }
})

const setupRealtimeUpdates = async (doc_id: string) => {
  const user = await getCurrentUser()
  setUnsubs(user, doc_id)
}

const clickBook = (item: Series | BookItem, isSelected: boolean): void => {
  if (isSelected) {
    if (isSeries(item)) emit('clickSeries', item as Series, Action.UPDATE)
    else if (isBookItem(item)) emit('clickBookItem', item as BookItem, Action.UPDATE)
  } else {
    if (isSeries(item)) emit('clickSeries', item as Series, Action.DELETE)
    else if (isBookItem(item)) emit('clickBookItem', item as BookItem, Action.DELETE)
  }
}

watch(
  () => prop.isEdit,
  (newVal) => {
    if (!newVal) {
      //editがfalseになったら初期化
      emit('clearList')
    }
  }
)
</script>

<template>
  <v-container>
    <div class="bookshelf">
      <BookComp
        v-for="element in items"
        :key="isSeries(element) ? element.seriesId : element.bookId"
        :item="element"
        :selectBookshelfId="selectedBookshelf?.doc_id || ''"
        :isEdit="isEdit"
        @clickBook="clickBook"
      ></BookComp>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.bookshelf {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(100px, 1fr)
  ); //ここでは、最小幅を100pxに設定しています。
  grid-gap: 20px;
  justify-content: start; //左詰め設定
  padding: 20px;

  @media (min-width: 600px) {
    //ビューポートが600px以上のとき
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); //本の最小幅を150pxに設定
  }

  @media (min-width: 900px) {
    //ビューポートが900px以上のとき
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); //本の最小幅を200pxに設定
  }
}
</style>
