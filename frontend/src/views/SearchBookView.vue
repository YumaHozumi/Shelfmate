<script setup lang="ts">
import GlobalHeader from '@/containers/GlobalHeader.vue'
import Results from '@/components/SearchBook/Results.vue'
import { type BookShelf, type BookItem, type Series } from '@/interface'
import { ref, watch } from 'vue'
import SearchBar from '@/basic/SearchBar.vue'
import axios from 'axios'
import LoadingContainer from '@/containers/LoadingContainer.vue'
import Menu from '@/components/Menu.vue'
import { firebaseAuth, firestore, getCurrentUser } from '@/config/firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore'
import imageURL from '@/assets/no-image.png'
import { onAuthStateChanged } from 'firebase/auth'
import { implementBookShelf, type BookItemNoSeries } from '@/interface'
import { onUnmounted, computed } from 'vue'
import router from '@/router'
import { incrementCounter, sort, addSeriesDataItem } from '@/function'
import { Timestamp } from 'firebase/firestore'
import Pagination from '@/components/SearchBook/Pagination.vue'
import SearchButton from '@/components/SearchButton.vue'
import ErrorMessage from '@/basic/ErrorMessage.vue'
import { setBookshelvesData, getBookshelvesData } from '@/function'

const onNavigate = (name: string): void => {
  router.push({ name: name })
}

const itemsInit: BookItem[] = []
const items = ref(itemsInit)
const isLoading = ref(false)
const errorMsg = ref('')

