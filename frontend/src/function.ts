import { FirebaseError } from 'firebase/app'
import {
  DocumentReference,
  addDoc,
  collection,
  getDoc,
  getDocs,
  increment,
  updateDoc,
  getDocsFromCache,
  CollectionReference,
  QuerySnapshot,
  getDocsFromServer,
  getDocFromCache,
  DocumentSnapshot,
  getDocFromServer,
  query,
  QueryConstraint
} from 'firebase/firestore'
import {type User} from 'firebase/auth';
import { type BookItem, type BookShelf, type Series } from './interface'
import { firestore, getCurrentUser } from './config/firebase'
import { Timestamp } from 'firebase/firestore'
import NO_IMAGE from '@/assets/no-image.png'

const firebaseErrorMessage = (e: FirebaseError): string => {
  switch (e.code) {
    case 'auth/email-already-in-use':
      return '指定されたメールアドレスは既に使用されています'
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません'
    case 'auth/user-disabled':
      return 'サービスの利用が停止されています'
    case 'auth/user-not-found':
      return 'メールアドレスまたはパスワードが違います'
    case 'auth/weak-password':
      return 'パスワードは6文字以上にしてください'
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが違います'
    case 'auth/operation-not-allowed':
      return '指定されたユーザはこの操作を許可していません'
    case 'auth/unauthorized-domain':
      return '現在この認証方法はご利用頂けません'
    case 'auth/requires-recent-login':
      return '認証の有効期限が切れています'
    default:
      return '不明なエラーが発生しました'
  }
}

// インクリメント
const incrementCounter = async (docRef: DocumentReference) => {
  try {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      const currentCounter = data?.counter ?? 0 // 既存のカウンター値を取得、または0を設定
      await updateDoc(docRef, { counter: currentCounter + 1 })
    }
  } catch (error) {
    console.error('Error incrementing counter:', error) // エラーハンドリング
  }
}

// デクリメント
const decrementCounter = async (docRef: DocumentReference) => {
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    await updateDoc(docRef, { counter: increment(-1) })
  }
}

const sort = (books: BookItem[], order: string): BookItem[] => {
  if (order === '発売日が新しい順' || order === '発売日が古い順') {
    return books.slice().sort((a, b) => {
      const dateA = a.public_date?.toDate?.() ?? new Date(a.public_date.seconds)
      const dateB = b.public_date?.toDate?.() ?? new Date(b.public_date.seconds)
      return order === '発売日が新しい順'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime()
    })
  } else if (order === '作品名順') {
    return books.slice().sort((a, b) => a.title.localeCompare(b.title, 'ja-u-co-natural'))
  } else if (order === '作者名順') {
    return books.slice().sort((a, b) => a.author.localeCompare(b.author, 'ja-u-co-natural'))
  } else if (order === '巻数順(降順)') {
    return books.slice().sort((a, b) => (b?.orderNumber ?? 0) - (a?.orderNumber ?? 0))
  } else if (order === '巻数順(昇順)') {
    return books.slice().sort((a, b) => (a?.orderNumber ?? 0) - (b?.orderNumber ?? 0))
  } else {
    return books
  }
}

const onInitBookshelf = async () => {
  const user = await getCurrentUser()
  const bookShelfCollection = collection(firestore, 'users', user.uid, 'bookshelves')
  // コレクションからドキュメントをクエリ
  const querySnapshot = await getDocs(bookShelfCollection)
  // クエリが空の場合、ドキュメントを追加
  if (querySnapshot.empty) {
    await addDoc(bookShelfCollection, { shelf_name: '始まりの本棚' })
  }
}

const transformApiResponseToBookItems = (apiResponse: any): BookItem[] => {
  const books: BookItem[] = apiResponse.map((item: any) => {
    const volumeInfo = item.volumeInfo;
    const isbnInfo = volumeInfo.industryIdentifiers?.find((identifier: any) => identifier.type === 'ISBN_13') || volumeInfo.industryIdentifiers?.[0];
    const isbn = isbnInfo ? parseInt(isbnInfo.identifier, 10) : undefined;
    
    return {
      bookId: item.id,
      isbn: isbn ?? 0,
      title: volumeInfo.title ?? '',
      image_url: volumeInfo.imageLinks?.thumbnail ?? NO_IMAGE,
      author: volumeInfo.authors?.[0] ?? '',
      detail: item.searchInfo?.textSnippet ?? '',
      public_date: Timestamp.fromDate(new Date(volumeInfo.publishedDate || 0)),
      seriesId: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.seriesId ?? '',
      orderNumber: item.volumeInfo?.seriesInfo?.volumeSeries?.[0]?.orderNumber ?? 0
    } as BookItem;
  })
  return books;
}


