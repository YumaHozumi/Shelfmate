<script setup lang="ts">
interface Props {
    label: string;
}

defineProps<Props>();
</script>

<template>
    <li>{{ label }}</li>
</template>

<style scoped lang="scss">
li {
    list-style-type: none;
    display: inline-block;
    width: 33.333%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #E0E0E0;

    &.current {
        background-color: #E0E0E0;
    }
}
</style>