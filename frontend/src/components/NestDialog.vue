<script setup lang="ts">
import { ref } from 'vue';

const dialog = ref(false);
</script>

<template>
    <v-dialog v-model="dialog">
        <template v-slot:activator="{ props }">
            <div v-bind="props" @click="dialog = true">
                <slot></slot>
            </div>
        </template>
        <v-card>
            test
        </v-card>
    </v-dialog>
</template>