<script setup lang="ts">
import GlobalHeader from "@/containers/GlobalHeader.vue";
import Results from "@/components/SearchBook/Results.vue";
import { type BookShelf, type BookItem } from "@/interface"
import { ref } from "vue";
import SearchBar from "@/basic/SearchBar.vue";
import axios from "axios";
import LoadingContainer from "@/containers/LoadingContainer.vue";
import Menu from "@/components/Menu.vue";
import { firebaseAuth, firestore, getCurrentUser } from "@/config/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import imageURL from "@/assets/no-image.png";
import { onAuthStateChanged, type Unsubscribe } from "firebase/auth";
import { implementBookShelf } from "@/interface";
import { onUnmounted, computed} from "vue";

const itemsInit: BookItem[] = []
const items = ref(itemsInit)
const isLoading = ref(false)
let nowIndex = 0;

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
                public_date: new Date(item.volumeInfo?.publishedDate || 0),
                seriesId: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.seriesId ?? "",
                orderNumber: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.orderNumber ?? 0,
            }))

            books.forEach((book) => {
                if(book.isbn !== undefined && book.image_url === undefined){
                    book.image_url = "https://iss.ndl.go.jp/thumbnail/" + book.isbn;
                }
            })
            //予めソートしたものを入れる
            items.value = sort(books, menu[nowIndex]);
        })
        .catch((e) => {
            console.log(e);
        })

    isLoading.value = false;
}

const menu = ["発売日が新しい順", "発売日が古い順", "作品名順", "作者名順"]

const registerBook = async(book: BookItem) => {
    try {
        const user = await getCurrentUser();
        const bookCollection = collection(firestore, "users", user.uid, "bookshelves", selectedBookshelf.value?.doc_id || "", "series", book?.seriesId || "","books")
        await addDoc(bookCollection, book);
    }catch(error) {
        console.log(error);
    }
}

const buttons = ref<BookShelf[]>([]);

let unsubscribe: Unsubscribe;

onAuthStateChanged(firebaseAuth, (user) => {

if(user) {
    unsubscribe = onSnapshot(collection(firestore, "users", user.uid, "bookshelves"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            if (implementBookShelf(data)) {
                if (change.type === "added") {
                    const bookShelfData: BookShelf = { doc_id: change.doc.id, ...data }; // doc_idを設定し直します
                    buttons.value.push(bookShelfData);
                }

                if(selectedBookshelf.value === undefined) {
                    selectedBookshelf.value = buttons.value?.[0];
                }
            }
        })
    })

}

})

onUnmounted(() => {
    unsubscribe();
})

const bookshelfOptions = computed(() => {
  return buttons.value.map(button => ({
    title: button.shelf_name,
    value: button // ここで識別子として使用するプロパティを設定します
  }));
});

const selectedBookshelf = ref<BookShelf | undefined>(undefined); // 選択されたbookshelfのIDを保持するためのref

const selectMenu = (index: number): void => {
    items.value = sort(items.value, menu[index]);
    nowIndex = index;
}

const sort = (books: BookItem[], order: string): BookItem[] => {
    if(order === "発売日が新しい順") {
        return books.slice().sort((a, b) => b.public_date.getTime() - a.public_date.getTime())
    } else if (order === "発売日が古い順") {
        return books.slice().sort((a, b) => a.public_date.getTime() - b.public_date.getTime())
    } else if(order === "作品名順") {
        return books.slice().sort((a, b) => a.title.localeCompare(b.title, 'ja-u-co-natural'));
    } else if(order === "作者名順"){
        return books.slice().sort((a, b) => a.title.localeCompare(b.author, 'ja-u-co-natural'));
    } else {
        return books;
    }
}
</script>

<template>
    <GlobalHeader></GlobalHeader>

        <div class="search-add-container mt-8 mb-4 mx-12">
            <SearchBar @search="searchClick" class="me-6"></SearchBar>
            <v-select label="追加先" :items="bookshelfOptions" item-title="title" item-value="value" v-model="selectedBookshelf">
                
            </v-select>

        </div>

    <v-row justify="end">
        <v-col cols="2">
            <Menu :items="menu" icon="mdi-sort" class="transparency" @selectItem="selectMenu"></Menu>

        </v-col>
        
    </v-row>
    <Results :items="items" v-if="!isLoading" @registerBook="registerBook"></Results>
    <LoadingContainer :isLoading="isLoading"></LoadingContainer>
</template>

<style scoped>
.search-add-container {
    display: flex;
}
.menu {
    margin: 0 10px 0 0;
    display: flex;
}
.modify-width {
    width: 100%;
    height: 100%;
}

.transparency {
    background-color: white;
}
</style>