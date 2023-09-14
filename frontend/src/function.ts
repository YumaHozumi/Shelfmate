import { FirebaseError } from 'firebase/app'
import { DocumentReference, getDoc, increment, updateDoc } from 'firebase/firestore'
import { isSeries, type BookItem, type BookShelf, type Series } from './interface'
import { openDB } from 'idb';

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
  if (order === '発売日が新しい順') {
    return books.slice().sort((a, b) => b.public_date.toDate().getTime() - a.public_date.toDate().getTime());
  } else if (order === '発売日が古い順') {
    return books.slice().sort((a, b) => a.public_date.toDate().getTime() - b.public_date.toDate().getTime());
  } else if (order === '作品名順') {
    return books.slice().sort((a, b) => a.title.localeCompare(b.title, 'ja-u-co-natural'));
  } else if (order === '作者名順') {
    return books.slice().sort((a, b) => a.author.localeCompare(b.author, 'ja-u-co-natural'));
  } else if (order === '巻数順(降順)') {
    return books.slice().sort((a, b) => (b?.orderNumber ?? 0) - (a?.orderNumber ?? 0))
  } else if (order === '巻数順(昇順)') {
    return books.slice().sort((a, b) => (a?.orderNumber ?? 0) - (b?.orderNumber ?? 0))
  } else {
    return books;
  }
}

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    db.createObjectStore('bookshelves');
    db.createObjectStore('series');
  },
});

const setBookshelvesData = async (uid: string, data: BookShelf[]) => {
  const db = await dbPromise;
  const timestamp = Date.now();
  await db.put('bookshelves', JSON.stringify({ data, timestamp }), uid);
};

const getBookshelvesData = async (uid: string) => {
  const db = await dbPromise;
  const result = await db.get('bookshelves', uid);
  if (result) {
    const { data, timestamp } = JSON.parse(result);

    // 有効期限を12時間と設定（43200000ミリ秒 = 12時間）
    const expiryTime = 43200000;
    if (Date.now() - timestamp < expiryTime) {
      return data;
    } else {
      // 有効期限が切れている場合はnullを返す
      return null;
    }
  }
  return null;
};

const setSeriesData = async (uid: string, doc_id: string, data: (Series | BookItem)[]) => {
  const db = await dbPromise;
  const timestamp = Date.now();
  await db.put('series', JSON.stringify({ data, timestamp }), `${uid}-${doc_id}`);
};

const getSeriesData = async (uid: string, doc_id: string) => {
  const db = await dbPromise;
  const result = await db.get('series', `${uid}-${doc_id}`);
  if (result) {
    const { data, timestamp } = JSON.parse(result);

    // 有効期限を12時間と設定（43200000ミリ秒 = 12時間）
    const expiryTime = 43200000;
    if (Date.now() - timestamp < expiryTime) {
      return data;
    } else {
      // 有効期限が切れている場合はnullを返す
      return null;
    }
  }
  return null;
};

const addSeriesDataItem = async(uid: string, doc_id: string, newItem: Series | BookItem) => {
  const db = await dbPromise;

  // 既存のデータを取得する
  const existingData = await getSeriesData(uid, doc_id);

  let data;
  if (existingData) {
    // 既存のデータがある場合は、新しいアイテムを追加または上書きする
    if (isSeries(newItem)) {
      // 新しいアイテムが Series タイプの場合に限り、上書きを試行する
      data = existingData.map((item: Series | BookItem) => 
        'seriesId' in item && item.seriesId === newItem.seriesId ? newItem : item
      );
      if (!data.find((item: Series | BookItem) => 'seriesId' in item && item.seriesId === newItem.seriesId)) {
        data.push(newItem);
      }
    } else {
      // 新しいアイテムが BookItem タイプの場合、追加する
      data = [...existingData, newItem];
    }
  } else {
    // 既存のデータがない場合は、新しいデータ配列を作成する
    data = [newItem];
  }

  // 更新されたデータをデータベースに保存する
  const timestamp = Date.now();
  await db.put('series', JSON.stringify({ data, timestamp }), `${uid}-${doc_id}`);
}

export { firebaseErrorMessage, incrementCounter, decrementCounter, sort, setBookshelvesData, getBookshelvesData,
        getSeriesData, setSeriesData, addSeriesDataItem }
