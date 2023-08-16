<script setup lang="ts">
import type { BookShelf } from '@/interface';

interface Props {
    bookshelf: BookShelf
}

const prop = defineProps<Props>();

interface Emits {
    (event: "clickLocalHeaderBtn", bookshelf: BookShelf): void;
}

const emit = defineEmits<Emits>();

const clickLocalHeaderBtn = (): void => {
    emit("clickLocalHeaderBtn", prop.bookshelf);
}
</script>

<template>
    <button class="local-header-button" @click="clickLocalHeaderBtn">{{ bookshelf.shelf_name }}</button>
</template>

<style scoped lang="scss">
.local-header-button {
    /* 既存のスタイル */
    width: 100px;
    min-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* ホバー時のアニメーション */
    transition: background-color 0.3s ease;

    &:hover {
        /* ホバー時の背景色とスケール変更 */
        background-color: #f1f1f1; /* ここにあなたが望む色を設定します */
    }

    &:active {
        /* クリック時のスケール変更 */
        transform: scale(0.95); /* ここにあなたが望むスケールを設定します */
    }
}
</style>

