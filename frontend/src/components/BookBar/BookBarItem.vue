<script setup lang="ts">
interface Props {
    label: string;
    name: string;
}

defineProps<Props>();
</script>

<template>
    <li>{{ label }}</li>
</template>

<style scoped lang="scss">
li {
    display: inline-block;
    margin-right: 15px;
    width: 100px; // 例として100pxを設定しています。あなたのニーズに応じて調節してください。
    height: 20px; // これもあなたのニーズに応じて調節してください。
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

</style>