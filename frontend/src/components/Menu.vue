<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  icon: string
  items: string[]
}

const props = defineProps<Props>()

interface Emits {
  (event: 'selectItem', currentSelect: number): void
}
const emit = defineEmits<Emits>()

const currentSelect = ref(props.items[0])

const selectItem = (item: string, index: number) => {
  currentSelect.value = item
  emit('selectItem', index)
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" elevation="0">
        <v-icon>{{ icon }}</v-icon>
        <slot></slot>
        {{ currentSelect }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        link
        v-for="(key, index) in items"
        :key="index"
        @click="() => selectItem(key, index)"
      >
        <v-list-item-title>
          {{ key }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
