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
    <v-badge color="blue" overlap class="book-badge">
      <template v-slot:badge>
        <span>{{ series.counter }}冊</span>
      </template>
    </v-badge>
  </div>
</template>

<style scoped lang="scss">
.book-container {
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

  &.book-stack {
    box-shadow: 7px -7px 0 0 rgb(208, 208, 208), 12px -12px 0 0 rgb(163, 163, 163);
  }

  .book-image {
    max-width: 100%; //画像がコンテナをはみ出さないようにする
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
    bottom: 18px;
  }
}
</style>
