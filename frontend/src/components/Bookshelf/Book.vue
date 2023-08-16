<script setup lang="ts">
import type { BookItem } from '@/interface';

interface Props {
    book: BookItem;
}

defineProps<Props>()
</script>

<template>
    <div class="book-container">
        <img class="book-image" :src="book.image_url">
    </div>
</template>

<style scoped lang="scss">
.book-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%; // widthをパーセンテージに変更
    background: #e5e5e5;
    cursor: pointer;
    overflow: hidden; //拡大時に画像がコンテナからはみ出さないようにする
    outline: 2px solid rgb(155, 155, 155);

    .book-image {
        max-width: 100%; //画像がコンテナをはみ出さないようにする
        transition: transform 0.2s ease-in-out;
    }

    &:hover {
        .book-image {
            transform: scale(1.05); //1.05倍に拡大
        }
    }
}
</style>
