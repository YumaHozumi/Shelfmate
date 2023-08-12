<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import type { BookItem } from "@/interface.ts"
import { ref } from "vue";
import SearchBar from "@/basic/SearchBar.vue";
import axios from "axios";

const itemsInit: BookItem[] = []
const items = ref(itemsInit)

const searchClick = async (searchText: string) => {
    //const baseURL = "https://iss.ndl.go.jp/api/opensearch"
    const baseURL = "https://www.googleapis.com/books/v1/volumes"
    const query = new URLSearchParams({q: searchText, 
        printType: "books",
        filter: "ebooks",
        maxResults: "5"
    })

    const completedURL = `${baseURL}?${query}`

    await axios
        .get(completedURL)
        .then((res) => {
            console.log(res)
            const apiItems = res.data.items;
            const books: BookItem[] = apiItems.map((item: any) => ({
                bookId: item.id,
                isbn: item.volumeInfo.industryIdentifiers[1]?.identifier,
                title: item.volumeInfo.title,
                image_url: item.volumeInfo.imageLinks?.thumbnail,
                author: item.volumeInfo.authors[0],
                detail: item.searchInfo?.textSnippet,
                public_date: new Date(item.volumeInfo.publishedDate),
                seriesId: item.volumeInfo?.seriesInfo?.volumeSeries[0]?.seriesId,
                orderNumber: item.volumeInfo?.seriesInfo?.volumeSeries[0]?.orderNumber,
            }))

            books.forEach((book) => {
                if(book.isbn !== undefined && book.image_url === undefined){
                    book.image_url = "https://iss.ndl.go.jp/thumbnail/" + book.isbn;
                }
            })

            items.value = books;
        })
        .catch((e) => {
            console.log(e);
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