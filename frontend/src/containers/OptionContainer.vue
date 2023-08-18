<script setup lang="ts">
import Menu from '@/components/Menu.vue'

const menu = ['作品名順', '発売日順']

interface Props {
  count: number;
}

defineProps<Props>();
</script>

<template>
  <v-app-bar height="35" flat class="transparency">
    <v-toolbar-title class="small">件数: {{ count }}件
    </v-toolbar-title>
    <Menu :items="menu" icon="mdi-sort"></Menu>
  </v-app-bar>
</template>

<style scoped lang="scss">
.small {
  font-size: 14px;
}

.transparency {
  background-color: white;
}
</style>
