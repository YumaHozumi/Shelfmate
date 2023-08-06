<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import type { BookItem } from "@/interface.ts"

interface Props {
    items: BookItem[];
}

defineProps<Props>();
</script>

<template>
    <GlobalHeader></GlobalHeader>
    <v-container>
        <Results></Results>
    </v-container>
</template>