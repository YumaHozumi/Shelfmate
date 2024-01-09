<script setup lang="ts">
import SearchBar from '@/basic/SearchBar.vue'
import axios from 'axios'
import { watch } from 'vue'
import { ref, computed } from 'vue'
import {
  implementBookShelf,
  type BookItem,
  type BookShelf,
  type SelectSeriesItem,
  type BookItemNoSeries,
type Series
} from '@/interface'
import {
  Timestamp,
  collection,
  onSnapshot,
  type Unsubscribe,
  doc,
  updateDoc,
  setDoc,
  where,
  CollectionReference,
  QuerySnapshot
} from 'firebase/firestore'
import imageURL from '@/assets/no-image.png'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth, firestore, getCurrentUser } from '@/config/firebase'
import { onUnmounted } from 'vue'
import SearchResult from '@/components/SearchBook/SearchResult.vue'
import DropdownMenu from './DropdownMenu.vue'
import { fetchBookShelfSeries, incrementCounter, fetchDocs, addDocAfterCacheCheck, fetchDocWithCache } from '@/function'
import { rules } from '@/validation'
import ErrorMessage from '@/basic/ErrorMessage.vue'

const dialog = ref(false)
const inputText = ref('')
const book = ref<BookItem | undefined>(undefined)
const selectedRadio = ref('one')

const errorMsg = ref('')

let unsubscribe: Unsubscribe

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    unsubscribe = onSnapshot(
      collection(firestore, 'users', user.uid, 'bookshelves') as CollectionReference<BookShelf>,
      {includeMetadataChanges: true},
      async (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const data = change.doc.data()
            if (!implementBookShelf(data)) return;
            if (change.type !== 'added') return;

            const bookShelfData: BookShelf = { doc_id: change.doc.id, ...data } // doc_idを設定し直します
            buttons.value.push(bookShelfData)
          })

          if(selectedBookshelf.value !== undefined) return

          selectedBookshelf.value = buttons.value?.[0];
      }
    )
  }
})

onUnmounted(() => {
  unsubscribe()
})

watch(dialog, (newVal) => {
  if (!newVal) inputText.value = '' //ダイアログ閉じられたらinput空にしておく
})

