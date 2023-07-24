<script setup lang="ts">
import Book from "@/components/Bookshelf/Book.vue"

</script>

<template>
    <div class="bookshelf">
        <Book img="https://iss.ndl.go.jp/thumbnail/9784422311074"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
        <Book img="https://cover.openbd.jp/9784780802047.jpg"></Book>
    </div>

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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); //本の最小幅を200pxに設定
  }
}

</style>