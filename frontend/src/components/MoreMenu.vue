<template>
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
            <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
      </template>
  
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>
  
<script setup lang="ts">
interface Props {
    items: { text: string }[];
}

defineProps<Props>();
</script>