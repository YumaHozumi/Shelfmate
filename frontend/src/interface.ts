import type { Timestamp } from "firebase/firestore"
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
  seriesTitle: string
}

interface SelectSeriesItem {
  seriesId: string
  pic: string
  seriesTitle: string
}

enum Action {
  DELETE = "DELETE",
  UPDATE = "UPDATE"
}

type BookItemNoSeries = Omit<BookItem, 'seriesId' | 'orderNumber'>

//ユーザ定義タイプガード
const implementBookShelf = (arg: any): arg is BookShelf => {
  return arg !== null && typeof arg === 'object' && typeof arg.shelf_name === 'string'
}

const isBookItem = (obj: any): obj is BookItem =>  {
  console.log(obj.public_date.constructor.name);

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

// 新たな型ガードを定義
const isSeries = (obj: any): obj is Series => {
  return (
    (typeof obj.seriesId === 'string' || obj.seriesId === undefined) &&
    typeof obj.pic === 'string' &&
    typeof obj.counter === 'number' &&
    typeof obj.seriesTitle === 'string'
  );
};

export type { BookItem, BookShelf, Series, BookItemNoSeries, SelectSeriesItem, }
export { implementBookShelf, isBookItem, isSeries, Action }
