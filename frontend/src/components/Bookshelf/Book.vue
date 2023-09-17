<script setup lang="ts">
import type { BookItem } from '@/interface'

interface Props {
  book: BookItem
}

defineProps<Props>()
</script>

<template>
  <div class="book-container">
    <img class="book-image" :src="book.image_url" />
    <div class="title-container">
      {{ book.title }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.book-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 60%; // widthをパーセンテージに変更
  background: #e5e5e5;
  cursor: pointer;
  overflow: hidden; //拡大時に画像がコンテナからはみ出さないようにする
  outline: 2px solid rgb(155, 155, 155);

  .title-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    padding: 5px;
    white-space: nowrap; // 改行を防ぐ
    overflow: hidden; // オーバーフローしたテキストを隠す
    text-overflow: ellipsis; // オーバーフローしたテキストを「...」で表示
  }

  .book-image {
    width: 100%; // コンテナの幅に合わせる
    height: 100%; // コンテナの高さに合わせる
    object-fit: cover; // アスペクト比を保持しながら、コンテナに画像をフィットさせる
    transition: transform 0.2s ease-in-out;
  }

  &:hover {
    .book-image {
      transform: scale(1.05); //1.05倍に拡大
    }
  }
}
</style>
