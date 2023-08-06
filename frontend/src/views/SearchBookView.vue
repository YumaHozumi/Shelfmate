<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import type { BookItem } from "@/interface.ts"
import { ref } from "vue";

const items: BookItem[] = [
            {
                isbn: 1111111111,
                title: "2.5次元の誘惑",
                image_url: undefined,
                author: "あああ",
                detail: "hoge",
                public_date: new Date()
            },
            {
                isbn: 1111111112,
                title: "3.5次元の誘惑",
                image_url: "https://www.iwanami.co.jp/files/kojien/kojien6img5.jpg",
                author: "あiiああ",
                detail: "hogeaaa",
                public_date: new Date()
            },
        ]
const its = ref(items)
</script>

<template>
    <GlobalHeader></GlobalHeader>
    <v-container>
        <Results :items="its"></Results>
    </v-container>
</template>