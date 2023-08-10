<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import type { BookItem } from "@/interface.ts"
import { ref } from "vue";
import SearchBar from "@/basic/SearchBar.vue";
import axios from "axios";

const itemsInit: BookItem[] = [
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
const items = ref(itemsInit)

const searchClick = async (searchText: string) => {
    //const baseURL = "https://iss.ndl.go.jp/api/opensearch"
    const baseURL = "/api/search"
    // const query = new URLSearchParams({
    //     cnt: "1",
    //     title: searchText,
    // }).toString();
    const query = new URLSearchParams({q: "きめつ"})

    const completedURL = `${baseURL}?${query}`

    await axios
        .get(baseURL)
        .then((res) => {
            console.log(res)
        })
}

</script>

<template>
    <GlobalHeader></GlobalHeader>
    <v-container>
        <SearchBar @search="searchClick"></SearchBar>
        <Results :items="items"></Results>
    </v-container>
</template>