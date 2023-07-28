<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    label: string;
    itemCount: number;
}

const props = defineProps<Props>();

const itemWidth = computed(() => 100 / props.itemCount + '%');
</script>

<template>
    <li :style="{ width: itemWidth }">{{ label }}</li>
</template>

<style scoped lang="scss">
li {
    list-style-type: none;
    display: inline-block;
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