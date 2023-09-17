<script setup lang="ts">
interface Emits {
  (event: 'navigate', name: string): void
}

const emit = defineEmits<Emits>()

const navigate = (): void => {
  emit('navigate', 'AppTop')
}
</script>

<template>
  <v-app-bar color="green" elevation="0" class="fix">
    <v-btn icon @click="navigate">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-toolbar-title>タイトル</v-toolbar-title>

    <v-btn class="edit">
      <v-icon>mdi-note-edit-outline</v-icon>
      編集
    </v-btn>
  </v-app-bar>
</template>

<style scoped lang="scss">
.edit {
  background-color: #fff;
  color: green;
  font-weight: bold;
  font-size: 16px;
}
</style>
