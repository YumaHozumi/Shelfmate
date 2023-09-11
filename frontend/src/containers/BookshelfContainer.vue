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

interface Props {
  selectedBookshelf: BookShelf | undefined
  isEdit: boolean
}

const prop = defineProps<Props>()

interface Emits {
  (event: "count", count: number): void
  (event: "clickBookItem", item: BookItem, action: Action): void
  (event: "clickSeries", series: Series, action: Action): void
  (event: "clearList"): void
}

const emit = defineEmits<Emits>();

const items = ref<(Series | BookItem)[]>([])

let unsubBook: Unsubscribe;
let unsubSeries: Unsubscribe

onAuthStateChanged(firebaseAuth, (user) => {
  const doc_id = prop.selectedBookshelf?.doc_id;
  if(user && doc_id) {
    unsubBook = onSnapshot(
      collection(firestore,'users',user.uid,'bookshelves',doc_id,'books'), 
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === "removed"){
            const data = change.doc.data() as BookItem;
            
            items.value = items.value.filter(item => {
              if(isBookItem(item)) {
                return item.bookId !== data.bookId;
              }
            })
            emit("count", items.value.length);
          }
       })
      }
    )

    unsubSeries = onSnapshot(
      collection(firestore, "users", user.uid, "bookshelves", doc_id, "series"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === "removed") {
            const data = change.doc.data() as Series;

            items.value = items.value.filter(item => {
              if(isSeries(item))  return item.seriesId !== data.seriesId;
            })
            emit("count", items.value.length);
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
    const seriesCollectionRef = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      doc_id,
      'series'
    )
    const noSeriesBookCollection = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      doc_id,
      'books'
    )
    await getDocs(seriesCollectionRef).then((snapshot) => {
      snapshot.forEach((e) => {
        items.value.push(e.data() as Series)
      })
    })

    await getDocs(noSeriesBookCollection).then((snapshot) => {
      snapshot.forEach((e) => {
        items.value.push(e.data() as BookItem)
      })
    })

    emit("count", items.value.length);
  }
}
const selectedBookshelf = toRef(prop, 'selectedBookshelf')

watch(selectedBookshelf, async () => {
  items.value.length = 0
  await getSeries()
})

const clickBook = (item: Series | BookItem, isSelected: boolean): void => {
  if(isSelected) {
    if (isSeries(item)) emit("clickSeries", item as Series, Action.UPDATE);
    else emit("clickBookItem", item as BookItem, Action.UPDATE);
  }else{
    if(isSeries(item)) emit("clickSeries", item as Series, Action.DELETE);
    else emit("clickBookItem", item as BookItem, Action.DELETE);
  }
}

watch(() => prop.isEdit, (newVal) => {
  if (!newVal) {
    //editがfalseになったら初期化
    emit("clearList");
  }
});
</script>

<template>
  <v-container>
    <div class="bookshelf">
      <BookComp
        v-for="(element, index) in items"
        :key="index"
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
