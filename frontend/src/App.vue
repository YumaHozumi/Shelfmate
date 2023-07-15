<script setup lang="ts">
import type { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-container fluid>
          <RouterView></RouterView>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