//Google Books APIに検索クエリ投げる
const search = async (searchText: string): Promise<BookItem[]> => {
  const baseURL = 'https://www.googleapis.com/books/v1/volumes'
  const replaceText = searchText.replace(/[\s\u3000]/g, '+')

  const params: Record<string, string> = {
    q: replaceText,
    printType: 'books',
    filter: 'ebooks',
    maxResults: '5',
    startIndex: page.value.toString()
  }

  const queryString = Object.keys(params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${key === 'q' ? params[key] : encodeURIComponent(params[key])}`
    )
    .join('&')

  const completedURL = `${baseURL}?${queryString}`

  let books: BookItem[] = []

  try {
    errorMsg.value = ''
    const res = await axios.get(completedURL)
    const apiItems = res.data.items

    if (!apiItems || apiItems.length === 0) {
      errorMsg.value = '本が見つかりませんでした' // 404エラーメッセージを設定
      return books // 空の本の配列を返す
    }

    books = apiItems.map((item: any) => ({
      bookId: item.id,
      isbn: item.volumeInfo?.industryIdentifiers?.[1]?.identifier ?? 0,
      title: item.volumeInfo?.title ?? '',
      image_url: item.volumeInfo?.imageLinks?.thumbnail ?? imageURL,
      author: item.volumeInfo?.authors?.[0] ?? '',
      detail: item.searchInfo?.textSnippet ?? '',
      public_date: Timestamp.fromDate(new Date(item.volumeInfo?.publishedDate || 0)),
      seriesId: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.seriesId ?? '',
      orderNumber: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.orderNumber ?? 0
    }))

    books.forEach((book) => {
      if (book.isbn !== undefined && book.image_url === undefined) {
        book.image_url = 'https://iss.ndl.go.jp/thumbnail/' + book.isbn
      }
    })
  } catch (error) {
    console.log(error)
    errorMsg.value = 'サーバーとの通信でエラーが発生しました。時間おいてお試しください。' // その他のエラーメッセージを設定
  }

  return books
}

let tempSearchText = ''

const searchClick = async (searchText: string) => {
  isLoading.value = true
  resetPage()
  tempSearchText = searchText

  const books = await search(searchText)
  items.value = books

  await setRegisteredBooks()
  isLoading.value = false
}

const menu = ['発売日が新しい順', '発売日が古い順', '作品名順', '作者名順']

const registerBookId = async (bookShelfId: string, book: BookItem): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    const bookshelvesRef = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      bookShelfId,
      'allBooks'
    )
    const q = query(bookshelvesRef, where('bookId', '==', book.bookId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length > 0) {
      return false
    } else {
      await addDoc(bookshelvesRef, book)
      return true
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

const registeredBooks = ref<BookItem[]>([])

const setRegisteredBooks = async () => {
  const user = await getCurrentUser()
  const selectedBookshelfId = selectedBookshelf.value?.doc_id || ''
  const bookshelvesRef = collection(
    firestore,
    'users',
    user.uid,
    'bookshelves',
    selectedBookshelfId,
    'allBooks'
  )
  const booksSnapshot = await getDocs(bookshelvesRef)

  registeredBooks.value = booksSnapshot.docs.map((doc) => doc.data() as BookItem)
}

//シリーズの部分のテキストだけを抽出する正規表現
const extractSeriesTitle = (str: string): string => {
  const regex = /^(.*?)(?:\s*\d+)?(?:\s*（[^）]+）)?(?:\s*【[^】]+】)?\s*$/
  const match = str.match(regex)
  return match ? match[1].trim() : ''
}

const registerBook = async (book: BookItem) => {
  try {
    const user = await getCurrentUser()
    const bookshelvesRef = collection(firestore, 'users', user.uid, 'bookshelves')
    const selectedBookshelfId = selectedBookshelf.value?.doc_id || ''
    const seriesId = book?.seriesId ?? ''
    const isAddBook = await registerBookId(selectedBookshelfId, book)

    if (!isAddBook) return
    await setRegisteredBooks()

    //シリーズものじゃないとき
    if (seriesId === '') {
      const noSeriesBookCollection = collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        selectedBookshelfId,
        'books'
      )
      const noSeriesBook: BookItemNoSeries = convertToBookItemWithoutSeries(book)
      await addDoc(noSeriesBookCollection, noSeriesBook)
      await addSeriesDataItem(user.uid, selectedBookshelfId, book)
    } else {
      //シリーズもの
      const seriesRef = doc(bookshelvesRef, selectedBookshelfId, 'series', seriesId)
      const seriesSnap = await getDoc(seriesRef)
      let seriesTemp: Series | undefined

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

        seriesTemp = {
          seriesId: seriesData?.seriesId,
          pic: seriesData?.pic,
          counter: seriesData?.counter ?? 0, // シリーズのカウンタを設定
          seriesTitle: seriesData?.seriesTitle
        }
      } else {
        // ドキュメントが存在しない場合、画像とカウンターを設定
        const seriesTitle = extractSeriesTitle(book.title)

        seriesTemp = {
          seriesId: seriesId,
          pic: book?.image_url ?? '',
          counter: 0,
          seriesTitle: extractSeriesTitle(book.title)
        }

        await setDoc(seriesRef, {
          seriesId: seriesId,
          pic: book?.image_url ?? '',
          counter: 0,
          picOrder: book?.orderNumber ?? 0,
          seriesTitle: seriesTitle
        })
      }

      const booksCollection = collection(
        firestore,
        'users',
        user.uid,
        'bookshelves',
        selectedBookshelfId,
        'series',
        seriesId,
        'books'
      )
      await addDoc(booksCollection, book)
      await incrementCounter(seriesRef)
      // 新しいシリーズアイテムをIndexedDBに追加

      if (seriesTemp) {
        seriesTemp.counter++
        await addSeriesDataItem(user.uid, selectedBookshelfId, seriesTemp)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const buttons = ref<BookShelf[]>([])

let isInitialLoad = true

let unsubscribe: Unsubscribe

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    unsubscribe = onSnapshot(
      collection(firestore, 'users', user.uid, 'bookshelves'),
      async (snapshot) => {
        if (isInitialLoad) {
          isInitialLoad = false
          const localCache = await getBookshelvesData(user.uid)
          if (!localCache) {
            //ローカルキャッシュがない場合、Firestoreからデータを取得
            buttons.value = snapshot.docs
              .map((doc) => {
                const data = doc.data()
                if (implementBookShelf(data)) {
                  const bookShelfData: BookShelf = { doc_id: doc.id, ...data }
                  return bookShelfData
                }
                return undefined
              })
              .filter((item): item is BookShelf => item !== undefined)

            await setBookshelvesData(user.uid, buttons.value)
          } else {
            //ある場合
            //ローカルキャッシュからデータを取得
            buttons.value = localCache
          }
        } else {
          snapshot.docChanges().forEach(async (change) => {
            const data = change.doc.data()
            if (implementBookShelf(data)) {
              if (change.type === 'added') {
                const bookShelfData: BookShelf = { doc_id: change.doc.id, ...data } // doc_idを設定し直します
                buttons.value.push(bookShelfData)
                await setBookshelvesData(user.uid, buttons.value)
              }
            }
          })
        }

        if (selectedBookshelf.value === undefined) {
          selectedBookshelf.value = buttons.value?.[0]
        }
      }
    )
  }
})

onUnmounted(() => {
  unsubscribe()
})

const bookshelfOptions = computed(() => {
  return buttons.value.map((button) => ({
    title: button.shelf_name,
    value: button // ここで識別子として使用するプロパティを設定します
  }))
})

const selectedBookshelf = ref<BookShelf | undefined>(undefined) // 選択されたbookshelfのIDを保持するためのref

const selectMenu = (index: number): void => {
  items.value = sort(items.value, menu[index])
}

const convertToBookItemWithoutSeries = (bookItem: BookItem): BookItemNoSeries => {
  const copy = { ...bookItem }
  delete copy.seriesId
  delete copy.orderNumber
  return copy
}

//Paginationの処理
const page = ref(0)

const resetPage = () => {
  page.value = 0
}

const moreBtnClick = async () => {
  if (page.value < 4) {
    page.value++
    await searchMore()
  }
}

const searchMore = async () => {
  const books = await search(tempSearchText)
  items.value.push(...books)
}

watch(selectedBookshelf, async () => {
  await setRegisteredBooks()
})
</script>

<template>
  <GlobalHeader @navigate="onNavigate"></GlobalHeader>
  <v-select
    v-if="bookshelfOptions.length > 0"
    label="追加先"
    :items="bookshelfOptions"
    item-title="title"
    item-value="value"
    v-model="selectedBookshelf"
    class="select"
  >
  </v-select>
  <SearchBar @search="searchClick" class="mt-4 mb-4" :rules="[]"></SearchBar>
  <ErrorMessage :errorMessage="errorMsg"></ErrorMessage>
  <div class="menu-container">
    <SearchButton></SearchButton>
    <Menu :items="menu" icon="mdi-sort" class="menu" @selectItem="selectMenu"></Menu>
  </div>
  <Results
    :items="items"
    v-if="!isLoading"
    @registerBook="registerBook"
    :registeredBooks="registeredBooks"
  ></Results>
  <Pagination
    :page="page"
    @moreBtnClick="moreBtnClick"
    v-if="items.length > 0 && !isLoading"
    class="my-8"
  ></Pagination>
  <LoadingContainer :isLoading="isLoading"></LoadingContainer>
</template>

<style scoped lang="scss">
.menu {
  margin: 0 10px 0 0;
  display: flex;
}
.modify-width {
  width: 100%;
  height: 100%;
}

.select {
  margin-top: 30px;
  margin-left: 10%;
  margin-right: 10%;
}

.menu-container {
  display: flex;
  justify-content: flex-end;
  margin-right: 9%;

  .menu {
    background-color: white;
  }
}

.error {
  margin-left: 10%;
}
</style>
