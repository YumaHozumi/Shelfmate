<script setup lang="ts">
import type { Series } from '@/interface'

//同じ作品はまとめる
interface Props {
  series: Series
}

defineProps<Props>()
</script>

<template>
  <div class="book-container book-stack">
    <img class="book-image" :src="series.pic" />
    <div class="title-container">
      {{ series.seriesTitle }}
    </div>
    
  </div>
</template>

<style scoped lang="scss">
.book-container {
  position: relative;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 60%; // widthをパーセンテージに変更
  background: #f3f3f3;
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
    white-space: nowrap;  // 改行を防ぐ
    overflow: hidden;     // オーバーフローしたテキストを隠す
    text-overflow: ellipsis; // オーバーフローしたテキストを「...」で表示
  }

  &.book-stack {
    box-shadow: 7px -7px 0 0 rgb(208, 208, 208), 12px -12px 0 0 rgb(163, 163, 163);
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

  .book-badge {
    position: absolute;
    right: 35px;
    top: 12px;
  }
}
</style>
