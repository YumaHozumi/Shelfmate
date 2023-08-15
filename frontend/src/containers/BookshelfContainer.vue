<script setup lang="ts">
import type { BookItem, BookShelf } from '@/interface';
import { ref } from "vue";
import Books from "@/components/Bookshelf/Books.vue";
import { onMounted } from 'vue';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore, getCurrentUser } from '@/config/firebase';
import type { constants } from 'buffer';

const books = ref<BookItem[]>([{
  bookId: 0,
  title: "hoge",
  image_url: "http://books.google.com/books/content?id=Xc3YDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  author: "aaa",
  detail: "gege",
  public_date: new Date(),
},
{
  bookId: 0,
  title: "hoge",
  image_url: "http://books.google.com/books/content?id=Xc3YDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  author: "aaa",
  detail: "gege",
  public_date: new Date(),
},
{
  bookId: 0,
  title: "hoge",
  image_url: "http://books.google.com/books/content?id=Xc3YDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
  author: "aaa",
  detail: "gege",
  public_date: new Date(),
}])

onMounted(async() => {
    await getSeries();
})

const getSeries = async () => {
    // const test = "OAuPO3RJ1pnHfb8bTGya"
    // const user = await getCurrentUser();
    // console.log(user.uid)
    // // 本棚のシリーズコレクションへの参照を取得
    // // 本棚のシリーズコレクションへの参照を取得
    // const seriesCollectionRef = collection(firestore, "users", user.uid, "bookshelves", test, "series");

    // // シリーズコレクション内のすべてのドキュメントID（シリーズID）を取得
    // const seriesSnapshot = await getDocs(seriesCollectionRef);
    // const seriesList = [];
    // for (const seriesDoc of seriesSnapshot.docs) {
    //   // 各シリーズIDの下にある本のコレクションを取得
    //   console.log("tes")
    //   console.log("")
    //   const booksRef = collection(seriesCollectionRef, seriesDoc.id, "books");
    //   const booksSnapshot = await getDocs(booksRef);
    //   const books: BookItem[] = [];
    //   booksSnapshot.forEach((bookDoc) => {
    //     // 各本のデータを取得してリストに追加
    //     books.push(bookDoc.data() as BookItem);
    //   });
    //   // シリーズリストに追加
    //   seriesList.push({ seriesId: seriesDoc.id, books: books });
    // }
    // console.log(seriesList)
  }
</script>

<template>
    <v-container>
        <div class="bookshelf">
            <Books :books="books"></Books>
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