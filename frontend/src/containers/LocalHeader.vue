<script setup lang="ts">
import LocalHeaderButton from '@/components/LocalHeaderButton.vue';
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import MoreMenu from '@/components/MoreMenu.vue';

const buttonsInit = [
    {text: "hoge"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
    {text: "hogggggggggggggggg"},
]

const buttonWidth = 80;
const buttonMarginEnd = 8;
const sum = buttonWidth + buttonMarginEnd;
const windowWidth = ref(window.innerWidth)
//表示するボタンの最大数
let maxButtons = Math.floor(windowWidth.value / sum) - 1

const visibleButtons = ref(buttonsInit.slice(0, maxButtons));
const hiddenButtons = ref(buttonsInit.slice(maxButtons));

watchEffect(() => {
    maxButtons = Math.floor(windowWidth.value / sum) - 1;
    visibleButtons.value = buttonsInit.slice(0, maxButtons);
    hiddenButtons.value = buttonsInit.slice(maxButtons);
});

const updateWidth = () => {
    windowWidth.value = window.innerWidth;
    maxButtons = Math.floor(windowWidth.value / sum) - 1
}

onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})
</script>

<template>
    <v-app-bar color="white" elevation="0" height="33" class="header-border">
        <div class="button-container">
            <LocalHeaderButton v-for="(button, index) in visibleButtons" :key="index" :text="button.text" class="me-2"></LocalHeaderButton>
            <div v-show="hiddenButtons.length > 0">
                <v-spacer></v-spacer>
                <MoreMenu :items="hiddenButtons"></MoreMenu>
            </div>
        </div>
    </v-app-bar>

</template>

<style scoped lang="scss">
.header-border {
    border-top: 1px solid rgb(209, 209, 209);
    border-bottom: 1px solid rgb(209, 209, 209);
}

.button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>
