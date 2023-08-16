<script setup lang="ts">
import type { BookItem, BookShelf } from '@/interface';
import { ref, watch, toRef} from "vue";
import Books from "@/components/Bookshelf/Books.vue";
import { onMounted } from 'vue';
import { collection, getDoc, getDocs, query } from 'firebase/firestore';
import { firestore, getCurrentUser } from '@/config/firebase';
import { type Series} from "@/interface";
import BookComp from '@/components/Bookshelf/BookComp.vue';

interface Props {
  selectedBookshelf: BookShelf | undefined
}

const prop = defineProps<Props>()

const items = ref<(Series | BookItem)[]>([]);

onMounted(async() => {
    await getSeries();
})

const getSeries = async () => {
    const user = await getCurrentUser();
    // 本棚のシリーズコレクションへの参照を取得
    const doc_id = prop.selectedBookshelf?.doc_id;
    if(doc_id) {
      const seriesCollectionRef = collection(firestore, "users", user.uid, "bookshelves", doc_id, "series");
      const noSeriesBookCollection = collection(firestore, "users", user.uid, "bookshelves", doc_id, "books");
      getDocs(seriesCollectionRef).then((snapshot) => {
        snapshot.forEach((e) => {
          items.value.push(e.data() as Series)
        })
      })
  
      getDocs(noSeriesBookCollection).then((snapshot) => {
        snapshot.forEach((e) => {
          items.value.push(e.data() as BookItem);
        })
      })

    }
  }

const selectedBookshelf = toRef(prop, "selectedBookshelf");

watch(selectedBookshelf, async () => {
  items.value.length = 0;
  await getSeries();
})
</script>

<template>
    <v-container>
        <div class="bookshelf">
            <BookComp v-for="(element, index) in items" :key="index" :item="element"></BookComp>
        </div>
    </v-container>
</template>

<style scoped lang="scss">
.bookshelf {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); //ここでは、最小幅を100pxに設定しています。
  grid-gap: 20px;
  justify-content: start; //左詰め設定
  padding: 20px;
  
  @media (min-width: 600px) { //ビューポートが600px以上のとき
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); //本の最小幅を150pxに設定
  }
  
  @media (min-width: 900px) { //ビューポートが900px以上のとき
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); //本の最小幅を200pxに設定
  }
}

</style>