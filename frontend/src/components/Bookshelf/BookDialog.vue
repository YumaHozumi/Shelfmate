<script setup lang="ts">
import type { BookItem } from '@/interface'
import { ref } from 'vue'
import BookListItem from '../BookListItem.vue'

interface Props {
  book: BookItem
  isEdit: boolean
}

const props = defineProps<Props>()

const dialog = ref(false)

const click = () => {
  if(!props.isEdit) dialog.value = true
}
</script>

<template>
  <v-dialog v-model="dialog" :disabled="isEdit">
    <template v-slot:activator="{ props }">
      <div v-bind="props" @click="click">
        <slot></slot>
      </div>
    </template>
    <v-card>
      <v-toolbar height="30">
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <BookListItem :book="book"></BookListItem>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.book-item {
  margin: 30px auto;
  width: 95%;
}
</style>