const searchClick = async (searchText: string) => {
  const baseURL = '/api/books/search'
  const params = '?isbn=' + searchText
  const completedURL = baseURL + params
  await axios
    .get(completedURL)
    .then((res) => {
      errorMsg.value = ''
      const item = res.data?.result?.items?.[0]
      if (item) {
        const removeTagsAndAddNewLines = (input: string): string => {
          // タグを取り除き、その後ろに改行を追加
          let output = input.replace(/<\/?[^>]+(>|$)/g, (match) => {
            return match.startsWith('</') ? '\t' : ''
          })

          return output
        }
        const output = removeTagsAndAddNewLines(item.detail)

        book.value = {
          bookId: item.bookId,
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
    .catch((error) => {
      console.log(error)
      const status = error.response['status']
      switch (status) {
        case 500:
          errorMsg.value = 'サーバーとの通信でエラーが発生しました。時間おいてお試しください。'
          break
        default:
          errorMsg.value = error.response['data']
          break
      }
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
const seriesList = ref<SelectSeriesItem[]>([])

watch(selectedBookshelf, async (newVal) => {
  if (newVal === undefined) return
  seriesList.value.length = 0

  const user = await getCurrentUser()

  const selectedBookshelfId = selectedBookshelf.value?.doc_id

  if (selectedBookshelfId === undefined) return;

  const seriesSnap: QuerySnapshot<Series> = await fetchBookShelfSeries(user, selectedBookshelfId);
  
  if(seriesSnap.empty) return;

  for(const docSnapshot of seriesSnap.docs) {
    const seriesData = docSnapshot.data() as Series;
    if(!seriesData.seriesId) continue
    const item: SelectSeriesItem = {
      seriesId: seriesData.seriesId,
      pic: seriesData.pic,
      seriesTitle: seriesData.seriesTitle
    }
    seriesList.value.push(item)
  }

})

const selectItem = ref<SelectSeriesItem | undefined>(undefined)

const updateSelectItem = (item: SelectSeriesItem): void => {
  selectItem.value = item
}

const nowBook = ref<BookItem | undefined>(undefined)

const registerBook = async (book: BookItem) => {
  nestDialog.value = true
  nowBook.value = book
}

const duplicateCheck = async (colref: CollectionReference, bookId: string) => {
  //重複判定
  const condition = where('bookId', '==', bookId)

  const querySnapshot = await fetchDocs(colref, [condition]);
  return querySnapshot.docs.length > 0
}

const submit = async () => {
  nestDialog.value = false
  const user = await getCurrentUser()
  const selectedBookshelfId = selectedBookshelf.value?.doc_id || ''
  const book = nowBook.value
  const allBookCollection = collection(
    firestore,
    'users',
    user.uid,
    'bookshelves',
    selectedBookshelfId,
    'allBooks'
  )
  const noSeriesBookCollection = collection(
    firestore,
    'users',
    user.uid,
    'bookshelves',
    selectedBookshelfId,
    'books'
  )
  if (book !== undefined) {
    //所持している本一覧に追加
    if (!(await duplicateCheck(allBookCollection, book.bookId))) {
      await addDocAfterCacheCheck(allBookCollection, book)
    } else return //重複していたらだめ
  }

  // シリーズものじゃないとき
  if (selectedRadio.value === 'one' && book !== undefined) {
    const noSeriesBook: BookItemNoSeries = convertToBookItemWithoutSeries(book)
    if (!(await duplicateCheck(noSeriesBookCollection, book.bookId))) {
      //重複していないとき
      await addDocAfterCacheCheck(noSeriesBookCollection, noSeriesBook)
    }
  } else {
    // シリーズもの
    
    if (selectItem.value === undefined || book === undefined) return

    const booksCollection = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      selectedBookshelfId,
      'series',
      selectItem.value.seriesId,
      'books'
    )

    if (await duplicateCheck(booksCollection, book.bookId)) return

    const bookshelvesRef = collection(firestore, 'users', user.uid, 'bookshelves')
    const seriesRef = doc(
      bookshelvesRef,
      selectedBookshelfId,
      'series',
      selectItem.value.seriesId
    )
    const seriesSnap = await fetchDocWithCache(seriesRef)

    if (seriesSnap.exists()) {
      const seriesData = seriesSnap.data()
      const shouldUpdatePic =
        book &&
        (((book.orderNumber ?? 0) > (seriesData?.picOrder ?? 0) && book.image_url !== '') ||
          ((book.orderNumber ?? 0) < (seriesData?.picOrder ?? 0) && seriesData?.pic === ''))

      if (shouldUpdatePic) {
        await updateDoc(seriesRef, {
          pic: book?.image_url,
          picOrder: book?.orderNumber ?? 0
        })
      }
    } else {
      // ドキュメントが存在しない場合、画像とカウンターを設定
      const seriesTitle = extractSeriesTitle(book.title)

      await setDoc(seriesRef, {
        seriesId: selectItem.value.seriesId,
        pic: book?.image_url ?? '',
        counter: 0,
        picOrder: book?.orderNumber ?? 0,
        seriesTitle: seriesTitle
      })
    }

    //API経由で取得したやつにはシリーズIDないためここで設定
    book.seriesId = selectItem.value.seriesId

    await addDocAfterCacheCheck(booksCollection, book)
    await incrementCounter(seriesRef)

    selectItem.value = undefined
    selectedRadio.value = 'one'
  }
}

const convertToBookItemWithoutSeries = (bookItem: BookItem): BookItemNoSeries => {
  const copy = { ...bookItem }
  delete copy.seriesId
  delete copy.orderNumber
  return copy
}

//シリーズの部分のテキストだけを抽出する正規表現
const extractSeriesTitle = (str: string): string => {
  const regex = /^(.*?)(?:\s*\d+)?(?:\s*（[^）]+）)?(?:\s*【[^】]+】)?\s*$/
  const match = str.match(regex)
  return match ? match[1].trim() : ''
}

const nestDialog = ref(false)

//text-fieldのバリデーション定義
const localRules = ref([rules.hyphen, rules.zenkaku, rules.isbn])

const closeDialog = () => {
  dialog.value = false
  book.value = undefined
  // selectItem.value = undefined
  // selectedRadio.value = "one"
}
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
        <v-btn @click="closeDialog" class="btn-style">
          <v-icon>mdi-close</v-icon>
          閉じる
        </v-btn>
      </v-card-actions>
      <v-card-title>
        <v-icon style="margin-left: 10%">mdi-magnify</v-icon>
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
        <SearchBar
          label="ISBN(13桁または10桁) ※ハイフンなし"
          @search="searchClick"
          :rules="localRules"
        ></SearchBar>
        <ErrorMessage :errorMessage="errorMsg"></ErrorMessage>
        <SearchResult
          :book="book"
          v-if="book"
          class="book-item"
          @registerBook="registerBook"
        ></SearchResult>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="nestDialog" max-width="500px">
    <v-card height="300px">
      <v-card-text>
        <v-radio-group v-model="selectedRadio">
          <v-radio label="単体で登録" value="one"></v-radio>
          <v-radio label="シリーズもので登録" value="series"></v-radio>
        </v-radio-group>
        <DropdownMenu
          :seriesList="seriesList"
          :isDisabled="selectedRadio === 'one'"
          @selectItem="updateSelectItem"
        ></DropdownMenu>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="registerBtn"
          @click="submit"
          :disabled="selectedRadio === 'series' && !selectItem"
          >登録</v-btn
        >
      </v-card-actions>
    </v-card>
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

.button-wrapper {
  text-align: right;
  /* もしくは margin-left: auto; */
}

.registerBtn {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.error {
  margin-left: 10%;
}
</style>
