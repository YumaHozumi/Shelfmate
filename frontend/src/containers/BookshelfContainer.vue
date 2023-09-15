<script setup lang="ts">
import type { BookItem, BookShelf } from '@/interface'
import { ref, watch, toRef } from 'vue'
import { onMounted } from 'vue'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { firebaseAuth, firestore, getCurrentUser } from '@/config/firebase'
import { type Series, isSeries, isBookItem, Action } from '@/interface'
import BookComp from '@/components/Bookshelf/BookComp.vue'
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth'
import { onUnmounted } from 'vue'
import { getSeriesData, setSeriesData } from '@/function'

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

onAuthStateChanged(firebaseAuth, (user) => {
  const doc_id = prop.selectedBookshelf?.doc_id
  if (user && doc_id) {
    unsubBook = onSnapshot(
      collection(firestore, 'users', user.uid, 'bookshelves', doc_id, 'books'),
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
      collection(firestore, 'users', user.uid, 'bookshelves', doc_id, 'series'),
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
          } else if(change.type === "modified") {
            const newData = change.doc.data() as Series;  // 新しいデータを取得します

            const index = items.value.findIndex((item) => isSeries(item) && item.seriesId === newData.seriesId);  // 該当のシリーズを見つけます

            if (index !== -1) {
              items.value[index] = newData;  // シリーズを新しいデータで更新します
            }

            emit('count', items.value.length);
            emit('update:propItems', items.value);
          }
        })
      }
    )
  }
})

onMounted(async () => {
  await getSeries()
})

onUnmounted(() => {
  unsubBook()
  unsubSeries()
})

const getSeries = async () => {
  const user = await getCurrentUser()
  // 本棚のシリーズコレクションへの参照を取得
  const doc_id = prop.selectedBookshelf?.doc_id
  if (doc_id) {
    const localCache = await getSeriesData(user.uid, doc_id)

    if (!localCache) {
      //キャッシュがないとき
      const noSeriesBookCollection = collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        doc_id,
        'books'
      )
      
      await getDocs(noSeriesBookCollection).then((snapshot) => {
        snapshot.forEach((e) => {
          const data = e.data() as BookItem // ここでBookItemとしてデータを取得
          // isbnをstringからnumberに変換します（isbnが存在する場合）
          if (data.isbn) {
            data.isbn = Number(data.isbn)
          }
          items.value.push(data) // 更新したデータを配列に追加
        })
      })
      
      await setSeriesData(user.uid, doc_id, items.value)
    } else {
  // キャッシュがあるときはキャッシュからデータを取得
      items.value = localCache.map((data: any) => {
        // isbnをstringからnumberに変換します（isbnが存在する場合）
        if (data.isbn) {
          data.isbn = Number(data.isbn);
        }
        return data;
      });
    }
    
    const seriesCollectionRef = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      doc_id,
      'series'
    )
    await getDocs(seriesCollectionRef).then((snapshot) => {
      snapshot.forEach((e) => {
        items.value.push(e.data() as Series)
      })
    })
    
    emit('count', items.value.length)
    emit('update:propItems', items.value)
    emit('initComp')
  }
}
const selectedBookshelf = toRef(prop, 'selectedBookshelf')

watch(selectedBookshelf, async () => {
  items.value.length = 0
  emit('update:propItems', items.value)
  await getSeries()
})

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
