import type { Query, Timestamp, QuerySnapshot, FirestoreError, Unsubscribe, DocumentData } from "firebase/firestore"
import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

interface BookItem {
  bookId: string
  isbn?: number
  title: string
  image_url: string | undefined
  author: string
  detail: string
  public_date: Timestamp
  seriesId?: string
  orderNumber?: number
}

interface BookShelf {
  doc_id?: string
  shelf_name: string
}

interface Series {
  seriesId?: string
  pic: string
  counter: number
}

interface SelectSeriesItem {
  seriesId: string
  pic: string
  seriesTitle: string
}

type BookItemNoSeries = Omit<BookItem, 'seriesId' | 'orderNumber'>

//ユーザ定義タイプガード
const implementBookShelf = (arg: any): arg is BookShelf => {
  return arg !== null && typeof arg === 'object' && typeof arg.shelf_name === 'string'
}

const isBookItem = (obj: any): obj is BookItem =>  {
  return (
    typeof obj.bookId === 'string' &&
    (typeof obj.isbn === 'number' || obj.isbn === undefined) &&
    typeof obj.title === 'string' &&
    (typeof obj.image_url === 'string' || obj.image_url === undefined) &&
    typeof obj.author === 'string' &&
    typeof obj.detail === 'string' &&
    obj.public_date instanceof FirestoreTimestamp &&
    (typeof obj.seriesId === 'string' || obj.seriesId === undefined) &&
    (typeof obj.orderNumber === 'number' || obj.orderNumber === undefined)
  );
}

export type { BookItem, BookShelf, Series, BookItemNoSeries, SelectSeriesItem }
export { implementBookShelf, isBookItem }
