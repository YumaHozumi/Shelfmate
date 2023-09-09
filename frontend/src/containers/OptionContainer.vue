<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import { ref } from 'vue';

const menu = ['作品名順', '発売日順']
const editMode = ref(false);

interface Props {
  count: number;
}

defineProps<Props>();

interface Emits {
  (event: "clickEdit"): void
  (event: "clickCancel"): void
}

const emit = defineEmits<Emits>();

const clickEdit = () => {
  editMode.value = true;
  emit("clickEdit")
}

const clickCancel = () => {
  editMode.value = false;
  emit("clickCancel")
}
</script>

<template>
  <v-app-bar height="35" flat class="transparency">
    <v-toolbar-title class="small">件数: {{ count }}件
    </v-toolbar-title>
    <v-btn color="blue" @click="clickCancel" v-if="editMode">キャンセル</v-btn>
    <v-btn color="blue" @click="clickEdit" v-else>編集</v-btn>
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
