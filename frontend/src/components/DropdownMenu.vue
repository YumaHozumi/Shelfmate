<script setup lang="ts">
import type { SelectSeriesItem } from '@/interface'
import { ref } from 'vue'
import { watch } from 'vue'

interface Props {
  seriesList: SelectSeriesItem[]
  isDisabled: boolean
}

const prop = defineProps<Props>()

interface Emits {
  (event: 'selectItem', item: SelectSeriesItem): void
}

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selected = ref<SelectSeriesItem | undefined>(undefined)

watch(
  () => prop.isDisabled,
  (newVal) => {
    if (newVal) {
      isOpen.value = false
    }
  }
)

const toggleDropdown = () => {
  if (prop.isDisabled) return // isDisabledがtrueなら操作を無効にする
  isOpen.value = !isOpen.value
}

const selectItem = (item: SelectSeriesItem) => {
  if (prop.isDisabled) return // isDisabledがtrueなら操作を無効にする
  selected.value = item
  isOpen.value = false
  emit('selectItem', item)
}
</script>

<template>
  <div class="dropdown" :class="{ 'disabled-button': isDisabled }">
    <button @click="toggleDropdown" class="togglebtn">
      {{ selected ? selected.seriesTitle : 'シリーズを選択' }}
      <v-icon class="arrow-icon">mdi-chevron-down</v-icon>
    </button>
    <transition name="fade">
      <div class="dropdown-menu" v-show="isOpen">
        <div
          class="dropdown-item"
          v-for="item in seriesList"
          :key="item.seriesId"
          @click="selectItem(item)"
        >
          <img :src="item.pic" alt="" class="item-image" />
          <span class="item-title">{{ item.seriesTitle }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  border: 1px solid #939393;
  padding: 2px 2px 2px 10px;
  cursor: pointer;
  background-color: #fff;

  .togglebtn {
    width: 100%;
    text-align: start;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow-icon {
    margin-left: auto;
  }

  &.disabled-button {
    background-color: rgb(196, 195, 195);
    cursor: default;
    color: grey;
    .togglebtn {
      cursor: default;
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 122%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #7f7f7f;
  width: 100%;
  border-radius: 5px;
}

// アニメーション関連のスタイル
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-item {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  padding-top: 5px;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
}

.item-image {
  width: 34px;
  height: 45.5px;
  margin: 3px 0 3px 3px;
}

.item-title {
  margin-left: 10px;
  vertical-align: top;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 350px;
}
</style>
