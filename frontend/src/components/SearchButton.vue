<script setup lang="ts">
import SearchBar from '@/basic/SearchBar.vue';
import axios from 'axios';
import { watch } from 'vue';
import { ref, computed } from 'vue';
import { implementBookShelf, type BookItem, type BookShelf } from '@/interface';
import { Timestamp, collection, onSnapshot, type Unsubscribe } from "firebase/firestore"
import imageURL from '@/assets/no-image.png'
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, firestore } from '@/config/firebase';
import { onUnmounted } from 'vue';
import SearchResult from '@/components/SearchBook/SearchResult.vue'

const dialog = ref(false);
const inputText = ref("");
const book = ref<BookItem>();

let unsubscribe: Unsubscribe

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    unsubscribe = onSnapshot(
      collection(firestore, 'users', user.uid, 'bookshelves'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          if (implementBookShelf(data)) {
            if (change.type === 'added') {
              const bookShelfData: BookShelf = { doc_id: change.doc.id, ...data } // doc_idを設定し直します
              buttons.value.push(bookShelfData)
            }

            if (selectedBookshelf.value === undefined) {
              selectedBookshelf.value = buttons.value?.[0]
            }
          }
        })

      }
    )
  }
})

onUnmounted(() => {
  unsubscribe()
})

watch(dialog, (newVal) => {
    if(!newVal) inputText.value = "" //ダイアログ閉じられたらinput空にしておく
})

const searchClick = async (searchText: string) => {
    const baseURL = "/api/books/search";
    const params = "?isbn=" + searchText;
    const completedURL = baseURL + params;

    await axios.get(completedURL)
        .then((res) => {
            const item = res.data?.result?.items?.[0];
            if(item){
                const removeTagsAndAddNewLines = (input: string): string => {
                    // タグを取り除き、その後ろに改行を追加
                    let output = input.replace(/<\/?[^>]+(>|$)/g, match => {
                        return match.startsWith('</') ? '\t' : '';
                    });

                    return output;
                };
                const output = removeTagsAndAddNewLines(item.detail);

                book.value = {
                    bookId: "",
                    isbn: item.isbn ?? 0,
                    title: item.title,
                    image_url: item.image_url && item.image_url.trim() !== '' ? item.image_url : imageURL,
                    author: item.author,
                    detail: output,
                    public_date: Timestamp.fromDate(new Date(item.public_date)),
                    orderNumber: item.orderNumber
                }

            }
        })
        .catch(error => {
            console.log(error);
        })
}

const buttons = ref<BookShelf[]>([])

const bookshelfOptions = computed(() => {
  return buttons.value.map((button) => ({
    title: button.shelf_name,
    value: button // ここで識別子として使用するプロパティを設定します
  }))
})

const selectedBookshelf = ref<BookShelf | undefined>(undefined) // 選択されたbookshelfのIDを保持するためのref

const registerBook = (book: BookItem): void => {
    nestDialog.value = true;
}

const nestDialog = ref(false);
</script>

<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" color="blue">
                <v-icon>mdi-magnify</v-icon>
                本が見つからないとき
            </v-btn>
        </template>
        <v-card>
            <v-card-actions class="justify-end">
                <v-btn @click="dialog = false" class="btn-style">
                    <v-icon>mdi-close</v-icon>
                    閉じる
                </v-btn>
            </v-card-actions>
            <v-card-title>
                <v-icon style="margin-left: 10%;">mdi-magnify</v-icon>
                ISBN検索で探す
            </v-card-title>
            <v-card-text>
                <v-select
                    v-if="bookshelfOptions.length > 0"
                    label="追加先"
                    :items="bookshelfOptions"
                    item-title="title"
                    item-value="value"
                    v-model="selectedBookshelf"
                    class="select-btn"
                >
                </v-select>
                <SearchBar label="ISBN(13桁または10桁)" @search="searchClick"></SearchBar>
                <SearchResult :book="book" v-if="book" class="book-item" @registerBook="registerBook"></SearchResult>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="nestDialog" max-width="400px">
      <v-card>test</v-card>
    </v-dialog>
</template>

<style scoped>
.btn-style {
    background-color: rgb(255, 93, 93);
    color: white;
    font-weight: bold;
}

.book-item {
    margin-top: 5%;
    margin-left: 10%;
    margin-right: 10%;
}

.select-btn {
    margin-left: 10%;
    margin-right: 10%;
}
</style>