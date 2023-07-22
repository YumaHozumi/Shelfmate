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
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    text-align: center;
    background-color: #ffffff;
    color: #333333;

    &.current {
        font-weight: bold;
    }
}
</style>

