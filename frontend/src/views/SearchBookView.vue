<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import type { BookItem } from "@/interface.ts"
import { ref } from "vue";
import SearchBar from "@/basic/SearchBar.vue";
import axios from "axios";
import LoadingContainer from "@/containers/LoadingContainer.vue";
import Menu from "@/components/Menu.vue";
import { firestore, getCurrentUser } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import imageURL from "@/assets/no-image.png";

const itemsInit: BookItem[] = []
const items = ref(itemsInit)
const isLoading = ref(false)

const searchClick = async (searchText: string) => {
    isLoading.value = true;
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
                isbn: item.volumeInfo?.industryIdentifiers?.[1]?.identifier ?? 0,
                title: item.volumeInfo?.title ?? "",
                image_url: item.volumeInfo?.imageLinks?.thumbnail ?? imageURL,
                author: item.volumeInfo?.authors?.[0] ?? "",
                detail: item.searchInfo?.textSnippet ?? "",
                public_date: new Date(item.volumeInfo?.publishedDate),
                seriesId: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.seriesId ?? "",
                orderNumber: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.orderNumber ?? 0,
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

    isLoading.value = false;
}

const menu = ["作品名順", "発売日順"]

const registerBook = async(book: BookItem) => {
    try {
        const user = await getCurrentUser();
        const bookCollection = collection(firestore, "users", user.uid, "bookshelves", "QdqAGHac6dH9FQWg0E6v", "books")
        await addDoc(bookCollection, book);
    }catch(error) {
        console.log(error);
    }
}
</script>

<template>
    <GlobalHeader></GlobalHeader>
    <SearchBar @search="searchClick" class="mt-8 mb-4"></SearchBar>
    <Menu :items="menu" icon="mdi-sort" class="transparency"></Menu>
    <Results :items="items" v-if="!isLoading" @registerBook="registerBook"></Results>
    <LoadingContainer :isLoading="isLoading"></LoadingContainer>
</template>

<style scoped>
.modify-width {
    width: 100%;
    height: 100%;
}

.transparency {
    background-color: white;
}
</style>