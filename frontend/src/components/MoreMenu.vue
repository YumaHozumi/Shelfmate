<template>
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
            <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
      </template>
  
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>{{ item.shelf_name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>
  
<script setup lang="ts">
import type { BookShelf } from '@/interface';

interface Props {
    items: BookShelf[];
}

defineProps<Props>();
</script>