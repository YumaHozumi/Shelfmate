<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label?: string;
}

defineProps<Props>();

interface Emits {
  (event: 'search', searchText: string): void
}

const emit = defineEmits<Emits>()

const inputText = ref('')

//検索ボタン押したら
const searchClick = (): void => {
  if (inputText.value === '') return
  emit('search', inputText.value)
}
</script>

<template>
  <v-toolbar class="pa-2 search-bar">
    <v-text-field hide-details v-model="inputText" @keyup.enter="searchClick" :label="label"></v-text-field>
    <v-btn icon @click="searchClick">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<style scoped lang="scss">
.search-bar {
  max-width: 80%;
  margin: auto;
}
</style>
