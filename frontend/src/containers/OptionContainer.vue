<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import { ref } from 'vue';

const menu = ['作品名順']
const editMode = ref(false);

interface Props {
  count: number;
}

defineProps<Props>();

interface Emits {
  (event: "clickBtn", editMode: boolean): void
  (event: "optionClick", selectedMenu: string): void
}

const emit = defineEmits<Emits>();

const clickEdit = () => {
  editMode.value = true;
  emit("clickBtn", editMode.value)
}

const clickCancel = () => {
  editMode.value = false;
  emit("clickBtn", editMode.value)
}

const selectMenu = (index: number): void => {
  emit("optionClick", menu[index])
}
</script>

<template>
  <v-app-bar height="35" flat class="transparency">
    <v-toolbar-title class="small">件数: {{ count }}件
    </v-toolbar-title>
    <v-btn color="blue" @click="clickCancel" v-if="editMode">キャンセル</v-btn>
    <v-btn color="blue" @click="clickEdit" v-else>編集</v-btn>
    <Menu :items="menu" icon="mdi-sort" @selectItem="selectMenu"></Menu>
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
