<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        @input="emitQueryUpdate"
      />
      <button @click="emitSearch">
        <v-icon>mdi-magnify</v-icon>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from "vue";
  
  // Props
  interface Props {
    query?: string;
    placeholder?: string;
  }
  
  const props = defineProps<Props>();
  
  // Emits
  const emit = defineEmits<{
    (e: "update:query", value: string): void;
    (e: "search", value: string): void;
  }>();
  
  // Data
  const searchQuery = ref<string>(props.query || "");
  
  // Methods
  const emitQueryUpdate = () => {
    emit("update:query", searchQuery.value);
  };
  
  const emitSearch = () => {
    emit("search", searchQuery.value);
  };
  
  // Watchers
  watch(searchQuery, (newValue) => {
    if (newValue.length > 150) {
      searchQuery.value = newValue.slice(0, 150);
    }
  });
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    width: 300px;
  }
  
  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 5px;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
  }
  </style>
  