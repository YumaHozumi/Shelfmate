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

