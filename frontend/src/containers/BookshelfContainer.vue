<script setup lang="ts">
import type { BookItem } from '@/interface';
import { ref } from "vue";
import Books from "@/components/Bookshelf/Books.vue";

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
</script>

<template>
    <v-container>
        <div class="bookshelf">
            <Books :books="books"></Books>
            <Books :books="books"></Books>
            <Books :books="books"></Books>
            <Books :books="books"></Books>
            <Books :books="books"></Books>
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