//getDocFromCacheはキャッシュが見つからないとエラーを返す
const fetchDocWithCache = async <T>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T>> => {
  try {
    return await getDocFromCache(docRef);
  } catch (error) {
    return await getDocFromServer(docRef)
  }
}

//getDocsFromCacheはキャッシュが見つからないと空の配列を返す
const fetchDocs = async <T>(
  collection: CollectionReference<T>,
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<T>> => {
  const queryWithConstraints = query(collection, ...queryConstraints);
  const docs = await getDocsFromCache(queryWithConstraints);
  
  if (docs.size === 0) return await getDocsFromServer(queryWithConstraints);

  return docs;
}

const fetchBookShelfNoSeries = async (
  user: User, 
  doc_id: string, 
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<BookItem>> => {
  const noSeriesBookCollection = collection(
      firestore,
      'users',
      user.uid,
      'bookshelves',
      doc_id,
      'books'
  ) as CollectionReference<BookItem>
    
  return await fetchDocs(noSeriesBookCollection, queryConstraints);
};

const fetchBookShelfSeries = async (
  user: User, 
  doc_id: string, 
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<Series>> => {
  const seriesCollection = collection(
    firestore,
    'users',
    user.uid,
    'bookshelves',
    doc_id,
    'series'
  ) as CollectionReference<Series>

  return await fetchDocs(seriesCollection, queryConstraints);
};

const fetchSeries = async (
  user: User, 
  selectedBookshelfId: string, 
  seriesId: string, 
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<BookItem>> => {
  const booksCollection = collection(
    firestore,
    'users',
    user.uid,
    'bookshelves',
    selectedBookshelfId,
    'series',
    seriesId,
    'books'
  ) as CollectionReference<BookItem>

  return await fetchDocs(booksCollection, queryConstraints);
}

const fetchBookshelves = async (
  user: User, 
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<BookShelf>> => {
  const bookshelvesCollection =  collection(
    firestore, 
    'users', 
    user.uid, 
    'bookshelves'
  ) as CollectionReference<BookShelf>

  return await fetchDocs(bookshelvesCollection, queryConstraints);
}

const fetchAllBooks = async (
  user: User, 
  selectedBookshelfId: string, 
  queryConstraints: QueryConstraint[] = [] // フィルタリングのための条件を追加
): Promise<QuerySnapshot<BookItem>> => {
  const allBooksCollection = collection(
    firestore, 
    'users', 
    user.uid, 
    'bookshelves',
    selectedBookshelfId,
    'allBooks'
  ) as CollectionReference<BookItem>;
  
  return await fetchDocs(allBooksCollection, queryConstraints);
}

 const addDocAfterCacheCheck = async <T>(
    collectRef: CollectionReference<T>,
    item: T
  ) => {

  //キャッシュ空の状態で追加してしまわないようにする
  //空の状態だったらサーバから読みこみ，そのデータがキャッシュされる
  await fetchDocs(collectRef);
  
  await addDoc(collectRef, item);
}

const addDocSeriesBookAfterCacheCheck = async (
  user: User,
  book: BookItem,
  selectedBookshelfId: string,
  seriesId: string
) => {
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

  await addDocAfterCacheCheck(booksCollection, book);
}

/**
 * 初回ログイン時に本棚を初期化する
 * @param user ユーザ情報
 */
const initBookshelf = async (user: User) => {
  const bookShelfCollection = collection(firestore, 'users', user.uid, 'bookshelves')
  // コレクションからドキュメントをクエリ
  const querySnapshot = await getDocs(bookShelfCollection)
  // クエリが空の場合、ドキュメントを追加
  if (querySnapshot.empty) {
    await addDoc(bookShelfCollection, { shelf_name: '始まりの本棚' })
  }
}

export {
  firebaseErrorMessage,
  incrementCounter,
  decrementCounter,
  sort,
  onInitBookshelf,
  transformApiResponseToBookItems,
  fetchBookShelfNoSeries,
  fetchBookShelfSeries,
  fetchSeries,
  fetchBookshelves,
  fetchDocWithCache,
  fetchAllBooks,
  addDocSeriesBookAfterCacheCheck,
  fetchDocs,
  addDocAfterCacheCheck,
  initBookshelf
}
